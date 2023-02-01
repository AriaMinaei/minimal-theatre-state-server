import express from "express"
import fs from "fs"

const app = express()
const port = process.argv[3]
  ? Number(process.argv[3].split("=")[1]) || 8008
  : 8008
const path = process.argv[2]

if (!path) {
  console.error(
    "No <path> provided. Call this script like this: yarn start path/to/the/states/folder"
  )
  process.exit(1)
}

if (!fs.existsSync(path)) {
  console.error(`Path "${path}" does not exist.`)
  process.exit(1)
}

app.use(express.json())

// enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.post(`/states/:projectId`, (req, res) => {
  const projectId = req.params.projectId
  if (!/^[a-zA-Z0-9]{1,128}$/.test(projectId)) {
    return res.status(400).send("Invalid project ID")
  }

  if (!req.body) {
    return res.status(400).send("Invalid JSON payload")
  }

  fs.writeFileSync(
    `${path}/${projectId}.json`,
    JSON.stringify(req.body, null, 2)
  )

  res.send(`State saved for project ID: ${projectId}`)
})

app.get("/", (req, res) => {
  res.send(
    "This is a state server. Check out how to use it at README.md in the root of this repository."
  )
})

app.listen(port, () => {
  console.log(`State server listening http://localhost:${port}/`)
})
