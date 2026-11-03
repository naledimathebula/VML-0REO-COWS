/* ---------- sound (synthesised, no files) ---------- */
let AC,mute=false;
const ac=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC};
function noise(dur,f,q,vol,type,delay){if(mute)return;const A=ac(),n=Math.floor(A.sampleRate*dur),bf=A.createBuffer(1,n,A.sampleRate),d=bf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);const s=A.createBufferSource();s.buffer=bf;const fl=A.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f;fl.Q.value=q;const g=A.createGain();g.gain.value=vol;s.connect(fl);fl.connect(g);g.connect(A.destination);s.start(A.currentTime+(delay||0))}
function moo(){if(mute)return;const A=ac(),T=A.currentTime,o=A.createOscillator(),lf=A.createOscillator(),lg=A.createGain(),fl=A.createBiquadFilter(),g=A.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(120,T);o.frequency.linearRampToValueAtTime(140,T+.35);o.frequency.exponentialRampToValueAtTime(82,T+1.7);
 lf.frequency.value=5;lg.gain.value=4;lf.connect(lg);lg.connect(o.frequency);fl.type='lowpass';fl.Q.value=5;fl.frequency.setValueAtTime(380,T);fl.frequency.linearRampToValueAtTime(900,T+.5);fl.frequency.linearRampToValueAtTime(420,T+1.7);
 g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(.35,T+.15);g.gain.linearRampToValueAtTime(.3,T+1.2);g.gain.linearRampToValueAtTime(0,T+1.8);
 o.connect(fl);fl.connect(g);g.connect(A.destination);o.start(T);lf.start(T);o.stop(T+1.9);lf.stop(T+1.9)}
function snap(){noise(.06,3800,1,.9,'highpass');noise(.12,260,3,.8,'lowpass')}
function crunch(){for(let i=0;i<16;i++)noise(.05+Math.random()*.06,700+Math.random()*2800,2,.55,'bandpass',i*.03+Math.random()*.02)}
document.getElementById('snd').onclick=function(){mute=!mute;this.textContent=mute?'Sound off':'Sound on'};
let lastTick=0;