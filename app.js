/* Canablue Signature Creator — table-based HTML, 100% email-client compatible */
const $ = id => document.getElementById(id);
const PORTRAIT_PATH = 'assets/agents/';
const PORTRAIT_PUBLIC_SITE = 'https://signaturecanablue.vercel.app/';
const PORTRAIT_SQUARE = 'c_fill,g_auto,w_240,h_240';
const PORTRAIT_FETCH = `https://res.cloudinary.com/ybkuwivn/image/fetch/${PORTRAIT_SQUARE}/`;
const PORTRAIT_BASES = [
  'https://canabluepuntacana.github.io/creador-de-firmas-cana-blue/assets/agents/',
  'https://canabluepuntacana.github.io/signaturecanablue/assets/agents/'
];
function portraitPath(value) {
  const url = String(value || '').trim();
  if (url.startsWith(PORTRAIT_PATH)) return url;
  const base = PORTRAIT_BASES.find(prefix => url.startsWith(prefix));
  return base ? PORTRAIT_PATH + url.slice(base.length) : '';
}
const samePortrait = (left, right) => {
  const a = portraitPath(left).split('?')[0];
  return !!a && a === portraitPath(right).split('?')[0];
};
function signaturePhotoUrl(value) {
  const path = portraitPath(value);
  if (path) return PORTRAIT_FETCH + new URL(path, PORTRAIT_PUBLIC_SITE).href;
  const url = normUrl(value);
  if (!url || url.startsWith('data:')) return url;
  // Email clients can ignore object-fit; send square source pixels instead.
  const ownCloudinary = 'https://res.cloudinary.com/ybkuwivn/image/upload/';
  if (url.startsWith(ownCloudinary)) {
    return url.replace(ownCloudinary, ownCloudinary + PORTRAIT_SQUARE + '/');
  }
  return PORTRAIT_FETCH + url;
}
// Canablue community page (editable per agent, like listings or booking).
const COMMUNITY_DEFAULT = 'https://canablue.com/community/cocotal/';
// Community Expert block: one pill per community page. The editor can rename,
// relink, disable or add more (each row has its own checkbox).
const COMMUNITY_LINKS = [
  { label: 'Palma Real Villas (Cocotal)', url: 'https://canablue.com/community/cocotal/' },
  { label: 'Los Corales, Cortecito', url: 'https://canablue.com/community/el-cortecito/' }
];
const defaultCommunities = () => COMMUNITY_LINKS.map(x => ({ label: x.label, url: x.url, on: true }));
// Agents saved before this existed fall back to the two default communities.
const communitiesOf = a => Array.isArray(a && a.communities) ? a.communities : defaultCommunities();
const activeCommunities = a => communitiesOf(a).filter(c => c && c.on !== false && String(c.label || '').trim());
const state = {
  tpl: 'principal',
  color: '#174176',
  nombre: 'Pamela Núñez', cargo: 'Broker Owner', zona: 'Punta Cana · Cap Cana',
  tel: '+1 (809) 975-3900', email: 'pamela@canablue.com', web: 'canablue.com',
  dir: 'Local P102, Plaza San Juan Shopping Center, Bávaro, Punta Cana',
  dirUrl: 'https://www.google.com/maps/place/Canablue+Real+Estate/data=!4m2!3m1!1s0x0:0x14220523874e3b46?sa=X&ved=1t:2428&ictx=111',
  listings: 'https://canablue.com/author/pamepam/',
  booking: '',
  community: COMMUNITY_DEFAULT,
  communities: defaultCommunities(),
  linkedin: 'https://do.linkedin.com/in/pamela-nunez-0280814a',
  instagram: 'https://www.instagram.com/pamela_canablue.rd',
  whatsapp: 'https://wa.me/18096080943',
  foto: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792087360/Firmas_de_correo_Electronico_pamela.png',
  photoPosition: 'center center',
  logo: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792071937/10._logo-blue-google.png',
  certs: { crs: true, aei: true, realtor: true, sr23: true, sr24: true, lux: false },
  certLinks: { crs: '', aei: '', realtor: '', sr23: '', sr24: '', lux: '' },
  customCerts: [],
  certsAlign: 'center',
  extra: [],
  iconStyle: 'solid',
  vis: { foto: true, social: true, listings: true, booking: true, community: true, qr: true, certs: true, legal: true },
  legal: 'The information in this email is confidential and intended solely for its recipient.'
};
const DEFAULT_LEGAL = 'The information in this email is confidential and intended solely for its recipient.';
const BRAND = { instagram: '#000000', whatsapp: '#25D366', linkedin: '#0A66C2' };
// Single base for the signature icon PNGs. Point this at your own host (e.g. your
// Cloudinary folder) to stop depending on the icons8 CDN — see README.
const ICON_BASE = 'https://img.icons8.com';
const IMG = (set, size, color, name) => `${ICON_BASE}/${set}/${size}/${color}/${name}.png`;
// Logo picker for extra links: official-style white glyph on brand color (email-safe PNG)
const NETWORKS = {
  facebook: { label: 'Facebook', bg: '#1877F2', slug: 'facebook-f', img: IMG('material-outlined', 48, 'ffffff', 'facebook-f') },
  instagram: { label: 'Instagram', bg: '#000000', slug: 'instagram', img: IMG('material-outlined', 48, 'ffffff', 'instagram') },
  whatsapp: { label: 'WhatsApp', bg: '#25D366', slug: 'whatsapp', img: IMG('material-outlined', 48, 'ffffff', 'whatsapp') },
  phone: { label: 'Teléfono Cana Blue', bg: '#174176', slug: 'phone', img: IMG('ios-filled', 50, 'ffffff', 'phone') },
  linkedin: { label: 'LinkedIn', bg: '#0A66C2', slug: 'linkedin', img: IMG('ios-filled', 50, 'ffffff', 'linkedin') },
  x: { label: 'X (Twitter)', bg: '#000000', slug: 'twitterx', img: IMG('material-outlined', 48, 'ffffff', 'twitterx') },
  tiktok: { label: 'TikTok', bg: '#000000', slug: 'tiktok', img: IMG('material-outlined', 48, 'ffffff', 'tiktok') },
  youtube: { label: 'YouTube', bg: '#FF0000', slug: 'youtube-play', img: IMG('material-outlined', 48, 'ffffff', 'youtube-play') },
  telegram: { label: 'Telegram', bg: '#229ED9', slug: 'telegram-app', img: IMG('material-outlined', 48, 'ffffff', 'telegram-app') },
  pinterest: { label: 'Pinterest', bg: '#E60023', slug: 'pinterest', img: IMG('material-outlined', 48, 'ffffff', 'pinterest') },
  website: { label: 'Website / custom link', bg: '#174176', slug: 'link', img: IMG('material-outlined', 48, 'ffffff', 'link') }
};
// Official profiles linked from canablue.com. They appear beside the logo in
// every signature; personal profiles stay with the agent's contact details.
const AGENCY_SOCIALS = [
  ['phone', 'tel:+18099753900'],
  ['whatsapp', 'https://wa.me/18099753900'],
  ['facebook', 'https://www.facebook.com/canablue/'],
  ['instagram', 'https://www.instagram.com/canablue.rd/'],
  ['linkedin', 'https://www.linkedin.com/company/canablue'],
  ['youtube', 'https://www.youtube.com/channel/UCh15GIlCR4JOPznpFpBGong']
];
function agentSocialLinksFor(person) {
  return [
    ['instagram', person.instagram], ['linkedin', person.linkedin],
    ...(person.extra || []).map(e => [e.icon, e.url])
  ].filter(([, url]) => String(url || '').trim());
}
function networkGlyph(n, hex) {
  return IMG(n.slug === 'linkedin' || n.slug === 'phone' ? 'ios-filled' : 'material-outlined', 48, hex, n.slug);
}
// Text coming from the editor goes into HTML: escape it so "&", "<" or a stray
// quote can never break (or corrupt) the generated signature.
const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Tolerate bare domains ("canablue.com") typed into URL fields.
function normUrl(u) {
  const t = String(u == null ? '' : u).trim();
  if (!t) return '';
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(t)) return t;
  return 'https://' + t.replace(/^\/+/, '');
}
// Extra-link button in 3 shapes: circle (solid) / square (solid) / outline (line only, no fill)
// Global social icon style (solid / rounded / outline / frame / line / soft),
// always in official brand colors. Glyphs are thick official-style line logos.
function socialIcon(url, key, style, c, k) {
  const n = NETWORKS[key] || NETWORKS.website;
  const bg = key === 'website' ? c : (n.bg || c);
  const hex = bg.charAt(0) === '#' ? bg.slice(1) : bg;
  const kk = k || 1;
  const box = 'display:inline-block;text-align:center;vertical-align:middle;';
  const im = (src, s, mt) => `<img src="${src}" width="${s}" height="${s}" alt="${n.label}" style="display:inline-block;width:${s}px;height:${s}px;margin-top:${mt}px;border:0;">`;
  if (style === 'rounded') return `<a href="${url}" target="_blank" style="${box}width:${Math.round(24 * kk)}px;height:${Math.round(24 * kk)}px;border-radius:${Math.round(8 * kk)}px;background-color:${bg};">${im(n.img, Math.round(13 * kk), Math.round(5 * kk))}</a>`;
  if (style === 'outline') return `<a href="${url}" target="_blank" style="${box}width:${Math.round(26 * kk)}px;height:${Math.round(26 * kk)}px;border-radius:50%;border:1px solid ${bg};background-color:transparent;">${im(networkGlyph(n, hex), Math.round(16 * kk), Math.round(4 * kk))}</a>`;
  if (style === 'frame') return `<a href="${url}" target="_blank" style="${box}width:${Math.round(26 * kk)}px;height:${Math.round(26 * kk)}px;border-radius:${Math.round(8 * kk)}px;border:1px solid ${bg};background-color:transparent;">${im(networkGlyph(n, hex), Math.round(16 * kk), Math.round(4 * kk))}</a>`;
  if (style === 'line') return `<a href="${url}" target="_blank" style="${box}">${im(networkGlyph(n, hex), Math.round(24 * kk), 0)}</a>`;
  if (style === 'soft') return `<a href="${url}" target="_blank" style="${box}width:${Math.round(26 * kk)}px;height:${Math.round(26 * kk)}px;border-radius:50%;background-color:${hexA(bg, .14)};">${im(networkGlyph(n, hex), Math.round(16 * kk), Math.round(4 * kk))}</a>`;
  return socialBtn(url, bg, n.img, n.label, kk);
}
function extraBtn(e, c, style, k) { return socialIcon(e.url, e.icon, style || 'solid', c, k); }
// Fixed official certification artwork (uploaed to Cloudinary)
const CERT_IMG = {
  crs: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-CRS.png',
  aei: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-AEI.png',
  realtor: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-REALTOR.png',
  sr23: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-Best-of-DR-2023.png',
  sr24: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-Best-of-DR-2024.png',
  lux: 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792088258/cert-Luxury-Homes-Expert.png'
};
const dataCache = {}; // local asset -> dataURL (so the copied signature carries its images)

async function toDataURL(url) {
  if (!url || url.startsWith('http') || url.startsWith('data:')) return url;
  if (dataCache[url]) return dataCache[url];
  try {
    const r = await fetch(url); const b = await r.blob();
    const d = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); });
    dataCache[url] = d; return d;
  } catch { return url; }
}
const cleanHex = h => (h || '#174176').trim();
const hexA = (hex, a) => {
  const h = String(hex || '').replace('#', '');
  const full = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
  const n = parseInt(full, 16) || 0;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
// Modern outline (line) icons, matching the Pamela reference. PNG = email-safe
// (email clients block SVG/Iconify, so brand/official logos ship as PNG images).
const lineIcon = (name, colorHex) => IMG('ios', 50, colorHex.replace('#', ''), name);
const whiteGlyph = name => IMG('ios-filled', 50, 'ffffff', name);

// ---- vCard + QR ------------------------------------------------------------
// The QR encodes a vCard so a scan saves the agent to the phone's contacts.
// Email clients may replace data-URI images with broken MIME attachments, so
// the copied signature references a PNG served by this site's QR endpoint.
const QR_IMAGE_BASE = 'https://signaturecanablue.vercel.app/api/contact-qr?data=';
function vcardText(s) {
  const tel = String(s.tel || '').replace(/[^+\d]/g, '');
  return [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${s.nombre};;;;`, `FN:${s.nombre}`,
    s.cargo ? `TITLE:${s.cargo}` : '', 'ORG:Canablue Real Estate',
    tel ? `TEL;TYPE=CELL:${tel}` : '',
    s.email ? `EMAIL;TYPE=WORK:${s.email}` : '',
    s.web ? `URL:${normUrl(s.web)}` : '',
    s.dir ? `ADR;TYPE=WORK:;;${s.dir};;;;` : '',
    'END:VCARD'
  ].filter(Boolean).join('\r\n');
}
function qrRow(data, align, h) {
  const src = QR_IMAGE_BASE + encodeURIComponent(data);
  const size = h || 92;
  const fs = size > 92 ? 12 : 11;
  const lh = size > 92 ? 16 : 15;
  return `<tr><td align="${align || 'center'}" style="padding-top:12px;"><table cellpadding="0" cellspacing="0" border="0" style="display:inline-block;"><tbody><tr>
<td valign="middle" style="padding-right:10px;"><img src="${src}" width="${size}" height="${size}" alt="Scan to save my contact" style="display:block;width:${size}px;height:${size}px;border:0;"></td>
<td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:${fs}px;line-height:${lh}px;color:#5b6b84;text-align:left;">Scan to save<br>my contact</td>
</tr></tbody></table></td></tr>`;
}

function contactRow(iconUrl, contentHtml, alt, sz) {
  const o = sz || {};
  const ic = o.ic || 15, fs = o.fs || 12, lh = o.lh || 17;
  return `<tr><td width="${ic + 7}" style="vertical-align:middle;padding:3px 0;"><img src="${iconUrl}" width="${ic}" height="${ic}" style="display:block;width:${ic}px;height:${ic}px;" alt="${alt || ''}"></td><td style="vertical-align:middle;font-size:${fs}px;line-height:${lh}px;color:#222222;font-family:Arial,Helvetica,sans-serif;">${contentHtml}</td></tr>`;
}
function socialBtn(href, bg, iconUrl, alt, k) {
  const kk = k || 1, box = Math.round(24 * kk), gly = Math.round(13 * kk), mt = Math.round(5 * kk);
  return `<a href="${href}" target="_blank" style="display:inline-block;width:${box}px;height:${box}px;border-radius:50%;background-color:${bg};text-align:center;vertical-align:middle;"><img src="${iconUrl}" width="${gly}" height="${gly}" alt="${alt}" style="display:inline-block;width:${gly}px;height:${gly}px;margin-top:${mt}px;border:0;"></a>`;
}
// Pill buttons (compact). Filled ones use the brand color; the "Community" button is
// the secondary action: white background, brand border and brand text.
function pillBtn(href, label, glyph, c, variant, opt) {
  if (!href) return '';
  const o = opt || {};
  const fs = o.fs || 11, pad = o.pad || '6px 12px', rad = o.rad || 16, gs = o.gs || 12;
  const base = `display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:${fs}px;font-weight:bold;text-decoration:none;border-radius:${rad}px;padding:${pad};white-space:nowrap;`;
  const img = `<img src="${glyph}" width="${gs}" height="${gs}" alt="" style="display:inline-block;width:${gs}px;height:${gs}px;vertical-align:-${Math.max(1, Math.round(gs / 6))}px;border:0;">&nbsp;${label}`;
  if (variant === 'outline') {
    return `<a href="${href}" target="_blank" style="${base}background-color:#ffffff;color:${c};border:1px solid ${c};">${img}</a>`;
  }
  return `<a href="${href}" target="_blank" style="${base}background-color:${c};color:#ffffff;">${img}</a>`;
}
// Pill button with modern home icon, placed next to the Canablue logo
function viewPropsBtn(listings, c, opt) { return pillBtn(listings, 'View My Listings', whiteGlyph('home'), c, 'filled', opt); }
// Optional second pill: booking / agenda link (Calendly, etc.)
function scheduleBtn(url, c, opt) { return pillBtn(url, 'Schedule a Call', whiteGlyph('calendar'), c, 'filled', opt); }
// Small community page pill for the "Community Expert" block (label only, no icon).
function communityPill(label, url, c, opt) {
  const o = opt || {};
  const fs = o.pfs || 10.5, pad = o.pad || '5px 11px', rad = o.rad || 15;
  const style = `display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:${fs}px;font-weight:bold;text-decoration:none;border-radius:${rad}px;padding:${pad};white-space:nowrap;background-color:#ffffff;color:${c};border:1px solid ${c};`;
  return url ? `<a href="${url}" target="_blank" style="${style}">${label}</a>`
    : `<span style="${style}border-style:dashed;" title="Community page pending">${label}</span>`;
}
// Logos only, no heading label
const CERT_DEFS = [
  ['crs', 'CRS'], ['aei', 'AEI'], ['realtor', 'REALTOR'],
  ['sr23', 'Best of DR 2023'], ['sr24', 'Best of DR 2024'], ['lux', 'Luxury Homes Expert']
];
function certImgTag(src, alt, link, h) {
  const img = `<img src="${src}" height="${h}" style="height:${h}px;width:auto;display:inline-block;border:0;" alt="${alt}">`;
  return link ? `<a href="${link}" target="_blank" style="text-decoration:none;border:0;">${img}</a>` : img;
}
function certImgs(certs, links, customs, h) {
  const out = CERT_DEFS.filter(([k]) => certs[k])
    .map(([k, alt]) => certImgTag(CERT_IMG[k], alt, links[k], h));
  (customs || []).filter(x => x.img).forEach(x => out.push(certImgTag(x.img, 'Certification', x.link, h)));
  return out;
}
function certsRow(certs, links, customs, vis, align, h) {
  if (!vis.certs) return '';
  const imgs = certImgs(certs, links, customs, h || 26);
  if (!imgs.length) return '';
  return `<tr><td align="${align || 'center'}" style="padding-top:12px;"><div>${imgs.join(' ')}</div></td></tr>`;
}
/* Extra links render as social circles appended to `socials` (see above). */

async function buildHTML() {
  const raw = state, c = cleanHex(raw.color);
  const photoPosition = raw.photoPosition === 'center top' ? 'center top' : 'center center';
  // Shallow copy used by every template below: plain-text fields are HTML-escaped
  // and URL fields normalized, so the interpolation further down is always safe.
  const s = {
    ...raw,
    nombre: esc(raw.nombre), cargo: esc(raw.cargo),
    tel: esc(raw.tel), email: esc(raw.email), web: esc(raw.web),
    dir: esc(raw.dir), legal: esc(raw.legal),
    dirUrl: normUrl(raw.dirUrl), listings: normUrl(raw.listings), booking: normUrl(raw.booking),
    community: normUrl(raw.community),
    instagram: normUrl(raw.instagram), whatsapp: normUrl(raw.whatsapp), linkedin: normUrl(raw.linkedin),
    foto: signaturePhotoUrl(raw.foto), logo: normUrl(raw.logo),
    extra: (raw.extra || []).map(e => ({ ...e, url: normUrl(e.url) })),
    certLinks: Object.fromEntries(Object.entries(raw.certLinks || {}).map(([k, v]) => [k, normUrl(v)])),
    customCerts: (raw.customCerts || []).map(x => ({ img: normUrl(x.img), link: normUrl(x.link) }))
  };
  const logoUrl = await toDataURL(s.logo);
  const whatsappDigits = String(raw.tel || '').replace(/\D/g, '');
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : s.whatsapp;
  const webHref = normUrl(raw.web) || '#';
  const fotoCell = (size) => s.vis.foto && s.foto
    ? `<div style="text-align:center;"><img src="${s.foto}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;object-position:${photoPosition};display:inline-block;border:3px solid ${c}22;" alt="${s.nombre}"></div>` : '';

  // The visible personal number opens WhatsApp; the address stays last.
  const contactRows = (sz) => [
    whatsappHref && contactRow(lineIcon('whatsapp', c), `<a href="${whatsappHref}" target="_blank" style="color:#222;text-decoration:none;">${s.tel || 'Escribir por WhatsApp'}</a>`, 'WhatsApp', sz),
    s.email && contactRow(lineIcon('new-post', c), `<a href="mailto:${s.email}" style="color:#222;text-decoration:none;">${s.email}</a>`, 'Email', sz),
    s.web && contactRow(lineIcon('domain', c), `<a href="${webHref}" style="color:#222;text-decoration:none;">${s.web}</a>`, 'Website', sz)
  ].filter(Boolean).join('');
  const addressRow = (sz) => s.dir ? contactRow(lineIcon('marker', c), s.dirUrl ? `<a href="${s.dirUrl}" target="_blank" style="color:#222;text-decoration:none;">${s.dir}</a>` : `<span>${s.dir}</span>`, 'Address', sz) : '';

  // Personal profiles live with contact details; company profiles stay by the logo.
  const ist = s.iconStyle || 'solid';
  const cal = ['left', 'center', 'right'].includes(s.certsAlign) ? s.certsAlign : 'center';
  const agencySocials = (k) => !s.vis.social ? '' : AGENCY_SOCIALS
    .map(([network, url]) => socialIcon(url, network, ist, c, Math.min(k || 1, 0.95))).join(' ');
  const agentSocialRows = (sz) => !s.vis.social ? '' : agentSocialLinksFor(s).map(([network, url]) => {
    let label = NETWORKS[network]?.label || 'Perfil';
    if (network === 'instagram') {
      try { label = '@' + decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop()); } catch {}
    } else if (network === 'linkedin') label = 'LinkedIn';
    const href = normUrl(url);
    const icon = network === 'linkedin' ? IMG('ios-filled', 50, c.replace('#', ''), 'linkedin') : lineIcon(NETWORKS[network]?.slug || 'link', c);
    return contactRow(icon,
      `<a href="${href}" target="_blank" style="color:#222;text-decoration:none;">${esc(label)}</a>`, label, sz);
  }).join('');
  const contactTable = (sz) => `<table cellpadding="0" cellspacing="0" border="0">${contactRows(sz)}${agentSocialRows(sz)}${addressRow(sz)}</table>`;
  const socials = agencySocials();

  const legalHtml = (sz, span) => s.vis.legal && s.legal
    ? `<tr><td${span ? ` colspan="${span}"` : ''} align="center" style="padding:16px 14px 0;font-size:${(sz && sz.fs) || 10}px;line-height:${(sz && sz.lh) || 14}px;color:#8a94a8;text-align:center;font-family:Arial,Helvetica,sans-serif;">${s.legal}</td></tr>` : '';
  // Action pills (listings + optional booking). The community links live on their own
  // "Community Expert:" line in every template, so they are no longer a pill here.
  const actionPills = (opt) => {
    const pills = [];
    if (s.vis.listings && s.listings) pills.push(viewPropsBtn(s.listings, c, opt));
    if (s.vis.booking && s.booking) pills.push(scheduleBtn(s.booking, c, opt));
    return pills.join('&nbsp;');
  };
  const viewBtn = actionPills();
  // "Community Expert:" + one smaller pill per active community. The inline variant
  // keeps the label and the pills on one centred line; the stacked one puts the pills
  // under the label for narrow columns (phone, Dark Sidebar).
  const commList = s.vis.community ? activeCommunities(s) : [];
  const communityExpertHtml = (opt, stacked) => {
    if (!commList.length) return '';
    const o = opt || {};
    // Joined with a normal space: with three or more pills the row can wrap instead
    // of pushing past the 600 px signature.
    const links = commList.map(x => communityPill(esc(x.label || 'Community'), normUrl(x.url), c, o)).join(' ');
    const label = `<span style="font-family:Arial,Helvetica,sans-serif;font-size:${o.fs || 12}px;font-weight:bold;color:#5b6b84;white-space:nowrap;">Community Expert:</span>`;
    if (stacked) return `<div>${label}</div><div style="padding-top:6px;">${links}</div>`;
    return `${label}&nbsp;${links}`;
  };
  // Full-width row used by the seven compact templates.
  const communityLine = (opt, stacked, span) => commList.length
    ? `<tr><td${span ? ` colspan="${span}"` : ''} align="center" style="padding-top:12px;">${communityExpertHtml(opt, stacked)}</td></tr>` : '';

  const certs = certsRow(s.certs, s.certLinks, s.customCerts, s.vis, s.certsAlign);
  const qr = (s.vis.qr && raw) ? qrRow(vcardText(raw), cal) : '';
  // The Main template runs one notch larger: its 600 px row has room to breathe.
  const MAIN_SZ = {
    photo: 118, photoCell: 132,
    name: 18.5, nameLh: 24, role: 13,
    contact: { ic: 17, fs: 12.5, lh: 18 },
    logo: 140,
    pill: { fs: 12, pad: '7px 14px', rad: 17, gs: 13 },
    socialK: 1.12, certH: 29, qrH: 104,
    legal: { fs: 10.5, lh: 15 },
    community: { fs: 13, pfs: 10.5, pad: '5px 11px', rad: 15 },
    communityMob: { fs: 12.5, pfs: 10, pad: '5px 9px', rad: 14 }
  };
  const mainCertImgs = s.vis.certs ? certImgs(s.certs, s.certLinks, s.customCerts, 25) : [];
  // Three or more badges need the portrait width on phones, as in Pamela's signature.
  const photoCertsOnMobile = s.vis.foto && !!s.foto && mainCertImgs.length > 2;
  const mainCertsHtml = mainCertImgs.length
    ? `<div${photoCertsOnMobile ? ' class="cb-cert-role"' : ''} style="padding-top:7px;line-height:0;max-width:150px;">${mainCertImgs.join('')}</div>`
    : '';
  const photoCertsHtml = photoCertsOnMobile
    ? `<div class="cb-cert-photo" style="display:none;padding-top:5px;text-align:center;white-space:nowrap;line-height:0;">${certImgs(s.certs, s.certLinks, s.customCerts, 29).join('')}</div>`
    : '';
  // Compact templates: the same block one notch smaller so it fits their 600 px row.
  const COMM_SZ = { fs: 11.5, pfs: 9, pad: '4px 7px', rad: 12 };
  const COMM_SZ_STACK = { fs: 11, pfs: 9, pad: '4px 7px', rad: 12 };

  if (s.tpl === 'broker') {
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody>
<tr><td width="200" valign="middle" style="text-align:center;padding-right:10px;">${fotoCell(110)}
<div style="font-size:16px;font-weight:bold;color:#111;margin-top:10px;line-height:20px;">${s.nombre}</div>
<div style="font-size:12px;color:#555;">${s.cargo}</div></td>
<td width="1" style="background-color:${c};width:1px;font-size:0;">&nbsp;</td><td width="20"></td>
<td valign="top">${contactTable()}</td></tr>
<tr><td colspan="4"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px;border-top:1px solid ${c};"><tbody><tr>
<td valign="middle" align="${cal}" style="padding-top:12px;">${s.vis.certs ? certImgs(s.certs, s.certLinks, s.customCerts, 26).join(' ') : ''}</td>
<td align="right" valign="middle" style="padding-top:12px;"><img src="${logoUrl}" width="130" style="width:130px;max-width:130px;display:inline-block;" alt="Canablue"><div style="padding-top:8px;">${viewBtn}</div><div style="padding-top:8px;">${socials}</div></td>
</tr></tbody></table></td></tr>${communityLine(COMM_SZ, false, 4)}${qr}${legalHtml(null, 4)}</tbody></table>`;
  }
  if (s.tpl === 'moderna') {
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody>
<tr><td style="background-color:${c};border-radius:10px 10px 0 0;padding:18px 22px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr>
<td valign="middle" align="center" style="text-align:center;"><div style="color:#ffffff;font-size:19px;font-weight:bold;line-height:24px;">${s.nombre}</div><div style="color:#d7e1f2;font-size:12.5px;line-height:17px;">${s.cargo}</div></td>
<td width="90" align="right" valign="middle">${s.vis.foto ? `<img src="${s.foto}" width="76" height="76" style="width:76px;height:76px;border-radius:50%;border:3px solid #ffffff;display:inline-block;" alt="">` : ''}</td>
</tr></tbody></table></td></tr>
<tr><td style="border:1px solid #e3e8f0;border-top:0;border-radius:0 0 10px 10px;padding:16px 22px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr>
<td valign="top" width="55%">${contactTable()}</td>
<td valign="top" align="right"><img src="${logoUrl}" width="125" style="width:125px;display:inline-block;" alt="Canablue"><div style="margin-top:10px;">${viewBtn}</div><div style="margin-top:10px;">${socials}</div></td>
</tr></tbody></table><table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ)}${certs}${qr}</table></td></tr>${legalHtml()}</tbody></table>`;
  }
  if (s.tpl === 'banner') {
    const sqPhoto = s.vis.foto ? `<img src="${s.foto}" width="84" height="84" style="width:84px;height:84px;border-radius:50%;object-fit:cover;object-position:${photoPosition};display:block;border:3px solid #ffffff;" alt="${s.nombre}">` : '';
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody>
<tr><td style="background-color:${c};border-radius:10px 10px 0 0;padding:20px 22px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr>
<td width="100" valign="middle">${sqPhoto}</td>
<td valign="middle" align="center" style="text-align:center;"><div style="color:#ffffff;font-size:21px;font-weight:bold;line-height:25px;">${s.nombre}</div><div style="color:#d7e1f2;font-size:12.5px;line-height:17px;margin-top:3px;">${s.cargo}</div></td>
</tr></tbody></table></td></tr>
<tr><td style="border:1px solid #e3e8f0;border-top:0;padding:18px 22px 6px;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr>
<td valign="top" width="56%">${contactTable()}</td>
<td valign="middle" align="center"><div>${viewBtn}</div><div style="margin-top:12px;"><img src="${logoUrl}" width="115" style="width:115px;display:inline-block;" alt="Canablue"></div><div style="margin-top:10px;">${socials}</div></td>
</tr></tbody></table></td></tr>
<tr><td style="border:1px solid #e3e8f0;border-top:0;border-radius:0 0 10px 10px;padding:0 22px 18px;"><div style="border-top:1px solid ${c};font-size:0;line-height:0;">&nbsp;</div><table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ)}${certs}${qr}</table></td></tr>
${legalHtml()}</tbody></table>`;
  }
  if (s.tpl === 'sidebar') {
    const sidePhoto = s.vis.foto ? `<img src="${s.foto}" width="88" height="88" style="width:88px;height:88px;border-radius:50%;object-fit:cover;object-position:${photoPosition};display:inline-block;border:3px solid #ffffff;" alt="${s.nombre}">` : '';
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody><tr>
<td width="190" valign="top" align="center" style="background-color:${c};border-radius:10px 0 0 10px;padding:24px 16px;">${sidePhoto}
<div style="color:#ffffff;font-size:16px;font-weight:bold;margin-top:12px;line-height:20px;">${s.nombre}</div>
<div style="color:#d7e1f2;font-size:12px;margin-top:2px;">${s.cargo}</div></td>
<td valign="top" style="border:1px solid #e3e8f0;border-left:0;border-radius:0 10px 10px 0;padding:20px 22px;">
${contactTable()}
<div style="margin-top:12px;">${viewBtn}</div>
<div style="margin-top:14px;"><img src="${logoUrl}" width="120" style="width:120px;display:inline-block;" alt="Canablue"></div>
<div style="margin-top:10px;">${socials}</div>
<table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ_STACK, true)}${certs}${qr}</table></td>
</tr>${legalHtml(null, 2)}</tbody></table>`;
  }
  if (s.tpl === 'photo-left') {
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody><tr>
<td width="150" valign="top" align="center">${fotoCell(110)}
<div style="margin-top:12px;"><img src="${logoUrl}" width="110" style="width:110px;display:inline-block;" alt="Canablue"></div>
<div style="margin-top:10px;">${socials}</div></td>
<td width="24"></td>
<td valign="top"><div style="text-align:center;"><div style="font-size:17px;font-weight:700;color:#111;line-height:22px;">${s.nombre}</div><div style="font-size:12px;color:#111;line-height:17px;">${s.cargo}</div></div>
<div style="border-top:1px solid ${c};font-size:0;line-height:0;margin:10px 0;">&nbsp;</div>
${contactTable()}
<div style="margin-top:10px;">${viewBtn}</div></td>
</tr>
<tr><td colspan="3"><table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ)}${certs}${qr}</table></td></tr>
${legalHtml(null, 3)}</tbody></table>`;
  }
  if (s.tpl === 'photo-top') {
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody>
<tr><td align="center">${fotoCell(120)}</td></tr>
<tr><td align="center" style="padding-top:10px;"><div style="font-size:19px;font-weight:bold;color:#111;line-height:24px;">${s.nombre}</div><div style="font-size:12.5px;color:#555;margin-top:2px;">${s.cargo}</div></td></tr>
<tr><td style="padding:12px 0;"><div style="border-top:1px solid ${c};font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr><td><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr>
<td valign="top">${contactTable()}<div style="margin-top:10px;">${viewBtn}</div></td>
<td valign="top" align="right"><img src="${logoUrl}" width="130" style="width:130px;display:inline-block;" alt="Canablue"><div style="margin-top:10px;">${socials}</div></td>
</tr></tbody></table></td></tr>
<tr><td><table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ)}${certs}${qr}</table></td></tr>
<tr><td style="padding-top:12px;"><div style="border-top:1px solid ${c};font-size:0;line-height:0;">&nbsp;</div></td></tr>
${legalHtml()}</tbody></table>`;
  }
  if (s.tpl === 'photo-right') {
    return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody><tr>
<td valign="top"><div style="text-align:center;"><div style="font-size:17px;font-weight:700;color:#111;line-height:22px;">${s.nombre}</div><div style="font-size:12px;color:#111;line-height:17px;">${s.cargo}</div></div>
<div style="border-top:1px solid ${c};font-size:0;line-height:0;margin:10px 0;">&nbsp;</div>
${contactTable()}
<div style="margin-top:10px;">${viewBtn}</div></td>
<td width="24"></td>
<td width="170" valign="top" align="center">${fotoCell(120)}
<div style="margin-top:12px;"><img src="${logoUrl}" width="120" style="width:120px;display:inline-block;" alt="Canablue"></div>
<div style="margin-top:10px;">${socials}</div></td>
</tr>
<tr><td colspan="3"><table cellpadding="0" cellspacing="0" border="0" width="100%">${communityLine(COMM_SZ)}${certs}${qr}</table></td></tr>
${legalHtml(null, 3)}</tbody></table>`;
  }
  // Main template.
  // The bottom row ships in two variants: on desktop the buttons sit in the
  // centre of the logo row (logo | buttons | socials); on a phone they drop to
  // their own centred line under the logo. The <style> block swaps them below
  // 480 px. Outlook desktop ignores media queries and keeps the desktop row —
  // the mobile rows are hidden inline, so they never show up twice.
  return `<style>@media only screen and (max-width:480px){.cb-desk{display:none !important}.cb-mob{display:table-row !important}.cb-name{white-space:normal !important}.cb-cert-role{display:none !important}.cb-cert-photo{display:block !important}}</style><table cellpadding="0" cellspacing="0" border="0" width="600" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;"><tbody>
<tr><td><table cellpadding="0" cellspacing="0" border="0"><tbody><tr>
${s.vis.foto && s.foto ? `<td width="${MAIN_SZ.photoCell}" valign="middle">${fotoCell(MAIN_SZ.photo)}${photoCertsHtml}</td>` : ''}
<td valign="middle" align="left" style="text-align:left;"><div class="cb-name" style="font-size:${MAIN_SZ.name}px;font-weight:700;color:#111;line-height:${MAIN_SZ.nameLh}px;white-space:nowrap;">${s.nombre}</div><div style="font-size:${MAIN_SZ.role}px;line-height:17px;color:#111;max-width:220px;white-space:normal;text-align:left;">${s.cargo}</div>${mainCertsHtml}</td>
<td width="20"></td><td width="1" style="border-left:1px solid ${c};font-size:0;">&nbsp;</td><td width="20"></td>
<td valign="middle">${contactTable(MAIN_SZ.contact)}</td>
</tr></tbody></table></td></tr>
<tr><td style="padding:14px 0 0;"><div style="border-top:1px solid ${c};font-size:0;line-height:0;max-width:100%;">&nbsp;</div></td></tr>
<tr class="cb-desk"><td><table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:100%;table-layout:fixed;"><tbody><tr>
<td width="25%" valign="middle"><img src="${logoUrl}" width="${MAIN_SZ.logo}" style="width:${MAIN_SZ.logo}px;max-width:${MAIN_SZ.logo}px;display:block;" alt="Canablue"></td>
<td width="42%" align="center" valign="middle" style="min-width:96px;">${actionPills(MAIN_SZ.pill)}</td>
<td width="33%" align="right" valign="middle" style="min-width:96px;">${agencySocials(MAIN_SZ.socialK)}</td></tr></tbody></table></td></tr>
<tr class="cb-desk"><td align="center" style="padding-top:10px;">${communityExpertHtml(MAIN_SZ.community)}</td></tr>
<tr class="cb-mob" style="display:none;"><td><table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:100%;table-layout:fixed;"><tbody><tr>
<td width="40%" valign="middle"><img src="${logoUrl}" width="110" style="width:110px;max-width:100%;display:block;" alt="Canablue"></td>
<td width="60%" align="right" valign="middle" style="white-space:nowrap;">${agencySocials(0.85)}</td></tr></tbody></table></td></tr>
<tr class="cb-mob" style="display:none;"><td align="center" style="padding-top:14px;">${actionPills(MAIN_SZ.pill)}</td></tr>
<tr class="cb-mob" style="display:none;"><td align="center" style="padding-top:10px;">${communityExpertHtml(MAIN_SZ.communityMob, true)}</td></tr>
${(s.vis.qr && raw) ? qrRow(vcardText(raw), cal, MAIN_SZ.qrH) : ''}${legalHtml(MAIN_SZ.legal)}</tbody></table>`;
}

// ---- Template thumbnails ----------------------------------------------------------
// Wireframes, not renders: no names, no photos, no brand colours. What IS faithful is
// the DISTRIBUTION — same columns, same row order and the same relative widths as the
// templates in buildHTML(), so the layout you pick is the layout you get.
// Every size is written in cqw (1 cqw = 1% of the card = 6 px of the real 600 px
// signature), so the miniature keeps those proportions at any card width.
const TPLS = [
  ['principal', 'Main'], ['broker', 'Broker'], ['moderna', 'Compact'], ['banner', 'Banner'],
  ['sidebar', 'Dark Sidebar'], ['photo-left', 'Photo Left'], ['photo-top', 'Photo Top'], ['photo-right', 'Photo Right']
];
const SK_CLASS = { moderna: 'bleed', banner: 'bleed', sidebar: 'split' };
const q = px => (px / 6).toFixed(2) + 'cqw';
const skBar = (w, cls) => `<i class="bar${cls ? ' ' + cls : ''}" style="width:${w}%"></i>`;
const skPhoto = px => `<span class="ph" style="width:${q(px)};height:${q(px)}"></span>`;
const skLogo = px => `<span class="logo" style="width:${q(px)};height:${q(26)}"></span>`;
const skPill = (px, cls) => `<span class="pill${cls ? ' ' + cls : ''}" style="width:${q(px)}"></span>`;
// What the current agent actually shows, so the thumbnails do not promise rows that
// the signature will not print (empty URL, toggle off, no photo...).
function skFlags() {
  const v = state.vis || {};
  const agentSocials = agentSocialLinksFor(state).length;
  const certs = CERT_DEFS.filter(([k]) => state.certs && state.certs[k]).length
    + (state.customCerts || []).filter(x => x && x.img).length;
  return {
    photo: !!v.foto && !!String(state.foto || '').trim(),
    socials: v.social ? AGENCY_SOCIALS.length : 0,
    agentSocials: v.social ? Math.min(agentSocials, 6) : 0,
    certs: v.certs ? Math.min(certs, 8) : 0,
    legal: !!v.legal,
    qr: !!v.qr,
    listings: !!v.listings && !!String(state.listings || '').trim(),
    booking: !!v.booking && !!String(state.booking || '').trim(),
    community: !!v.community && activeCommunities(state).length > 0,
    align: ['left', 'center', 'right'].includes(state.certsAlign) ? state.certsAlign : 'center'
  };
}
function skelFor(tpl, f) {
  const name = dark => skBar(58, dark && 'wh') + skBar(34, dark ? 'whs' : 'sm');
  const contacts = () => [84, 62, 72, 55, ...Array(f.agentSocials).fill(62)]
    .map(w => `<span class="crow"><i class="cico"></i>${skBar(w)}</span>`).join('');
  const photo = px => f.photo ? skPhoto(px) : '';
  // One ghost pill per active community, as wide as its label really is.
  const comm = () => {
    if (!f.community) return '';
    const list = activeCommunities(state).slice(0, 4);
    if (!list.length) return '';
    const pills = list.map(c => skPill(Math.max(58, Math.min(178, String(c.label || '').length * 5.4 + 20)), 'ghost')).join('');
    return `<span class="skrow tight" style="justify-content:center;padding-top:1.4cqw"><i class="bar sm" style="width:${q(96)}"></i>${pills}</span>`;
  };
  const pills = (style = '') => `<span class="skrow tight"${style ? ` style="${style}"` : ''}>${f.listings ? skPill(136) : ''}${f.booking ? skPill(122) : ''}</span>`;
  const social = () => f.socials ? `<span class="dots">${'<i></i>'.repeat(f.socials)}</span>` : '';
  const certs = (underRole = false) => f.certs ? `<span class="certs" style="justify-content:${underRole ? 'flex-start' : f.align}">${'<i></i>'.repeat(f.certs)}</span>` : '';
  const legal = () => f.legal ? `<span class="lg">${skBar(58, 'sm')}${skBar(40, 'sm')}</span>` : '';
  const qr = () => f.qr ? `<span class="qwrap"><span class="qr"></span><span class="lg">${skBar(90, 'sm')}${skBar(60, 'sm')}</span></span>` : '';
  if (tpl === 'broker') return `
<span class="skrow" style="align-items:stretch">
  <span class="col colc" style="width:33.3%">${photo(110)}${name()}</span>
  <i class="vline"></i>
  <span class="col" style="flex:1">${contacts()}</span>
</span>
<i class="hline"></i>
<span class="skrow between" style="align-items:center">
  ${certs()}
  <span class="col colr">${skLogo(130)}${pills()}${social()}</span>
</span>
${comm()}${qr()}${legal()}`;
  if (tpl === 'moderna') return `
<span class="band">
  <span class="skrow between">
    <span class="col" style="flex:1">${name(true)}</span>
    ${photo(76)}
  </span>
</span>
<span class="body">
  <span class="skrow" style="align-items:flex-start">
    <span class="col" style="width:55%">${contacts()}</span>
    <span class="col colr" style="flex:1">${skLogo(125)}${pills()}${social()}</span>
  </span>
  ${comm()}${certs()}${qr()}${legal()}
</span>`;
  if (tpl === 'banner') return `
<span class="band">
  <span class="skrow">
    ${photo(84)}
    <span class="col" style="flex:1">${name(true)}</span>
  </span>
</span>
<span class="body">
  <span class="skrow" style="align-items:flex-start">
    <span class="col" style="width:56%">${contacts()}</span>
    <span class="col colc" style="flex:1">${pills()}${social()}${skLogo(115)}</span>
  </span>
</span>
<span class="foot">
  <i class="hline"></i>
  ${comm()}${certs()}${qr()}${legal()}
</span>`;
  if (tpl === 'sidebar') return `
<span class="side">
  ${photo(88)}
  <span class="col colc" style="width:100%">${name(true)}</span>
  ${social()}
</span>
<span class="panel">
  ${contacts()}
  ${pills()}
  ${skLogo(120)}
  ${comm()}${certs()}${qr()}${legal()}
</span>`;
  if (tpl === 'photo-left') return `
<span class="skrow" style="align-items:flex-start">
  <span class="col colc" style="width:25%">${photo(110)}${skLogo(110)}${social()}</span>
  <span class="col" style="flex:1;gap:1.6cqw">
    ${name()}
    <i class="hline"></i>
    ${contacts()}
    ${pills()}
  </span>
</span>
${comm()}${certs()}${qr()}${legal()}`;
  if (tpl === 'photo-top') return `
<span class="col colc" style="width:100%">${photo(120)}${name()}</span>
<i class="hline"></i>
<span class="skrow" style="align-items:flex-start">
  <span class="col" style="flex:1">${contacts()}${pills()}</span>
  <span class="col colr" style="flex:1">${skLogo(130)}${social()}</span>
</span>
${comm()}${certs()}${qr()}${legal()}
<i class="hline"></i>`;
  if (tpl === 'photo-right') return `
<span class="skrow" style="align-items:flex-start">
  <span class="col" style="flex:1;gap:1.6cqw">
    ${name()}
    <i class="hline"></i>
    ${contacts()}
    ${pills()}
  </span>
  <span class="col colc" style="width:28.3%">${photo(120)}${skLogo(120)}${social()}</span>
</span>
${comm()}${certs()}${qr()}${legal()}`;
  return `
<span class="skrow" style="align-items:stretch">
  <span class="col colc" style="width:23%">${photo(118)}</span>
  <span class="col" style="flex:1">${name()}${certs(true)}</span>
  <i class="vline"></i>
  <span class="col" style="width:32%">${contacts()}</span>
</span>
<i class="hline"></i>
<span class="skrow">
  <span class="col" style="width:25%">${skLogo(140)}</span>
  <span class="col colc" style="width:42%"><span class="skrow tight" style="justify-content:center">${f.listings ? skPill(141) : ''}${f.booking ? skPill(122) : ''}</span></span>
  <span class="col colr" style="width:33%">${social()}</span>
</span>
${comm()}${qr()}${legal()}`;
}
let skKey = '';
function renderSkels(force) {
  const grid = $('tplGrid');
  if (!grid) return;
  const f = skFlags();
  // The community pills are drawn from the agent's own list, so their labels are part
  // of the cache key: renaming or adding one must repaint the thumbnails too.
  const comms = activeCommunities(state).map(c => [c.label, c.url]);
  const key = JSON.stringify([state.tpl, f, comms]);
  if (!force && key === skKey) return;
  skKey = key;
  grid.innerHTML = TPLS.map(([tpl, label]) => {
    const on = tpl === state.tpl;
    return `<button type="button" data-tpl="${tpl}" class="tpl${on ? ' active' : ''}" aria-pressed="${on}" title="${label}"><span class="sk${SK_CLASS[tpl] ? ' ' + SK_CLASS[tpl] : ''}">${skelFor(tpl, f)}</span><span class="tname">${label}</span></button>`;
  }).join('');
}
renderSkels(true);

async function render() {
  syncStateFromInputs();
  renderSkels();
  const html = await buildHTML();
  // The preview must not run the signature's own media query (the browser window
  // is not a phone): the app simulates the mobile layout with its own CSS.
  $('sigPreview').innerHTML = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  // The copied signature uses public image URLs. Before publication, preview the
  // extracted portraits from this checkout so every agent can be checked locally.
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    $('sigPreview').querySelectorAll('img').forEach(img => {
      const path = portraitPath(img.src);
      if (path) img.src = path;
    });
  }
  fitPreview();
  $('codeText').textContent = html;
  updateStats(html);
  autosave();
  return html;
}
// Live weight of the copied HTML: Gmail clips signatures over ~102 KB.
function updateStats(html) {
  const chip = $('sizeChip');
  if (!chip) return;
  const kb = new Blob([html]).size / 1024;
  chip.textContent = kb.toFixed(1) + ' KB';
  chip.classList.toggle('warn', kb >= 100);
}
let isDirty = false;
function setDirty(on) { isDirty = !!on; const d = $('dirtyChip'); if (d) d.hidden = !on; }
function markDirty() { setDirty(true); render(); }
function syncStateFromInputs() {
  state.color = $('fColor').value || '#174176'; $('fColorHex').value = state.color.toUpperCase();
  state.nombre = $('fNombre').value; state.cargo = $('fCargo').value;
  state.tel = $('fTel').value; state.email = $('fEmail').value; state.web = $('fWeb').value; state.dir = $('fDir').value; state.dirUrl = $('fDirUrl').value;
  state.listings = $('fListings').value; state.linkedin = $('fLinkedin').value;
  state.booking = $('fBooking').value;
  state.instagram = $('fInstagram').value; state.whatsapp = $('fWhatsapp').value;
  state.foto = $('fFoto').value; state.logo = $('fLogo').value;
  state.certs = { crs: $('cCRS').checked, aei: $('cAEI').checked, realtor: $('cRealtor').checked, sr23: $('cSR23').checked, sr24: $('cSR24').checked, lux: $('cLux').checked };
  state.certLinks = { crs: $('fLinkCRS').value, aei: $('fLinkAEI').value, realtor: $('fLinkRealtor').value, sr23: $('fLinkSR23').value, sr24: $('fLinkSR24').value, lux: $('fLinkLux').value };
  state.customCerts = [...document.querySelectorAll('#customCerts .xlink')].map(r => { const i = r.querySelectorAll('input'); return { img: i[0].value, link: i[1].value }; }).filter(x => x.img || x.link);
  state.vis = { foto: $('vFoto').checked, social: $('vSocial').checked, listings: $('vListings').checked, booking: $('vBooking').checked, community: $('vCommunity').checked, qr: $('vQr').checked, certs: $('vCerts').checked, legal: $('vLegal').checked };
  state.legal = $('fLegal').value;
  document.querySelectorAll('#tplGrid .tpl').forEach(b => b.classList.toggle('active', b.dataset.tpl === state.tpl));
}
// Toast: semantic variants (ok / err / info) with a filled icon and aria-live.
const TOAST_ICON = {
  ok: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-4.3-4.3 1.4-1.4 2.9 2.9 5.4-5.4 1.4 1.4-6.8 6.8Z',
  err: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z'
};
function toast(msg, kind = 'ok') {
  const t = $('toast');
  if (!t) return;
  t.dataset.kind = kind;
  const p = t.querySelector('path');
  if (p) p.setAttribute('d', TOAST_ICON[kind] || TOAST_ICON.ok);
  const tx = $('toastText');
  if (tx) tx.textContent = msg; else t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
// Visual confirmation on the copy buttons themselves (not only the toast).
function flashCopied(btn) {
  if (!btn) return;
  const original = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = '<iconify-icon icon="mdi:check"></iconify-icon> Copied';
  clearTimeout(btn._t);
  btn._t = setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 2000);
}

async function copyRich() {
  const html = await render();
  const text = `${state.nombre} · ${state.cargo}\n${state.tel} · ${state.email} · ${state.web}\nLinkedIn: ${state.linkedin}${state.listings ? '\nView My Listings: ' + state.listings : ''}`;
  try {
    const item = new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) });
    await navigator.clipboard.write([item]);
    flashCopied($('btnCopyRich'));
    toast('Signature copied. Paste it with Ctrl+V into your email.');
  } catch {
    const w = window.open('', '_blank', 'width=700,height=500'); w.document.write(html); w.document.close(); w.focus();
    w.getSelection().selectAllChildren(w.document.body); w.document.execCommand('copy');
    toast('Manual copy: press Ctrl+C in the opened window.');
  }
}
async function copyHtml() { const html = await render(); await navigator.clipboard.writeText(html); flashCopied($('btnCopyHtml')); toast('HTML code copied.'); }
// Standalone vCard, handy for a phone or for sharing the contact directly.
function downloadVcf() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([vcardText(state)], { type: 'text/vcard' }));
  a.download = slug(state.nombre) + '.vcf';
  a.click();
  toast('Contact file downloaded — open it to save the agent to your phone.');
}
async function download() {
  const html = await render();
  const full = `<!DOCTYPE html><html><body>${html}</body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([full], { type: 'text/html' }));
  a.download = 'signature-' + state.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html'; a.click();
}

let ipickBound = false;
// Floating popups escape the scrolling editor: position fixed to the viewport
function placeFixed(menu, anchor, minW) {
  const r = anchor.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.top = (r.bottom + 5) + 'px';
  menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - minW - 8)) + 'px';
  menu.style.minWidth = Math.max(minW, r.width) + 'px';
  menu.style.zIndex = 999;
}
function hideFloatMenus() {
  document.querySelectorAll('.ipick-menu,.agent-list').forEach(m => m.classList.add('hidden'));
}
// Scrolling inside a floating menu must not close it (only scrolls from the
// page / editor behind it do), so the list stays open while browsing logos.
function onFloatScroll(e) {
  const t = e.target;
  if (t && t.nodeType === 1 && (t.closest('.ipick-menu') || t.closest('.agent-list'))) return;
  hideFloatMenus();
}
function iconPicker(selected, onPick) {
  const wrap = document.createElement('div'); wrap.className = 'ipick';
  const paint = k => {
    const n = NETWORKS[k] || NETWORKS.facebook;
    wrap.querySelector('.ipick-btn').innerHTML = `<span class="ipick-logo" style="background:${n.bg}"><img src="${n.img}" alt=""></span><span>${n.label}</span>`;
    wrap.querySelectorAll('.ipick-item').forEach(it => it.classList.toggle('sel', it.dataset.k === k));
  };
  const n0 = NETWORKS[selected] || NETWORKS.facebook;
  wrap.innerHTML = `<button type="button" class="ipick-btn" aria-haspopup="listbox" aria-expanded="false"><span class="ipick-logo" style="background:${n0.bg}"><img src="${n0.img}" alt=""></span><span>${n0.label}</span></button><div class="ipick-menu hidden" role="listbox" tabindex="-1">${Object.keys(NETWORKS).map(k => {
    const n = NETWORKS[k];
    return `<div class="ipick-item${k === selected ? ' sel' : ''}" role="option" aria-selected="${k === selected}" data-k="${k}"><span class="ipick-logo" style="background:${n.bg}"><img src="${n.img}" alt=""></span><span>${n.label}</span></div>`;
  }).join('')}</div>`;
  const menu = wrap.querySelector('.ipick-menu');
  const btn = wrap.querySelector('.ipick-btn');
  const setOpen = open => { menu.classList.toggle('hidden', !open); btn.setAttribute('aria-expanded', String(open)); };
  btn.onclick = e => {
    e.stopPropagation();
    document.querySelectorAll('.ipick-menu').forEach(m => { if (m !== menu) m.classList.add('hidden'); });
    const opening = menu.classList.contains('hidden');
    setOpen(opening);
    if (opening) placeFixed(menu, btn, 200);
  };
  menu.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); btn.focus(); } });
  menu.querySelectorAll('.ipick-item').forEach(it => it.onclick = e => {
    e.stopPropagation(); paint(it.dataset.k); setOpen(false); onPick(it.dataset.k);
  });
  if (!ipickBound) { ipickBound = true; document.addEventListener('click', hideFloatMenus); document.addEventListener('scroll', onFloatScroll, true); window.addEventListener('resize', hideFloatMenus); }
  return wrap;
}
function setCertsAlign(a) {
  state.certsAlign = ['left', 'center', 'right'].includes(a) ? a : 'center';
  document.querySelectorAll('#certsAlignSeg button').forEach(b => b.classList.toggle('on', b.dataset.a === state.certsAlign));
}
function setIconStyle(s) {
  state.iconStyle = ['solid', 'rounded', 'outline', 'frame', 'line', 'soft'].includes(s) ? s : 'solid';
  document.querySelectorAll('#iconStyleSeg button').forEach(b => b.classList.toggle('on', b.dataset.s === state.iconStyle));
}
function addLinkRow(icon = 'facebook', url = '') {
  const d = document.createElement('div'); d.className = 'xlink xlink-net';
  d._icon = NETWORKS[icon] ? icon : 'facebook';
  const urlInput = document.createElement('input'); urlInput.placeholder = 'https://…'; urlInput.value = url || '';
  const del = document.createElement('button'); del.textContent = '✕'; del.title = 'Remove';
  const sync = () => { state.extra = [...document.querySelectorAll('#extraLinks .xlink-net')].map(r => ({ icon: r._icon || 'facebook', url: r.querySelector('input').value })).filter(e => e.url); markDirty(); };
  d.appendChild(iconPicker(d._icon, k => { d._icon = k; sync(); }));
  d.appendChild(urlInput); d.appendChild(del);
  urlInput.oninput = sync; del.onclick = () => { d.remove(); sync(); };
  $('extraLinks').appendChild(d);
}
// One row per "Community Expert" button: checkbox (show / hide), label, link, remove.
function addCommunityRow(c) {
  const item = c || {};
  const d = document.createElement('div'); d.className = 'xlink xlink-comm';
  const on = document.createElement('input');
  on.type = 'checkbox'; on.checked = item.on !== false; on.title = 'Show this button';
  const label = document.createElement('input');
  label.className = 'comm-label'; label.placeholder = 'Community name'; label.value = item.label || '';
  const url = document.createElement('input');
  url.className = 'comm-url'; url.placeholder = 'https://…'; url.value = item.url || '';
  const del = document.createElement('button');
  del.type = 'button'; del.textContent = '✕'; del.title = 'Remove this community';
  const sync = () => { state.communities = readCommunityRows(); markDirty(); };
  on.onchange = sync; label.oninput = sync; url.oninput = sync;
  del.onclick = () => { d.remove(); sync(); };
  [on, label, url, del].forEach(el => d.appendChild(el));
  $('communityList').appendChild(d);
}
function readCommunityRows() {
  return [...document.querySelectorAll('#communityList .xlink-comm')].map(r => ({
    on: r.querySelector('input[type=checkbox]').checked,
    label: r.querySelector('.comm-label').value,
    url: r.querySelector('.comm-url').value
  }));
}
// Paint the rows from the agent (legacy agents fall back to the two defaults).
function renderCommunityRows() {
  const box = $('communityList');
  if (!box) return;
  box.querySelectorAll('.xlink-comm').forEach(n => n.remove());
  communitiesOf(state).forEach(c => addCommunityRow(c));
}
function addCertRow(img = '', link = '') {
  const d = document.createElement('div'); d.className = 'xlink';
  d.innerHTML = `<input placeholder="Logo image URL (PNG)" value="${img || ''}"><input placeholder="Click-through link (optional)" value="${link || ''}"><button>✕</button>`;
  const sync = () => { state.customCerts = [...document.querySelectorAll('#customCerts .xlink')].map(r => { const i = r.querySelectorAll('input'); return { img: i[0].value, link: i[1].value }; }).filter(x => x.img || x.link); markDirty(); };
  d.querySelectorAll('input').forEach(i => i.oninput = sync); d.querySelector('button').onclick = () => { d.remove(); sync(); };
  $('customCerts').appendChild(d);
}

const MAPS_DEFAULT = 'https://www.google.com/maps/place/Canablue+Real+Estate/data=!4m2!3m1!1s0x0:0x14220523874e3b46?sa=X&ved=1t:2428&ictx=111';
const DIR_DEFAULT = 'Local P104, Plaza San Juan Shopping Center, Bávaro, Punta Cana';
const BUILTIN_AGENTS = []; // Agent records live in data/agents.json.
let AGENTS = BUILTIN_AGENTS.slice();
let JSON_AGENTS = [];
let selectedAgentKey = 'pamela';
// A brand-new, empty agent: what "New agent" loads before you type anything.
const LOGO_DEFAULT = 'https://res.cloudinary.com/ybkuwivn/image/upload/v1792071937/10._logo-blue-google.png';
function blankAgent() {
  return {
    key: '', color: '#174176', name: '', role: '', zona: '', tel: '', email: '',
    web: 'canablue.com', dir: DIR_DEFAULT, dirUrl: MAPS_DEFAULT,
    listings: '', booking: '', community: COMMUNITY_DEFAULT, communities: defaultCommunities(), linkedin: '', instagram: '', whatsapp: '',
    foto: '', photoPosition: 'center center', logo: LOGO_DEFAULT,
    extra: [], tpl: 'principal',
    vis: { foto: true, social: true, listings: true, booking: true, community: true, qr: true, certs: true, legal: true, ...getBulkVis() },
    iconStyle: 'solid', certsAlign: 'center',
    certLinks: { crs: '', aei: '', realtor: '', sr23: '', sr24: '', lux: '' },
    customCerts: [],
    certs: { crs: false, aei: false, realtor: false, sr23: false, sr24: false, lux: false }
  };
}
// ---- Static-page persistence: data/agents.json (shared source of truth, via fetch)
// + localStorage (per-browser autosave + custom agents). ----
const LS_FORM = 'canablue.form.v4', LS_CUSTOM = 'canablue.agents.custom.v1';
const getCustoms = () => { try { return JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]'); } catch { return []; } };
const setCustoms = c => localStorage.setItem(LS_CUSTOM, JSON.stringify(c));
const isCustom = key => getCustoms().some(x => x.key === key);
// Keep the reviewed Luxury Homes list from the published catalog when an older
// browser copy or optional Google Sheet still carries the PDF template's logo.
function withReviewedLuxury(a) {
  const official = JSON_AGENTS.find(x => x.key === a.key);
  if (!official || !official.certs) return a;
  return { ...a, certs: { ...(a.certs || {}), lux: !!official.certs.lux } };
}
const VIS_FIELDS = { foto: 'vFoto', social: 'vSocial', listings: 'vListings', booking: 'vBooking', community: 'vCommunity', qr: 'vQr', certs: 'vCerts', legal: 'vLegal' };
const LS_BULK_VIS = 'canablue.visibility.all.v1';
const INACTIVE_AGENT_KEYS = new Set([
  'annie-fernandez', 'arslan-tahir', 'carla-martinez', 'dahiana-senclaire',
  'ivan-ortega', 'juan-medina', 'mayelin-avila', 'yiraine-miraglio'
]);
const isVisibleAgent = a => !!a && !a.inactive && !INACTIVE_AGENT_KEYS.has(a.key);
const activeAgents = () => AGENTS.filter(isVisibleAgent);
function getBulkVis() {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_BULK_VIS) || '{}');
    return Object.fromEntries(Object.keys(VIS_FIELDS).filter(k => typeof stored[k] === 'boolean').map(k => [k, stored[k]]));
  } catch { return {}; }
}
const withBulkVis = a => ({ ...a, vis: { ...(a.vis || {}), ...getBulkVis() } });
const slug = s => (s || 'agent').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'agent';
// Google Sheet column `communities`: "Label|https://…; Label|https://…" — every entry
// shows up as one "Community Expert" pill.
function parseCommunities(v) {
  if (v == null || String(v).trim() === '') return undefined;
  return String(v).split(';').map(s => s.trim()).filter(Boolean).map(s => {
    const i = s.lastIndexOf('|');
    if (i < 0) return { on: true, label: s, url: '' };
    return { on: true, label: s.slice(0, i).trim(), url: s.slice(i + 1).trim() };
  });
}
const SHEET_TAB = 'Agentes';
const LS_SHEET = 'canablue.sheet.id.v1';
function setDbStatus(msg, cls) {
  const s = $('dbStatus'); if (s) s.textContent = msg;
  const d = $('dbDot'); if (d) d.className = 'db-dot' + (cls ? ' ' + cls : '');
}
async function loadSheetAgents(id) {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_TAB)}&headers=1`;
  const r = await fetch(url);
  if (!r.ok) throw 0;
  const t = await r.text();
  const json = JSON.parse(t.substring(t.indexOf('{'), t.lastIndexOf('}') + 1));
  const cols = (json.table.cols || []).map(c => String((c && c.label) || '').trim().toLowerCase());
  const B = v => v === true || v === 1 || String(v).toUpperCase() === 'TRUE' || String(v) === '1';
  return (json.table.rows || []).map(row => {
    const o = {}; const cells = row.c || [];
    cols.forEach((h, i) => { o[h] = cells[i] ? cells[i].v : null; });
    return {
      key: String(o.key || '').trim() || slug(o.name),
      color: o.color || '', name: o.name || '', role: o.role || '', zona: o.zona || '',
      tel: o.tel || '', email: o.email || '', web: o.web || 'canablue.com',
      dir: o.dir || DIR_DEFAULT, dirUrl: o.dirUrl || MAPS_DEFAULT,
      listings: o.listings || '', linkedin: o.linkedin || '',
      booking: o.booking || '',
      community: o.community || '',
      // Optional `communities` column: "Label|url; Label|url" (all shown by default).
      communities: parseCommunities(o.communities),
      instagram: o.instagram || '', whatsapp: o.whatsapp || '',
      foto: o.foto || '', logo: o.logo || '',
      vis: { qr: o.qr == null ? true : B(o.qr) },
      tpl: ['principal', 'broker', 'moderna', 'banner', 'sidebar', 'photo-left', 'photo-top', 'photo-right'].includes(String(o.tpl || '').toLowerCase()) ? String(o.tpl).toLowerCase() : undefined,
      certs: { crs: B(o.crs), aei: B(o.aei), realtor: B(o.realtor), sr23: B(o.sr23), sr24: B(o.sr24), lux: o.lux == null ? false : B(o.lux) },
      iconStyle: ['solid', 'rounded', 'outline', 'frame', 'line', 'soft'].includes(String(o.iconstyle || '').toLowerCase()) ? String(o.iconstyle).toLowerCase() : 'solid',
      certsAlign: ['left', 'center', 'right'].includes(String(o.certsalign || '').toLowerCase()) ? String(o.certsalign).toLowerCase() : 'center'
    };
  }).filter(a => a.name);
}
async function loadAgents() {
  AGENTS = BUILTIN_AGENTS.slice();
  JSON_AGENTS = [];
  try {
    const r = await fetch('data/agents.json', { cache: 'no-store' });
    if (!r.ok) throw 0;
    const j = await r.json();
    if (Array.isArray(j) && j.length) { JSON_AGENTS = j; AGENTS = j.slice(); }
  } catch {}
  const sid = (($('fSheetId') && $('fSheetId').value) || '').trim();
  if (sid) {
    try {
      const sheet = await loadSheetAgents(sid);
      if (sheet.length) {
        AGENTS = sheet.map(withReviewedLuxury);
        try { localStorage.setItem(LS_SHEET, sid); } catch {}
        setDbStatus(`Google Sheets — ${sheet.filter(isVisibleAgent).length} agentes activos`, 'ok');
      } else {
        setDbStatus('Google Sheets — empty sheet, using local data', 'err');
      }
    } catch {
      setDbStatus('Google Sheets — check ID / sharing, using local data', 'err');
    }
  } else {
    if (JSON_AGENTS.length) {
      setDbStatus(`Archivo local — ${AGENTS.filter(isVisibleAgent).length} firmas activas.`, '');
    } else setDbStatus('Built-in data (offline or file://).', '');
  }
  // A one-time migration corrects previously saved signatures and the last
  // autosaved preview. Future manual edits can still be saved by the user.
  try {
    const reviewKey = 'canablue.luxury-reviewed.20261028';
    if (JSON_AGENTS.length && !localStorage.getItem(reviewKey)) {
      setCustoms(getCustoms().map(withReviewedLuxury));
      const draft = JSON.parse(localStorage.getItem(LS_FORM) || 'null');
      if (draft) localStorage.setItem(LS_FORM, JSON.stringify(withReviewedLuxury(draft)));
      localStorage.setItem(reviewKey, '1');
    }
  } catch {}
  // Existing browser-saved records inherited QR=false from the earlier default.
  // Enable it once, then leave later manual choices alone.
  try {
    if (!localStorage.getItem('canablue.qr.enabled.v1')) {
      const customs = getCustoms().map(c => ({ ...c, vis: { ...(c.vis || {}), qr: true } }));
      setCustoms(customs);
      localStorage.setItem('canablue.qr.enabled.v1', '1');
    }
  } catch {}
  // Bring older browser-saved signatures in line with the team-wide notice
  // and the two corrected job titles. Later manual edits remain editable.
  try {
    if (!localStorage.getItem('canablue.team-update.v1')) {
      const refresh = c => {
        const role = c.key === 'martha-mendoza' && c.role === 'Commercial Assistant' ? 'Commercial Coordinator'
          : c.key === 'leslie-ann-cedeno' && c.role === 'Marketing' ? 'Lead Generation & Digital Channels Specialist' : c.role;
        return { ...c, role, legal: c.legal === undefined ? DEFAULT_LEGAL : c.legal,
          vis: { ...(c.vis || {}), legal: true } };
      };
      setCustoms(getCustoms().map(refresh));
      const draft = JSON.parse(localStorage.getItem(LS_FORM) || 'null');
      if (draft) localStorage.setItem(LS_FORM, JSON.stringify(refresh(draft)));
      localStorage.setItem('canablue.team-update.v1', '1');
    }
  } catch {}
  AGENTS = AGENTS.map(withBulkVis);
  getCustoms().forEach(c => {
    const i = AGENTS.findIndex(a => a.key === c.key);
    if (i >= 0) {
      const base = AGENTS[i];
      AGENTS[i] = { ...base, ...c,
        foto: samePortrait(c.foto, base.foto) ? base.foto : c.foto,
        photoPosition: samePortrait(c.foto, base.foto) ? base.photoPosition : (c.photoPosition || base.photoPosition) };
    }
    else AGENTS.push(c);
  });
  AGENTS = AGENTS.map(a => INACTIVE_AGENT_KEYS.has(a.key) ? { ...a, inactive: true } : a);
  renderAgentList();
  renderDirectory();
}
function collectAgent(key) {
  return {
    key, color: $('fColor').value, name: $('fNombre').value, role: $('fCargo').value,
    zona: state.zona || '', tel: $('fTel').value, email: $('fEmail').value, web: $('fWeb').value,
    dir: $('fDir').value, dirUrl: $('fDirUrl').value, listings: $('fListings').value,
    booking: $('fBooking').value, community: state.community,
    communities: readCommunityRows(),
    linkedin: $('fLinkedin').value, instagram: $('fInstagram').value, whatsapp: $('fWhatsapp').value,
    foto: $('fFoto').value, photoPosition: state.photoPosition || 'center center', logo: $('fLogo').value,
    extra: [...document.querySelectorAll('#extraLinks .xlink-net')].map(r => ({ icon: r._icon || 'facebook', url: r.querySelector('input').value })).filter(e => e.url),
    tpl: state.tpl,
    vis: { foto: $('vFoto').checked, social: $('vSocial').checked, listings: $('vListings').checked, booking: $('vBooking').checked, community: $('vCommunity').checked, qr: $('vQr').checked, certs: $('vCerts').checked, legal: $('vLegal').checked },
    iconStyle: state.iconStyle,
    certsAlign: state.certsAlign,
    certLinks: { crs: $('fLinkCRS').value, aei: $('fLinkAEI').value, realtor: $('fLinkRealtor').value, sr23: $('fLinkSR23').value, sr24: $('fLinkSR24').value, lux: $('fLinkLux').value },
    customCerts: [...document.querySelectorAll('#customCerts .xlink')].map(r => { const i = r.querySelectorAll('input'); return { img: i[0].value, link: i[1].value }; }).filter(x => x.img || x.link),
    certs: { crs: $('cCRS').checked, aei: $('cAEI').checked, realtor: $('cRealtor').checked, sr23: $('cSR23').checked, sr24: $('cSR24').checked, lux: $('cLux').checked }
  };
}
function applyAgent(a) {
  if (a.color && /^#[0-9a-f]{6}$/i.test(a.color)) $('fColor').value = a.color;
  $('fNombre').value = a.name || ''; $('fCargo').value = a.role || '';
  state.zona = a.zona || '';
  $('fTel').value = a.tel || '';
  $('fEmail').value = a.email || ''; $('fWeb').value = a.web || 'canablue.com';
  $('fDir').value = a.dir || DIR_DEFAULT; $('fDirUrl').value = a.dirUrl || MAPS_DEFAULT;
  $('fListings').value = a.listings || ''; $('fLinkedin').value = a.linkedin || '';
  $('fBooking').value = a.booking || '';
  $('fInstagram').value = a.instagram || ''; $('fWhatsapp').value = a.whatsapp || '';
  $('fFoto').value = a.foto || ''; state.photoPosition = a.photoPosition || 'center center'; if (a.logo) $('fLogo').value = a.logo;
  $('fLegal').value = a.legal === undefined ? DEFAULT_LEGAL : a.legal;
  const ct = a.certs || {};
  $('cCRS').checked = !!ct.crs; $('cAEI').checked = !!ct.aei; $('cRealtor').checked = !!ct.realtor;
  if (ct.sr23 !== undefined) $('cSR23').checked = !!ct.sr23;
  if (ct.sr24 !== undefined) $('cSR24').checked = !!ct.sr24;
  if (ct.lux !== undefined) $('cLux').checked = !!ct.lux;
  const linkIds = { crs: 'fLinkCRS', aei: 'fLinkAEI', realtor: 'fLinkRealtor', sr23: 'fLinkSR23', sr24: 'fLinkSR24', lux: 'fLinkLux' };
  for (const k in linkIds) { const el = $(linkIds[k]); if (el) el.value = (a.certLinks && a.certLinks[k]) || ''; }
  document.querySelectorAll('#extraLinks .xlink-net').forEach(n => n.remove());
  (a.extra || []).forEach(x => addLinkRow(x.icon, x.url));
  state.communities = communitiesOf(a);
  renderCommunityRows();
  setIconStyle(a.iconStyle || 'solid');
  setCertsAlign(a.certsAlign || 'center');
  if (a.tpl) state.tpl = a.tpl;
  if (a.vis) {
    const v = a.vis;
    for (const k in VIS_FIELDS) $(VIS_FIELDS[k]).checked = v[k] === undefined ? true : !!v[k];
  }
  if (!a.vis || a.vis.qr === undefined) $('vQr').checked = true;
  document.querySelectorAll('#customCerts .xlink').forEach(n => n.remove());
  (a.customCerts || []).forEach(x => addCertRow(x.img, x.link));
  selectedAgentKey = a.key || '';
  $('agentSelect').value = selectedAgentKey;
  renderDirectory();
}
function saveCurrentAgent() {
  const current = AGENTS.find(x => x.key === selectedAgentKey);
  const key = current && foldAgent(current.name) === foldAgent($('fNombre').value)
    ? current.key : slug($('fNombre').value);
  const a = collectAgent(key);
  if (INACTIVE_AGENT_KEYS.has(a.key)) a.inactive = true;
  if (!a.name) { toast('Enter the agent name first.'); return false; }
  const cs = getCustoms(); const i = cs.findIndex(x => x.key === a.key);
  if (i >= 0) cs[i] = a; else cs.push(a);
  setCustoms(cs);
  const j = AGENTS.findIndex(x => x.key === a.key);
  if (j >= 0) AGENTS[j] = a; else AGENTS.push(a);
  selectedAgentKey = a.key;
  renderAgentList();
  renderDirectory();
  setDirty(false);
  render();
  toast('Agent saved in this browser.');
  return true;
}
// Start a fresh, empty agent (kept in this browser until you save it).
function newAgent() {
  applyAgent(blankAgent());
  $('fLegal').value = DEFAULT_LEGAL;
  setDirty(true);
  render();
  const n = $('fNombre'); if (n) n.focus();
}
function saveAndNew() {
  if (!saveCurrentAgent()) return;
  newAgent();
}
function deleteCustomAgent(key) {
  setCustoms(getCustoms().filter(x => x.key !== key));
  const base = JSON_AGENTS.length ? JSON_AGENTS : BUILTIN_AGENTS;
  AGENTS = AGENTS.filter(x => x.key !== key);
  const b = base.find(x => x.key === key);
  if (b) AGENTS.push(withBulkVis(b));
  const next = AGENTS.find(x => x.key === key && isVisibleAgent(x)) || AGENTS.find(x => x.key === 'pamela') || activeAgents()[0];
  if (next) fillAgent(next); else { selectedAgentKey = ''; renderAgentList(); renderDirectory(); render(); }
  toast('Saved agent deleted.');
}
function exportAgentsJSON() {
  const merged = AGENTS.slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' }));
  a.download = 'agents.json'; a.click();
  toast('agents.json downloaded — replace data/agents.json and commit.');
}
// ---- Undo: a lightweight ring of form snapshots (button, no keyboard shortcut,
// so the browser's native Ctrl+Z inside text fields keeps working). ----
let undoStack = [], undoLock = false;
function updateUndoBtn() { const b = $('btnUndo'); if (b) b.disabled = undoStack.length < 2; }
function pushUndo(snap) {
  if (undoLock || !snap) return;
  if (undoStack[undoStack.length - 1] === snap) return;
  undoStack.push(snap);
  if (undoStack.length > 40) undoStack.shift();
  updateUndoBtn();
}
function undoStep() {
  if (undoStack.length < 2) return;
  undoStack.pop();
  let prev = null;
  try { prev = JSON.parse(undoStack[undoStack.length - 1]); } catch {}
  if (!prev) return;
  undoLock = true;
  applyAgent(prev);
  undoLock = false;
  setDirty(true);
  updateUndoBtn();
  render();
}
let saveT = null;
function autosave() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    const snap = collectAgent(selectedAgentKey || 'draft');
    try { localStorage.setItem(LS_FORM, JSON.stringify(snap)); } catch {}
    pushUndo(JSON.stringify(snap));
  }, 600);
}
function restoreAutosave() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_FORM) || 'null');
    if (!d) return false;
    const match = AGENTS.find(a => a.key === d.key)
      || AGENTS.find(a => a.email && a.email.toLowerCase() === String(d.email || '').toLowerCase());
    if (!isVisibleAgent(match || d)) return false;
    applyAgent(d);
    if (match) {
      selectedAgentKey = match.key;
      if (samePortrait(d.foto, match.foto)) {
        state.foto = match.foto;
        $('fFoto').value = match.foto;
        state.photoPosition = match.photoPosition || 'center center';
      } else {
        state.photoPosition = d.photoPosition || match.photoPosition || 'center center';
      }
      $('agentSelect').value = match.key;
      renderDirectory();
    }
    return true;
  } catch { return false; }
}
function fillAgent(a) {
  if (!a) return;
  applyAgent(a);
  setDirty(false);
  render();
}
const foldAgent = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const sortedAgents = () => activeAgents().sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'));
function renderAgentList() {
  const select = $('agentSelect');
  if (!select) return;
  select.replaceChildren(new Option('Select an agent', ''));
  sortedAgents().forEach(a => select.add(new Option(a.name + (isCustom(a.key) ? ' · saved' : ''), a.key)));
  select.value = selectedAgentKey;
}
function directoryPhoto(a) {
  const url = String(a.foto || '');
  return portraitPath(url) || url;
}
function updateBulkVisibilityStatus() {
  const field = $('bulkVisibilityField').value;
  const visible = activeAgents();
  const shown = visible.filter(a => !a.vis || a.vis[field] !== false).length;
  $('bulkVisibilityStatus').textContent = `${shown} de ${visible.length} firmas con esta opción activada`;
}
function applyBulkVisibility(enabled) {
  const visible = activeAgents();
  if (!visible.length) return;
  const field = $('bulkVisibilityField').value;
  if (!Object.hasOwn(VIS_FIELDS, field)) return;
  const update = a => ({ ...a, vis: { ...(a.vis || {}), [field]: enabled } });
  try {
    localStorage.setItem(LS_BULK_VIS, JSON.stringify({ ...getBulkVis(), [field]: enabled }));
    setCustoms(getCustoms().map(a => isVisibleAgent(a) ? update(a) : a));
  } catch {
    toast('No se pudo guardar el cambio en este navegador.', 'err');
    return;
  }
  AGENTS = AGENTS.map(a => isVisibleAgent(a) ? update(a) : a);
  $(VIS_FIELDS[field]).checked = enabled;
  try { localStorage.setItem(LS_FORM, JSON.stringify(collectAgent(selectedAgentKey || 'draft'))); } catch {}
  renderDirectory();
  render();
  const label = $('bulkVisibilityField').selectedOptions[0].textContent;
  toast(`${label}: ${enabled ? 'activado' : 'desactivado'} en ${visible.length} firmas.`);
}
function renderDirectory() {
  const list = $('directoryList');
  if (!list) return;
  const q = foldAgent(($('directorySearch') && $('directorySearch').value || '').trim());
  const hits = sortedAgents().filter(a => [a.name, a.role, a.email, a.zona].some(v => foldAgent(v).includes(q)));
  $('directoryCount').textContent = `${hits.length} de ${activeAgents().length}`;
  updateBulkVisibilityStatus();
  list.innerHTML = hits.length ? hits.map(a => {
    const initials = String(a.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const src = directoryPhoto(a);
    const photoPosition = a.photoPosition === 'center top' ? 'center top' : 'center center';
    const photo = src ? `<img class="directory-photo" src="${esc(src)}" alt="" style="object-position:${photoPosition}">` : `<span class="directory-photo directory-initials">${esc(initials)}</span>`;
    const certs = CERT_DEFS.filter(([k]) => a.certs && a.certs[k]).map(([k, name]) => `<img src="${CERT_IMG[k]}" alt="${name}" title="${name}">`).join('');
    const details = [a.tel, a.email, a.zona].filter(Boolean).map(esc).join(' · ');
    return `<article class="directory-entry${a.key === selectedAgentKey ? ' selected' : ''}" data-key="${esc(a.key)}">
      <div class="directory-person">${photo}<div class="directory-identity"><strong>${esc(a.name)}</strong><small>${esc(a.role || 'Cargo por confirmar')}${isCustom(a.key) ? ' · guardado' : ''}</small></div></div>
      <p class="directory-details">${details || 'Datos pendientes de confirmar'}</p>
      ${certs ? `<div class="directory-certs" aria-label="Certificaciones">${certs}</div>` : ''}
      <div class="directory-actions"><button class="btn small primary" type="button" data-action="view">Ver firma</button><button class="btn small" type="button" data-action="edit">Editar</button>${isCustom(a.key) ? '<button class="btn small" type="button" data-action="delete" title="Eliminar cambios guardados">✕</button>' : ''}</div>
    </article>`;
  }).join('') : '<div class="directory-empty">No se encontraron agentes.</div>';
  list.querySelectorAll('img.directory-photo').forEach(img => { img.onerror = () => {
    const a = AGENTS.find(x => x.key === img.closest('.directory-entry').dataset.key);
    const ini = String(a && a.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const avatar = document.createElement('span'); avatar.className = 'directory-photo directory-initials'; avatar.textContent = ini; img.replaceWith(avatar);
  }; });
}

// ---- Preview width: desktop (fluid) or mobile (a 390 x 844 phone viewport).
// Mobile mail clients squeeze the signature to the screen width instead of
// shrinking it as a whole, so the preview does the same and shows the real
// line breaks (that is where "View My Listings" or a social icon can wrap).
const LS_VIEW = 'canablue.view.v1';
function setViewport(vp) {
  const mobile = vp === 'mobile';
  const box = document.querySelector('.preview-box');
  if (!box) return;
  box.classList.toggle('mobile', mobile);
  document.querySelectorAll('#vpSeg button').forEach(b => {
    const on = (b.dataset.vp === 'mobile') === mobile;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  try { localStorage.setItem(LS_VIEW, mobile ? 'mobile' : 'desktop'); } catch {}
  fitPreview();
}
// Desktop preview: the signature keeps its real 600 px layout and is scaled down to
// fit the box, so the preview shows the geometry the client will render (the mobile
// preview does the opposite: it squeezes it, like a phone does).
function fitPreview() {
  const box = document.querySelector('.preview-box'), sig = $('sigPreview');
  if (!box || !sig) return;
  const table = sig.firstElementChild;
  if (!table) return;
  if (box.classList.contains('mobile')) {
    table.style.position = ''; table.style.left = ''; table.style.top = '';
    table.style.transform = ''; table.style.transformOrigin = ''; table.style.marginLeft = '';
    table.style.width = '';
    sig.style.height = '';
    fitMobile();
    return;
  }
  const avail = sig.clientWidth;
  if (!avail) return;
  const NAT = 600;
  table.style.width = NAT + 'px';
  const s = Math.min(1, avail / NAT);
  table.style.position = 'absolute';
  table.style.left = '0'; table.style.top = '0';
  table.style.transformOrigin = 'top left';
  table.style.transform = 'scale(' + s.toFixed(4) + ')';
  table.style.marginLeft = Math.max(0, (avail - NAT * s) / 2) + 'px';
  sig.style.height = Math.ceil(table.offsetHeight * s) + 2 + 'px';
}
function fitMobile() {
  const box = document.querySelector('.preview-box'), sig = $('sigPreview');
  if (!box || !sig) return;
  const table = sig.firstElementChild;
  if (!table) return;
  table.style.zoom = '';
  if (!box.classList.contains('mobile')) return;
  const cs = getComputedStyle(sig);
  const avail = sig.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
  const natW = table.offsetWidth || 0;
  if (avail > 0 && natW > avail) table.style.zoom = (avail / natW).toFixed(3);
  return { zoom: table.style.zoom, natW, avail };
}
document.querySelectorAll('#vpSeg button').forEach(b => b.onclick = () => setViewport(b.dataset.vp));
window.addEventListener('resize', fitPreview);
try { setViewport(localStorage.getItem(LS_VIEW) === 'mobile' ? 'mobile' : 'desktop'); } catch { setViewport('desktop'); }

document.querySelectorAll('#certsAlignSeg button').forEach(b => b.onclick = () => { setCertsAlign(b.dataset.a); markDirty(); });
document.querySelectorAll('#iconStyleSeg button').forEach(b => b.onclick = () => { setIconStyle(b.dataset.s); markDirty(); });
function showSection(id) {
  document.querySelectorAll('.rail button').forEach(x => x.classList.toggle('on', x.dataset.sec === id));
  document.querySelectorAll('.editor .card').forEach(c => c.classList.toggle('show', c.id === id));
  document.querySelector('.editor').scrollTop = 0;
}
document.querySelectorAll('.rail button').forEach(b => b.onclick = () => showSection(b.dataset.sec));
// Delegated: the thumbnails are rebuilt whenever a toggle changes, so per-button
// handlers would be lost on every rebuild.
$('tplGrid').addEventListener('click', e => {
  const b = e.target.closest('.tpl');
  if (!b) return;
  state.tpl = b.dataset.tpl;
  markDirty();
});
document.querySelectorAll('.swatches button').forEach(b => b.onclick = () => { $('fColor').value = b.dataset.c; markDirty(); });
['fColor','fColorHex','fNombre','fCargo','fTel','fEmail','fWeb','fDir','fDirUrl','fListings','fBooking','fLinkedin','fInstagram','fWhatsapp','fFoto','fLogo','fLinkCRS','fLinkAEI','fLinkRealtor','fLinkSR23','fLinkSR24','fLinkLux','fLegal','cCRS','cAEI','cRealtor','cSR23','cSR24','cLux','vFoto','vSocial','vListings','vBooking','vCommunity','vQr','vCerts','vLegal'].forEach(id => $(id).addEventListener('input', markDirty));
$('fColorHex').addEventListener('change', e => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) $('fColor').value = e.target.value; markDirty(); });
$('fFotoFile').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const fr = new FileReader(); fr.onload = () => { $('fFoto').value = fr.result; markDirty(); toast('Photo loaded (for the final email use a public https link).'); }; fr.readAsDataURL(f);
});
$('btnAddLink').onclick = () => { addLinkRow(); setDirty(true); };
$('btnAddCommunity').onclick = () => { addCommunityRow({ on: true, label: '', url: '' }); setDirty(true); };
$('btnAddCert').onclick = () => { addCertRow(); setDirty(true); };
$('btnCopyRich').onclick = copyRich; $('btnCopyHtml').onclick = copyHtml; $('btnDownload').onclick = download;
$('btnVcf').onclick = downloadVcf;
$('btnUndo').onclick = undoStep;
$('agentSelect').addEventListener('change', e => fillAgent(AGENTS.find(x => x.key === e.target.value)));
$('directorySearch').addEventListener('input', renderDirectory);
$('bulkVisibilityField').addEventListener('change', updateBulkVisibilityStatus);
$('bulkVisibilityOn').onclick = () => applyBulkVisibility(true);
$('bulkVisibilityOff').onclick = () => applyBulkVisibility(false);
$('directoryList').addEventListener('click', e => {
  const action = e.target.closest('button[data-action]');
  if (!action) return;
  const card = action.closest('.directory-entry');
  if (!card) return;
  const a = AGENTS.find(x => x.key === card.dataset.key);
  if (action.dataset.action === 'delete') { deleteCustomAgent(card.dataset.key); return; }
  fillAgent(a);
  if (action.dataset.action === 'edit') { showSection('sec-agent'); $('fNombre').focus(); }
});
$('toggleCode').onchange = e => $('codeBox').classList.toggle('hidden', !e.target.checked);
$('btnSaveAgent').onclick = saveCurrentAgent;
$('btnSaveNew').onclick = saveAndNew;
$('btnNewAgent').onclick = () => {
  if (isDirty && !confirm('You have unsaved changes. Start a new agent anyway?')) return;
  newAgent();
  toast('New agent ready — fill in the details and click Save agent.');
};
$('btnExportAgents').onclick = exportAgentsJSON;
$('btnReloadDb').onclick = () => loadAgents().then(() => { render(); });
$('fSheetId').addEventListener('change', e => { try { localStorage.setItem(LS_SHEET, e.target.value.trim()); } catch {} });
try { const sid = localStorage.getItem(LS_SHEET); if (sid) $('fSheetId').value = sid; } catch {}
loadAgents().then(() => {
  let hasDraft = false;
  try { hasDraft = !!localStorage.getItem(LS_FORM); } catch {}
  if (!hasDraft || !restoreAutosave()) {
    const initial = AGENTS.find(a => a.email === 'pamela@canablue.com') || activeAgents()[0];
    if (initial) applyAgent(initial);
  }
  // A brand-new session has no autosave: paint the default community rows once.
  if (!document.querySelector('#communityList .xlink-comm')) renderCommunityRows();
  render();
  setDirty(false);
  pushUndo(JSON.stringify(collectAgent('draft')));
});
