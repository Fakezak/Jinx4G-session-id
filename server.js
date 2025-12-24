const express = require("express")
const QRCode = require("qrcode")
const fs = require("fs")
const {
  makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const app = express()
app.use(express.static("public"))

let qrData = ""
let sessionID = ""

async function startBot() {
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
      sessionID = ""
    }

    if (connection === "open") {
      const creds = fs.readFileSync("./session/creds.json")
      sessionID = Buffer.from(creds).toString("base64")
      console.log("Jinx4G SESSION ID READY")
    }
  })
}

startBot()

app.get("/qr", (req, res) => {
  if (!qrData) return res.sendStatus(204)
  res.json({ qr: qrData })
})

app.get("/session", (req, res) => {
  if (!sessionID) return res.sendStatus(204)
  res.json({ session: sessionID })
})

app.listen(3000, () =>
  console.log("🔥 Jinx4G Session Server running on port 3000")
)
