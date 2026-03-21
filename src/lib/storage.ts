import { supabase } from './supabase'

export interface UploadResult {
  url: string | null
  error: string | null
}

export async function uploadTradeScreenshot(
  file: File, 
  userId: string, 
  tradeId: string
): Promise<UploadResult> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' }
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { url: null, error: 'Image size must be less than 5MB' }
    }

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}/${tradeId}/${timestamp}.${fileExtension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('trade-screenshots')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('trade-screenshots')
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected upload error:', error)
    return { url: null, error: 'Failed to upload image' }
  }
}

export async function deleteTradeScreenshot(
  screenshotUrl: string | null | undefined
): Promise<{ error: string | null }> {
  if (!screenshotUrl) {
    return { error: null }
  }

  try {
    // Extract file path from public URL
    const url = new URL(screenshotUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const userId = pathParts[pathParts.length - 2]
    const fullPath = `${userId}/${fileName}`

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('trade-screenshots')
      .remove([fullPath])

    if (error) {
      console.error('Delete error:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error('Unexpected delete error:', error)
    return { error: 'Failed to delete image' }
  }
}