import supabaseService from './supabaseService'

class NotificationService {
  constructor() {
    this.emailConfig = {}
    this.slackConfig = {}
    this.teamsConfig = {}
  }

  // Configuration
  setEmailConfig(config) {
    this.emailConfig = config
  }

  setSlackConfig(config) {
    this.slackConfig = config
  }

  setTeamsConfig(config) {
    this.teamsConfig = config
  }

  // Email Notifications
  async sendEmail(to, subject, content, attachments = []) {
    try {
      // In a real implementation, this would use a service like SendGrid, AWS SES, etc.
      const emailData = {
        to,
        subject,
        content,
        attachments,
        sent_at: new Date().toISOString(),
        status: 'sent'
      }

      // Store email record
      await supabaseService.createEmailRecord(emailData)

      // For now, just log
      console.log('Email sent:', { to, subject })
      
      return { success: true, data: emailData }
    } catch (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }
  }

  // Slack Notifications
  async sendSlackMessage(channel, message, attachments = []) {
    try {
      if (!this.slackConfig.webhookUrl) {
        throw new Error('Slack webhook URL not configured')
      }

      const payload = {
        channel,
        text: message,
        attachments: attachments.map(att => ({
          color: att.color || 'good',
          fields: att.fields || [],
          title: att.title,
          text: att.text
        }))
      }

      const response = await fetch(this.slackConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Slack notification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Teams Notifications
  async sendTeamsMessage(message, title = '', color = 'good') {
    try {
      if (!this.teamsConfig.webhookUrl) {
        throw new Error('Teams webhook URL not configured')
      }

      const payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": color === 'good' ? '00FF00' : color === 'warning' ? 'FFA500' : 'FF0000',
        "summary": title,
        "sections": [{
          "activityTitle": title,
          "activitySubtitle": "QualiWrite™ Notification",
          "text": message
        }]
      }

      const response = await fetch(this.teamsConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Teams API error: ${response.statusText}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Teams notification error:', error)
      return { success: false, error: error.message }
    }
  }

  // In-app Notifications
  async createNotification(userId, title, message, type = 'info', deviationId = null) {
    try {
      const notificationData = {
        user_id: userId,
        title,
        message,
        type,
        deviation_id: deviationId,
        created_at: new Date().toISOString()
      }

      const result = await supabaseService.createNotification(notificationData)
      return result
    } catch (error) {
      console.error('Create notification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Deviation-specific notifications
  async notifyDeviationCreated(deviation, assignedUsers = []) {
    const title = `New Deviation: ${deviation.deviation_id}`
    const message = `A new ${deviation.classification} deviation has been created: ${deviation.title}`

    // Send to assigned users
    for (const user of assignedUsers) {
      await this.createNotification(user.id, title, message, 'info', deviation.id)
      
      // Send email if user has email notifications enabled
      if (user.email_notifications) {
        await this.sendEmail(
          user.email,
          title,
          this.buildDeviationEmailContent(deviation, 'created')
        )
      }
    }

    // Send Slack notification to quality channel
    if (this.slackConfig.enabled) {
      await this.sendSlackMessage(
        this.slackConfig.channelId || '#quality-alerts',
        `🚨 New ${deviation.classification} Deviation: ${deviation.deviation_id}\n${deviation.title}`,
        [{
          color: deviation.classification === 'Critical' ? 'danger' : 'warning',
          fields: [
            { title: 'ID', value: deviation.deviation_id, short: true },
            { title: 'Classification', value: deviation.classification, short: true },
            { title: 'Area', value: deviation.area || 'Not specified', short: true }
          ]
        }]
      )
    }

    // Send Teams notification
    if (this.teamsConfig.enabled) {
      await this.sendTeamsMessage(
        `New ${deviation.classification} deviation created: ${deviation.deviation_id}\n\n${deviation.title}`,
        'Deviation Alert',
        deviation.classification === 'Critical' ? 'attention' : 'warning'
      )
    }

    return { success: true }
  }

  async notifyDeviationStatusChange(deviation, oldStatus, newStatus, changedBy) {
    const title = `Deviation Status Updated: ${deviation.deviation_id}`
    const message = `Status changed from "${oldStatus}" to "${newStatus}" by ${changedBy}`

    // Get users to notify (assigned users, QA managers, etc.)
    const usersToNotify = await this.getDeviationStakeholders(deviation.id)

    for (const user of usersToNotify) {
      await this.createNotification(user.id, title, message, 'info', deviation.id)
    }

    // Send Slack update
    if (this.slackConfig.enabled) {
      await this.sendSlackMessage(
        this.slackConfig.channelId || '#quality-alerts',
        `📝 Status Update: ${deviation.deviation_id}\n${oldStatus} → ${newStatus}`
      )
    }

    return { success: true }
  }

  async notifyApprovalRequired(deviation, approver) {
    const title = `Approval Required: ${deviation.deviation_id}`
    const message = `Investigation is ready for your approval`

    await this.createNotification(approver.id, title, message, 'warning', deviation.id)

    if (approver.email_notifications) {
      await this.sendEmail(
        approver.email,
        title,
        this.buildApprovalEmailContent(deviation)
      )
    }

    return { success: true }
  }

  async notifyTimelineAlert(deviation, alertType, daysUntilDue) {
    const title = `Timeline Alert: ${deviation.deviation_id}`
    const message = `${alertType} deadline approaching in ${daysUntilDue} days`

    const stakeholders = await this.getDeviationStakeholders(deviation.id)
    
    for (const user of stakeholders) {
      await this.createNotification(user.id, title, message, 'warning', deviation.id)
    }

    // Send urgent Slack notification
    if (this.slackConfig.enabled) {
      await this.sendSlackMessage(
        this.slackConfig.channelId || '#quality-alerts',
        `⏰ URGENT: ${title}\n${message}`,
        [{
          color: 'danger',
          fields: [
            { title: 'Deviation', value: deviation.deviation_id, short: true },
            { title: 'Days Until Due', value: daysUntilDue.toString(), short: true }
          ]
        }]
      )
    }

    return { success: true }
  }

  // Helper methods
  async getDeviationStakeholders(deviationId) {
    // This would query the database for users involved in the deviation
    // For now, return empty array
    return []
  }

  buildDeviationEmailContent(deviation, action) {
    return `
<h2>Deviation ${action.charAt(0).toUpperCase() + action.slice(1)}</h2>

<p><strong>Deviation ID:</strong> ${deviation.deviation_id}</p>
<p><strong>Classification:</strong> ${deviation.classification}</p>
<p><strong>Title:</strong> ${deviation.title}</p>
<p><strong>Area:</strong> ${deviation.area || 'Not specified'}</p>
<p><strong>Status:</strong> ${deviation.status}</p>

<p>Please log into QualiWrite™ to view the full details and take any necessary actions.</p>

<hr>
<p><small>This is an automated notification from QualiWrite™ Deviation Management System</small></p>
    `
  }

  buildApprovalEmailContent(deviation) {
    return `
<h2>Investigation Approval Required</h2>

<p>The following deviation investigation is ready for your review and approval:</p>

<p><strong>Deviation ID:</strong> ${deviation.deviation_id}</p>
<p><strong>Title:</strong> ${deviation.title}</p>
<p><strong>Classification:</strong> ${deviation.classification}</p>
<p><strong>Current Status:</strong> ${deviation.status}</p>

<p>Please log into QualiWrite™ to review the investigation and provide your approval.</p>

<hr>
<p><small>This is an automated notification from QualiWrite™ Deviation Management System</small></p>
    `
  }

  // Batch notifications for analytics
  async sendDailyDigest(userId, digestData) {
    const title = "Daily Quality Digest"
    const message = `${digestData.newDeviations} new deviations, ${digestData.pendingApprovals} pending approvals`

    await this.createNotification(userId, title, message, 'info')

    // Send email digest
    const user = await supabaseService.getCurrentUser()
    if (user.data && user.data.email_notifications) {
      await this.sendEmail(
        user.data.email,
        title,
        this.buildDigestEmailContent(digestData)
      )
    }

    return { success: true }
  }

  buildDigestEmailContent(digestData) {
    return `
<h2>Daily Quality Digest</h2>

<h3>Summary</h3>
<ul>
  <li>New Deviations: ${digestData.newDeviations}</li>
  <li>Pending Approvals: ${digestData.pendingApprovals}</li>
  <li>Overdue Investigations: ${digestData.overdueInvestigations}</li>
  <li>Completed Today: ${digestData.completedToday}</li>
</ul>

<h3>Action Required</h3>
${digestData.actionItems?.map(item => `<li>${item}</li>`).join('') || '<li>No action items</li>'}

<p>Log into QualiWrite™ for detailed information.</p>

<hr>
<p><small>Daily digest from QualiWrite™ Deviation Management System</small></p>
    `
  }
}

export default new NotificationService()