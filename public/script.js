const startBtn = document.getElementById("startBtn")
const qrBox = document.getElementById("qrBox")
const pairBox = document.getElementById("pairBox")
const pairInput = document.getElementById("pairInput")
const pairBtn = document.getElementById("pairBtn")
const sessionBox = document.getElementById("sessionBox")

startBtn.onclick = () => {
  startBtn.innerText = "Waiting for QR..."
  pollQR()
}

async function pollQR() {
  const res = await fetch("/qr")
  if (res.status === 200) {
    const data = await res.json()
    qrBox.innerHTML = `<img src="${data.qr}">`
    pairBox.innerText = `PAIR CODE: ${data.pairCode}`
  }
  setTimeout(pollQR, 2000)
}

pairBtn.onclick = async () => {
  const code = pairInput.value
  const res = await fetch("/pair", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })

  if (res.ok) {
    pairBtn.innerText = "Paired ✅"
    pollSession()
  } else {
    alert("Wrong Pair Code")
  }
}

async function pollSession() {
  const res = await fetch("/session")
  if (res.status === 200) {
    const data = await res.json()
    sessionBox.value = data.session
    startBtn.innerText = "Session Ready 🔥"
    return
  }
  setTimeout(pollSession, 3000)
}
