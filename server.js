const express = require("express")
const QRCode = require("qrcode")
const fs = require("fs")
const {
  makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const app = express()
app.use(express.json())
app.use(express.static("public"))

let qrData = ""
let sessionID = ""
let pairCode = ""
let pairVerified = false

async function startSession() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { qr, connection } = update

    if (qr) {
      qrData = await QRCode.toDataURL(qr)
      pairCode = Math.floor(100000 + Math.random() * 900000).toString()
      pairVerified = false
      sessionID = ""
      console.log("PAIR CODE:", pairCode)
    }

    if (connection === "open") {
      const creds = fs.readFileSync("./session/creds.json")
      sessionID = Buffer.from(creds).toString("base64")
      console.log("Jinx4G SESSION READY")
    }
  })
}

startSession()

// Get QR
app.get("/qr", (req, res) => {
  if (!qrData) return res.sendStatus(204)
  res.json({ qr: qrData, pairCode })
})

// Verify Pair Code
app.post("/pair", (req, res) => {
  const { code } = req.body
  if (code === pairCode) {
    pairVerified = true
    return res.json({ success: true })
  }
  res.status(401).json({ success: false })
})

// Get Session ID (locked)
app.get("/session", (req, res) => {
  if (!pairVerified) return res.sendStatus(403)
  if (!sessionID) return res.sendStatus(204)
  res.json({ session: sessionID })
})

app.listen(3000, () =>
  console.log("🔥 Jinx4G Session Server running on port 3000")
)
