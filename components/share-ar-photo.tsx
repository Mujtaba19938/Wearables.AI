"use client"

import type React from "react"
import { useState } from "react"
import {
  isWebShareSupported,
  shareImage,
  dataURLToBlob,
  downloadImage,
  isClipboardSupported,
  copyImageToClipboard,
} from "@/utils/share"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/contexts/toast-context"

interface ShareARPhotoProps {
  imageDataURL: string
  frameName: string
}

export const ShareARPhoto: React.FC<ShareARPhotoProps> = ({ imageDataURL, frameName }) => {
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const { showToast } = useToast()

  const handleShare = async () => {
    if (isWebShareSupported()) {
      // Use native sharing if available
      setIsSharing(true)
      try {
        const imageBlob = dataURLToBlob(imageDataURL)
        const success = await shareImage(
          imageBlob,
          `${frameName.toLowerCase().replace(/\s+/g, "-")}-try-on.png`,
          `Virtual Try-On: ${frameName}`,
          `Check out how I look in these ${frameName} frames!`,
        )
        setShareSuccess(success)
        if (success) {
          showToast("Shared successfully!", "success")
        } else {
          showToast("Failed to share. Please try again.", "error")
        }
      } catch (error) {
        console.error("Error sharing:", error)
        setShareSuccess(false)
        showToast("Failed to share. Please try again.", "error")
      } finally {
        setIsSharing(false)
      }
    } else {
      // Show custom share options if native sharing is not available
      setShowShareOptions(true)
    }
  }

  const handleDownload = () => {
    const imageBlob = dataURLToBlob(imageDataURL)
    downloadImage(imageBlob, `${frameName.toLowerCase().replace(/\s+/g, "-")}-try-on.png`)
    showToast("Image downloaded successfully!", "success")
  }

  const handleCopy = async () => {
    if (isClipboardSupported()) {
      setIsSharing(true)
      try {
        const imageBlob = dataURLToBlob(imageDataURL)
        const success = await copyImageToClipboard(imageBlob)
        setCopySuccess(success)
        if (success) {
          showToast("Copied to clipboard!", "success")
        } else {
          showToast("Failed to copy. Please try again.", "error")
        }
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (error) {
        console.error("Error copying to clipboard:", error)
        setCopySuccess(false)
        showToast("Failed to copy. Please try again.", "error")
      } finally {
        setIsSharing(false)
      }
    }
  }

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")
    showToast("Opening Facebook sharing...", "info")
    setShowShareOptions(false)
  }

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out how I look in these ${frameName} frames!`)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    )
    showToast("Opening Twitter sharing...", "info")
    setShowShareOptions(false)
  }

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    )
    showToast("Opening LinkedIn sharing...", "info")
    setShowShareOptions(false)
  }

  return (
    <>
      <Button onClick={handleShare} disabled={isSharing}>
        {isWebShareSupported() ? "Share" : "Share Options"}
      </Button>

      <Dialog open={showShareOptions} onOpenChange={setShowShareOptions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Options</DialogTitle>
            <DialogDescription>Choose how you'd like to share your virtual try-on.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={handleDownload}>Download</Button>
            <Button onClick={handleCopy} disabled={isSharing}>
              {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button onClick={handleFacebookShare}>Share on Facebook</Button>
            <Button onClick={handleTwitterShare}>Share on Twitter</Button>
            <Button onClick={handleLinkedInShare}>Share on LinkedIn</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShareARPhoto
