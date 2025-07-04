import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use a simple approach that works with Vite
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
}

export const fileTypes = {
  TEXT: ['txt', 'md', 'json', 'csv'],
  DOCUMENT: ['pdf', 'docx', 'doc'],
  SPREADSHEET: ['xlsx', 'xls', 'csv'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  AUDIO: ['mp3', 'wav', 'ogg', 'webm'],
  VIDEO: ['mp4', 'avi', 'mov', 'webm'],
  CODE: ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs', 'swift', 'kt']
}

export const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase()
  
  for (const [type, extensions] of Object.entries(fileTypes)) {
    if (extensions.includes(extension)) {
      return type
    }
  }
  
  return 'UNKNOWN'
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsArrayBuffer(file)
  })
}

export const processDocument = async (file) => {
  const fileType = getFileType(file.name)
  
  try {
    switch (fileType) {
      case 'TEXT':
        return await readFileAsText(file)
        
      case 'DOCUMENT':
        if (file.name.toLowerCase().endsWith('.pdf')) {
          try {
            const arrayBuffer = await readFileAsArrayBuffer(file)
            
            // Use pdfjs-dist for PDF processing
            const loadingTask = pdfjsLib.getDocument({ 
              data: arrayBuffer,
              verbosity: 0 // Reduce console output
            })
            
            const pdf = await loadingTask.promise
            let text = ''
            let pagesProcessed = 0
            
            console.log(`Processing PDF with ${pdf.numPages} pages`)
            
            // Process each page with error handling
            for (let i = 1; i <= pdf.numPages; i++) {
              try {
                const page = await pdf.getPage(i)
                const textContent = await page.getTextContent()
                
                if (textContent && textContent.items && textContent.items.length > 0) {
                  const pageText = textContent.items
                    .map(item => item.str || '')
                    .join(' ')
                  text += pageText + '\n'
                  pagesProcessed++
                } else {
                  console.warn(`Page ${i} has no text content (possibly scanned image)`)
                  text += `[Page ${i} - No text content (scanned image)]\n`
                }
              } catch (pageError) {
                console.warn(`Error processing page ${i}:`, pageError)
                text += `[Page ${i} - Error reading content]\n`
              }
            }
            
            const result = text.trim()
            if (result && result !== '') {
              console.log(`Successfully processed ${pagesProcessed} pages`)
              return result
            } else {
              return 'No text content could be extracted from this PDF. The document might be scanned images or have no selectable text.'
            }
          } catch (pdfError) {
            console.error('PDF processing error:', pdfError)
            throw new Error(`PDF processing failed: ${pdfError.message}`)
          }
        } else if (file.name.toLowerCase().endsWith('.docx')) {
          const arrayBuffer = await readFileAsArrayBuffer(file)
          const result = await mammoth.extractRawText({ arrayBuffer })
          return result.value
        } else {
          throw new Error('Unsupported document format')
        }
        
      case 'SPREADSHEET':
        const arrayBuffer = await readFileAsArrayBuffer(file)
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Convert to readable text format
        return jsonData.map(row => row.join('\t')).join('\n')
        
      case 'CODE':
        return await readFileAsText(file)
        
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Error processing file:', error)
    throw new Error(`Failed to process ${file.name}: ${error.message}`)
  }
}

export const validateFile = (file, maxSize = 10 * 1024 * 1024) => { // 10MB default
  const errors = []
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`)
  }
  
  if (file.size === 0) {
    errors.push('File is empty')
  }
  
  const fileType = getFileType(file.name)
  if (fileType === 'UNKNOWN') {
    errors.push('Unsupported file type')
  }
  
  // Additional validation for PDF files
  if (file.name.toLowerCase().endsWith('.pdf')) {
    if (file.size < 100) { // PDF files should be at least 100 bytes
      errors.push('PDF file appears to be corrupted or too small')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const createFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    const fileType = getFileType(file.name)
    
    if (fileType === 'IMAGE') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
    } else {
      resolve(null)
    }
  })
}

export const extractCodeFromText = (text) => {
  const codeBlocks = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let match
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    })
  }
  
  return codeBlocks
}

export const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_')
} 