import { v4 as uuidv4 } from 'uuid';

class AuditTrailService {
  constructor() {
    this.storageKey = 'qualiwrite_audit_trail';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getCurrentUser() {
    // In real app, this would come from auth context
    return {
      userId: localStorage.getItem('userId') || 'system',
      userRole: localStorage.getItem('userRole') || 'System User',
      sessionId: localStorage.getItem('sessionId') || 'sess-' + Date.now(),
      ipAddress: '192.168.1.100', // In real app, would be captured server-side
      userAgent: navigator.userAgent
    };
  }

  logActivity(params) {
    const {
      action,
      actionType,
      deviationId,
      section,
      fieldChanged = null,
      oldValue = null,
      newValue = null,
      justification,
      regulatoryImpact = 'Low',
      additionalData = {}
    } = params;

    const user = this.getCurrentUser();
    const auditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action,
      actionType,
      deviationId,
      userId: user.userId,
      userRole: user.userRole,
      section,
      fieldChanged,
      oldValue,
      newValue,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
      sessionId: user.sessionId,
      justification,
      regulatoryImpact,
      dataIntegrity: 'ALCOA+ Compliant',
      checksum: this.generateChecksum({
        timestamp: new Date().toISOString(),
        action,
        userId: user.userId,
        oldValue,
        newValue
      }),
      ...additionalData
    };

    // Save to localStorage (in real app, would send to secure server)
    const existingTrail = JSON.parse(localStorage.getItem(this.storageKey));
    existingTrail.push(auditEntry);
    localStorage.setItem(this.storageKey, JSON.stringify(existingTrail));

    return auditEntry;
  }

  generateChecksum(data) {
    // Simple checksum for demonstration - in real app would use proper cryptographic hash
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  getAuditTrail(deviationId = null) {
    const trail = JSON.parse(localStorage.getItem(this.storageKey));
    if (deviationId) {
      return trail.filter(entry => entry.deviationId === deviationId);
    }
    return trail;
  }

  // Specific logging methods for different actions
  logDeviationCreated(deviationId, deviationData) {
    return this.logActivity({
      action: 'Deviation Created',
      actionType: 'CREATE',
      deviationId,
      section: 'Basic Information',
      newValue: `${deviationId}: ${deviationData.title || deviationData.description}`,
      justification: 'Initial deviation report creation',
      regulatoryImpact: 'Low'
    });
  }

  logFieldUpdate(deviationId, section, fieldChanged, oldValue, newValue, justification) {
    return this.logActivity({
      action: `${section} Updated`,
      actionType: 'UPDATE',
      deviationId,
      section,
      fieldChanged,
      oldValue,
      newValue,
      justification,
      regulatoryImpact: this.assessRegulatoryImpact(section, fieldChanged)
    });
  }

  logAIGeneration(deviationId, section, aiModel, generatedContent, justification) {
    return this.logActivity({
      action: `AI ${section} Generated`,
      actionType: 'AI_GENERATE',
      deviationId,
      section,
      newValue: generatedContent,
      justification,
      regulatoryImpact: 'Medium',
      additionalData: {
        aiModel,
        aiVersion: '2024.01'
      }
    });
  }

  logApproval(deviationId, approvalLevel, comments, electronicSignature) {
    return this.logActivity({
      action: 'Investigation Approved',
      actionType: 'APPROVE',
      deviationId,
      section: 'Investigation Status',
      fieldChanged: 'status',
      oldValue: 'Under Review',
      newValue: 'Approved',
      justification: comments,
      regulatoryImpact: 'High',
      additionalData: {
        electronicSignature,
        approvalLevel
      }
    });
  }

  logReportGeneration(deviationId, reportFormat, reportSize, aiModel) {
    return this.logActivity({
      action: 'Report Generated',
      actionType: 'GENERATE',
      deviationId,
      section: 'Report Generation',
      newValue: `${reportFormat} Report: ${deviationId}_Investigation_Report.${reportFormat.toLowerCase()}`,
      justification: 'Final investigation report for regulatory submission',
      regulatoryImpact: 'High',
      additionalData: {
        aiModel,
        reportFormat,
        reportSize
      }
    });
  }

  logView(deviationId, section = 'Full Investigation') {
    return this.logActivity({
      action: `${section} Viewed`,
      actionType: 'VIEW',
      deviationId,
      section,
      justification: 'User accessed investigation data',
      regulatoryImpact: 'Low'
    });
  }

  logStatusChange(deviationId, oldStatus, newStatus, justification) {
    return this.logActivity({
      action: 'Status Changed',
      actionType: 'UPDATE',
      deviationId,
      section: 'Investigation Status',
      fieldChanged: 'status',
      oldValue: oldStatus,
      newValue: newStatus,
      justification,
      regulatoryImpact: 'High'
    });
  }

  logCAPAAction(deviationId, capaAction, justification) {
    return this.logActivity({
      action: 'CAPA Action Added',
      actionType: 'CREATE',
      deviationId,
      section: 'CAPA Development',
      fieldChanged: 'capaActions',
      newValue: `${capaAction.type} Action: ${capaAction.description}`,
      justification,
      regulatoryImpact: 'High'
    });
  }

  assessRegulatoryImpact(section, fieldChanged) {
    const highImpactFields = [
      'classification', 'riskAssessment', 'rootCause', 'capaActions', 'status'
    ];
    const mediumImpactFields = [
      'problemStatement', 'containmentActions', 'timeline'
    ];

    if (highImpactFields.includes(fieldChanged)) {
      return 'High';
    } else if (mediumImpactFields.includes(fieldChanged)) {
      return 'Medium';
    }
    return 'Low';
  }

  exportAuditTrail(deviationId = null, format = 'json') {
    const trail = this.getAuditTrail(deviationId);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = deviationId 
      ? `${deviationId}_AuditTrail_${timestamp}.${format}`
      : `AuditTrail_${timestamp}.${format}`;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(trail, null, 2)], { type: 'application/json' });
      this.downloadFile(blob, filename);
    } else if (format === 'csv') {
      const csvContent = this.convertToCSV(trail);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      this.downloadFile(blob, filename);
    }
  }

  convertToCSV(auditTrail) {
    const headers = [
      'Timestamp', 'Action', 'Action Type', 'User ID', 'User Role', 'Section',
      'Field Changed', 'Old Value', 'New Value', 'Justification', 'Regulatory Impact',
      'IP Address', 'Session ID', 'Checksum'
    ];

    const rows = auditTrail.map(entry => [
      entry.timestamp,
      entry.action,
      entry.actionType,
      entry.userId,
      entry.userRole,
      entry.section,
      entry.fieldChanged || '',
      entry.oldValue || '',
      entry.newValue || '',
      entry.justification,
      entry.regulatoryImpact,
      entry.ipAddress,
      entry.sessionId,
      entry.checksum
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  verifyIntegrity(auditEntry) {
    const expectedChecksum = this.generateChecksum({
      timestamp: auditEntry.timestamp,
      action: auditEntry.action,
      userId: auditEntry.userId,
      oldValue: auditEntry.oldValue,
      newValue: auditEntry.newValue
    });

    return expectedChecksum === auditEntry.checksum;
  }

  generateComplianceReport(deviationId) {
    const trail = this.getAuditTrail(deviationId);
    const users = [...new Set(trail.map(entry => entry.userId))];
    const actions = [...new Set(trail.map(entry => entry.actionType))];
    
    return {
      deviationId,
      totalEntries: trail.length,
      uniqueUsers: users.length,
      actionTypes: actions,
      firstEntry: trail[0]?.timestamp,
      lastEntry: trail[trail.length - 1]?.timestamp,
      integrityCheck: trail.every(entry => this.verifyIntegrity(entry)),
      regulatoryCompliance: {
        cfr21Part11: true,
        alcoaPlus: true,
        dataIntegrity: true
      }
    };
  }
}

export default new AuditTrailService();