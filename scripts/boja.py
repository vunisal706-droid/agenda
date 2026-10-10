"""Vigila el BOJA cada mañana y guarda en boja.json lo que afecta a un colegio.
Fuente: canales Atom oficiales del BOJA (una por sección), que traen el último
boletín. Se van acumulando día a día (se guardan los últimos 120 días)."""
import json, re, html, datetime, unicodedata, urllib.request, sys
import xml.etree.ElementTree as ET

UA = {'User-Agent': 'Mozilla/5.0 (Agenda ED CEIP Capitulaciones; novedades BOJA)'}
SECCIONES = {'s51': '1. Disposiciones generales', 's52': '2.1 Nombramientos y ceses', 's53': '2.2 Oposiciones y concursos',
             's54': '3. Otras disposiciones', 's55': '4. Administración de Justicia', 's56': '5. Anuncios'}
DIAS = 120
DEPURAR = True
A = '{http://www.w3.org/2005/Atom}'

def norm(t):
    return unicodedata.normalize('NFD', (t or '').lower()).encode('ascii', 'ignore').decode()

def get(url, intentos=3):
    import time
    for i in range(intentos):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as ex:
            if i == intentos - 1:
                raise
            print(f'  reintento {i+1}: {ex}'); time.sleep(20)

# ¿Es de educación? (Consejería o, en otras consejerías, temas escolares)
EDU_ORG = re.compile(r'desarrollo educativo|educacion|agencia publica andaluza de educacion', re.I)
EDU_TXT = re.compile(r'centros? docentes?|educacion infantil|educacion primaria|segundo ciclo de educacion infantil|'
                     r'escolar|alumnado|profesorado|comedor|aula matinal|actividades extraescolares|'
                     r'necesidades especificas de apoyo educativo|consejos? escolar', re.I)
# Lo que casi nunca le toca a un CEIP de Granada
RUIDO = re.compile(r'centro docente privado|centro privado|autorizacion administrativa|cese de actividad|cambio de titularidad|escuela de arte|conservatorio|universidad|'
                   r'formacion profesional para el empleo|ensenanzas deportivas|escuela oficial de idiomas|'
                   r'bachillerato|ciclos? formativos?|educacion secundaria obligatoria y bachillerato', re.I)
PROV = re.compile(r'\b(almeria|cadiz|cordoba|huelva|jaen|malaga|sevilla)\b', re.I)
# Lo importante para un colegio
CLAVE = re.compile(r'instrucciones?|calendario|escolarizacion|admision|matricula|plan(es)? |programa|'
                   r'convocatoria|ayudas?|subvencion|evaluacion|direccion|director|reglamento organico|'
                   r'plantilla|cuerpo de maestros|maestros|adjudicacion|concurso de traslados|interinos|'
                   r'bolsa|comedor|aula matinal|gratuidad|libros de texto|transporte escolar|granada', re.I)

TIPOS = [('📌', 'Instrucciones', r'instrucciones?|orden de .* por la que se (regula|establece|desarrolla)|decreto'),
         ('🗓️', 'Calendario', r'calendario|plazos?'),
         ('🏫', 'Centros', r'autoriza|centro de educacion|centros? docentes?|cese de actividad|escolarizacion|admision'),
         ('👥', 'Personal', r'maestros|profesorado|cuerpo|plantilla|interinos|bolsa|adjudicacion|traslados|nombra|\bcese\b|direccion|director'),
         ('💶', 'Ayudas', r'ayudas?|subvencion|becas?|gratuidad|bonificacion'),
         ('📝', 'Convocatoria', r'convocatoria|convoca|premios?|concurso'),
         ('🏫', 'Centros', r'centros?|comedor|aula matinal|transporte')]

def tipo(t):
    n = norm(t)
    for e, nombre, rx in TIPOS:
        if re.search(rx, n):
            return e, nombre
    return '📄', 'Otros'

def leer_feed(sec):
    raiz = ET.fromstring(get(f'https://juntadeandalucia.es/boja/distribucion/{sec}.xml'))
    out = []
    for e in raiz.iter(A + 'entry'):
        titulo = html.unescape((e.findtext(A + 'title') or '').strip())
        link = (e.find(A + 'link').get('href') if e.find(A + 'link') is not None else '').replace('http://', 'https://')
        bruto = e.findtext(A + 'content') or e.findtext(A + 'summary') or ''
        if not bruto:   # contenido con etiquetas XHTML dentro
            nodo = e.find(A + 'content') if e.find(A + 'content') is not None else e.find(A + 'summary')
            bruto = ET.tostring(nodo, encoding='unicode', method='text') if nodo is not None else ''
        if DEPURAR and not out:
            print(f'::notice::{sec} ejemplo de contenido: {bruto[:250]!r}')
        cont = re.sub(r'<[^>]+>', ' ', html.unescape(bruto))
        cont = re.sub(r'\s+', ' ', cont)
        org = re.search(r'Organismo\s*:\s*([^;]+?)\s*(?:;|Administraci|PDF|$)', cont)
        bol = re.search(r'BOJA n[ºo°]\s*(\d+)\s*de\s*(\d{4})', cont)
        fecha = (e.findtext(A + 'updated') or '')[:10]
        out.append({'t': titulo, 'url': link, 'org': org.group(1).strip() if org else '', 'sec': SECCIONES[sec],
                    'bol': f'{bol.group(1)}/{bol.group(2)}' if bol else '', 'fecha': fecha})
    return out

def clasificar(x):
    n, o = norm(x['t']), norm(x['org'])
    es_edu = bool(EDU_ORG.search(o)) or bool(EDU_TXT.search(n))
    if not es_edu:
        return None
    ruido = bool(RUIDO.search(n)) or (bool(PROV.search(n)) and 'granada' not in n and 'andalucia' not in n)
    importante = (not ruido) and bool(CLAVE.search(n))
    e, nombre = tipo(x['t'])
    return {**x, 'imp': importante, 'ruido': ruido, 'emoji': e, 'tipo': nombre}

def main():
    try:
        previo = json.load(open('boja.json', encoding='utf-8')).get('items', [])
    except Exception:
        previo = []
    guardado = {}
    for x in previo:   # se vuelve a clasificar con las reglas actuales
        c = clasificar(x)
        if c: guardado[x['url']] = c
    nuevos, errores = [], 0
    for sec in SECCIONES:
        try:
            items = leer_feed(sec)
            print(f'{sec}: {len(items)} disposiciones')
        except Exception as ex:
            errores += 1; print(f'::warning::{sec}: no se ha podido leer ({ex})'); continue
        for x in items:
            c = clasificar(x)
            if c and c['url'] not in guardado:
                nuevos.append(c)
                print(f'  {"★" if c["imp"] else "·"} {c["t"][:110]}')
            if c: guardado[c['url']] = c
    if errores == len(SECCIONES):
        print('::warning::No se ha podido leer el BOJA: no se cambia nada.'); return
    limite = (datetime.date.today() - datetime.timedelta(days=DIAS)).isoformat()
    items = [x for x in guardado.values() if x.get('fecha', '9999') >= limite]
    items.sort(key=lambda x: (x.get('fecha', ''), x['url']), reverse=True)
    with open('boja.json', 'w', encoding='utf-8') as f:
        json.dump({'actualizado': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'),
                   'items': items}, f, ensure_ascii=False, indent=1)
    sin_org = sum(1 for x in items if not x.get('org'))
    print(f'::notice::boja.json: {len(nuevos)} nuevas, {len(items)} en total, {sum(x["imp"] for x in items)} importantes, {sin_org} sin consejería')

if __name__ == '__main__':
    main()
