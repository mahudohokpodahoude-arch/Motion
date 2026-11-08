# python3 transcribe.py audio.mp3 model_dir out.txt
# Whisper (sherpa-onnx, int8) in French. Audio is cut at silences into chunks <= 28 s (Whisper's window).
import sys, subprocess, re, wave, glob, os, numpy as np, sherpa_onnx
audio, mdir, out = sys.argv[1:4]
wav = '/tmp/claude-0/-home-user-Motion/c49657ba-536b-5f71-ae25-f5c99b307e81/scratchpad/aud16k.wav'
subprocess.run(['ffmpeg','-y','-v','error','-i',audio,'-ac','1','-ar','16000',wav],check=True)
w = wave.open(wav); x = np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768; sr = w.getframerate(); dur = len(x)/sr
# silence detection -> candidate cut points
log = subprocess.run(['ffmpeg','-v','info','-i',wav,'-af','silencedetect=noise=-32dB:d=0.35','-f','null','-'],capture_output=True,text=True).stderr
ends = [float(m) for m in re.findall(r'silence_end: ([\d.]+)',log)]; starts = [float(m) for m in re.findall(r'silence_start: ([\d.]+)',log)]
cuts = sorted(set([(s+e)/2 for s,e in zip(starts,ends)]))
segs=[]; a=0.0
while a < dur-0.5:
    cand = [c for c in cuts if a+8 < c <= a+27]
    b = max(cand) if cand else min(a+27, dur)
    if dur-a <= 27: b = dur
    segs.append((a,b)); a=b
def f(pattern):
    r = glob.glob(os.path.join(mdir,'**',pattern),recursive=True); assert r, pattern; return r[0]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f('*-encoder.int8.onnx'),decoder=f('*-decoder.int8.onnx'),tokens=f('*-tokens.txt'),language='fr',task='transcribe',num_threads=4)
lines=[]
for a,b in segs:
    s = rec.create_stream(); s.accept_waveform(sr, x[int(a*sr):int(b*sr)]); rec.decode_stream(s)
    t = s.result.text.strip(); print(f'[{a:6.1f}-{b:6.1f}] {t}', flush=True); lines.append(f'[{a:.1f}-{b:.1f}] {t}')
open(out,'w').write('\n'.join(lines)+'\n')
