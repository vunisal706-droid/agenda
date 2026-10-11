/* Calendario del CEIP Capitulaciones para todas las apps del centro.
   Lee calendario.json (en la app Agenda ED) y:
   - pinta un aviso «Próximo día sin cole» donde haya <div data-calendario-cole></div>
     (data-calendario-cole="lista" muestra los próximos 3);
   - ofrece window.CalendarioCole.sinCole('2026-10-12') → {nombre, emoji, tipo} o null.
   Guarda una copia para que funcione sin conexión. */
(function(){
  const URL_CAL = 'https://vunisal706-droid.github.io/agenda/calendario.json';
  const KEY = 'calendario-cole';
  const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DIA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const pad = n => String(n).padStart(2,'0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const mas = (ds,n) => { const d=new Date(ds+'T12:00'); d.setDate(d.getDate()+n); return iso(d); };
  const hoy = () => iso(new Date());
  let datos = null;
  try { datos = JSON.parse(localStorage.getItem(KEY)); } catch(e) {}

  // Curso al que pertenece una fecha (de septiembre a agosto)
  const cursos = () => !datos ? [] : Array.isArray(datos.cursos) ? datos.cursos : (datos.inicio ? [datos] : []);
  function cursoDe(ds){
    const y = +ds.slice(0,4), m = +ds.slice(5,7), ini = m >= 9 ? y : y - 1;
    return cursos().find(c => c.inicio && +c.inicio.slice(0,4) === ini) || null;
  }
  // Si aún no está el calendario de ese curso: fines de semana, verano, Navidad y festivos fijos
  const FIJOS = {'10-12':'Fiesta Nacional de España','11-01':'Todos los Santos','12-06':'Día de la Constitución','12-08':'Inmaculada Concepción',
    '01-01':'Año Nuevo','01-06':'Reyes','02-28':'Día de Andalucía','05-01':'Fiesta del Trabajo'};
  function estimado(ds){
    const md = ds.slice(5), m = +ds.slice(5,7), d = +ds.slice(8,10);
    if (FIJOS[md]) return {nombre:FIJOS[md], emoji:'🎉', tipo:'festivo', estimado:true};
    if (m===7 || m===8 || (m===6 && d>=23) || (m===9 && d<10)) return {nombre:'Vacaciones de verano', emoji:'☀️', tipo:'verano', estimado:true};
    if ((m===12 && d>=23) || (m===1 && d<=6)) return {nombre:'Vacaciones de Navidad', emoji:'🎄', tipo:'vacaciones', estimado:true};
    return null;
  }
  function sinCole(ds){
    const d = new Date(ds+'T12:00').getDay();
    const c = cursoDe(ds);
    if (!c){
      if (d===0 || d===6) return {nombre:'Fin de semana', emoji:'😎', tipo:'finde'};
      return estimado(ds);
    }
    {
      const dia = (c.dias||[]).find(x=>x.fecha===ds);
      if (dia) return {nombre:dia.nombre, emoji:dia.emoji||'🎉', tipo:'festivo'};
      const p = (c.periodos||[]).find(x=>ds>=x.desde && ds<=x.hasta);
      if (p) return {nombre:p.nombre, emoji:p.emoji||'🏖️', tipo:'vacaciones', hasta:p.hasta};
      if (d===0 || d===6) return {nombre:'Fin de semana', emoji:'😎', tipo:'finde'};
      if (c.inicio && ds < c.inicio || c.fin && ds > c.fin) return {nombre:'Vacaciones de verano', emoji:'☀️', tipo:'verano'};
      return null;
    }
  }
  // ¿Falta el calendario del curso que viene? (aviso desde el 1 de junio)
  function faltaSiguiente(){
    const h = hoy(), y = +h.slice(0,4), m = +h.slice(5,7);
    const sig = m >= 9 ? null : (m >= 6 ? y : null);   // de junio a agosto se mira el curso que empieza ese año
    const actual = cursoDe(h);
    if (!actual) return `${+h.slice(0,4) - (m>=9?0:1)}/${String((+h.slice(0,4) - (m>=9?0:1) + 1) % 100).padStart(2,'0')}`;
    if (sig && !cursos().some(c => +c.inicio.slice(0,4) === sig)) return `${sig}/${String((sig+1)%100).padStart(2,'0')}`;
    return null;
  }
  // Próximos días sin cole entre semana (agrupa vacaciones en un solo aviso)
  function proximos(n, desde){
    const out=[]; let ds = desde || hoy();
    for (let k=0; k<400 && out.length<n; k++, ds=mas(ds,1)){
      const s = sinCole(ds); if (!s || s.tipo==='finde') continue;
      if (s.tipo==='vacaciones' || s.tipo==='verano'){
        let fin = ds; while (sinCole(mas(fin,1))) fin = mas(fin,1);
        out.push({...s, fecha:ds, hasta:fin, vuelta:mas(fin,1)}); ds = fin; continue;
      }
      out.push({...s, fecha:ds});
    }
    return out;
  }
  const largo = ds => { const d=new Date(ds+'T12:00'); return `${DIA[d.getDay()]} ${d.getDate()} de ${MES[d.getMonth()]}`; };
  const corto = ds => { const d=new Date(ds+'T12:00'); return `${d.getDate()} ${MES[d.getMonth()].slice(0,3)}`; };
  function cuando(ds){
    const k = Math.round((new Date(ds+'T12:00') - new Date(hoy()+'T12:00'))/864e5);
    return k<=0 ? 'hoy' : k===1 ? 'mañana' : `en ${k} días`;
  }
  const esc = t => String(t).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function texto(x){
    if (x.hasta && x.hasta!==x.fecha)
      return `<b>${esc(x.emoji)} ${esc(x.nombre)}</b>: del ${corto(x.fecha)} al ${corto(x.hasta)} · vuelta el ${largo(x.vuelta)}`;
    return `<b>${esc(x.emoji)} ${largo(x.fecha)}</b> · ${esc(x.nombre)}`;
  }
  function pintar(){
    document.querySelectorAll('[data-calendario-cole]').forEach(el=>{
      const lista = el.getAttribute('data-calendario-cole')==='lista';
      const hoyS = sinCole(hoy());
      const prox = proximos(lista?3:1);
      if (!prox.length && !hoyS && !(lista && faltaSiguiente())){ el.innerHTML=''; return; }
      const cab = hoyS && hoyS.tipo!=='finde'
        ? `<div style="font-weight:800">🏠 Hoy no hay cole · ${esc(hoyS.nombre)}</div>` : '';
      const filas = prox.filter(x=>!(hoyS && x.fecha===hoy())).map((x,i)=>
        `<div style="margin-top:${i?4:0}px">${i===0?`<span style="font-size:.78em;font-weight:800;text-transform:uppercase;letter-spacing:.04em;opacity:.75">Próximo día sin cole · ${cuando(x.fecha)}</span><br>`:''}${texto(x)}</div>`).join('');
      const falta = lista ? faltaSiguiente() : null;
      const pend = lista ? cursos().filter(c => c.pendiente && c.fin >= hoy()).map(c => `${c.curso}: ${c.pendiente}`) : [];
      const aviso = pend.length && !falta ? `<div style="margin-top:6px;padding:6px 10px;border-radius:10px;background:#fef3c7;color:#78350f;font-weight:700;font-size:.9em">⚠️ ${esc(pend.join(' · '))}</div>` : falta ? `<div style="margin-top:6px;padding:6px 10px;border-radius:10px;background:#fef3c7;color:#78350f;font-weight:700;font-size:.9em">⚠️ Falta el calendario del curso ${falta}. Añádelo en <code>agenda/calendario.json</code> (o pídeselo a Claude) para que las apps sepan los festivos.</div>` : '';
      el.innerHTML = `<div style="background:rgba(255,255,255,.9);border:1.5px solid #c7d2fe;border-left:6px solid #4f46e5;border-radius:14px;padding:10px 14px;margin:10px 0;color:#1f2a37;font-size:.95rem;line-height:1.4;text-align:left">${cab}${filas}${aviso}</div>`;
    });
  }
  const listo = fetch(URL_CAL + '?_=' + Date.now(), {cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(j=>{ if(j && (j.inicio || Array.isArray(j.cursos))){ datos=j; try{localStorage.setItem(KEY, JSON.stringify(j));}catch(e){} } return datos; })
    .catch(()=>datos)
    .then(d=>{ pintar(); document.dispatchEvent(new CustomEvent('calendario-cole')); return d; });
  window.CalendarioCole = { sinCole, proximos, listo, faltaSiguiente, get datos(){ return datos; }, pintar };
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', pintar); else pintar();
})();
