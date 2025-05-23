// This script can be run to download the face-api.js models
// Run with: node scripts/download-face-api-models.js

const fs = require("fs")
const path = require("path")
const https = require("https")

const MODELS_DIR = path.join(__dirname, "../public/models")
const BASE_URL = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights"

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true })
  console.log("Created models directory:", MODELS_DIR)
}

// List of model files to download
const modelFiles = [
  "face_expression_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_recognition_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "tiny_face_detector_model-weights_manifest.json",
]

// Download a file
function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${filename}`
    const filePath = path.join(MODELS_DIR, filename)

    console.log(`Downloading ${url}...`)

    const file = fs.createWriteStream(filePath)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on("finish", () => {
          file.close()
          console.log(`Downloaded ${filename}`)
          resolve()
        })
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}) // Delete the file if there was an error
        reject(err)
      })
  })
}

// Download all model files
async function downloadAllModels() {
  console.log("Starting download of face-api.js models...")

  try {
    for (const file of modelFiles) {
      await downloadFile(file)
    }
    console.log("All models downloaded successfully!")
  } catch (error) {
    console.error("Error downloading models:", error)
  }
}

downloadAllModels()
