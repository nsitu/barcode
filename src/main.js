import './style.css'
import { BarcodeDetector } from 'barcode-detector/ponyfill'

document.querySelector('#app').innerHTML = `
<main class="app">
  <header><a href="/">BARCODE SCANNER</a></header>
  <section class="scanner">
    <div class="camera-panel"><div class="camera-frame" id="camera-frame"><video id="video" autoplay muted playsinline></video><div class="scan-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="scan-line" aria-hidden="true"></div><div class="placeholder" id="placeholder"></div></div><div class="controls"><span id="status" class="status"></span><button id="start-button" class="button primary" type="button">START CAMERA</button></div></div>
    <aside class="result-panel"><p class="label">DETECTED VALUE</p><output id="result" aria-live="polite">—</output><p id="format" class="format">—</p></aside>
  </section>
</main>`

const video = document.querySelector('#video')
const startButton = document.querySelector('#start-button')
const placeholder = document.querySelector('#placeholder')
const cameraFrame = document.querySelector('#camera-frame')
const status = document.querySelector('#status')
const result = document.querySelector('#result')
const format = document.querySelector('#format')
let stream
let scanning = false
let detector

const setStatus = (value) => { status.textContent = value; status.classList.toggle('active', value === 'SCANNING') }
const scan = async () => {
  if (!scanning || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) { if (scanning) requestAnimationFrame(scan); return }
  try {
    const detections = await detector.detect(video)
    if (detections.length) {
      const detected = detections[0]
      result.textContent = detected.rawValue
      format.textContent = detected.format.replaceAll('_', ' ').toUpperCase()
      scanning = false
      stream?.getTracks().forEach((track) => track.stop())
      video.srcObject = null
      cameraFrame.classList.remove('active')
      placeholder.hidden = false
      startButton.textContent = 'START CAMERA'
      setStatus('FOUND')
    }
  } catch (error) { console.error('Barcode detection failed:', error) }
  if (scanning) requestAnimationFrame(scan)
}

startButton.addEventListener('click', async () => {
  if (scanning) { scanning = false; stream?.getTracks().forEach((track) => track.stop()); video.srcObject = null; placeholder.hidden = false; cameraFrame.classList.remove('active'); startButton.textContent = 'START CAMERA'; setStatus(''); return }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
    video.srcObject = stream; await video.play(); detector ??= new BarcodeDetector(); scanning = true; placeholder.hidden = true; cameraFrame.classList.add('active'); startButton.textContent = 'STOP CAMERA'; setStatus('SCANNING'); result.textContent = '—'; format.textContent = '—'; requestAnimationFrame(scan)
  } catch (error) { console.error(error); result.textContent = 'ERROR'; format.textContent = error.name === 'NotAllowedError' ? 'ALLOW CAMERA ACCESS' : 'USE HTTPS OR LOCALHOST'; setStatus('ERROR') }
})
