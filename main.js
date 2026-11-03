const c=document.getElementById('c'),x=c.getContext('2d'),hint=document.getElementById('hint'),lt=document.getElementById('lt');
let W,H,u,s,tableY,hY;
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);u=Math.min(W/1.2,H)/700;s=Math.max(u*1.35,W/620);tableY=H*.74;hY=H*.42}
addEventListener('resize',rs);rs();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let mode='pasture',level=0,t=0,px=0,py=0,hold=false,drag=false,lastX=0,tw=0,split=0,gyroOn=false,galT=0;
let drops=[],crumbs=[],gal=[];
const gl=()=>({x:W*.8,top:tableY+(H-tableY)*.5-70*u,base:tableY+(H-tableY)*.5+50*u});
const cowPos=()=>({x:W*.5,y:tableY-4});

/* ---------- scene ---------- */
function hills(base,amp,col,f,ph,k){x.fillStyle=col;x.beginPath();x.moveTo(0,hY+40);
 for(let i=0;i<=W+20;i+=20)x.lineTo(i,base-amp*(Math.sin(i*f+ph)+.5*Math.sin(i*f*2.3+ph))+px*k);
 x.lineTo(W,hY+60);x.fill()}
function bgScene(){
 let g=x.createLinearGradient(0,0,0,hY+40);g.addColorStop(0,'#8fb0cc');g.addColorStop(1,'#e3e9df');x.fillStyle=g;x.fillRect(0,0,W,hY+60);
 hills(hY-30*u,50*u,'#6f8aa0',.004,1,-6);hills(hY-8*u,35*u,'#4d6f58',.007,3,-12);hills(hY+10*u,18*u,'#3f6a2d',.011,5,-20);
 g=x.createLinearGradient(0,hY,0,tableY);g.addColorStop(0,'#5d8b38');g.addColorStop(1,'#32561f');x.fillStyle=g;x.fillRect(0,hY+10,W,tableY-hY);
 x.fillStyle='rgba(0,0,0,.05)';for(let i=0;i<8;i++){x.fillRect(0,hY+20+i*(tableY-hY)/8,W,(tableY-hY)/16)}
 cow(W*.2+px*-14,hY+34*u,s*.3,2,true);cow(W*.3+px*-14,hY+56*u,s*.38,4,true);
}
function cow(cx,cy,sc,ph,small){
 const cp=small?0:1,d=small?.5+.5*Math.sin(t*.7+ph):(hold&&mode==='pasture'?0:.5+.5*Math.sin(t*.7+ph));
 x.save();x.translate(cx,cy);x.scale(sc,sc);
 x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(0,4,130,14,0,0,7);x.fill();
 const sw=Math.sin(t*1.6+ph);
 x.strokeStyle='#111';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(-112,-130);x.quadraticCurveTo(-150,-110+sw*14,-140+sw*18,-60);x.stroke();
 x.fillStyle='#151311';[-88,-56,58,90].forEach(l=>{x.fillRect(l-9,-70,18,70);x.fillRect(l-10,-8,20,8)});
 x.save();x.beginPath();x.ellipse(0,-120,125,62,0,0,7);x.clip();
 x.fillStyle='#171513';x.fillRect(-140,-190,280,140);
 x.shadowColor='#fff';x.shadowBlur=10;x.fillStyle='#f4f0e6';x.beginPath();
 for(let i=0;i<=14;i++)x.lineTo(-32+(i%2?7:-5),-190+i*10);for(let i=14;i>=0;i--)x.lineTo(32+(i%2?-6:6),-190+i*10);x.fill();
 x.shadowBlur=0;g=x.createLinearGradient(0,-185,0,-55);g.addColorStop(0,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(-140,-190,280,140);
 // fur: seeded strokes that sway in the wind, fluffy band edges, sun rim light
 const N=small?50:420;for(let i=0;i<N;i++){const a=Math.sin(i*12.9898+ph)*43758.5453,r1=a-Math.floor(a),b=Math.sin(i*78.233)*12543.17,r2=b-Math.floor(b),fx=-135+r1*270,fy=-185+r2*135;
  x.strokeStyle=Math.abs(fx)<30?'rgba(130,120,105,.4)':'rgba(255,255,255,'+(.04+r1*.08)+')';x.lineWidth=1.2;x.beginPath();x.moveTo(fx,fy);x.lineTo(fx+3+Math.sin(t*1.6+i)*1.2,fy+7);x.stroke()}
 for(let i=0;i<(small?0:70);i++){const yy=-190+i*2,jx=(i%2?7:-5),sd=i%2?1:-1;x.strokeStyle='rgba(255,252,240,.7)';x.lineWidth=1.3;x.beginPath();x.moveTo(-32+jx,yy);x.lineTo(-32+jx-4-Math.sin(t*2+i)*1.5,yy+2);x.moveTo(32+jx,yy);x.lineTo(36+jx+Math.sin(t*2+i)*1.5,yy+2);x.stroke()}
 x.strokeStyle='rgba(255,232,180,.6)';x.lineWidth=4;x.beginPath();x.ellipse(0,-120,121,58,0,3.6,5.8);x.stroke();
 g=x.createRadialGradient(-60,-170,5,0,-120,150);g.addColorStop(0,'rgba(255,240,200,.18)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(-140,-190,280,140);
 x.restore();
 const hy=-150+d*88;
 x.fillStyle='#151311';x.beginPath();x.moveTo(90,-175);x.lineTo(150,hy-26);x.lineTo(166,hy+26);x.lineTo(105,-92);x.fill();
 x.save();x.translate(160,hy);x.rotate(.45);x.beginPath();x.ellipse(0,0,36,27,0,0,7);x.fill();x.restore();
 x.fillStyle='#4a3a33';x.beginPath();x.ellipse(190,hy+14,19,15,.5,0,7);x.fill();
 x.fillStyle='#000';x.beginPath();x.arc(196,hy+14,3,0,7);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(170,hy-8,4,0,7);x.fill();x.fillStyle='#000';x.beginPath();x.arc(171,hy-8,2,0,7);x.fill();
 x.fillStyle='#151311';x.save();x.translate(138,hy-22);x.rotate(-.5+Math.sin(t*5+ph)*.06);x.beginPath();x.ellipse(0,0,22,9,0,0,7);x.fill();x.restore();
 x.restore();
}
function oreoFace(cx,cy,rx,ry){x.fillStyle='#1b1311';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.fill();
 x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=1.5;x.beginPath();x.ellipse(cx,cy,rx*.8,ry*.8,0,0,7);x.stroke();
 x.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<14;i++){const a=i/14*6.28;x.beginPath();x.arc(cx+Math.cos(a)*rx*.6,cy+Math.sin(a)*ry*.6,rx*.04,0,7);x.fill()}}
function foreground(){
 let y0=tableY,g=x.createLinearGradient(0,y0,0,H);g.addColorStop(0,'#d4a574');g.addColorStop(1,'#a97c4f');x.fillStyle=g;x.fillRect(0,y0,W,H-y0);
 x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,y0,W,3);
 const oy=y0+(H-y0)*.5;
 // bottle
 x.save();x.translate(W*.34,oy+10*u);x.rotate(-.03);x.scale(u*1.1,u*1.1);
 x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(0,50,190,12,0,0,7);x.fill();
 x.fillStyle='#232326';x.fillRect(-206,-26,32,52);x.fillStyle='#3a3a3e';for(let i=0;i<5;i++)x.fillRect(-202+i*6,-26,2,52);
 x.fillStyle='#0d0d0f';x.beginPath();x.roundRect(-176,-46,320,92,[20,34,34,20]);x.fill();
 x.save();x.clip();x.fillStyle='#f3efe5';x.beginPath();for(let i=0;i<=10;i++)x.lineTo(-52+(i%2?6:-4),-46+i*9.2);for(let i=10;i>=0;i--)x.lineTo(54+(i%2?-5:5),-46+i*9.2);x.fill();
 x.fillStyle='rgba(255,255,255,.1)';x.fillRect(-176,-40,320,10);x.restore();
 x.fillStyle='#111';x.textAlign='center';x.font="9px 'DM Mono',monospace";x.fillText('· MILK FROM ·',0,-8);x.font="22px 'Bowlby One',Impact,sans-serif";x.fillText('OREO',0,12);x.fillText('COWS',0,32);
 x.restore();
 for(const [cx,cy]of[[W*.12,oy+30*u],[W*.5,oy+60*u]]){oreoFace(cx,cy,34*u,13*u)}
 for(let i=0;i<3;i++){x.fillStyle='#fff';x.beginPath();x.ellipse(W*.7,oy+60*u-i*14*u,36*u,12*u,0,0,7);x.fill();oreoFace(W*.7,oy+54*u-i*14*u,36*u,12*u)}
 // glass
 const G=gl(),gw=50*u,hh=G.base-G.top;
 x.save();x.beginPath();x.moveTo(G.x-gw-8*u,G.top);x.lineTo(G.x+gw+8*u,G.top);x.lineTo(G.x+gw,G.base);x.lineTo(G.x-gw,G.base);x.closePath();x.clip();
 x.fillStyle='rgba(255,255,255,.12)';x.fillRect(G.x-gw-10,G.top,gw*2+20,hh);
 const ly=G.base-hh*level;x.fillStyle='#fbf9f2';x.beginPath();x.moveTo(G.x-gw-10,G.base);x.lineTo(G.x-gw-10,ly);
 for(let i=-gw;i<=gw;i+=6)x.lineTo(G.x+i,ly+Math.sin(t*5+i*.2)*(hold?2.5:.6)*u);x.lineTo(G.x+gw+10,ly);x.lineTo(G.x+gw+10,G.base);x.fill();
 x.restore();
 x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;x.beginPath();x.moveTo(G.x-gw-8*u,G.top);x.lineTo(G.x-gw,G.base);x.lineTo(G.x+gw,G.base);x.lineTo(G.x+gw+8*u,G.top);x.stroke();
}

/* ---------- particles ---------- */
function milking(dt){
 const C=cowPos(),G=gl(),T=.8,gr=1500;
 for(let i=0;i<2;i++){const sx=C.x+16*s+Math.random()*8,sy=C.y-62*s;const tx=G.x+(Math.random()-.5)*50*u,ty=G.top;
  drops.push({x:sx,y:sy,vx:(tx-sx)/T,vy:(ty-sy-.5*gr*T*T)/T,l:T})}
 level=Math.min(1,level+dt*.18);
 if(level>=1){hold=false;setTimeout(()=>{mode='twist';tw=0;hint.textContent='Now twist the cookie — drag left/right or tilt your phone';hint.style.opacity=1},500)}
}
function stepDrops(dt){drops=drops.filter(p=>(p.l-=dt)>0);for(const p of drops){p.vy+=1500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;x.fillStyle='#fbf9f2';x.beginPath();x.arc(p.x,p.y,3.2*u+1,0,7);x.fill()}}
function burst(cx,cy){
 for(let i=0;i<260;i++){const a=Math.random()*6.28,v=150+Math.random()*700;crumbs.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-200,r:1+Math.random()*4,l:1.5+Math.random()*1.5,c:Math.random()<.2?'#f4efe2':'#2a1a14'})}
 gal=[];for(let i=0;i<2600;i++){const arm=i%3,r=Math.pow(Math.random(),.7)*Math.min(W,H)*.42,a=arm*2.094+r*.014+(Math.random()-.5)*.5/(1+r*.01);
  const k=Math.random();gal.push({r,a,sp:.35/(1+r*.012),sz:.6+Math.random()*1.8,col:k<.55?'255,246,225':k<.8?'80,130,255':'150,100,70'})}
 galT=0;
}
function stepCrumbs(dt){crumbs=crumbs.filter(p=>(p.l-=dt)>0);for(const p of crumbs){p.vy+=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;x.globalAlpha=Math.min(1,p.l);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}x.globalAlpha=1}

/* ---------- twist + galaxy ---------- */
function twistScene(){
 x.fillStyle='rgba(6,6,10,'+(mode==='galaxy'?.9:.78)+')';x.fillRect(0,0,W,H);
 const cx=W/2,cy=H/2,w=Math.min(W*.8,340*u*1.3),h=w*.2,sp=split;
 const wafer=(yy,off,rot,al)=>{x.save();x.globalAlpha=al;x.translate(cx+off,yy);x.rotate(rot);x.fillStyle='#1c1210';x.beginPath();x.roundRect(-w/2,-h/2,w,h,h*.35);x.fill();
  x.fillStyle='rgba(255,255,255,.12)';for(let i=-w/2+h*.5;i<w/2-h*.4;i+=h*.45){x.fillRect(i,-h*.3,2,h*.6)}x.restore()};
 const al=clamp(1-(sp-.5)*2,0,1)||(sp<.5?1:0);
 if(sp<1){x.globalAlpha=al;x.fillStyle='#f7f2e6';x.beginPath();x.roundRect(cx-w*.46,cy-h*.3,w*.92,h*.6,10);x.fill();x.fillStyle='rgba(0,0,0,.08)';for(let i=-w*.44;i<w*.44;i+=7)x.fillRect(cx+i,cy-h*.3,2,h*.6);x.globalAlpha=1}
 wafer(cy+h*.9+sp*260*u,0,sp*.3,al);
 wafer(cy-h*.9-sp*300*u,tw*w*.45,sp*-.6,al);
 if(mode==='twist'){x.fillStyle='rgba(255,255,255,.2)';x.fillRect(cx-100,cy+h*2.4,200,4);x.fillStyle='#fff';x.fillRect(cx,cy+h*2.4,tw*100,4)}
}
function galaxy(dt){
 galT+=dt;const cx=W/2,cy=H/2,e=clamp(galT/2.2,0,1),ee=1-Math.pow(1-e,3);
 x.globalCompositeOperation='lighter';
 const g=x.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*.3*ee);g.addColorStop(0,'rgba(255,245,220,.55)');g.addColorStop(1,'rgba(255,245,220,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(const p of gal){p.a+=p.sp*dt;const r=p.r*ee,X=cx+Math.cos(p.a)*r+px*p.r*.02,Y=cy+Math.sin(p.a)*r*.5;x.fillStyle='rgba('+p.col+','+(.35+.4*Math.sin(p.a*3+t))+')';x.fillRect(X,Y,p.sz,p.sz)}
 x.globalCompositeOperation='source-over';
 x.textAlign='center';x.globalAlpha=clamp((galT-1.2)/1.2,0,1);x.fillStyle='#fff';x.font="clamp(30px,8vw,84px) 'Bowlby One',Impact,sans-serif";x.font=Math.round(Math.min(W*.09,86))+"px 'Bowlby One',Impact,sans-serif";
 x.fillText('OREO COW MILK',cx,cy+Math.min(W*.03,12)*0+10);x.font="13px 'DM Mono',monospace";x.fillText('MOO-NLIGHT · DUNK THE GALAXY',cx,cy+44);x.globalAlpha=1;
}

/* ---------- loop ---------- */
let last=performance.now();
function frame(n){const dt=Math.min(.05,(n-last)/1000);last=n;t+=dt;
 x.clearRect(0,0,W,H);bgScene();foreground();const C=cowPos();cow(C.x+px*-6,C.y,s,0,false);
 if(hold&&mode==='pasture')milking(dt);
 lt.textContent=level.toFixed(2)+' L';stepDrops(dt);
 if(mode!=='pasture'){
  if(mode==='twist'){const k=Math.floor(Math.abs(tw)*6);if(k!==lastTick){if(k>lastTick)noise(.03,1800+k*400,4,.35);lastTick=k}}
  if(!drag&&mode==='twist'&&!gyroOn)tw*=.96;
  if(mode==='twist'&&Math.abs(tw)>=1){mode='galaxy';burst(W/2,H/2);snap();crunch();hint.style.opacity=0;document.getElementById('again').style.display='inline-block';if(navigator.vibrate)navigator.vibrate([30,20,60])}
  if(mode==='galaxy')split+=(1-split)*Math.min(1,dt*3);
  twistScene();if(mode==='galaxy')galaxy(dt);
 }
 stepCrumbs(dt);requestAnimationFrame(frame)}
requestAnimationFrame(frame);

/* ---------- input ---------- */
function hitCow(mx,my){const C=cowPos();return Math.abs(mx-C.x)<150*s&&my>C.y-210*s&&my<C.y+10}
c.addEventListener('pointerdown',e=>{c.setPointerCapture(e.pointerId);
 if(mode==='pasture'&&hitCow(e.clientX,e.clientY)){hold=true;hint.style.opacity=.0;moo()}
 else if(mode==='pasture'){hint.style.opacity=1;hint.textContent='Tap and hold the cow, not the grass'}
 if(mode==='twist'){drag=true;lastX=e.clientX}});
c.addEventListener('pointermove',e=>{px=(e.clientX/W-.5)*2;py=(e.clientY/H-.5)*2;
 if(drag&&mode==='twist'){tw=clamp(tw+(e.clientX-lastX)/170,-1.05,1.05);lastX=e.clientX}});
addEventListener('pointerup',()=>{hold=false;drag=false;if(mode==='pasture'&&level<1)hint.style.opacity=1});
addEventListener('keydown',e=>{if(mode==='twist'&&/Arrow/.test(e.key))tw=clamp(tw+(e.key==='ArrowRight'?.15:-.15),-1.05,1.05)});
const gy=document.getElementById('gy');
function onTilt(e){if(e.gamma==null)return;px=clamp(e.gamma/30,-1,1);if(mode==='twist'){gyroOn=true;tw=clamp(e.gamma/35,-1.05,1.05)}}
gy.onclick=async()=>{try{if(DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')return;addEventListener('deviceorientation',onTilt);gy.style.display='none'}catch(err){gy.textContent='Gyro unavailable'}};
document.getElementById('again').onclick=function(){mode='pasture';level=0;tw=0;split=0;crumbs=[];gal=[];this.style.display='none';hint.textContent='Hold the cow to milk her';hint.style.opacity=1};