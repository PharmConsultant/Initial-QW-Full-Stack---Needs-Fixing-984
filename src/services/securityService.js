import { supabase } from '../lib/supabase'

class SecurityService {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000 // 30 minutes
    this.passwordPolicy = {
      minLength: 15,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expiryDays: 90,
      preventReuse: 12
    }
  }

  // Password Security
  validatePassword(password) {
    const errors = []
    
    if (password.length < this.passwordPolicy.minLength) {
      errors.push(`Password must be at least ${this.passwordPolicy.minLength} characters`)
    }
    
    if (this.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (this.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (this.passwordPolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (this.passwordPolicy.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one symbol')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  async checkPasswordExpiry(userId) {
    try {
      const { data, error } = await supabase
        .from('user_passwords')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) throw error
      
      const passwordAge = Date.now() - new Date(data.created_at).getTime()
      const maxAge = this.passwordPolicy.expiryDays * 24 * 60 * 60 * 1000
      
      return {
        isExpired: passwordAge > maxAge,
        daysUntilExpiry: Math.ceil((maxAge - passwordAge) / (24 * 60 * 60 * 1000)),
        lastChanged: data.created_at
      }
    } catch (error) {
      console.error('Check password expiry error:', error)
      return { isExpired: false, daysUntilExpiry: null }
    }
  }

  // Session Management
  initializeSessionMonitoring() {
    // Monitor for user activity
    let lastActivity = Date.now()
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    const updateActivity = () => {
      lastActivity = Date.now()
    }
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })
    
    // Check session timeout every minute
    setInterval(() => {
      if (Date.now() - lastActivity > this.sessionTimeout) {
        this.handleSessionTimeout()
      }
    }, 60000)
  }

  async handleSessionTimeout() {
    try {
      // Log session timeout
      await this.logSecurityEvent({
        event_type: 'SESSION_TIMEOUT',
        severity: 'LOW',
        description: 'User session timed out due to inactivity'
      })
      
      // Sign out user
      await supabase.auth.signOut()
      
      // Redirect to login with message
      window.location.href = '/#/login?reason=timeout'
    } catch (error) {
      console.error('Session timeout error:', error)
    }
  }

  // Access Control
  async checkUserPermission(userId, resource, action) {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          permission,
          roles!inner(
            role_permissions!inner(
              permission
            )
          )
        `)
        .eq('user_id', userId)
      
      if (error) throw error
      
      const requiredPermission = `${resource}:${action}`
      
      // Check direct permissions
      const hasDirectPermission = data.some(p => p.permission === requiredPermission)
      
      // Check role-based permissions
      const hasRolePermission = data.some(p => 
        p.roles?.role_permissions?.some(rp => rp.permission === requiredPermission)
      )
      
      return hasDirectPermission || hasRolePermission
    } catch (error) {
      console.error('Check permission error:', error)
      return false
    }
  }

  // Audit Logging for Security Events
  async logSecurityEvent(eventData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const securityLog = {
        user_id: user?.id,
        event_type: eventData.event_type,
        severity: eventData.severity || 'MEDIUM',
        description: eventData.description,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additional_data: eventData.additional_data || {}
      }
      
      const { error } = await supabase
        .from('security_logs')
        .insert([securityLog])
      
      if (error) throw error
      
      // For high severity events, send immediate alerts
      if (eventData.severity === 'HIGH') {
        await this.sendSecurityAlert(securityLog)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Log security event error:', error)
      return { success: false, error: error.message }
    }
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  async sendSecurityAlert(securityLog) {
    // This would integrate with your alerting system
    console.warn('SECURITY ALERT:', securityLog)
    
    // Could send to Slack, email, etc.
    // await notificationService.sendSecurityAlert(securityLog)
  }

  // Data Encryption (for sensitive fields)
  async encryptSensitiveData(data, keyId = 'default') {
    try {
      // In a real implementation, this would use proper encryption
      // For now, just base64 encode (NOT SECURE - for demo only)
      const encrypted = btoa(JSON.stringify(data))
      return {
        success: true,
        encrypted_data: encrypted,
        key_id: keyId,
        algorithm: 'demo-base64' // Would be AES-256 in production
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async decryptSensitiveData(encryptedData, keyId = 'default') {
    try {
      // In a real implementation, this would use proper decryption
      const decrypted = JSON.parse(atob(encryptedData))
      return { success: true, data: decrypted }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Compliance Monitoring
  async generateComplianceReport(startDate, endDate) {
    try {
      const { data: securityLogs, error } = await supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: false })
      
      if (error) throw error
      
      const report = {
        period: { start: startDate, end: endDate },
        total_events: securityLogs.length,
        events_by_severity: {
          HIGH: securityLogs.filter(l => l.severity === 'HIGH').length,
          MEDIUM: securityLogs.filter(l => l.severity === 'MEDIUM').length,
          LOW: securityLogs.filter(l => l.severity === 'LOW').length
        },
        events_by_type: {},
        unique_users: new Set(securityLogs.map(l => l.user_id)).size,
        generated_at: new Date().toISOString()
      }
      
      // Count events by type
      securityLogs.forEach(log => {
        report.events_by_type[log.event_type] = 
          (report.events_by_type[log.event_type] || 0) + 1
      })
      
      return { success: true, data: report }
    } catch (error) {
      console.error('Generate compliance report error:', error)
      return { success: false, error: error.message }
    }
  }

  // Rate Limiting
  createRateLimiter(maxRequests, windowMs) {
    const requests = new Map()
    
    return (identifier) => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      // Clean old entries
      for (const [key, timestamps] of requests.entries()) {
        requests.set(key, timestamps.filter(t => t > windowStart))
        if (requests.get(key).length === 0) {
          requests.delete(key)
        }
      }
      
      // Check current requests
      const currentRequests = requests.get(identifier) || []
      
      if (currentRequests.length >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: Math.min(...currentRequests) + windowMs
        }
      }
      
      // Add current request
      currentRequests.push(now)
      requests.set(identifier, currentRequests)
      
      return {
        allowed: true,
        remaining: maxRequests - currentRequests.length,
        resetTime: now + windowMs
      }
    }
  }

  // Secure file upload validation
  validateFileUpload(file) {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'video/mp4', 'video/avi', 'video/quicktime'
    ]
    
    const maxSize = 50 * 1024 * 1024 // 50MB
    const errors = []
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed')
    }
    
    if (file.size > maxSize) {
      errors.push('File size exceeds 50MB limit')
    }
    
    // Check filename for malicious patterns
    const dangerousPatterns = [/\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.vbs$/i]
    if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('Potentially dangerous file type')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default new SecurityService()