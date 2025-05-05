export interface FacialMeasurements {
  // Basic measurements
  faceWidth: number
  faceHeight: number
  jawWidth: number
  cheekWidth: number
  foreheadHeight: number
  chinHeight: number

  // Ratios
  widthToHeightRatio: number
  jawToFaceWidthRatio: number
  cheekToJawRatio: number
  foreheadToChinRatio: number
  foreheadToJawRatio: number

  // Advanced measurements
  symmetryScore: number
  goldenRatioScore: number
  eyeDistance: number
  eyeWidth: number
  eyeSpacingRatio: number

  // Facial proportions
  facialThirds: {
    upper: number
    middle: number
    lower: number
    balanced: boolean
  }

  facialFifths: {
    width: number
    balanced: boolean
  }
}
