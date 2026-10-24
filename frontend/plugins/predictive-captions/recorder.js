/* global AudioWorkletProcessor, registerProcessor, sampleRate */
class CaptionRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.samples = []; this.voiced = 0; this.silence = 0;
    this.port.onmessage = event => { if (event.data === 'flush') this.flush(); };
  }
  flush() {
    // A click or a short transient must not submit 30 seconds of padded silence to Whisper.
    if (this.voiced >= sampleRate * 0.24 && this.samples.length >= sampleRate * 0.4) {
      const pcm = Float32Array.from(this.samples);
      this.port.postMessage(pcm, [pcm.buffer]);
    }
    this.samples = []; this.voiced = 0; this.silence = 0;
  }
  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;
    const mean = input.reduce((sum, x) => sum + x, 0) / input.length;
    const rms = Math.sqrt(input.reduce((sum, x) => sum + (x - mean) ** 2, 0) / input.length);
    if (rms > 0.012) { this.voiced += input.length; this.silence = 0; }
    else this.silence += input.length;
    this.samples.push(...input);
    if (!this.voiced && this.samples.length > sampleRate * 0.2) this.samples.splice(0, input.length);
    if (this.voiced && (this.silence > sampleRate * 0.65 || this.samples.length >= sampleRate * 6)) this.flush();
    return true;
  }
}
registerProcessor('caption-recorder', CaptionRecorder);
