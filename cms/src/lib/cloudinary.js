const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload a file to Cloudinary using unsigned upload preset.
 * @param {File} file - The file to upload
 * @param {string} folder - Cloudinary folder (e.g. 'products', 'certificates')
 * @returns {{ url: string, publicId: string }}
 */
export async function uploadToCloudinary(file, folder = 'afra') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Missing Cloudinary environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

/**
 * Get an optimized Cloudinary image URL.
 * @param {string} publicId
 * @param {{ width?: number, height?: number, quality?: string }} opts
 */
export function getCloudinaryUrl(publicId, opts = {}) {
  if (!publicId) return null
  const { width = 800, quality = 'auto', format = 'auto' } = opts
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${quality},f_${format}/${publicId}`
}
