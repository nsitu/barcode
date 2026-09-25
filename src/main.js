import './style.css'
import { BarcodeDetector } from 'barcode-detector/ponyfill'

document.querySelector('#app').innerHTML = `
<main class="shell">
  <header class="topbar"><a class="brand" href="/" aria-label="Barcode Lens home"><span class="brand-mark">⌁</span><span>BARCODE LENS</span></a><span class="header-note"><span class="live-dot"></span> LOCAL SCANNER</span></header>
  <section class="intro"><p class="eyebrow">WEBCAM CAPTURE / REAL-TIME DETECTION</p><h1>Scan what’s<br /><em>in front</em> of you.</h1><p class="lede">Point your camera at a barcode and we’ll read it instantly in your browser. Nothing leaves this device.</p></section>
  <section class="scanner-grid" aria-label="Barcode scanner">
    <div class="camera-card"><div class="camera-frame"><video id="video" autoplay muted playsinline></video><div class="scan-corners"><i></i><i></i><i></i><i></i></div><div class="scan-line"></div><div class="camera-placeholder" id="placeholder"><span class="camera-icon">◉</span><span>Camera preview appears here</span></div></div><div class="camera-footer"><span id="status" class="status"><span class="status-dot"></span> CAMERA OFF</span><button id="start-button" class="button button-primary" type="button">Start camera <span>↗</span></button></div></div>
    <aside class="result-card"><div class="result-heading"><span>DETECTED VALUE</span><span class="format" id="format">—</span></div><output id="result" class="result-value" aria-live="polite">Waiting…</output><p id="result-detail" class="result-detail">Start the camera, then hold a barcode inside the frame.</p><div class="result-divider"></div><div class="tips"><p class="eyebrow">QUICK TIPS</p><ul><li>Use even, natural lighting</li><li>Keep the barcode flat and steady</li><li>Move closer if the code is tiny</li></ul></div></aside>
  </section>
  <footer><span>POWERED BY <a href="https://github.com/Sec-ant/barcode-detector" target="_blank" rel="noreferrer">BARCODE-DETECTOR</a></span><span>PROCESSING STAYS LOCAL <b>✦</b></span></footer>
</main>`

const video = document.querySelector('#video')
const startButton = document.querySelector('#start-button')
const placeholder = document.querySelector('#placeholder')
const status = document.querySelector('#status')
const result = document.querySelector('#result')
const resultDetail = document.querySelector('#result-detail')
const format = document.querySelector('#format')
let stream
let scanning = false
let detector

const setStatus = (label, active = false) => { status.innerHTML = `<span class="status-dot"></span> ${label}`; status.classList.toggle('active', active) }
const scan = async () => {
  if (!scanning || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) { if (scanning) requestAnimationFrame(scan); return }
  try {
    const detections = await detector.detect(video)
    if (detections.length > 0) { const detected = detections[0]; result.textContent = detected.rawValue; format.textContent = detected.format.replaceAll('_', ' ').toUpperCase(); resultDetail.textContent = `Captured at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; setStatus('BARCODE FOUND', true) }
  } catch (error) { console.error('Barcode detection failed:', error) }
  if (scanning) requestAnimationFrame(scan)
}

startButton.addEventListener('click', async () => {
  if (scanning) { scanning = false; stream?.getTracks().forEach((track) => track.stop()); video.srcObject = null; placeholder.hidden = false; startButton.innerHTML = 'Start camera <span>↗</span>'; setStatus('CAMERA OFF'); return }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
    video.srcObject = stream; await video.play(); detector ??= new BarcodeDetector(); scanning = true; placeholder.hidden = true; startButton.innerHTML = 'Stop camera <span>×</span>'; setStatus('SCANNING LIVE', true); result.textContent = 'Waiting…'; format.textContent = '—'; resultDetail.textContent = 'Hold a barcode inside the frame.'; requestAnimationFrame(scan)
  } catch (error) { console.error(error); result.textContent = 'Camera unavailable'; resultDetail.textContent = error.name === 'NotAllowedError' ? 'Camera permission was denied. Allow access and try again.' : 'Use a secure origin (localhost or HTTPS) and try again.'; setStatus('CAMERA ERROR') }
})
