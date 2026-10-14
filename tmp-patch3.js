/* Parche 14-oct-2026: página programaciones.html + enlaces (menú, transparencia, profesorado, sitemap) */
window.P3 = {};
P3.AREAS = [
  ['Lengua Castellana y Literatura', '📖', ['Lectura y escritura (código)', 'Comprensión y tipos de texto', 'Expresión escrita', 'Gramática', 'Ortografía', 'Comunicación oral', 'Literatura y biblioteca']],
  ['Matemáticas', '🔢', ['Numeración', 'Suma y resta', 'Multiplicación', 'División', 'Fracciones y decimales', 'Medida', 'Geometría', 'Estadística y probabilidad', 'Resolución de problemas']],
  ['Conocimiento del Medio Natural, Social y Cultural', '🌍', ['Ciencia e indagación', 'El cuerpo y la salud', 'Seres vivos y ecosistemas', 'Materia, energía y máquinas', 'Tecnología y digitalización', 'Geografía y espacio', 'Historia y tiempo', 'Sociedad y ciudadanía']],
  ['Inglés (Lengua Extranjera)', '🇬🇧', ['Comprensión oral', 'Expresión oral', 'Lectura', 'Escritura', 'Vocabulario y estructuras', 'Interculturalidad']],
  ['Educación Física', '⚽', ['Salud y vida activa', 'Habilidades motrices', 'Juegos y deportes', 'Expresión corporal', 'Convivencia y emociones', 'Medio natural']],
  ['Educación Artística', '🎨', ['Plástica: percepción', 'Plástica: creación', 'Música: lenguaje musical', 'Música: interpretación']]
];

/* Texto de un PDF -> {area: [[apartado, texto], ...]} */
P3.parse = function (raw, n) {
  var t = raw.replace(/Qué se trabaja en \d\.º de Primaria · CEIP Capitulaciones de Santa Fe · www\.colegiocapitulaciones\.com · Pág\. \d+/g, ' ')
    .replace(/Contenido Qué se trabaja en \d\.º/g, ' ')
    .replace(/\s+/g, ' ');
  var ini = t.indexOf('hora de atención a familias.');
  if (ini >= 0) t = t.slice(ini + 'hora de atención a familias.'.length);
  var out = [], pos = 0;
  P3.AREAS.forEach(function (A, ai) {
    var a = t.indexOf(A[0], pos); if (a < 0) throw 'area ' + A[0] + ' curso ' + n;
    var fin = ai + 1 < P3.AREAS.length ? t.indexOf(P3.AREAS[ai + 1][0], a + A[0].length) : t.length;
    if (fin < 0) throw 'fin area ' + A[0] + ' curso ' + n;
    var seg = t.slice(a + A[0].length, fin), filas = [], p = 0, labs = A[2].filter(function (l) { return seg.indexOf(l) >= 0; });
    labs.forEach(function (l, li) {
      var s = seg.indexOf(l, p); if (s < 0) throw 'apartado ' + l + ' curso ' + n;
      var e = li + 1 < labs.length ? seg.indexOf(labs[li + 1], s + l.length) : seg.length;
      var txt = seg.slice(s + l.length, e).trim();
      // cierra paréntesis que el PDF dejó abiertos: "(D y U." -> "(D y U)."
      txt = txt.replace(/\(([^()]*?)\.(\s|$)/g, function (m, x, sp) { return '(' + x + ').' + sp; });
      filas.push([l, txt]); p = e;
    });
    out.push([A[0], A[1], filas]);
    pos = fin;
  });
  return out;
};

P3.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

/* Construye programaciones.html a partir de transparencia.html (cabecera, menú y pie) */
P3.pagina = function (plantilla, cursos) {
  var e = P3.esc;
  var a = plantilla.indexOf('<main id="contenido-principal">'), b = plantilla.indexOf('</main>');
  if (a < 0 || b < 0) throw 'plantilla main';
  var cab = plantilla.slice(0, a), pie = plantilla.slice(b);
  var titulo = 'Programaciones didácticas de Primaria (LOMLOE, Andalucía) · CEIP Capitulaciones';
  var desc = 'Qué se trabaja en cada curso de 1.º a 6.º de Primaria en el CEIP Capitulaciones de Santa Fe (Granada): Lengua, Matemáticas, Conocimiento del Medio, Inglés, Educación Física y Artística. Concreción curricular LOMLOE para Andalucía, con PDF descargables.';
  cab = cab.replace(/<title>[\s\S]*?<\/title>/, '<title>' + e(titulo) + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + e(desc) + '">')
    .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="https://www.colegiocapitulaciones.com/programaciones.html">')
    .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="Programaciones didácticas de Primaria · CEIP Capitulaciones">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + e(desc) + '">')
    .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://www.colegiocapitulaciones.com/programaciones.html">');
  if (cab.indexOf('programaciones.html') < 0) throw 'cabecera sin cambiar';
  var ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Programaciones didácticas de Educación Primaria', description: desc, url: 'https://www.colegiocapitulaciones.com/programaciones.html', inLanguage: 'es', isPartOf: { '@type': 'WebSite', url: 'https://www.colegiocapitulaciones.com/' }, about: 'Concreción curricular LOMLOE de Educación Primaria en Andalucía', publisher: { '@type': 'ElementarySchool', name: 'CEIP Capitulaciones de Santa Fe', url: 'https://www.colegiocapitulaciones.com/' }, hasPart: cursos.map(function (c, i) { return { '@type': 'LearningResource', name: 'Qué se trabaja en ' + (i + 1) + '.º de Primaria', educationalLevel: (i + 1) + '.º de Educación Primaria', encodingFormat: 'application/pdf', url: 'https://www.colegiocapitulaciones.com/descargas/Que_se_trabaja_en_' + (i + 1) + '_Primaria.pdf' }; }) };
  cab = cab.replace('</head>', '<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>\n</head>');
  var css = '<style>\n' +
    '.pg-int{max-width:900px;margin:0 auto}\n.pg-int p{line-height:1.6}\n' +
    '.pg-ctx{background:#fff8db;border-radius:14px;padding:.8rem 1rem;margin:1rem 0;line-height:1.5}\n' +
    '.pg-ind{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:1rem 0 0}\n' +
    '.pg-ind a{display:inline-flex;align-items:center;min-height:44px;padding:.4rem 1rem;border-radius:30px;background:#e8f0fe;color:#0d47a1;font-weight:700;text-decoration:none}\n' +
    '.pg-ind a:hover{background:#d2e3fc}\n' +
    '.pg-curso{scroll-margin-top:90px}\n.pg-curso h2{margin-bottom:.3rem}\n' +
    '.pg-pdf{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;padding:.5rem 1.1rem;border-radius:30px;background:#0d47a1;color:#fff;font-weight:700;text-decoration:none;margin:.3rem 0 .8rem}\n.pg-pdf:hover{background:#0a3a85;color:#fff}\n' +
    '.pg-curso details{border:2px solid #e2e8f0;border-radius:14px;margin:.5rem 0;background:#fff}\n' +
    '.pg-curso summary{cursor:pointer;padding:.7rem 1rem;font-weight:800;color:#0f172a;list-style:none;min-height:44px;display:flex;align-items:center;gap:.5rem}\n' +
    '.pg-curso summary::-webkit-details-marker{display:none}\n.pg-curso summary::after{content:"▾";margin-left:auto;color:#64748b}\n.pg-curso details[open] summary::after{content:"▴"}\n' +
    '.pg-tab{width:100%;border-collapse:collapse;font-size:.95rem}\n.pg-tab th,.pg-tab td{text-align:left;vertical-align:top;padding:.5rem .8rem;border-top:1px solid #eef2f7;line-height:1.45}\n' +
    '.pg-tab th{width:30%;color:#0d47a1;font-weight:700}\n@media(max-width:640px){.pg-tab th,.pg-tab td{display:block;width:auto;border:0;padding:.25rem .8rem}.pg-tab tr{display:block;border-top:1px solid #eef2f7;padding:.3rem 0}}\n' +
    '</style>\n';
  var html = '<main id="contenido-principal">\n' + css + '\n  <section class="contenido">\n\n' +
    '    <div class="card pg-int">\n' +
    '      <h1 style="font-size:1.7rem;margin-top:0">Programaciones didácticas de Educación Primaria</h1>\n' +
    '      <p>Aquí tienes, curso a curso, <strong>qué se trabaja en cada área de 1.º a 6.º de Primaria</strong> en el CEIP Capitulaciones de Santa Fe (Granada). Es la concreción curricular del centro, elaborada a partir del currículo de la <strong>LOMLOE para Andalucía</strong>, y cada curso se puede descargar en PDF.</p>\n' +
    '      <p>No es un temario de obligado cumplimiento: cada maestro o maestra ajusta el ritmo, el orden y la profundidad a su grupo y a cada alumno o alumna. Lo que evalúa el centro son los <a href="transparencia.html">criterios de evaluación oficiales</a>.</p>\n' +
    '      <div class="pg-ctx">🏫 <strong>Contexto del centro:</strong> colegio público bilingüe de Infantil y Primaria, de <strong>línea 1</strong> (una clase por curso), con Aula TEA y en Zona de Transformación Social. Santa Fe, Granada.</div>\n' +
    '      <nav class="pg-ind" aria-label="Cursos">' + cursos.map(function (c, i) { return '<a href="#curso-' + (i + 1) + '">' + (i + 1) + '.º</a>'; }).join('') + '</nav>\n' +
    '    </div>\n\n';
  cursos.forEach(function (c, i) {
    var n = i + 1;
    html += '    <div class="card pg-curso" id="curso-' + n + '">\n' +
      '      <h2>' + n + '.º de Primaria</h2>\n' +
      '      <a class="pg-pdf" href="descargas/Que_se_trabaja_en_' + n + '_Primaria.pdf" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Descargar ' + n + '.º en PDF</a>\n';
    c.forEach(function (A) {
      html += '      <details>\n        <summary><span aria-hidden="true">' + A[1] + '</span> ' + e(A[0]) + '</summary>\n        <table class="pg-tab"><tbody>\n' +
        A[2].map(function (f) { return '          <tr><th scope="row">' + e(f[0]) + '</th><td>' + e(f[1]) + '</td></tr>'; }).join('\n') +
        '\n        </tbody></table>\n      </details>\n';
    });
    html += '    </div>\n\n';
  });
  html += '    <div style="text-align:center;margin-top:2rem">\n      <a href="transparencia.html" class="boton boton-secundario"><i class="fa-solid fa-scale-balanced"></i> Criterios de evaluación y promoción</a>\n' +
    '      <a href="index.html" class="boton boton-volver"><i class="fa-solid fa-house"></i> <span data-i18n="ui.backHome">Volver al inicio</span></a>\n    </div>\n  </section>\n';
  return cab + html + pie;
};

/* Enlace en el menú «El Centro», después de «Plan de Centro» */
P3.menu = function (t, nombre) {
  if (t.indexOf('href="programaciones.html"') >= 0) return t;
  var re = /(<li><a [^>]*><i class="fa-solid fa-book"><\/i> <span data-i18n="nav\.centro\.plan">Plan de Centro<\/span><\/a><\/li>)/g;
  var n = 0;
  t = t.replace(re, function (m) { n++; return m + '\n          <li><a href="programaciones.html"><i class="fa-solid fa-list-check"></i> <span>Programaciones</span></a></li>'; });
  if (!n) throw 'menu sin Plan de Centro: ' + nombre;
  return t;
};

P3.transparencia = function (t) {
  if (t.indexOf('class="boton boton-secundario" href="programaciones.html"') >= 0) return t;
  var k = t.indexOf('descargas/Que_se_trabaja_en_6_Primaria.pdf'); if (k < 0) throw 'tr pdf';
  var cierre = '</a>\n      </div>\n      </div>';
  var c = t.indexOf(cierre, k); if (c < 0 || c - k > 600) throw 'tr cierre';
  var pos = c + '</a>\n      </div>'.length;
  return t.slice(0, pos) + '\n      <p style="text-align:center;margin:1rem 0 0"><a class="boton boton-secundario" href="programaciones.html"><i class="fa-solid fa-list-check"></i> Ver las programaciones curso a curso</a></p>' + t.slice(pos);
};

P3.profesorado = function (t) {
  if (t.indexOf('class="boton boton-secundario" href="programaciones.html"') >= 0 || t.indexOf('href="programaciones.html" class="boton') >= 0) return t;
  var a = '<a href="transparencia.html" class="boton boton-secundario"><i class="fa-solid fa-scale-balanced"></i> Documentación del centro</a>';
  if (t.split(a).length !== 2) throw 'prof';
  return t.replace(a, a + '\n        <a href="programaciones.html" class="boton boton-secundario"><i class="fa-solid fa-list-check"></i> Programaciones didácticas</a>');
};

P3.sitemap = function (t) {
  if (t.indexOf('programaciones.html') >= 0) return t;
  var k = t.indexOf('</url>', t.indexOf('transparencia.html'));
  if (k < 0) throw 'sitemap';
  k += 6;
  return t.slice(0, k) + '\n  <url>\n    <loc>https://www.colegiocapitulaciones.com/programaciones.html</loc>\n    <lastmod>2026-10-14</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.7</priority>\n  </url>' + t.slice(k);
};
