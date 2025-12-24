const btn = document.getElementById("startBtn")
const qrBox = document.getElementById("qrBox")
const sessionBox = document.getElementById("sessionBox")

btn.onclick = async () => {
  btn.innerText = "Waiting for QR..."
  pollQR()
  pollSession()
}

async function pollQR() {
  const res = await fetch("/qr")
  if (res.status === 200) {
    const data = await res.json()
    qrBox.innerHTML = `<img src="${data.qr}" />`
  }
  setTimeout(pollQR, 2000)
}

async function pollSession() {
  const res = await fetch("/session")
  if (res.status === 200) {
    const data = await res.json()
    sessionBox.value = data.session
    btn.innerText = "Session Generated ✅"
    return
  }
  setTimeout(pollSession, 3000)
}
