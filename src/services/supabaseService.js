import { supabase } from '../lib/supabase'

class SupabaseService {
  // Authentication
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('SignUp error:', error)
      return { success: false, error: error.message }
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('SignIn error:', error)
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('SignOut error:', error)
      return { success: false, error: error.message }
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, data: user }
    } catch (error) {
      console.error('Get user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Deviations
  async createDeviation(deviationData) {
    try {
      const { data, error } = await supabase
        .from('deviations')
        .insert([deviationData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create deviation error:', error)
      return { success: false, error: error.message }
    }
  }

  async getDeviations(filters = {}) {
    try {
      let query = supabase
        .from('deviations')
        .select(`
          *,
          created_by:users!deviations_created_by_fkey(id, email, full_name),
          assigned_to:users!deviations_assigned_to_fkey(id, email, full_name)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.classification) {
        query = query.eq('classification', filters.classification)
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
      }

      const { data, error } = await query
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get deviations error:', error)
      return { success: false, error: error.message }
    }
  }

  async updateDeviation(id, updates) {
    try {
      const { data, error } = await supabase
        .from('deviations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update deviation error:', error)
      return { success: false, error: error.message }
    }
  }

  // Audit Trail
  async logAuditEntry(auditData) {
    try {
      const { data, error } = await supabase
        .from('audit_trail')
        .insert([auditData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Log audit entry error:', error)
      return { success: false, error: error.message }
    }
  }

  async getAuditTrail(deviationId = null, limit = 100) {
    try {
      let query = supabase
        .from('audit_trail')
        .select(`
          *,
          user:users!audit_trail_user_id_fkey(id, email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (deviationId) {
        query = query.eq('deviation_id', deviationId)
      }

      const { data, error } = await query
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get audit trail error:', error)
      return { success: false, error: error.message }
    }
  }

  // File Upload
  async uploadFile(file, bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Upload file error:', error)
      return { success: false, error: error.message }
    }
  }

  async getFileUrl(bucket, path) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      
      return { success: true, data: data.publicUrl }
    } catch (error) {
      console.error('Get file URL error:', error)
      return { success: false, error: error.message }
    }
  }

  async deleteFile(bucket, path) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete file error:', error)
      return { success: false, error: error.message }
    }
  }

  // Documents
  async createDocument(documentData) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create document error:', error)
      return { success: false, error: error.message }
    }
  }

  async getDocuments(deviationId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploaded_by:users!documents_uploaded_by_fkey(id, email, full_name)
        `)
        .eq('deviation_id', deviationId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get documents error:', error)
      return { success: false, error: error.message }
    }
  }

  // Notifications
  async createNotification(notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create notification error:', error)
      return { success: false, error: error.message }
    }
  }

  async getNotifications(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get notifications error:', error)
      return { success: false, error: error.message }
    }
  }

  async markNotificationAsRead(id) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Mark notification as read error:', error)
      return { success: false, error: error.message }
    }
  }

  // Real-time subscriptions
  subscribeToDeviation(deviationId, callback) {
    return supabase
      .channel(`deviation:${deviationId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'deviations',
          filter: `id=eq.${deviationId}`
        }, 
        callback
      )
      .subscribe()
  }

  subscribeToAuditTrail(deviationId, callback) {
    return supabase
      .channel(`audit:${deviationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'audit_trail',
          filter: `deviation_id=eq.${deviationId}`
        }, 
        callback
      )
      .subscribe()
  }

  subscribeToNotifications(userId, callback) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  }

  // Analytics
  async getAnalytics(timeframe = '30days') {
    try {
      // Get deviation counts by status
      const { data: statusCounts, error: statusError } = await supabase
        .from('deviation_analytics')
        .select('*')
        .eq('metric_type', 'status_count')
        .eq('timeframe', timeframe)

      if (statusError) throw statusError

      // Get classification breakdown
      const { data: classificationCounts, error: classError } = await supabase
        .from('deviation_analytics')
        .select('*')
        .eq('metric_type', 'classification_count')
        .eq('timeframe', timeframe)

      if (classError) throw classError

      return { 
        success: true, 
        data: {
          statusCounts,
          classificationCounts
        }
      }
    } catch (error) {
      console.error('Get analytics error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new SupabaseService()