import supabaseService from './supabaseService'
import notificationService from './notificationService'

class WorkflowService {
  constructor() {
    this.workflowDefinitions = new Map()
    this.initializeDefaultWorkflows()
  }

  initializeDefaultWorkflows() {
    // Standard Deviation Investigation Workflow
    this.workflowDefinitions.set('deviation_investigation', {
      id: 'deviation_investigation',
      name: 'Deviation Investigation Workflow',
      steps: [
        {
          id: 'initiation',
          name: 'Investigation Initiation',
          requiredRole: ['QA Investigator', 'QA Manager'],
          autoAssign: true,
          timelineHours: 72,
          requiredFields: ['basic_info', 'immediate_actions'],
          nextSteps: ['evaluation']
        },
        {
          id: 'evaluation',
          name: 'Initial Evaluation',
          requiredRole: ['QA Investigator'],
          timelineHours: 120,
          requiredFields: ['risk_assessment', 'problem_statement'],
          nextSteps: ['investigation']
        },
        {
          id: 'investigation',
          name: 'Detailed Investigation',
          requiredRole: ['QA Investigator'],
          timelineHours: 240,
          requiredFields: ['root_cause_analysis', 'evidence_collection'],
          nextSteps: ['capa_development']
        },
        {
          id: 'capa_development',
          name: 'CAPA Development',
          requiredRole: ['QA Investigator', 'Process Owner'],
          timelineHours: 168,
          requiredFields: ['capa_actions'],
          nextSteps: ['qa_review']
        },
        {
          id: 'qa_review',
          name: 'QA Review',
          requiredRole: ['QA Manager'],
          timelineHours: 72,
          approvalRequired: true,
          nextSteps: ['management_approval']
        },
        {
          id: 'management_approval',
          name: 'Management Approval',
          requiredRole: ['Site Manager', 'QA Director'],
          timelineHours: 48,
          approvalRequired: true,
          nextSteps: ['closure']
        },
        {
          id: 'closure',
          name: 'Investigation Closure',
          requiredRole: ['QA Manager'],
          timelineHours: 24,
          finalStep: true
        }
      ]
    })

    // CAPA Effectiveness Workflow
    this.workflowDefinitions.set('capa_effectiveness', {
      id: 'capa_effectiveness',
      name: 'CAPA Effectiveness Review',
      triggerAfterDays: 90,
      steps: [
        {
          id: 'effectiveness_review',
          name: 'Effectiveness Review',
          requiredRole: ['QA Investigator'],
          timelineHours: 120,
          nextSteps: ['approval']
        },
        {
          id: 'approval',
          name: 'Effectiveness Approval',
          requiredRole: ['QA Manager'],
          timelineHours: 48,
          approvalRequired: true,
          finalStep: true
        }
      ]
    })
  }

  async startWorkflow(workflowId, deviationId, initiatedBy) {
    try {
      const workflowDef = this.workflowDefinitions.get(workflowId)
      if (!workflowDef) {
        throw new Error(`Workflow definition not found: ${workflowId}`)
      }

      // Create workflow instance
      const workflowInstance = {
        deviation_id: deviationId,
        workflow_definition_id: workflowId,
        current_step: workflowDef.steps[0].id,
        status: 'active',
        initiated_by: initiatedBy,
        initiated_at: new Date().toISOString(),
        due_date: this.calculateDueDate(workflowDef.steps[0])
      }

      const result = await supabaseService.createWorkflowInstance(workflowInstance)
      
      if (result.success) {
        // Auto-assign if configured
        if (workflowDef.steps[0].autoAssign) {
          await this.autoAssignStep(result.data.id, workflowDef.steps[0])
        }

        // Send notifications
        await this.notifyStepAssignment(result.data, workflowDef.steps[0])
      }

      return result
    } catch (error) {
      console.error('Start workflow error:', error)
      return { success: false, error: error.message }
    }
  }

  async advanceWorkflow(workflowInstanceId, completedBy, comments = '') {
    try {
      const instance = await supabaseService.getWorkflowInstance(workflowInstanceId)
      if (!instance.success) {
        throw new Error('Workflow instance not found')
      }

      const workflowDef = this.workflowDefinitions.get(instance.data.workflow_definition_id)
      const currentStep = workflowDef.steps.find(s => s.id === instance.data.current_step)
      
      // Validate step completion
      const validation = await this.validateStepCompletion(
        instance.data.deviation_id,
        currentStep,
        completedBy
      )
      
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // Log step completion
      await supabaseService.logAuditEntry({
        deviation_id: instance.data.deviation_id,
        action: `Workflow Step Completed: ${currentStep.name}`,
        action_type: 'WORKFLOW',
        section: 'Workflow Management',
        old_value: currentStep.id,
        new_value: 'completed',
        justification: comments,
        user_id: completedBy,
        regulatory_impact: 'Medium'
      })

      // Determine next step
      const nextSteps = currentStep.nextSteps || []
      if (nextSteps.length === 0 || currentStep.finalStep) {
        // Complete workflow
        return await this.completeWorkflow(workflowInstanceId, completedBy)
      }

      // For simplicity, take first next step (in real implementation, could have branching logic)
      const nextStepId = nextSteps[0]
      const nextStep = workflowDef.steps.find(s => s.id === nextStepId)

      // Update workflow instance
      const updateData = {
        current_step: nextStepId,
        due_date: this.calculateDueDate(nextStep),
        updated_at: new Date().toISOString()
      }

      const updateResult = await supabaseService.updateWorkflowInstance(
        workflowInstanceId,
        updateData
      )

      if (updateResult.success) {
        // Auto-assign next step
        if (nextStep.autoAssign) {
          await this.autoAssignStep(workflowInstanceId, nextStep)
        }

        // Send notifications for next step
        await this.notifyStepAssignment(updateResult.data, nextStep)
      }

      return updateResult
    } catch (error) {
      console.error('Advance workflow error:', error)
      return { success: false, error: error.message }
    }
  }

  async validateStepCompletion(deviationId, step, userId) {
    try {
      // Check user role authorization
      const user = await supabaseService.getUserById(userId)
      if (!user.success || !step.requiredRole.includes(user.data.role)) {
        return {
          isValid: false,
          error: `User role ${user.data?.role} not authorized for this step. Required: ${step.requiredRole.join(', ')}`
        }
      }

      // Check required fields completion
      if (step.requiredFields) {
        const deviation = await supabaseService.getDeviation(deviationId)
        if (!deviation.success) {
          return { isValid: false, error: 'Deviation not found' }
        }

        const missingFields = step.requiredFields.filter(field => {
          const fieldData = deviation.data.form_data?.[field]
          return !fieldData || Object.keys(fieldData).length === 0
        })

        if (missingFields.length > 0) {
          return {
            isValid: false,
            error: `Required fields not completed: ${missingFields.join(', ')}`
          }
        }
      }

      // Check approval requirements
      if (step.approvalRequired) {
        // Additional approval validation logic would go here
      }

      return { isValid: true }
    } catch (error) {
      return { isValid: false, error: error.message }
    }
  }

  async completeWorkflow(workflowInstanceId, completedBy) {
    try {
      const updateData = {
        status: 'completed',
        completed_by: completedBy,
        completed_at: new Date().toISOString()
      }

      const result = await supabaseService.updateWorkflowInstance(
        workflowInstanceId,
        updateData
      )

      if (result.success) {
        // Trigger any post-completion actions
        await this.handleWorkflowCompletion(result.data)
      }

      return result
    } catch (error) {
      console.error('Complete workflow error:', error)
      return { success: false, error: error.message }
    }
  }

  async handleWorkflowCompletion(workflowInstance) {
    // Schedule CAPA effectiveness review if this was a deviation investigation
    if (workflowInstance.workflow_definition_id === 'deviation_investigation') {
      const effectivenessDue = new Date()
      effectivenessDue.setDate(effectivenessDue.getDate() + 90) // 90 days later

      await supabaseService.scheduleWorkflow({
        deviation_id: workflowInstance.deviation_id,
        workflow_definition_id: 'capa_effectiveness',
        scheduled_start: effectivenessDue.toISOString(),
        created_by: workflowInstance.completed_by
      })
    }

    // Send completion notifications
    const stakeholders = await this.getWorkflowStakeholders(workflowInstance.deviation_id)
    for (const stakeholder of stakeholders) {
      await notificationService.createNotification(
        stakeholder.id,
        'Investigation Completed',
        `Deviation ${workflowInstance.deviation_id} investigation has been completed`,
        'success',
        workflowInstance.deviation_id
      )
    }
  }

  async autoAssignStep(workflowInstanceId, step) {
    try {
      // Get users with required roles
      const eligibleUsers = await supabaseService.getUsersByRoles(step.requiredRole)
      
      if (eligibleUsers.success && eligibleUsers.data.length > 0) {
        // Simple assignment logic - assign to user with least current workload
        const assignments = await Promise.all(
          eligibleUsers.data.map(async (user) => {
            const workload = await this.getUserWorkload(user.id)
            return { user, workload }
          })
        )

        assignments.sort((a, b) => a.workload - b.workload)
        const assignedUser = assignments[0].user

        // Create assignment
        await supabaseService.createWorkflowAssignment({
          workflow_instance_id: workflowInstanceId,
          assigned_to: assignedUser.id,
          assigned_at: new Date().toISOString(),
          due_date: this.calculateDueDate(step)
        })

        return assignedUser
      }
    } catch (error) {
      console.error('Auto-assign step error:', error)
    }

    return null
  }

  async getUserWorkload(userId) {
    try {
      const result = await supabaseService.getUserActiveWorkflowCount(userId)
      return result.success ? result.data : 0
    } catch (error) {
      return 0
    }
  }

  calculateDueDate(step) {
    const dueDate = new Date()
    dueDate.setHours(dueDate.getHours() + step.timelineHours)
    return dueDate.toISOString()
  }

  async notifyStepAssignment(workflowInstance, step) {
    const assignments = await supabaseService.getWorkflowAssignments(workflowInstance.id)
    
    if (assignments.success) {
      for (const assignment of assignments.data) {
        await notificationService.createNotification(
          assignment.assigned_to,
          `New Assignment: ${step.name}`,
          `You have been assigned to complete: ${step.name}`,
          'info',
          workflowInstance.deviation_id
        )
      }
    }
  }

  async getWorkflowStakeholders(deviationId) {
    // This would query for all users involved in the deviation
    // For now, return empty array
    return []
  }

  // Timeline monitoring
  async checkOverdueWorkflows() {
    try {
      const overdueWorkflows = await supabaseService.getOverdueWorkflows()
      
      if (overdueWorkflows.success) {
        for (const workflow of overdueWorkflows.data) {
          await this.handleOverdueWorkflow(workflow)
        }
      }
    } catch (error) {
      console.error('Check overdue workflows error:', error)
    }
  }

  async handleOverdueWorkflow(workflow) {
    // Send escalation notifications
    const assignments = await supabaseService.getWorkflowAssignments(workflow.id)
    
    if (assignments.success) {
      for (const assignment of assignments.data) {
        await notificationService.createNotification(
          assignment.assigned_to,
          'OVERDUE: Investigation Step',
          `Investigation step is overdue: ${workflow.current_step}`,
          'error',
          workflow.deviation_id
        )

        // Notify supervisor
        const supervisor = await this.getUserSupervisor(assignment.assigned_to)
        if (supervisor) {
          await notificationService.createNotification(
            supervisor.id,
            'Team Member Overdue Assignment',
            `${assignment.user?.full_name} has an overdue investigation step`,
            'warning',
            workflow.deviation_id
          )
        }
      }
    }
  }

  async getUserSupervisor(userId) {
    // This would query the organizational structure
    // For now, return null
    return null
  }
}

export default new WorkflowService()