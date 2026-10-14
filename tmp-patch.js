/* Parche: sección "El tiempo en el cole" (entrada, recreo, salida) y quitar recreo/lluvia de la franja */
window.parchearTiempo = function (ix) {
  function rep(s, a, b) { if (s.split(a).length !== 2) throw 'NO ÚNICO: ' + a.slice(0, 60); return s.replace(a, b); }
  if (ix.indexOf('id="tiempo-cole"') >= 0) throw 'YA APLICADO';
  // 1) Quitar de la franja el recreo y el protocolo de lluvia
  var a = ix.indexOf('      if(tiempo){var w=tiempo,T=w.hourly.time');
  var finTxt = "'sc-lluvia'));}\n";
  var b = ix.indexOf(finTxt, a);
  if (a < 0 || b < 0) throw 'bloque tiempo no encontrado';
  ix = ix.slice(0, a) + ix.slice(b + finTxt.length);
  // 2) Pedir también la temperatura
  ix = rep(ix, 'hourly=precipitation_probability,precipitation,weather_code,apparent_temperature', 'hourly=precipitation_probability,precipitation,weather_code,apparent_temperature,temperature_2m');
  // 3) Pintar la nueva sección después de la franja
  ix = rep(ix, "document.getElementById('scFilas').innerHTML=out.join('');", "document.getElementById('scFilas').innerHTML=out.join('');try{pintarTiempo(obj,D,L)}catch(e){}");
  var fn = [
"    var TT={es:{t:'El tiempo en el cole',n:'Previsión del tiempo: puede cambiar.',e:'Entrada',r:'Recreo',s:'Salida',ll:'Lluvia probable',pu:'Puede llover',se:'Sin lluvia',rn:'Posiblemente no haya recreo en el patio por la lluvia.',rq:'Recreo en el patio si no llueve.',rc:'Hará calor: agua y gorra.',rf:'Hará frío: que vengan bien abrigados.',ro:'¡Recreo en el patio!'},",
"      en:{t:'Weather at school',n:'Weather forecast: it may change.',e:'Drop-off',r:'Break',s:'Pick-up',ll:'Rain likely',pu:'Chance of rain',se:'No rain',rn:'Break will probably not be in the playground because of rain.',rq:'Break in the playground if it doesn’t rain.',rc:'It will be hot: water and a cap.',rf:'It will be cold: dress warmly.',ro:'Break in the playground!'},",
"      ar:{t:'الطقس في المدرسة',n:'توقعات الطقس: قد تتغير.',e:'الدخول',r:'الاستراحة',s:'الخروج',ll:'مطر محتمل',pu:'قد تمطر',se:'بدون مطر',rn:'على الأرجح لن تكون الاستراحة في الساحة بسبب المطر.',rq:'الاستراحة في الساحة إن لم تمطر.',rc:'سيكون الجو حارًا: ماء وقبعة.',rf:'سيكون الجو باردًا: ملابس دافئة.',ro:'الاستراحة في الساحة!'},",
"      ro:{t:'Vremea la școală',n:'Prognoza meteo: se poate schimba.',e:'Intrarea',r:'Pauza',s:'Ieșirea',ll:'Ploaie probabilă',pu:'Poate ploua',se:'Fără ploaie',rn:'Probabil pauza nu va fi în curte din cauza ploii.',rq:'Pauza în curte dacă nu plouă.',rc:'Va fi cald: apă și șapcă.',rf:'Va fi frig: îmbrăcați-vă gros.',ro:'Pauza în curte!'}};",
"    function tcGate(open,dir){var bars=open?'<path d=\"M12 18 L22 22 L22 50 L12 52 Z\" fill=\"none\" stroke=\"#475569\" stroke-width=\"2.5\"/><path d=\"M15 20 V51 M18 21 V51\" stroke=\"#475569\" stroke-width=\"2\"/><path d=\"M52 18 L42 22 L42 50 L52 52 Z\" fill=\"none\" stroke=\"#475569\" stroke-width=\"2.5\"/><path d=\"M49 20 V51 M46 21 V51\" stroke=\"#475569\" stroke-width=\"2\"/><g fill=\"#38bdf8\"><path d=\"M30 6 q-2 4 0 5 q2-1 0-5Z\"/><path d=\"M38 10 q-2 4 0 5 q2-1 0-5Z\"/><path d=\"M26 13 q-2 4 0 5 q2-1 0-5Z\"/></g>'",
"      :'<rect x=\"12\" y=\"18\" width=\"40\" height=\"34\" fill=\"none\" stroke=\"#475569\" stroke-width=\"2.5\"/><path d=\"M18 18 V52 M24 18 V52 M30 18 V52 M34 18 V52 M40 18 V52 M46 18 V52\" stroke=\"#475569\" stroke-width=\"2\"/><path d=\"M12 26 H52 M12 44 H52\" stroke=\"#475569\" stroke-width=\"2\"/><circle cx=\"32\" cy=\"35\" r=\"2.5\" fill=\"#f59e0b\"/>';",
"      var ar=dir==='in'?'<circle cx=\"52\" cy=\"54\" r=\"9\" fill=\"#16a34a\"/><path d=\"M47 54 H57 M53 50 L57 54 L53 58\" stroke=\"#fff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>':'<circle cx=\"52\" cy=\"54\" r=\"9\" fill=\"#ea580c\"/><path d=\"M57 54 H47 M51 50 L47 54 L51 58\" stroke=\"#fff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>';",
"      return '<svg class=\"tc-svg\" viewBox=\"0 0 64 64\" width=\"60\" height=\"60\" aria-hidden=\"true\"><rect x=\"5\" y=\"12\" width=\"7\" height=\"46\" rx=\"2\" fill=\"#94a3b8\"/><rect x=\"52\" y=\"12\" width=\"7\" height=\"46\" rx=\"2\" fill=\"#94a3b8\"/><path d=\"M4 12 h9 l-4.5 -5Z M51 12 h9 l-4.5 -5Z\" fill=\"#64748b\"/>'+bars+ar+'</svg>'}",
"    function tcPatio(wet){return '<svg class=\"tc-svg\" viewBox=\"0 0 64 64\" width=\"60\" height=\"60\" aria-hidden=\"true\"><rect x=\"4\" y=\"50\" width=\"56\" height=\"6\" rx=\"3\" fill=\"#86efac\"/><rect x=\"41\" y=\"30\" width=\"4\" height=\"21\" fill=\"#92400e\"/><circle cx=\"43\" cy=\"24\" r=\"12\" fill=\"#22c55e\"/><circle cx=\"18\" cy=\"43\" r=\"7\" fill=\"#f97316\"/><path d=\"M11 43 h14 M18 36 v14\" stroke=\"#fff\" stroke-width=\"1.5\"/>'+(wet?'<g fill=\"#38bdf8\"><path d=\"M14 8 q-2 4 0 5 q2-1 0-5Z\"/><path d=\"M24 14 q-2 4 0 5 q2-1 0-5Z\"/><path d=\"M32 6 q-2 4 0 5 q2-1 0-5Z\"/></g>':'<circle cx=\"16\" cy=\"14\" r=\"6\" fill=\"#facc15\"/>')+'</svg>'}",
"    function tcIco(c){return c<=1?'☀️':c<=3?'⛅':c<=48?'🌫️':c<=67?'🌧️':c<=77?'❄️':c<=82?'🌦️':'⛈️'}",
"    function pintarTiempo(obj,D,L){var sec=document.getElementById('tiempo-cole'),box=document.getElementById('tcBox');if(!sec||!box||!tiempo)return;",
"      var X=TT[capiLang()]||TT.es,w=tiempo,T=w.hourly.time,H=w.hourly;",
"      function at(hh){var i=T.indexOf(obj+'T'+pad(hh)+':00');if(i<0)return null;return {pr:H.precipitation_probability[i]||0,mm:H.precipitation[i]||0,wc:H.weather_code[i],t:Math.round(H.temperature_2m?H.temperature_2m[i]:H.apparent_temperature[i]),ta:H.apparent_temperature[i]}}",
"      function peor(hs){var r=null;hs.forEach(function(h){var a=at(h);if(a&&(!r||a.pr>r.pr||a.mm>r.mm))r=a});return r}",
"      function est(x){return (x.pr>=50||x.mm>=0.3)?2:x.pr>=30?1:0}",
"      var e=peor([8,9]),r=at(12),s=peor([13,14]),e9=at(9),s14=at(14);",
"      if(!e||!r||!s){sec.hidden=true;return}",
"      var eE=est(e),eR=est(r),eS=est(s);",
"      function llu(st,x){return st===2?'🌧️ '+X.ll+' ('+x.pr+'%)':st===1?'🌦️ '+X.pu+' ('+x.pr+'%)':X.se}",
"      function card(wet,svg,lbl,hora,dat,txt){return '<div class=\"tc-c'+(wet?' wet':'')+'\">'+svg+'<div class=\"tc-tx\"><div class=\"tc-l\">'+lbl+' · '+hora+'</div><div class=\"tc-v\">'+(wet?'🌧️':tcIco(dat.wc))+' '+dat.t+'°</div><div class=\"tc-s\">'+txt+'</div></div></div>'}",
"      var rt=eR===2?'🌧️ '+X.rn:eR===1?'🌦️ '+X.rq+' ('+r.pr+'%)':(r.ta>=32?X.rc:r.ta<=6?X.rf:X.ro);",
"      var html='<div class=\"tc-grid\">'+card(eE===2,tcGate(eE===2,'in'),X.e,'9:00',e9||e,llu(eE,e))+card(eR===2,tcPatio(eR===2),X.r,'12:00 – 12:30',r,rt)+card(eS===2,tcGate(eS===2,'out'),X.s,'14:00',s14||s,llu(eS,s))+'</div>';",
"      if(eE===2||eS===2) html+='<div class=\"tc-aviso\">🌧️ '+L.llu(D,eE===2&&eS===2?L.amb:eE===2?L.ent:L.sal)+'</div>';",
"      document.getElementById('tcTit').textContent=X.t+' · '+D;document.getElementById('tcNota').textContent=X.n;box.innerHTML=html;sec.hidden=false;}",
""].join('\n');
  ix = rep(ix, '    window.capiPintarSemana=pintar;', fn + '    window.capiPintarSemana=pintar;');
  // 4) Sección HTML, justo después de "Esta semana en el cole"
  var s = ix.indexOf('id="esta-semana"'), c = ix.indexOf('</section>', s);
  if (s < 0 || c < 0) throw 'seccion';
  var html = '\n\n  <!-- El tiempo en el cole (14-oct-2026) -->\n' +
    '  <section class="contenido tiempo-cole" id="tiempo-cole" aria-label="Previsión del tiempo en el cole" hidden>\n' +
    '    <style>\n' +
    '      .tiempo-cole{padding-top:0}\n' +
    '      .tiempo-cole .tc-card{max-width:1100px;margin:0 auto;background:#fff;border-radius:18px;border-left:6px solid #0ea5e9;box-shadow:0 4px 16px rgba(0,74,173,.10);padding:1.1rem 1.3rem}\n' +
    '      .tc-card h2{margin:0;font-size:1.25rem}\n' +
    '      .tc-nota{margin:.15rem 0 .8rem;font-size:.82rem;color:#5b6b80}\n' +
    '      .tc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}\n' +
    '      .tc-c{display:flex;gap:.6rem;align-items:center;border:2px solid #e2e8f0;border-radius:14px;padding:.6rem .7rem;background:#fff}\n' +
    '      .tc-c.wet{border-color:#38bdf8;background:#f0f9ff}\n' +
    '      .tc-svg{flex:0 0 60px}\n' +
    '      .tc-l{font-weight:800;font-size:.78rem;color:#5b6b80;text-transform:uppercase;letter-spacing:.03em}\n' +
    '      .tc-v{font-weight:900;font-size:1.35rem;color:#1b2440;line-height:1.2}\n' +
    '      .tc-s{font-weight:700;font-size:.86rem;color:#233;line-height:1.35}\n' +
    '      .tc-c.wet .tc-s{color:#075985}\n' +
    '      .tc-aviso{margin-top:.8rem;background:#e0f2fe;border-radius:12px;padding:.65rem .85rem;font-size:.95rem;line-height:1.45;color:#233}\n' +
    '      @media(max-width:760px){.tc-grid{grid-template-columns:1fr}}\n' +
    '    </style>\n' +
    '    <div class="tc-card">\n' +
    '      <h2><i class="fa-solid fa-cloud-sun-rain"></i> <span id="tcTit">El tiempo en el cole</span></h2>\n' +
    '      <p class="tc-nota" id="tcNota">Previsión del tiempo: puede cambiar.</p>\n' +
    '      <div id="tcBox"></div>\n' +
    '    </div>\n' +
    '  </section>';
  ix = ix.slice(0, c + 10) + html + ix.slice(c + 10);
  return ix;
};
