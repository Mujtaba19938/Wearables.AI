export function isLowPowerDevice(): boolean {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return false

  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : "",
  )

  // Check if the device has a low number of logical processors
  const hasLowCPU =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4

  // Check for low memory devices
  const hasLowMemory =
    typeof navigator !== "undefined" &&
    // @ts-ignore - deviceMemory is not in the standard navigator type
    navigator.deviceMemory !== undefined &&
    // @ts-ignore
    navigator.deviceMemory < 4

  // For mobile devices, always use low power mode
  return isMobile || hasLowCPU || hasLowMemory
}
