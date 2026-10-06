const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
setTimeout(()=>document.getElementById('loader').classList.add('done'),1300);

// Name letters
const nm=document.getElementById('name');let d=1.3;
nm.innerHTML=nm.textContent.split(' ').map(w=>'<span class="w">'+[...w].map(c=>`<span class="l" style="animation-delay:${(d+=.04).toFixed(2)}s">${c}</span>`).join('')+'</span>').join(' ');

// Typing code window
const src=`<span class="c">// Role-based access for admin panel</span>
<span class="k">class</span> <span class="f">OrderController</span> <span class="k">extends</span> Controller
{
    <span class="k">public function</span> <span class="f">index</span>(Request $request)
    {
        $orders = Order::<span class="f">with</span>(<span class="s">'customer'</span>)
            -&gt;<span class="f">latest</span>()
            -&gt;<span class="f">paginate</span>(<span class="s">20</span>);

        <span class="k">return</span> <span class="f">view</span>(<span class="s">'admin.orders'</span>, [
            <span class="s">'orders'</span> =&gt; $orders,
        ]);
    }
}`;
const pre=document.getElementById('code');
(function run(){
  let i=0;pre.innerHTML='';
  const tick=()=>{
    if(src[i]==='<'){i=src.indexOf('>',i)+1}else if(src[i]==='&'){i=src.indexOf(';',i)+1}else i++;
    pre.innerHTML=src.slice(0,i);
    if(i<src.length)setTimeout(tick,rm?0:28);else setTimeout(run,5000);
  };tick();
})();

// Menu
const nav=document.getElementById('nav');
document.getElementById('burger').onclick=()=>nav.classList.toggle('open');
nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));

// Cursor glow
const glow=document.getElementById('glow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Scroll: progress, timeline, active link
const bar=document.getElementById('progress'),fill=document.getElementById('lineFill'),tl=document.getElementById('timeline');
const links=[...nav.querySelectorAll('a:not(.nav-cta)')],secs=links.map(a=>document.querySelector(a.hash));
function sc(){
  bar.style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%';
  const r=tl.getBoundingClientRect();
  fill.style.height=Math.max(0,Math.min(100,(innerHeight*.6-r.top)/r.height*100))+'%';
  let c=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.4)c=i});
  links.forEach((a,i)=>a.classList.toggle('on',i===c));
}
addEventListener('scroll',sc,{passive:true});sc();

// Reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');io.unobserve(e.target);
  e.target.querySelectorAll('[data-n]').forEach(el=>{
    const n=+el.dataset.n,s=el.dataset.s;let t0;
    requestAnimationFrame(function f(ts){t0=t0||ts;const p=Math.min((ts-t0)/1500,1);el.textContent=Math.round(n*(1-(1-p)**3))+s;if(p<1)requestAnimationFrame(f)});
  });
}),{threshold:.15});
document.querySelectorAll('.reveal,.title').forEach((el,i)=>{if(!el.classList.contains('title'))el.style.transitionDelay=(i%3)*100+'ms';io.observe(el)});

// Card spotlight
document.querySelectorAll('.spot').forEach(c=>c.addEventListener('pointermove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px');
}));

// Magnetic buttons
document.querySelectorAll('.mag').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='');
});

// Hero parallax tilt
const hs=document.querySelector('.hero-side');
addEventListener('pointermove',e=>{if(innerWidth<900||rm)return;
  hs.style.transform=`perspective(900px) rotateY(${(e.clientX/innerWidth-.5)*8}deg) rotateX(${(.5-e.clientY/innerHeight)*6}deg)`});

// Network particle background
if(!rm){
  const cv=document.getElementById('net'),x=cv.getContext('2d');let W,H,P=[];
  const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.min(60,W/22|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};
  rs();addEventListener('resize',rs);
  (function draw(){
    x.clearRect(0,0,W,H);
    P.forEach((p,i)=>{p.x=(p.x+p.vx+W)%W;p.y=(p.y+p.vy+H)%H;
      x.fillStyle='rgba(91,140,255,.7)';x.fillRect(p.x,p.y,2,2);
      for(let j=i+1;j<P.length;j++){const q=P[j],dd=Math.hypot(p.x-q.x,p.y-q.y);
        if(dd<130){x.strokeStyle=`rgba(91,140,255,${.18*(1-dd/130)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}});
    requestAnimationFrame(draw);
  })();
}
