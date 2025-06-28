import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiImage, FiVideo, FiX, FiDownload, FiEye } from 'react-icons/fi'
import supabaseService from '../../services/supabaseService'

function FileUploadManager({ deviationId, onFileUploaded, existingFiles = [] }) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState(existingFiles)
  const [uploadProgress, setUploadProgress] = useState({})

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    
    for (const file of acceptedFiles) {
      const fileId = `${Date.now()}-${file.name}`
      const filePath = `${deviationId}/${fileId}`
      
      try {
        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        // Upload to Supabase Storage
        const uploadResult = await supabaseService.uploadFile(file, 'documents', filePath)
        
        if (uploadResult.success) {
          // Get public URL
          const urlResult = await supabaseService.getFileUrl('documents', filePath)
          
          // Create document record
          const documentData = {
            deviation_id: deviationId,
            filename: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: (await supabaseService.getCurrentUser()).data?.id,
            url: urlResult.data
          }
          
          const docResult = await supabaseService.createDocument(documentData)
          
          if (docResult.success) {
            setFiles(prev => [...prev, docResult.data])
            onFileUploaded?.(docResult.data)
            
            // Process file if it's an image (OCR, etc.)
            if (file.type.startsWith('image/')) {
              processImageFile(file, docResult.data)
            }
          }
        }
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
      } catch (error) {
        console.error('Upload error:', error)
        setUploadProgress(prev => ({ ...prev, [fileId]: -1 }))
      }
    }
    
    setUploading(false)
  }, [deviationId, onFileUploaded])

  const processImageFile = async (file, documentRecord) => {
    try {
      // Import Tesseract dynamically
      const Tesseract = await import('tesseract.js')
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      })
      
      // Update document with extracted text
      await supabaseService.updateDocument(documentRecord.id, {
        extracted_text: text,
        processed_at: new Date().toISOString()
      })
      
      // Log OCR processing in audit trail
      await supabaseService.logAuditEntry({
        deviation_id: deviationId,
        action: 'Document OCR Processing',
        action_type: 'PROCESS',
        section: 'Document Management',
        new_value: `OCR text extracted from ${file.name}`,
        justification: 'Automatic text extraction for searchability and compliance',
        regulatory_impact: 'Low',
        user_id: (await supabaseService.getCurrentUser()).data?.id
      })
    } catch (error) {
      console.error('OCR processing error:', error)
    }
  }

  const deleteFile = async (file) => {
    try {
      await supabaseService.deleteFile('documents', file.file_path)
      setFiles(prev => prev.filter(f => f.id !== file.id))
      
      // Log file deletion
      await supabaseService.logAuditEntry({
        deviation_id: deviationId,
        action: 'Document Deleted',
        action_type: 'DELETE',
        section: 'Document Management',
        old_value: file.filename,
        justification: 'Document removed from investigation',
        regulatory_impact: 'Medium',
        user_id: (await supabaseService.getCurrentUser()).data?.id
      })
    } catch (error) {
      console.error('Delete file error:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'video/*': ['.mp4', '.avi', '.mov']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10
  })

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return FiImage
    if (fileType.startsWith('video/')) return FiVideo
    return FiFile
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload Evidence & Documents'}
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supports: Images, PDFs, Word docs, Excel files, Text files, Videos (Max 50MB each)
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-600 mt-2">Uploading files...</p>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Uploaded Documents ({files.length})
        </h4>
        
        <AnimatePresence>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.file_type)
            const progress = uploadProgress[file.id]
            
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                    {progress !== undefined && progress < 100 && progress >= 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {progress === -1 && (
                      <p className="text-sm text-red-600 mt-1">Upload failed</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.url && (
                    <>
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View file"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = file.url
                          link.download = file.filename
                          link.click()
                        }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Download file"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteFile(file)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete file"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {files.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiFile className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploadManager