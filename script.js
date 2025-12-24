async function getCode() {
  const phoneNumber = document.getElementById('phone').value.trim();
  if (!phoneNumber) return alert('Enter your WhatsApp number');

  const res = await fetch('/generate-pair-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });

  const data = await res.json();

  if (data.success) {
    document.getElementById('msg').innerText = 'Pair code sent to WhatsApp!';
    document.getElementById('verify').style.display = 'block';
  } else {
    document.getElementById('msg').innerText = data.error;
  }
}

async function verifyCode() {
  const phoneNumber = document.getElementById('phone').value.trim();
  const pairCode = document.getElementById('code').value.trim();

  const res = await fetch('/verify-pair-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, pairCode })
  });

  const data = await res.json();

  document.getElementById('msg').innerText =
    data.success ? 'Session ID sent to WhatsApp!' : data.error;
}
