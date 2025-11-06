// AI Image Generator Utility
// This module can be used to generate felted animal images using AI image generation APIs
// Currently disabled - configure API keys and uncomment to enable

/**
 * Generate a felted animal image using AI image generation
 * 
 * @param {Object} data - The data object containing data.data array
 * @param {Object} animalParams - Animal parameters (size, colors, etc.)
 * @param {string} animalName - Name of the animal (bear, cat, dog, etc.)
 * @returns {Promise<string|null>} - Base64 image data URL or null if generation fails
 */
export async function generateAIAnimalImage(data, animalParams, animalName = 'bear') {
  // TODO: Configure your AI image generation API key
  // Options:
  // 1. OpenAI DALL-E: https://platform.openai.com/docs/guides/images
  // 2. Stability AI Stable Diffusion: https://platform.stability.ai/
  // 3. Midjourney API (if available)
  // 4. Replicate API: https://replicate.com/
  
  const API_KEY = process.env.NEXT_PUBLIC_AI_IMAGE_API_KEY || ''
  const API_URL = process.env.NEXT_PUBLIC_AI_IMAGE_API_URL || ''
  
  if (!API_KEY || !API_URL) {
    console.warn('AI Image Generation API not configured. Set NEXT_PUBLIC_AI_IMAGE_API_KEY and NEXT_PUBLIC_AI_IMAGE_API_URL environment variables.')
    return null
  }
  
  try {
    // Generate prompt based on data and animal parameters
    const prompt = generatePromptFromData(data, animalParams, animalName)
    
    // Example for OpenAI DALL-E:
    /*
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      })
    })
    
    const result = await response.json()
    if (result.data && result.data[0]) {
      return result.data[0].url
    }
    */
    
    // Example for Stability AI:
    /*
    const response = await fetch(`${API_URL}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30
      })
    })
    
    const result = await response.json()
    if (result.artifacts && result.artifacts[0]) {
      return `data:image/png;base64,${result.artifacts[0].base64}`
    }
    */
    
    return null
  } catch (error) {
    console.error('Error generating AI image:', error)
    return null
  }
}

/**
 * Generate a prompt for AI image generation based on data and animal parameters
 * 
 * @param {Object} data - The data object
 * @param {Object} animalParams - Animal parameters
 * @param {string} animalName - Name of the animal
 * @returns {string} - Generated prompt
 */
function generatePromptFromData(data, animalParams, animalName) {
  // Extract data characteristics
  const allValues = []
  data.data.forEach(row => {
    row.forEach(val => {
      if (typeof val === 'number') allValues.push(val)
    })
  })
  
  const avgValue = allValues.length > 0 
    ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length 
    : 0.5
  
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0
  const dataRange = maxValue - minValue
  
  // Map data characteristics to descriptive terms
  const sizeDescription = avgValue > 0.7 ? 'large' : avgValue > 0.4 ? 'medium-sized' : 'small'
  const complexityDescription = dataRange > 0.5 ? 'detailed' : 'simple'
  const colorVariance = dataRange > 0.3 ? 'multicolored' : 'solid-colored'
  
  // Build prompt
  const prompt = `A ${sizeDescription}, ${complexityDescription}, ${colorVariance} felted ${animalName} toy, handcrafted with wool felt, 
    soft and cuddly appearance, professional photography, studio lighting, white background, 
    high quality, detailed texture, realistic proportions, cute and friendly expression`
  
  return prompt
}

/**
 * Check if AI image generation is available
 * @returns {boolean}
 */
export function isAIImageGenerationAvailable() {
  return !!(process.env.NEXT_PUBLIC_AI_IMAGE_API_KEY && process.env.NEXT_PUBLIC_AI_IMAGE_API_URL)
}

