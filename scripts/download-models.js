const fs = require("fs")
const path = require("path")
const https = require("https")

const MODELS_DIR = path.join(__dirname, "../public/models")
const BASE_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true })
}

const MODELS = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
]

// Download each model
MODELS.forEach((model) => {
  const url = `${BASE_URL}/${model}`
  const filePath = path.join(MODELS_DIR, model)

  console.log(`Downloading ${url}...`)

  const file = fs.createWriteStream(filePath)
  https
    .get(url, (response) => {
      response.pipe(file)
      file.on("finish", () => {
        file.close()
        console.log(`Downloaded ${model}`)
      })
    })
    .on("error", (err) => {
      fs.unlink(filePath)
      console.error(`Error downloading ${model}: ${err.message}`)
    })
})
