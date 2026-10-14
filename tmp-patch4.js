/* Parche 14-oct-2026: invitación a familias nuevas (portada, con modo marzo) y razones en matriculación */
window.P4 = {};
P4.portada = function (ix) {
  if (ix.indexOf('id="buscas-cole"') >= 0) throw 'portada ya';
  var html = '  <!-- Invitación a familias nuevas (14-oct-2026). En marzo cambia al aviso del plazo de admisión -->\n' +
  '  <section class="contenido buscas-cole" id="buscas-cole" aria-labelledby="bcTit">\n' +
  '    <style>\n' +
  '      .buscas-cole{padding-top:0;padding-bottom:0;margin-top:1.2rem}\n' +
  '      .bc-card{max-width:1100px;margin:0 auto;border-radius:18px;padding:1rem 1.2rem;background:linear-gradient(135deg,#0d47a1,#1565c0);color:#fff;display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.2rem;box-shadow:0 6px 18px rgba(13,71,161,.25)}\n' +
  '      .bc-card.marzo{background:linear-gradient(135deg,#b45309,#d97706)}\n' +
  '      .bc-tx{flex:1 1 320px}\n' +
  '      .bc-card h2{margin:0 0 .25rem;font-size:1.2rem;color:#fff}\n' +
  '      .bc-card h2::after{display:none}\n' +
  '      .bc-card p{margin:0;line-height:1.45;color:#eef4ff}\n' +
  '      .bc-bts{display:flex;flex-wrap:wrap;gap:.5rem}\n' +
  '      .bc-b{display:inline-flex;align-items:center;gap:.45rem;min-height:44px;padding:.5rem 1.1rem;border-radius:30px;font-weight:700;text-decoration:none;background:#ffd84d;color:#3a2a00}\n' +
  '      .bc-b.sec{background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.6)}\n' +
  '      .bc-b:hover{filter:brightness(1.05)}\n' +
  '    </style>\n' +
  '    <div class="bc-card" id="bcCard">\n' +
  '      <div class="bc-tx"><h2 id="bcTit">👋 ¿Buscas cole para tu hijo o hija?</h2><p id="bcP">Ven a conocernos sin compromiso: te enseñamos las aulas, el patio y el comedor.</p></div>\n' +
  '      <div class="bc-bts"><a class="bc-b" id="bcB1" href="tel:+34958893892"><i class="fa-solid fa-phone" aria-hidden="true"></i> <span>Pedir una visita</span></a><a class="bc-b sec" id="bcB2" href="nuestro-centro.html"><span>Conoce el cole</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>\n' +
  '    </div>\n' +
  '    <script>(function(){\n' +
  '      var T={es:{t:"👋 ¿Buscas cole para tu hijo o hija?",p:"Ven a conocernos sin compromiso: te enseñamos las aulas, el patio y el comedor.",b1:"Pedir una visita",b2:"Conoce el cole",mt:"📢 Plazo de solicitud de plaza abierto: del 1 al 31 de marzo",mp:"¿Quieres que tu hijo o hija estudie con nosotros? Te ayudamos con la solicitud y puedes visitarnos antes.",mb:"Cómo pedir plaza"},\n' +
  '        en:{t:"👋 Looking for a school for your child?",p:"Come and visit us, no strings attached: we will show you the classrooms, the playground and the canteen.",b1:"Book a visit",b2:"Discover our school",mt:"📢 School application period open: 1 to 31 March",mp:"Would you like your child to study with us? We will help you with the application, and you can visit us first.",mb:"How to apply"},\n' +
  '        ar:{t:"👋 هل تبحث عن مدرسة لطفلك؟",p:"تعالوا لزيارتنا دون أي التزام: سنريكم الأقسام والساحة والمقصف.",b1:"اطلب زيارة",b2:"تعرّف على المدرسة",mt:"📢 فترة طلب المقعد مفتوحة: من 1 إلى 31 مارس",mp:"هل تريد أن يدرس طفلك معنا؟ نساعدك في الطلب ويمكنك زيارتنا قبل ذلك.",mb:"كيف تطلب مقعدًا"},\n' +
  '        ro:{t:"👋 Căutați o școală pentru copilul dumneavoastră?",p:"Veniți să ne cunoașteți, fără niciun angajament: vă arătăm sălile de clasă, curtea și cantina.",b1:"Cereți o vizită",b2:"Cunoașteți școala",mt:"📢 Perioada de cereri este deschisă: 1–31 martie",mp:"Doriți ca copilul să învețe la noi? Vă ajutăm cu cererea și ne puteți vizita înainte.",mb:"Cum se cere locul"}};\n' +
  '      function p(){var l=(window.I18N&&window.I18N.current)||"es",D=T[l]||T.es,c=document.getElementById("bcCard");if(!c)return;var marzo=new Date().getMonth()===2;c.className="bc-card"+(marzo?" marzo":"");c.dir=l==="ar"?"rtl":"ltr";\n' +
  '        document.getElementById("bcTit").textContent=marzo?D.mt:D.t;document.getElementById("bcP").textContent=marzo?D.mp:D.p;\n' +
  '        var b1=document.getElementById("bcB1"),b2=document.getElementById("bcB2");b1.querySelector("span").textContent=D.b1;\n' +
  '        if(marzo){b2.href="matriculacion.html";b2.querySelector("span").textContent=D.mb;}else{b2.href="nuestro-centro.html";b2.querySelector("span").textContent=D.b2;}}\n' +
  '      p();document.addEventListener("capi:langchange",p);window.addEventListener("capi:langchange",p);setTimeout(p,1500);\n' +
  '    })();<\/script>\n' +
  '  </section>\n\n';
  var s = ix.indexOf('id="esta-semana"'); var a = ix.lastIndexOf('<!--', s);
  if (s < 0 || a < 0 || s - a > 200) throw 'pos portada';
  return ix.slice(0, a) + html + '  ' + ix.slice(a);
};

P4.matricula = function (t) {
  if (t.indexOf('id="por-que-matricula"') >= 0) throw 'matric ya';
  var html = '\n    <!-- Por qué elegirnos (14-oct-2026) -->\n' +
  '    <div class="card" id="por-que-matricula" style="margin-bottom:1.5rem">\n' +
  '      <style>.pm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.7rem;margin:.8rem 0 1rem}.pm-it{background:#f5f8ff;border-radius:14px;padding:.8rem 1rem;line-height:1.45}.pm-it b{display:block;color:#0d47a1;margin-bottom:.2rem}.pm-bts{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center}</style>\n' +
  '      <h2 id="pmTit">¿Por qué elegir el CEIP Capitulaciones?</h2>\n' +
  '      <div class="pm-grid" id="pmGrid"></div>\n' +
  '      <div class="pm-bts"><a href="tel:+34958893892" class="boton boton-primario"><i class="fa-solid fa-phone"></i> <span id="pmB1">Pedir una visita</span></a><a href="nuestro-centro.html" class="boton boton-secundario"><i class="fa-solid fa-school"></i> <span id="pmB2">Conoce el cole</span></a></div>\n' +
  '      <script>(function(){var T={es:{t:"¿Por qué elegir el CEIP Capitulaciones?",b1:"Pedir una visita",b2:"Conoce el cole",r:[["Una clase por curso","Somos un cole pequeño: aquí cada alumno tiene nombre y apellidos."],["Atención a la diversidad","Aula TEA, Pedagogía Terapéutica y Audición y Lenguaje, con apoyo dentro del aula."],["Bilingüe e innovador","Inglés cada día y proyectos en el Aula del Futuro."],["De 7:30 a 18:00","Aula matinal, comedor y extraescolares, con ayudas de la Junta."]]},\n' +
  '        en:{t:"Why choose CEIP Capitulaciones?",b1:"Book a visit",b2:"Discover our school",r:[["One class per year","We are a small school: here every pupil is known by name."],["Support for every child","ASD classroom, special needs and speech therapy, with support inside the classroom."],["Bilingual and innovative","English every day and projects in the Future Classroom."],["From 7:30 to 18:00","Breakfast club, school lunch and after-school activities, with help from the regional government."]]},\n' +
  '        ar:{t:"لماذا تختار مدرسة كابيتولاسيونس؟",b1:"اطلب زيارة",b2:"تعرّف على المدرسة",r:[["قسم واحد لكل مستوى","نحن مدرسة صغيرة: هنا نعرف كل تلميذ باسمه."],["رعاية التنوع","قسم التوحد والتربية الخاصة والنطق، مع الدعم داخل القسم."],["ثنائية اللغة ومبتكرة","الإنجليزية كل يوم ومشاريع في قسم المستقبل."],["من 7:30 إلى 18:00","القسم الصباحي والمقصف والأنشطة اللامنهجية، بدعم من حكومة الأندلس."]]},\n' +
  '        ro:{t:"De ce să alegeți CEIP Capitulaciones?",b1:"Cereți o vizită",b2:"Cunoașteți școala",r:[["O clasă pe an","Suntem o școală mică: aici fiecare elev are nume și prenume."],["Atenție la diversitate","Clasă TEA, pedagogie terapeutică și logopedie, cu sprijin în clasă."],["Bilingvă și inovatoare","Engleză în fiecare zi și proiecte în Clasa Viitorului."],["De la 7:30 la 18:00","Program de dimineață, cantină și activități extrașcolare, cu ajutoare de la Junta."]]}};\n' +
  '        function e(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}\n' +
  '        function p(){var l=(window.I18N&&window.I18N.current)||"es",D=T[l]||T.es,c=document.getElementById("por-que-matricula");if(!c)return;c.dir=l==="ar"?"rtl":"ltr";document.getElementById("pmTit").textContent=D.t;document.getElementById("pmB1").textContent=D.b1;document.getElementById("pmB2").textContent=D.b2;document.getElementById("pmGrid").innerHTML=D.r.map(function(x){return \'<div class="pm-it"><b>\'+e(x[0])+\'</b>\'+e(x[1])+\'</div>\'}).join("")}\n' +
  '        p();document.addEventListener("capi:langchange",p);window.addEventListener("capi:langchange",p);setTimeout(p,1500);})();<\/script>\n' +
  '    </div>\n';
  var a = t.indexOf('<main id="contenido-principal">'); var s = t.indexOf('<section class="contenido">', a);
  if (a < 0 || s < 0) throw 'matric pos';
  s += '<section class="contenido">'.length;
  return t.slice(0, s) + html + t.slice(s);
};
