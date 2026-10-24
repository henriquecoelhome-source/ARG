// Gera public/index.html: as respostas e coordenadas ficam criptografadas.
// Cada fase só é descriptografada pela resposta da fase anterior.
const fs = require('fs'), path = require('path');
const { webcrypto } = require('crypto');
const sub = webcrypto.subtle;
const cfg = require('./config.js');

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const enc = new TextEncoder();
const b64 = u8 => Buffer.from(u8).toString('base64');
const hex = buf => Buffer.from(buf).toString('hex');

async function derive(n, k) {
  const base = await sub.importKey('raw', enc.encode(n), 'PBKDF2', false, ['deriveKey']);
  return sub.deriveKey({ name: 'PBKDF2', salt: enc.encode(cfg.salt + ':' + k), iterations: cfg.iterations, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
}
async function tag(n, k) {
  const h = await sub.digest('SHA-256', enc.encode(cfg.salt + '|tag|' + k + '|' + n));
  return hex(h).slice(0, 8);
}
const pub = l => {
  const o = { html: l.html };
  for (const k of ['num', 'cls', 'clean', 'kind', 'data', 'attrs']) if (l[k] !== undefined && l[k] !== '') o[k] = l[k];
  return o;
};

(async () => {
  const L = cfg.levels;
  if (L.length !== 8 || cfg.coords.length !== 8) throw new Error('São necessárias 8 fases e 8 coordenadas.');
  const blobs = [];
  for (let k = 1; k <= 8; k++) {
    const lv = L[k - 1], payload = JSON.stringify({ c: cfg.coords[k - 1], n: k < 8 ? pub(L[k]) : null });
    const seen = new Set(), list = [];
    for (const a of lv.answers) {
      const n = norm(a); if (!n || seen.has(n)) continue; seen.add(n);
      const iv = webcrypto.getRandomValues(new Uint8Array(12));
      const ct = await sub.encrypt({ name: 'AES-GCM', iv }, await derive(n, k), enc.encode(payload));
      list.push({ t: await tag(n, k), i: b64(iv), c: b64(new Uint8Array(ct)) });
    }
    if (!list.length) throw new Error('Fase ' + k + ' sem resposta.');
    blobs.push(list);
  }
  const data = { salt: cfg.salt, it: cfg.iterations, l1: pub(L[0]), b: blobs };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  if (!tpl.includes('/*__DATA__*/{}')) throw new Error('Marcador /*__DATA__*/{} ausente no template.');
  const out = tpl.replace('/*__DATA__*/{}', () => json);
  fs.mkdirSync(path.join(__dirname, 'public', 'assets'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), out);
  console.log('ok: public/index.html (' + (out.length / 1024).toFixed(1) + ' KB)');
})().catch(e => { console.error(e); process.exit(1); });
