import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Download, 
  RefreshCw, 
  Sparkles,
  Palette,
  Camera,
  Wand2
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImages, setGeneratedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('natural')
  const [selectedSize, setSelectedSize] = useState('1024x1024')

  const styles = [
    { value: 'natural', label: 'Natural', icon: Camera },
    { value: 'artistic', label: 'Artistic', icon: Palette },
    { value: 'photographic', label: 'Photographic', icon: Camera },
    { value: 'digital-art', label: 'Digital Art', icon: Wand2 },
    { value: 'cartoon', label: 'Cartoon', icon: Sparkles },
    { value: 'anime', label: 'Anime', icon: Sparkles },
    { value: 'oil-painting', label: 'Oil Painting', icon: Palette },
    { value: 'watercolor', label: 'Watercolor', icon: Palette },
  ]

  const sizes = [
    { value: '1024x1024', label: 'Square (1024x1024)' },
    { value: '1792x1024', label: 'Landscape (1792x1024)' },
    { value: '1024x1792', label: 'Portrait (1024x1792)' },
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('http://localhost:3001/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt} in ${selectedStyle} style`,
          size: selectedSize,
          quality: 'hd',
          n: 1
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      if (data.images && data.images.length > 0) {
        const newImage = {
          id: Date.now(),
          url: data.images[0].url,
          prompt: prompt,
          style: selectedStyle,
          size: selectedSize,
          timestamp: new Date().toISOString()
        }
        
        setGeneratedImages(prev => [newImage, ...prev])
        toast.success('Image generated successfully!')
      } else {
        throw new Error('No image generated')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const clearImages = () => {
    setGeneratedImages([])
    toast.success('Images cleared')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-chat-text">AI Image Generator</h1>
            <p className="text-sm text-chat-muted">Create stunning images with DALL-E 3</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-chat-muted">
          <Sparkles className="w-4 h-4" />
          <span>Powered by DALL-E 3 • Updated January 2025</span>
        </div>
      </div>

      {/* Generation Form */}
      <div className="card">
        <div className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block font-medium mb-2">Image Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset with a lake reflection')"
              className="chat-input w-full h-24 resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Style Selection */}
          <div>
            <label className="block font-medium mb-2">Style</label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-3 rounded-lg border transition-colors duration-200 flex flex-col items-center space-y-1 ${
                    selectedStyle === style.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'border-chat-border hover:border-chat-muted text-chat-muted hover:text-chat-text'
                  }`}
                >
                  <style.icon className="w-4 h-4" />
                  <span className="text-xs">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block font-medium mb-2">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="chat-input w-full"
              disabled={isGenerating}
            >
              {sizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-chat-text">Generated Images</h2>
            <button
              onClick={clearImages}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <div className="space-y-3">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-chat-text font-medium">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-chat-muted">
                      <span>{image.style} • {image.size}</span>
                      <span>{new Date(image.timestamp).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => downloadImage(image.url, `ai-generated-${image.id}.png`)}
                      className="btn-secondary w-full flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="font-semibold text-chat-text mb-2">💡 Tips for Better Images</h3>
        <ul className="text-sm text-chat-muted space-y-1">
          <li>• Be specific and descriptive in your prompts</li>
          <li>• Include details about lighting, composition, and mood</li>
          <li>• Try different styles to achieve different effects</li>
          <li>• Use adjectives to enhance the visual quality</li>
        </ul>
      </div>
    </div>
  )
}

export default ImageGenerator

 