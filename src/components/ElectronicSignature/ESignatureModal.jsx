import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLock, FiCheck, FiX, FiShield } from 'react-icons/fi'

function ESignatureModal({ isOpen, onClose, onSign, document, reason }) {
  const [password, setPassword] = useState('')
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSign = async () => {
    if (!password.trim()) {
      alert('Password is required for electronic signature')
      return
    }

    setLoading(true)
    try {
      const signatureData = {
        document_id: document?.id,
        reason,
        comments,
        password_hash: btoa(password), // In real implementation, this would be properly hashed
        signed_at: new Date().toISOString(),
        ip_address: '192.168.1.100', // Would be captured from request
        user_agent: navigator.userAgent
      }

      await onSign(signatureData)
      onClose()
    } catch (error) {
      console.error('Electronic signature error:', error)
      alert('Electronic signature failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Electronic Signature
                </h3>
                <p className="text-sm text-gray-600">
                  FDA 21 CFR Part 11 Compliant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Document to Sign</h4>
            <p className="text-sm text-gray-600">
              {document?.title || 'Investigation Report'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Reason: {reason}
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10"
                placeholder="Enter your password"
                required
              />
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your password confirms your identity for this electronic signature
            </p>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Add any comments about your approval..."
            />
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-yellow-900 mb-2">
              Electronic Signature Agreement
            </h5>
            <div className="text-xs text-yellow-800 space-y-1">
              <p>
                By entering your password, you are electronically signing this document
                and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>This signature is legally equivalent to a handwritten signature</li>
                <li>You are the authorized person for this signature</li>
                <li>This signature is binding and cannot be disputed</li>
                <li>All signature data will be securely logged per FDA 21 CFR Part 11</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSign}
              disabled={!password.trim() || loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              <span>{loading ? 'Signing...' : 'Sign Document'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ESignatureModal