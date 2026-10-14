/* Parche 14-oct-2026: «Recién llegados» (familias + matriculación) y «Un mes, un valor» (nuestro centro) */
window.P2 = {};

/* ---------- 1) Familias: bloque «¿Acabáis de llegar?» ---------- */
P2.familias = function (t) {
  if (t.indexOf('id="recien-llegados"') >= 0) throw 'familias ya';
  var sec = '\n<!-- Recién llegados (14-oct-2026) -->\n<section class="contenido recien-llegados" id="recien-llegados" aria-labelledby="rlTit">\n' +
  '<style>\n' +
  '.recien-llegados{padding-bottom:0}\n' +
  '.rl-card{max-width:1000px;margin:0 auto;background:#fff;border-radius:18px;border-top:6px solid #16a34a;box-shadow:0 4px 16px rgba(0,74,173,.10);padding:1.2rem 1.4rem}\n' +
  '.rl-card h2{margin:0 0 .4rem;font-size:1.35rem}\n' +
  '.rl-p{margin:0 0 .9rem;line-height:1.55;color:#233}\n' +
  '.rl-pasos{list-style:none;margin:0 0 1rem;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.6rem}\n' +
  '.rl-pasos a{display:flex;gap:.7rem;align-items:center;min-height:56px;padding:.6rem .8rem;border-radius:14px;background:#f0fdf4;border:2px solid #bbf7d0;color:#14532d;font-weight:700;text-decoration:none;line-height:1.3}\n' +
  '.rl-pasos a:hover{background:#dcfce7}\n' +
  '.rl-n{flex:0 0 32px;height:32px;border-radius:50%;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}\n' +
  '.rl-pie{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}\n' +
  '.rl-tel{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;padding:.5rem 1.1rem;border-radius:30px;background:#16a34a;color:#fff;font-weight:700;text-decoration:none}\n' +
  '.rl-tel:hover{background:#15803d;color:#fff}\n' +
  '.rl-idi{font-size:.9rem;color:#475569}\n' +
  '</style>\n' +
  '<div class="rl-card" id="rlCard">\n' +
  '<h2 id="rlTit">👋 ¿Acabáis de llegar al cole? Empezad aquí</h2>\n' +
  '<p class="rl-p">Bienvenidos. En cinco minutos sabréis lo más importante. Si algo no lo entendéis o necesitáis ayuda con los papeles, decídnoslo: os ayudamos.</p>\n' +
  '<ol class="rl-pasos" id="rlPasos"></ol>\n' +
  '<div class="rl-pie"><a class="rl-tel" href="tel:+34958893892"><i class="fa-solid fa-phone" aria-hidden="true"></i> <span id="rlTel">Llamar al cole</span></a><span class="rl-idi" id="rlIdi">🌐 Esta web se puede leer en español, inglés, árabe y rumano: elige el idioma en el menú.</span></div>\n' +
  '</div>\n' +
  '<script>\n(function(){\n' +
  'var T={es:{t:"👋 ¿Acabáis de llegar al cole? Empezad aquí",p:"Bienvenidos. En cinco minutos sabréis lo más importante. Si algo no lo entendéis o necesitáis ayuda con los papeles, decídnoslo: os ayudamos.",s:["Horario: entrada a las 9:00 y salida a las 14:00","Si vuestro hijo o hija falta, avisad al cole","Cómo os contamos las cosas","Aula matinal, comedor y extraescolares","Salud, medicinas y alergias","Preguntas frecuentes"],tel:"Llamar al cole",idi:"🌐 Esta web se puede leer en español, inglés, árabe y rumano: elige el idioma en el menú."},\n' +
  'en:{t:"👋 New to our school? Start here",p:"Welcome. In five minutes you will know the most important things. If anything is unclear or you need help with paperwork, tell us: we will help you.",s:["Timetable: school starts at 9:00 and ends at 14:00","If your child is absent, let the school know","How we keep you informed","Breakfast club, school lunch and after-school activities","Health, medicines and allergies","Frequently asked questions"],tel:"Call the school",idi:"🌐 This website can be read in Spanish, English, Arabic and Romanian: choose the language in the menu."},\n' +
  'ar:{t:"👋 هل وصلتم حديثًا إلى المدرسة؟ ابدأوا من هنا",p:"مرحبًا بكم. في خمس دقائق ستعرفون أهم الأشياء. إذا لم تفهموا شيئًا أو احتجتم مساعدة في الأوراق، أخبرونا: سنساعدكم.",s:["المواعيد: الدخول 9:00 والخروج 14:00","إذا تغيّب طفلكم، أخبروا المدرسة","كيف نتواصل معكم","القسم الصباحي والمقصف والأنشطة اللامنهجية","الصحة والأدوية والحساسية","أسئلة متكررة"],tel:"اتصل بالمدرسة",idi:"🌐 يمكن قراءة هذا الموقع بالإسبانية والإنجليزية والعربية والرومانية: اختر اللغة من القائمة."},\n' +
  'ro:{t:"👋 Abia ați venit la școală? Începeți de aici",p:"Bine ați venit. În cinci minute veți afla cele mai importante lucruri. Dacă nu înțelegeți ceva sau aveți nevoie de ajutor cu actele, spuneți-ne: vă ajutăm.",s:["Orar: intrarea la 9:00 și ieșirea la 14:00","Dacă copilul lipsește, anunțați școala","Cum vă ținem la curent","Program de dimineață, cantină și activități extrașcolare","Sănătate, medicamente și alergii","Întrebări frecvente"],tel:"Sunați la școală",idi:"🌐 Acest site poate fi citit în spaniolă, engleză, arabă și română: alegeți limba din meniu."}};\n' +
  'var H=["#horarios","#faltas","#comunicacion","#servicios","#salud","#faq"];\n' +
  'function p(){var l=(window.I18N&&window.I18N.current)||"es",D=T[l]||T.es;var c=document.getElementById("rlCard");if(!c)return;c.dir=l==="ar"?"rtl":"ltr";\n' +
  'document.getElementById("rlTit").textContent=D.t;c.querySelector(".rl-p").textContent=D.p;document.getElementById("rlTel").textContent=D.tel;document.getElementById("rlIdi").textContent=D.idi;\n' +
  'document.getElementById("rlPasos").innerHTML=D.s.map(function(s,i){return \'<li><a href="\'+H[i]+\'"><span class="rl-n">\'+(i+1)+\'</span><span>\'+s+\'</span></a></li>\'}).join("");}\n' +
  'p();document.addEventListener("capi:langchange",p);window.addEventListener("capi:langchange",p);setTimeout(p,1500);\n' +
  '})();\n<\/script>\n</section>\n';
  var nav = t.indexOf('</nav>', t.indexOf('</header>'));
  var s1 = t.indexOf('<section', nav);
  if (nav < 0 || s1 < 0) throw 'familias pos';
  return t.slice(0, s1) + sec.replace(/^\n/, '') + '\n' + t.slice(s1);
};

/* ---------- 2) Matriculación: botón hacia «Recién llegados» ---------- */
P2.matriculacion = function (t) {
  if (t.indexOf('familias.html#recien-llegados') >= 0) throw 'matric ya';
  var bloque = '\n<!-- Enlace a Recién llegados (14-oct-2026) -->\n<div style="max-width:1000px;margin:1.2rem auto 0;text-align:center">\n' +
    '<a href="familias.html#recien-llegados" style="display:inline-flex;align-items:center;gap:.6rem;min-height:48px;padding:.7rem 1.4rem;border-radius:30px;background:#16a34a;color:#fff;font-weight:700;text-decoration:none;font-size:1.05rem">' +
    '<span>👋</span> <span id="mtRl">¿Sois nuevos en el cole? Empezad aquí</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>\n' +
    '<script>(function(){var T={es:"¿Sois nuevos en el cole? Empezad aquí",en:"New to our school? Start here",ar:"هل أنتم جدد في المدرسة؟ ابدأوا من هنا",ro:"Sunteți noi la școală? Începeți de aici"};function p(){var e=document.getElementById("mtRl");if(e)e.textContent=T[(window.I18N&&window.I18N.current)||"es"]||T.es}p();document.addEventListener("capi:langchange",p);window.addEventListener("capi:langchange",p);setTimeout(p,1500)})();<\/script>\n</div>\n';
  // al final del contenido principal, justo antes de </main>
  if (t.split('</main>').length !== 2) throw 'matric main';
  var vi = t.lastIndexOf('Volver al inicio', t.indexOf('</main>'));
  var pos = vi > 0 ? t.lastIndexOf('<', t.lastIndexOf('<section', vi) ) : -1;
  if (pos < 0) pos = t.indexOf('</main>');
  return t.slice(0, pos) + bloque + t.slice(pos);
};

/* ---------- 3) Nuestro centro: «Un mes, un valor» ---------- */
P2.centro = function (t) {
  if (t.indexOf('id="valores"') >= 0) throw 'centro ya';
  var sec = '<!-- Un mes, un valor (14-oct-2026) -->\n<section class="contenido valores-mes" id="valores" aria-labelledby="vmTit">\n' +
  '<style>\n' +
  '.vm-card{max-width:1100px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 4px 16px rgba(0,74,173,.10);padding:1.3rem 1.4rem}\n' +
  '.vm-card h2{margin:0 0 .4rem;font-size:1.4rem}\n' +
  '.vm-p{margin:0 0 1rem;line-height:1.55;color:#233}\n' +
  '.vm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.7rem}\n' +
  '.vm-m{border-radius:16px;padding:.8rem .9rem;border:2px solid transparent;line-height:1.4}\n' +
  '.vm-m.hoy{border-color:#0d47a1;box-shadow:0 0 0 3px rgba(13,71,161,.15)}\n' +
  '.vm-mes{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#334155}\n' +
  '.vm-v{font-size:1.15rem;font-weight:800;color:#0f172a;margin:.1rem 0}\n' +
  '.vm-l{font-size:.9rem;color:#1e293b;margin:0 0 .4rem}\n' +
  '.vm-c{font-size:.85rem;color:#334155;margin:0}\n' +
  '.vm-c b{color:#0f172a}\n' +
  '.vm-hoy{display:inline-block;margin-left:.3rem;padding:.05rem .5rem;border-radius:20px;background:#0d47a1;color:#fff;font-size:.7rem;letter-spacing:0;text-transform:none}\n' +
  '</style>\n' +
  '<div class="vm-card" id="vmCard">\n' +
  '<h2 id="vmTit">🌱 Un mes, un valor: juntos crecemos</h2>\n' +
  '<p class="vm-p" id="vmP">Cada mes, todo el colegio trabaja un mismo valor de convivencia: en clase, en el patio y también en casa. Aquí tenéis el calendario del curso y una idea sencilla para reforzarlo en familia.</p>\n' +
  '<div class="vm-grid" id="vmGrid"></div>\n' +
  '</div>\n' +
  '<script>\n(function(){\n' +
  'var C=["#fff3c4","#fde2ef","#dbeafe","#ede4fb","#dcfce7","#e0f2fe","#f3e8ff","#e0f7fa","#ffe4dc","#e6f6e3"];\n' +
  'var M=[9,10,11,12,1,2,3,4,5,6];\n' +
  'var T={es:{t:"🌱 Un mes, un valor: juntos crecemos",p:"Cada mes, todo el colegio trabaja un mismo valor de convivencia: en clase, en el patio y también en casa. Aquí tenéis el calendario del curso y una idea sencilla para reforzarlo en familia.",casa:"En casa",hoy:"Este mes",loc:"es-ES",\n' +
  'v:[["Acogida","Nos conocemos y pertenecemos.","Preguntadle por el nombre de un compañero o compañera nuevos."],["Respeto","Nos cuidamos y valoramos a los demás.","Practicad pedir las cosas por favor y dar las gracias."],["Empatía","Nos ponemos en el lugar del otro.","Al ver una película, preguntad: ¿cómo se siente ese personaje?"],["Solidaridad","Ayudamos y compartimos.","Elegid juntos algo para donar o compartir."],["Responsabilidad","Cumplimos con nuestros deberes.","Dadle una pequeña tarea de casa que sea solo suya."],["Tolerancia","Aceptamos que somos diferentes.","Hablad de las costumbres de otras familias y otros países."],["Perseverancia","No nos rendimos.","Cuando algo le cueste, recordadle cuánto ha mejorado."],["Honestidad","Decimos la verdad y somos sinceros.","Valorad que diga la verdad, aunque se haya equivocado."],["Cooperación","Juntos llegamos más lejos.","Haced algo en equipo: cocinar, ordenar o un puzle."],["Paz","Dialogamos, perdonamos y convivimos.","Si hay una discusión, que cada uno cuente cómo se siente antes de buscar una solución."]]},\n' +
  'en:{t:"🌱 One month, one value: growing together",p:"Every month the whole school works on the same value: in class, in the playground and at home too. Here is the calendar for the year and a simple idea to reinforce it as a family.",casa:"At home",hoy:"This month",loc:"en-GB",\n' +
  'v:[["Welcome","We get to know each other and belong.","Ask them the name of a new classmate."],["Respect","We look after and value others.","Practise saying please and thank you."],["Empathy","We put ourselves in other people\'s shoes.","When watching a film, ask: how does that character feel?"],["Solidarity","We help and share.","Choose something together to donate or share."],["Responsibility","We fulfil our duties.","Give them a small household job that is just theirs."],["Tolerance","We accept that we are different.","Talk about the customs of other families and countries."],["Perseverance","We never give up.","When something is hard, remind them how much they have improved."],["Honesty","We tell the truth and are sincere.","Praise them for telling the truth, even after a mistake."],["Cooperation","Together we go further.","Do something as a team: cooking, tidying up or a puzzle."],["Peace","We talk, forgive and live together.","After an argument, let everyone say how they feel before looking for a solution."]]},\n' +
  'ar:{t:"🌱 شهر واحد، قيمة واحدة: معًا نكبر",p:"كل شهر تعمل المدرسة كلها على القيمة نفسها: في القسم وفي الساحة وفي البيت أيضًا. إليكم رزنامة السنة وفكرة بسيطة لتعزيزها مع العائلة.",casa:"في البيت",hoy:"هذا الشهر",loc:"ar-u-nu-latn",\n' +
  'v:[["الترحيب","نتعارف وننتمي.","اسألوه عن اسم زميل جديد."],["الاحترام","نعتني ببعضنا ونقدّر الآخرين.","تدرّبوا على قول من فضلك وشكرًا."],["التعاطف","نضع أنفسنا مكان الآخر.","عند مشاهدة فيلم، اسألوا: بماذا تشعر هذه الشخصية؟"],["التضامن","نساعد ونتشارك.","اختاروا معًا شيئًا للتبرع به أو لمشاركته."],["المسؤولية","نقوم بواجباتنا.","أعطوه مهمة صغيرة في البيت تكون خاصة به."],["التسامح","نتقبّل أننا مختلفون.","تحدّثوا عن عادات عائلات وبلدان أخرى."],["المثابرة","لا نستسلم.","حين يصعب عليه شيء، ذكّروه بمدى تحسّنه."],["الصدق","نقول الحقيقة ونكون صادقين.","قدّروا قوله الحقيقة حتى لو أخطأ."],["التعاون","معًا نصل أبعد.","اعملوا شيئًا كفريق: الطبخ أو الترتيب أو لعبة تركيب."],["السلام","نتحاور ونسامح ونتعايش.","بعد أي خلاف، ليعبّر كل واحد عن شعوره قبل البحث عن حل."]]},\n' +
  'ro:{t:"🌱 O lună, o valoare: creștem împreună",p:"În fiecare lună, toată școala lucrează aceeași valoare: în clasă, în curte și acasă. Iată calendarul anului școlar și o idee simplă pentru a o întări în familie.",casa:"Acasă",hoy:"Luna aceasta",loc:"ro-RO",\n' +
  'v:[["Primirea","Ne cunoaștem și ne simțim parte din grup.","Întrebați-l cum se numește un coleg nou."],["Respectul","Avem grijă unii de alții și îi prețuim pe ceilalți.","Exersați să spuneți te rog și mulțumesc."],["Empatia","Ne punem în locul celuilalt.","Când vedeți un film, întrebați: cum se simte acel personaj?"],["Solidaritatea","Ajutăm și împărțim.","Alegeți împreună ceva de donat sau de împărțit."],["Responsabilitatea","Ne îndeplinim datoriile.","Dați-i o mică sarcină în casă care să fie doar a lui."],["Toleranța","Acceptăm că suntem diferiți.","Vorbiți despre obiceiurile altor familii și țări."],["Perseverența","Nu renunțăm.","Când ceva îi este greu, amintiți-i cât de mult a progresat."],["Onestitatea","Spunem adevărul și suntem sinceri.","Apreciați că spune adevărul, chiar dacă a greșit."],["Cooperarea","Împreună ajungem mai departe.","Faceți ceva în echipă: gătit, ordine sau un puzzle."],["Pacea","Dialogăm, iertăm și conviețuim.","După o ceartă, fiecare să spună cum se simte înainte de a căuta o soluție."]]}};\n' +
  'function e(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;"}[c]})}\n' +
  'function p(){var l=(window.I18N&&window.I18N.current)||"es",D=T[l]||T.es,mesHoy=new Date().getMonth()+1,c=document.getElementById("vmCard");if(!c)return;c.dir=l==="ar"?"rtl":"ltr";\n' +
  'document.getElementById("vmTit").textContent=D.t;document.getElementById("vmP").textContent=D.p;\n' +
  'document.getElementById("vmGrid").innerHTML=D.v.map(function(x,i){var nm;try{nm=new Date(2026,M[i]-1,15).toLocaleDateString(D.loc,{month:"long"})}catch(_){nm=""}var hoy=M[i]===mesHoy;\n' +
  'return \'<div class="vm-m\'+(hoy?" hoy":"")+\'" style="background:\'+C[i]+\'"><div class="vm-mes">\'+e(nm)+(hoy?\'<span class="vm-hoy">\'+e(D.hoy)+\'</span>\':"")+\'</div><div class="vm-v">\'+e(x[0])+\'</div><p class="vm-l">\'+e(x[1])+\'</p><p class="vm-c"><b>\'+e(D.casa)+\':</b> \'+e(x[2])+\'</p></div>\'}).join("");}\n' +
  'p();document.addEventListener("capi:langchange",p);window.addEventListener("capi:langchange",p);setTimeout(p,1500);\n' +
  '})();\n<\/script>\n</section>\n\n';
  // antes del bloque final «Ven a verlo» si existe; si no, antes del cierre de </main>
  var k = t.indexOf('Ven a verlo');
  var pos = k > 0 ? t.lastIndexOf('<section', k) : -1;
  if (pos < 0) pos = t.indexOf('</main>');
  if (pos < 0) throw 'centro pos';
  return t.slice(0, pos) + sec + t.slice(pos);
};

/* ---------- 4) Frase del día: «Valor del mes» enlaza a nuestro-centro.html#valores ---------- */
P2.frases = function (t) {
  var a = "(valor?'<div class=\"fd-valor\"><span>'";
  if (t.split(a).length !== 2) throw 'frases valor';
  t = t.replace(a, "(valor?'<a class=\"fd-valor\" href=\"nuestro-centro.html#valores\"><span>'");
  var b = "+'</span></div>':'')+";
  if (t.split(b).length !== 2) throw 'frases cierre';
  t = t.replace(b, "+'</span></a>':'')+");
  var c = '".fd-valor b{color:#5a3d00}"+';
  if (t.split(c).length !== 2) throw 'frases css';
  t = t.replace(c, '".fd-valor b{color:#5a3d00}.fd-valor{text-decoration:none}a.fd-valor:hover{background:#ffec99}"+');
  return t;
};
