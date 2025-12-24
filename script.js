async function getPairCode() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();

  if (!phoneNumber) {
    alert('Enter your WhatsApp number');
    return;
  }

  try {
    const res = await fetch('/generate-pair-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `phoneNumber=${encodeURIComponent(phoneNumber)}`
    });

    const text = await res.text();

    document.getElementById('message').innerHTML = 'Pair code sent to WhatsApp ✅';
    document.getElementById('verifySection').style.display = 'block';

  } catch (err) {
    document.getElementById('message').innerHTML = 'Error sending pair code ❌';
  }
}

async function verifyPairCode() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const pairCode = document.getElementById('pairCode').value.trim();

  if (!pairCode) {
    alert('Enter the pair code');
    return;
  }

  try {
    const res = await fetch('/verify-pair-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:
        `phoneNumber=${encodeURIComponent(phoneNumber)}&pairCode=${encodeURIComponent(pairCode)}`
    });

    const text = await res.text();
    document.getElementById('message').innerHTML = text;

  } catch (err) {
    document.getElementById('message').innerHTML = 'Verification failed ❌';
  }
}
