"""Genera dos calendarios de suscripción (.ics) del CEIP Capitulaciones para Google Calendar,
el móvil o Outlook. Se actualizan solos con GitHub Actions.
 - calendario-profesorado.ics: días sin cole, reuniones de los lunes lectivos (cuadrante) con el
   orden del día previsto (app Teletrabajo) y tutorías con familias.
 - calendario-familias.ics: días sin cole, vacaciones y trámites con plazo para familias."""
import json, re, datetime, urllib.request, hashlib

BASE = 'https://vunisal706-droid.github.io'
UA = {'User-Agent': 'Agenda ED CEIP Capitulaciones (calendarios)'}
def web(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
            return json.loads(r.read())
    except Exception as ex:
        print('No disponible:', url, ex); return None

CAL = json.load(open('calendario.json', encoding='utf-8'))
CURSOS = CAL.get('cursos') or [CAL]
REU = json.load(open('reuniones.json', encoding='utf-8'))
ORD = (web(f'{BASE}/teletrabajo/ordenes-del-dia.json') or {}).get('organos', {})
TRA = web(f'{BASE}/tablon/tramites.json') or {}
D = datetime.date
MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
NOMBRE_ORG = {'CLAUSTRO':'Claustro','EQUIPO DE ORIENTACIÓN':'Equipo de Orientación','EQUIPOS DE CICLO':'Equipos de ciclo','ETCP':'ETCP','EQUIPOS DOCENTES':'Equipos docentes'}

def curso_de(d):
    ini = d.year if d.month >= 9 else d.year - 1
    return next((c for c in CURSOS if c['inicio'][:4] == str(ini)), None)
def sin_cole(d):
    if d.weekday() >= 5: return True
    c = curso_de(d); s = d.isoformat()
    if not c: return True
    if any(x['fecha'] == s for x in c.get('dias', [])): return True
    if any(p['desde'] <= s <= p['hasta'] for p in c.get('periodos', [])): return True
    return s < c['inicio'] or s > c['fin']

# ---------- utilidades iCalendar ----------
def esc(t): return str(t).replace('\\', '\\\\').replace(';', '\\;').replace(',', '\\,').replace('\n', '\\n')
def plegar(linea):
    b = linea.encode('utf-8'); out = []
    while len(b) > 74:
        corte = 74
        while (b[corte] & 0xC0) == 0x80: corte -= 1
        out.append(b[:corte].decode('utf-8')); b = b' ' + b[corte:]
    out.append(b.decode('utf-8')); return '\r\n'.join(out)
TZ = """BEGIN:VTIMEZONE
TZID:Europe/Madrid
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE"""
SELLO = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
def evento(titulo, inicio, fin=None, hora=None, desc='', clave='', url=''):
    uid = hashlib.md5(f'{clave or titulo}|{inicio}|{hora}'.encode()).hexdigest() + '@capitulaciones'
    L = ['BEGIN:VEVENT', f'UID:{uid}', f'DTSTAMP:{SELLO}', f'SUMMARY:{esc(titulo)}']
    if hora:
        h0, h1 = [x.strip().replace(':', '') + '00' for x in hora.split('-')]
        L += [f'DTSTART;TZID=Europe/Madrid:{inicio:%Y%m%d}T{h0}', f'DTEND;TZID=Europe/Madrid:{inicio:%Y%m%d}T{h1}']
    else:
        L += [f'DTSTART;VALUE=DATE:{inicio:%Y%m%d}', f'DTEND;VALUE=DATE:{(fin or inicio) + datetime.timedelta(days=1):%Y%m%d}', 'TRANSP:TRANSPARENT']
    if desc: L.append(f'DESCRIPTION:{esc(desc)}')
    if url: L.append(f'URL:{url}')
    L.append('END:VEVENT'); return L
def guardar(nombre, titulo, eventos):
    L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CEIP Capitulaciones//Agenda//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
         f'X-WR-CALNAME:{esc(titulo)}', 'X-WR-TIMEZONE:Europe/Madrid', 'REFRESH-INTERVAL;VALUE=DURATION:PT12H', 'X-PUBLISHED-TTL:PT12H'] + TZ.split('\n')
    for e in eventos: L += e
    L.append('END:VCALENDAR')
    open(nombre, 'w', encoding='utf-8', newline='').write('\r\n'.join(plegar(x) for x in L) + '\r\n')
    print(nombre, len(eventos), 'eventos')

# ---------- Días sin cole (común) ----------
sin = []
for c in CURSOS:
    for x in c.get('dias', []):
        sin.append(evento(f"{x.get('emoji','')} Sin cole: {x['nombre']}".strip(), D.fromisoformat(x['fecha']), clave='dia'))
    for p in c.get('periodos', []):
        sin.append(evento(f"{p.get('emoji','')} {p['nombre']}".strip(), D.fromisoformat(p['desde']), D.fromisoformat(p['hasta']), clave='periodo'))
    sin.append(evento('🎒 Primer día de clase', D.fromisoformat(c['inicio']), clave='inicio'))
    sin.append(evento('🎉 Último día de clase', D.fromisoformat(c['fin']), clave='fin'))

# ---------- Reuniones de los lunes lectivos ----------
reu = []
for c in CURSOS:
    d = D.fromisoformat(c['inicio']); fin = D.fromisoformat(c['fin'])
    while d.weekday() != 0: d += datetime.timedelta(days=1)
    cuenta = {}
    while d <= fin:
        if not sin_cole(d):
            k = (d.year, d.month); cuenta[k] = cuenta.get(k, 0) + 1; n = cuenta[k]
            reu.append(evento('Tutorías con familias', d, hora=REU.get('tutorias', '16:00 - 17:00'), clave='tutorias'))
            for r in REU['cuadrante'].get(str(n), []):
                pts = ORD.get(r.get('organo', ''), {}).get(f'{d.month:02d}', [])
                desc = f'{n}.º lunes lectivo de {MES[d.month-1]}.'
                if r.get('nota'): desc += f" {r['nota']}."
                if pts: desc += f"\n\nOrden del día previsto ({NOMBRE_ORG.get(r['organo'], r['organo'])}):\n" + '\n'.join(f'{i}. {p}' for i, p in enumerate(pts, 1))
                if r.get('turnos'):
                    for curso, hora in r['turnos']:
                        reu.append(evento(f"Equipo docente {curso}", d, hora=hora, desc=desc, clave='ed' + curso))
                else:
                    reu.append(evento(r['nombre'], d, hora=r['hora'], desc=desc, clave=r['nombre']))
        d += datetime.timedelta(days=7)

# ---------- Trámites para familias ----------
tra = []
for c in CURSOS:
    y0 = int(c['inicio'][:4])
    for t in TRA.get('anuales', []):
        for y in (y0, y0 + 1):
            a, b = D.fromisoformat(f"{y}-{t['desde']}"), D.fromisoformat(f"{y}-{t['hasta']}")
            if D.fromisoformat(c['inicio']) - datetime.timedelta(days=15) <= a <= D.fromisoformat(f'{y0+1}-08-31'):
                tra.append(evento(f"{t['emoji']} {t['nombre']}", a, b, desc=t.get('detalle', ''), clave='tr' + t['nombre']))
for t in TRA.get('puntuales', []):
    tra.append(evento(f"{t['emoji']} {t['nombre']}", D.fromisoformat(t['fecha']), D.fromisoformat(t.get('fechaFin', t['fecha'])), desc=t.get('detalle', ''), clave='trp' + t['nombre']))

# ---------- Citas puntuales con enlace (eventos.json) ----------
cit = []
try:
    for e in json.load(open('eventos.json', encoding='utf-8')).get('eventos', []):
        desc = e.get('detalle', '') + (f"\n\nEnlace: {e['enlace']}" if e.get('enlace') else '')
        cit.append(evento(e['titulo'], D.fromisoformat(e['fecha']), hora=e.get('hora'), desc=desc, clave='ev' + e['titulo'], url=e.get('enlace', '')))
except FileNotFoundError:
    pass

guardar('calendario-profesorado.ics', 'CEIP Capitulaciones · Profesorado', sin + reu + cit)
guardar('calendario-familias.ics', 'CEIP Capitulaciones · Familias', sin + tra)
