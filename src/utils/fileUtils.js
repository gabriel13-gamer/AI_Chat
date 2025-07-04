import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

// PDF.js will use its default worker configuration
// No manual worker configuration needed

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

// Separate function for PDF processing with multiple fallback strategies
export const processPDFFile = async (file) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  
  console.log('Starting PDF processing for:', file.name)
  console.log('File size:', file.size, 'bytes')
  console.log('PDF.js version:', pdfjsLib.version)
  
  // Strategy 1: Try with minimal settings
  try {
    console.log('Strategy 1: Trying with minimal settings...')
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0,
      disableWorker: true,
      disableRange: true,
      disableStream: true
    })
    
    const pdf = await loadingTask.promise
    let text = ''
    let pagesProcessed = 0
    
    console.log(`Successfully loaded PDF with ${pdf.numPages} pages`)
    
    // Process each page with error handling
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        console.log(`Processing page ${i}/${pdf.numPages}...`)
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        
        if (textContent && textContent.items && textContent.items.length > 0) {
          const pageText = textContent.items
            .map(item => item.str || '')
            .join(' ')
          text += pageText + '\n'
          pagesProcessed++
          console.log(`Page ${i} processed successfully`)
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
  } catch (error) {
    console.error('Primary PDF processing failed:', error.message)
    console.error('Full error:', error)
    
    // Strategy 2: Try with even more minimal settings
    try {
      console.log('Strategy 2: Trying with even more minimal settings...')
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0,
        disableWorker: true,
        disableRange: true,
        disableStream: true,
        cMapUrl: null,
        cMapPacked: false,
        standardFontDataUrl: null
      })
      
      const pdf = await loadingTask.promise
      let text = ''
      
      // Process first few pages only for fallback
      const maxPages = Math.min(pdf.numPages, 2)
      for (let i = 1; i <= maxPages; i++) {
        try {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          
          if (textContent && textContent.items && textContent.items.length > 0) {
            const pageText = textContent.items
              .map(item => item.str || '')
              .join(' ')
            text += pageText + '\n'
          }
        } catch (pageError) {
          console.warn(`Fallback: Error processing page ${i}:`, pageError)
        }
      }
      
      const result = text.trim()
      if (result && result !== '') {
        console.log(`Fallback method successful, processed ${maxPages} pages`)
        return result + '\n\n[Note: Only first few pages processed due to technical limitations]'
      }
    } catch (fallbackError) {
      console.error('Fallback PDF processing also failed:', fallbackError.message)
    }
    
    // Strategy 3: Try to provide a basic file info response
    try {
      console.log('Strategy 3: Providing basic file information...')
      return `PDF File Information:
- Filename: ${file.name}
- File size: ${formatFileSize(file.size)}
- File type: PDF document

Note: This PDF could not be processed for text extraction. This might be due to:
1. The PDF being password protected
2. The PDF containing only scanned images
3. The PDF being corrupted or in an unsupported format
4. Technical limitations in the current environment

Please try converting the PDF to a text format or using a different document.`
    } catch (infoError) {
      console.error('Even basic info failed:', infoError)
    }
    
    // If all strategies fail, provide helpful error message
    if (error.message.includes('Invalid PDF structure')) {
      throw new Error('The PDF file appears to be corrupted or invalid')
    } else if (error.message.includes('Password required')) {
      throw new Error('This PDF is password protected and cannot be processed')
    } else if (error.message.includes('worker') || error.message.includes('fetch')) {
      throw new Error('PDF processing is temporarily unavailable. Please try again or use a different file format.')
    } else {
      throw new Error(`PDF processing failed: ${error.message}`)
    }
  }
}

export const processDocument = async (file) => {
  const fileType = getFileType(file.name)
  
  try {
    switch (fileType) {
      case 'TEXT':
        return await readFileAsText(file)
        
      case 'DOCUMENT':
        if (file.name.toLowerCase().endsWith('.pdf')) {
          // For now, provide a helpful message about PDF processing
          return `PDF Processing Notice

The PDF file "${file.name}" has been uploaded successfully, but text extraction is currently experiencing technical difficulties.

File Information:
• Filename: ${file.name}
• Size: ${formatFileSize(file.size)}
• Type: PDF document

To work with this document, please try one of these alternatives:

1. Convert the PDF to a text file (.txt):
   - Open the PDF in a PDF reader
   - Copy the text content
   - Save as a .txt file
   - Upload the .txt file instead

2. Convert to Word document (.docx):
   - Use online converters like SmallPDF, ILovePDF, or Adobe Acrobat
   - Save as .docx format
   - Upload the .docx file

3. If it's a scanned document:
   - Use OCR software to extract text
   - Save as .txt or .docx
   - Upload the converted file

4. Alternative formats supported:
   • Text files (.txt, .md)
   • Word documents (.docx)
   • Spreadsheets (.xlsx, .csv)
   • Code files (.js, .py, .html, etc.)

We're working on improving PDF processing support. Thank you for your patience!`
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
    // Note: PDF processing is currently limited - users will get a helpful message
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