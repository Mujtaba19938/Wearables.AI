/**
 * Utility functions for sharing content
 */

// Check if Web Share API is supported
export function isWebShareSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share
}

// Check if the browser supports the clipboard API
export function isClipboardSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.clipboard
}

// Share content using the Web Share API
export async function shareContent(data: {
  title?: string
  text?: string
  url?: string
  files?: File[]
}): Promise<boolean> {
  if (!isWebShareSupported()) {
    console.error("Web Share API not supported")
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    console.error("Error sharing content:", error)
    return false
  }
}

// Share an image using the Web Share API
export async function shareImage(
  imageBlob: Blob,
  fileName = "glasses-try-on.png",
  title = "Check out these glasses!",
  text = "What do you think of these frames on me?",
): Promise<boolean> {
  if (!isWebShareSupported()) {
    console.error("Web Share API not supported")
    return false
  }

  try {
    const file = new File([imageBlob], fileName, { type: imageBlob.type })

    // Check if sharing files is supported
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text,
        files: [file],
      })
      return true
    } else {
      // Fallback to sharing without the file
      await navigator.share({
        title,
        text,
      })
      return true
    }
  } catch (error) {
    console.error("Error sharing image:", error)
    return false
  }
}

// Copy image to clipboard
export async function copyImageToClipboard(imageBlob: Blob): Promise<boolean> {
  if (!isClipboardSupported()) {
    console.error("Clipboard API not supported")
    return false
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [imageBlob.type]: imageBlob,
      }),
    ])
    return true
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    return false
  }
}

// Download image
export function downloadImage(imageBlob: Blob, fileName = "glasses-try-on.png"): void {
  const url = URL.createObjectURL(imageBlob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Convert a data URL to a Blob
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}
