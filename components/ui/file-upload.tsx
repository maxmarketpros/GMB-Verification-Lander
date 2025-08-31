"use client"

import React, { useCallback, useState } from "react"
import { Upload, X, FileText, Image } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  value?: File[]
  onChange?: (files: File[]) => void
  className?: string
  label?: string
  helperText?: string
  required?: boolean
}

export function FileUpload({
  accept = "image/*,.pdf",
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  value = [],
  onChange,
  className,
  label,
  helperText,
  required = false
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateFile = (file: File) => {
    const errors: string[] = []
    
    if (maxSize && file.size > maxSize) {
      errors.push(`File ${file.name} is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`)
    }

    return errors
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: File[] = []
    const newErrors: string[] = []

    Array.from(files).forEach(file => {
      const fileErrors = validateFile(file)
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors)
      } else {
        newFiles.push(file)
      }
    })

    setErrors(newErrors)

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...value, ...newFiles] : newFiles
      onChange?.(updatedFiles)
    }
  }, [value, multiple, onChange, maxSize])

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange?.(newFiles)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          "focus-within:border-blue-500 focus-within:bg-blue-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.includes('image') && 'Images'} 
              {accept.includes('image') && accept.includes('.pdf') && ' and '}
              {accept.includes('.pdf') && 'PDFs'} up to {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Uploaded files:</p>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <span className="text-sm text-gray-900 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
