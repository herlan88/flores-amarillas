/* No necesitas editar este archivo para cambiar textos:
   eso se hace en config.js */

function fill(str){
  return str.replaceAll("{nombre}", CONFIG.nombre).replaceAll("{remitente}", CONFIG.remitente);
}

document.getElementById('tag1').textContent = CONFIG.tagLinea1;
document.getElementById('greeting').textContent = fill(CONFIG.saludo);
document.getElementById('subgreeting').textContent = CONFIG.subSaludo;
document.getElementById('line2a').textContent = CONFIG.lineaAntes;
document.getElementById('line2b').textContent = CONFIG.lineaDespues;
document.getElementById('line3').textContent = fill(CONFIG.linea3);
document.getElementById('tag2').textContent = CONFIG.tagLinea2;
document.getElementById('noteTo').textContent = fill(CONFIG.notaPara);
document.getElementById('noteBody1').textContent = CONFIG.notaCuerpo;
document.getElementById('quoteLead').textContent = CONFIG.citaLead;
document.getElementById('quoteLine').textContent = CONFIG.citaTexto;
document.getElementById('closing').textContent = CONFIG.cierreTitulo;
document.getElementById('closingSub').textContent = CONFIG.cierreSub;
document.getElementById('signoffLead').textContent = CONFIG.firmaLead;
document.getElementById('signoffName').textContent = CONFIG.remitente;
document.title = "Para " + CONFIG.nombre;

/* ---------------------------------------------------------
   Dibujo de flores y tallos en SVG (sin imágenes externas)
--------------------------------------------------------- */
function petalPath(cx,cy,r){
  return `M ${cx} ${cy} C ${cx-r*0.55} ${cy-r*0.2}, ${cx-r*0.55} ${cy-r*1.1}, ${cx} ${cy-r*1.3} C ${cx+r*0.55} ${cy-r*1.1}, ${cx+r*0.55} ${cy-r*0.2}, ${cx} ${cy} Z`;
}
function flowerMarkup(cx,cy,r,extraClass){
  let g = `<g class="${extraClass||''}" transform-box="fill-box" transform-origin="center">`;
  for(let i=0;i<6;i++){
    g += `<g transform="rotate(${i*60} ${cx} ${cy})"><path d="${petalPath(cx,cy,r)}" fill="var(--petal)"/></g>`;
  }
  g += `<circle cx="${cx}" cy="${cy}" r="${r*0.32}" fill="var(--petal-deep)"/></g>`;
  return g;
}

// ícono simple (saludo + cierre) — sin animación, decorativo
document.getElementById('flowerSvg1').innerHTML = flowerMarkup(50,52,34);
document.getElementById('flowerSvg2').innerHTML = flowerMarkup(50,50,40);

// datos del ramo: posiciones de cada flor
const FLOWERS = [
  {x:70,  y:120, r:28},
  {x:120, y:95,  r:30},
  {x:165, y:130, r:24},
  {x:100, y:135, r:20},
  {x:150, y:165, r:22},
];
const BASE_Y_GROW = 210;
const BASE_Y_GIFT = 196; /* dónde "aterrizan" los tallos sobre el sobre nuevo */

function stemPath(x, r, baseY){
  const y1 = FLOWERS.find(f=>f.x===x).y + FLOWERS.find(f=>f.x===x).r*0.6;
  return `M ${x} ${y1} Q ${(x+120)/2+10} ${(y1+baseY)/2} 120 ${baseY}`;
}

/* --- sección 1: el ramo CRECE (tallos se dibujan + flores brotan) --- */
const growSvg = document.getElementById('growSvg');
growSvg.innerHTML =
  FLOWERS.map(f => `<path class="stem" d="${stemPath(f.x,f.r,BASE_Y_GROW)}"></path>`).join('') +
  FLOWERS.map(f => flowerMarkup(f.x,f.y,f.r,'bloom')).join('');

// preparar cada tallo con su longitud real para poder animarlo
const growStems = Array.from(growSvg.querySelectorAll('.stem'));
growStems.forEach((path,i)=>{
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.style.transitionDelay = (i*0.12)+'s';
});
const growBlooms = Array.from(growSvg.querySelectorAll('.bloom'));
growBlooms.forEach((g,i)=>{
  g.style.transitionDelay = (0.5 + i*0.18)+'s';
});

function playGrow(){
  growStems.forEach(p => p.style.strokeDashoffset = 0);
  growBlooms.forEach(g => g.classList.add('shown'));
  document.getElementById('line2a').classList.add('faded');
  document.querySelector('section[data-idx="1"] .reveal-after').classList.add('shown');
}
function resetGrow(){
  growStems.forEach(p => p.style.strokeDashoffset = p.getTotalLength());
  growBlooms.forEach(g => g.classList.remove('shown'));
  document.getElementById('line2a').classList.remove('faded');
  document.querySelector('section[data-idx="1"] .reveal-after').classList.remove('shown');
}

/* --- sección 2: el ramo ya armado SE ASIENTA sobre el sobre --- */
const giftSvg = document.getElementById('giftSvg');
giftSvg.innerHTML =
  `<g class="envelope">
     <!-- sombra en el suelo, da sensación de que el sobre está apoyado -->
     <ellipse cx="120" cy="272" rx="62" ry="8" fill="#000000" opacity=".08"/>

     <!-- cuerpo del sobre -->
     <path d="M 52 168 L 188 168 L 188 262 L 52 262 Z"
           fill="var(--cream-2)" stroke="var(--petal-deep)" stroke-width="1.2"/>

     <!-- solapas laterales (dan volumen / profundidad) -->
     <path d="M 52 168 L 120 208 L 52 262 Z" fill="#00000008"/>
     <path d="M 188 168 L 120 208 L 188 262 Z" fill="#00000008"/>

     <!-- borde inferior de la carta asomando dentro del sobre -->
     <path d="M 62 190 L 178 190 L 178 250 L 62 250 Z" fill="var(--cream)" stroke="#00000012" stroke-width="1"/>
     <line x1="78" y1="205" x2="162" y2="205" stroke="#00000014" stroke-width="1.5"/>
     <line x1="78" y1="216" x2="150" y2="216" stroke="#00000014" stroke-width="1.5"/>
     <line x1="78" y1="227" x2="156" y2="227" stroke="#00000014" stroke-width="1.5"/>

     <!-- solapa frontal doblada hacia abajo -->
     <path d="M 52 168 L 188 168 L 120 218 Z"
           fill="var(--petal)" stroke="var(--petal-deep)" stroke-width="1.2" stroke-linejoin="round"/>
     <!-- línea de pliegue de la solapa -->
     <path d="M 52 168 L 120 218 L 188 168" fill="none" stroke="var(--petal-deep)" stroke-width="1" opacity=".4"/>

     <!-- sello de cera sobre la punta de la solapa -->
     <circle cx="120" cy="208" r="12" fill="var(--petal-deep)"/>
     <circle cx="120" cy="208" r="12" fill="none" stroke="#00000020" stroke-width="1"/>
     ${flowerMarkup(120,208,6)}
   </g>
   <g class="settle-group">` +
    FLOWERS.map(f => `<path class="stem" d="${stemPath(f.x,f.r,BASE_Y_GIFT)}" style="stroke-dashoffset:0"></path>`).join('') +
    FLOWERS.map(f => flowerMarkup(f.x,f.y,f.r,'bloom shown')).join('') +
  `</g>`;
const giftEnvelope = giftSvg.querySelector('.envelope');
const giftSettle = giftSvg.querySelector('.settle-group');

function playGift(){
  giftEnvelope.classList.add('shown');
  setTimeout(()=> giftSettle.classList.add('shown'), 200);
  setTimeout(()=>{
    document.getElementById('line3').classList.add('shown');
    document.querySelector('section[data-idx="2"] button.next').classList.add('shown');
  }, 500);
}
function resetGift(){
  giftEnvelope.classList.remove('shown');
  giftSettle.classList.remove('shown');
  document.getElementById('line3').classList.remove('shown');
  document.querySelector('section[data-idx="2"] button.next').classList.remove('shown');
}

/* ---------------------------------------------------------
   Pétalos cayendo (ambiente, decorativo)
--------------------------------------------------------- */
document.querySelectorAll('.petals').forEach(layer=>{
  const n = parseInt(layer.dataset.density || "8", 10);
  for(let i=0;i<n;i++){
    const s = document.createElement('i');
    s.textContent = "🌼";
    s.style.left = (Math.random()*100) + "%";
    s.style.fontSize = (10 + Math.random()*10) + "px";
    s.style.opacity = (0.25 + Math.random()*0.35).toFixed(2);
    s.style.animationDuration = (9 + Math.random()*8) + "s";
    s.style.animationDelay = (Math.random()*10) + "s";
    layer.appendChild(s);
  }
});

/* ---------------------------------------------------------
   Navegación por scroll-snap + puntitos de progreso
--------------------------------------------------------- */
const scroller = document.getElementById('scroller');
const sections = Array.from(document.querySelectorAll('section'));
const dotsWrap = document.getElementById('dots');
sections.forEach((_,i)=>{
  const d = document.createElement('span');
  if(i===0) d.classList.add('active');
  dotsWrap.appendChild(d);
});
const dots = Array.from(dotsWrap.children);

function goTo(i){
  sections[i].scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('[data-go]').forEach(btn=>{
  btn.addEventListener('click', ()=> goTo(parseInt(btn.dataset.go,10)));
});
document.getElementById('replayBtn').addEventListener('click', ()=> goTo(0));

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const idx = parseInt(entry.target.dataset.idx,10);
    if(entry.isIntersecting){
      dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
      if(idx===1) playGrow();
      if(idx===2) playGift();
    } else {
      if(idx===1) resetGrow();
      if(idx===2) resetGift();
    }
  });
}, {root:scroller, threshold:0.6});
sections.forEach(s=>observer.observe(s));
