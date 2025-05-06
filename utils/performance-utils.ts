export function isLowPowerDevice(): boolean {
  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : "",
  )

  // Check if the device has a low number of logical processors
  const hasLowCPU =
    typeof navigator !== "undefined" && navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4

  // Check if the device has requested battery saving mode (if available)
  const hasBatterySaving =
    typeof navigator !== "undefined" &&
    "getBattery" in navigator &&
    // @ts-ignore - getBattery is not in the standard navigator type
    navigator.getBattery &&
    // @ts-ignore
    navigator
      .getBattery()
      .then((battery: any) => battery.charging === false && battery.level < 0.2)

  return isMobile || hasLowCPU || !!hasBatterySaving
}
