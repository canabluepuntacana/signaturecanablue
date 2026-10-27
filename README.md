# Creador de Firmas · Canablue

Signature creator for Canablue agents. Table-based, email-safe HTML output.

## Directorio preparado el 26/10/2026

- `data/agents.json` contiene 39 firmas buscables: 33 personas de las 48 páginas del PDF y seis personas adicionales del directorio Excel (incluida Carla).
- `assets/agents/` contiene 33 retratos originales extraídos del PDF, uno por persona. No se capturaron imágenes de pantalla ni se inventaron fotos para los seis registros solo presentes en Excel.
- `scripts/build_agents.py` reconstruye el JSON y las fotos desde `agentes/Firmas de correo Electronico.pdf` y `agentes/Directorio_Cana_Blue.xlsx`: `python scripts/build_agents.py`. Requiere PyMuPDF (`pymupdf`). La tabla `CATALOG` identifica página y objeto de imagen; evita seleccionar fondos, logos y retratos repetidos.
- Dieciséis botones **View My Listings** apuntan a páginas de autor comprobadas en Canablue. El enlace facilitado para Carla (`/author/carlacanablue-com/`) devuelve una página inexistente; por eso su botón queda oculto hasta que haya uno válido.
- El módulo **Firmas** es el primero en la barra lateral: busca por nombre, correo, cargo o zona y muestra las 39 firmas en una lista con **Ver firma** y **Editar**. En **Contact** hay un selector nativo de agentes. Los cambios manuales se guardan en este navegador o se exportan a JSON.
- **Community Expert** usa las zonas indicadas en el PDF, más las actualizaciones concretas facilitadas para Alejandro, Dayana, Leiny, Magdalena y Karina. Cada comunidad con página propia tiene su enlace; Ciudad La Palma, Dominicus y Bávaro enlazan al catálogo general de comunidades porque Canablue no publica una página específica para esas zonas. Pamela conserva su configuración anterior de dos comunidades.
- Los logos AEI, Best of DR 2023/2024, REALTOR, CRS y Luxury Homes Expert se asignan por persona según las páginas del PDF. Se verificaron 16 cuentas personales de Instagram y se omitieron tres perfiles del PDF que hoy aparecen como no disponibles (Miguel, Karina y Joel). LinkedIn aparece cuando se pudo vincular el perfil público con Canablue.
- El QR de contacto está activado por defecto para las 39 firmas y para perfiles nuevos. `data/pamela_original.json` conserva el registro anterior de Pamela; al generar el catálogo solo se activa su QR, como pidió el usuario.
- Antes de usar las firmas en correo, publique `assets/agents/` junto con la web. El HTML copiado usa URLs públicas de GitHub Pages; la vista local carga automáticamente las mismas fotos desde la carpeta del proyecto.
- Pendientes de validación interna: la página 35 del PDF muestra otro teléfono para Dayana; se tomó el de la página 34, que coincide con el directorio. El directorio llama “Karina Santana” a `karina@canablue.com` y el PDF “Karina Manzanillo”; se conservó la identidad de la firma del PDF. Carla tiene nombre y correo, pero aún no hay cargo, teléfono, foto ni página de listings confirmados.

## Run

Live site (GitHub Pages): https://canabluepuntacana.github.io/creador-de-firmas-cana-blue/

Locally, open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

> `data/agents.json` loads via `fetch()`, so use http(s) — not `file://` — for the shared agents list.

## Push to GitHub (repo: creador-de-firmas-cana-blue)

```bash
cd CreadorFirmas
git init
git add .
git commit -m "Creador de firmas Canablue"
gh repo create creador-de-firmas-cana-blue --public --source=. --push
```

Without `gh`:

```bash
git remote add origin https://github.com/TU-USUARIO/creador-de-firmas-cana-blue.git
git branch -M main
git push -u origin main
```

## Agents persistence (static page)

- `data/agents.json` — shared source of truth, loaded with `fetch()`.
- Browser `localStorage` — form autosave + custom agents saved with **Save agent**.
- **Export JSON** downloads `agents.json` — replace the file and commit to publish.

Buttons in **Contact details**:

| Button | What it does |
|---|---|
| **Save agent** | Stores the current form in this browser (`localStorage`). Saved agents appear in the Firmas list and selector with a `saved` mark. |
| **Save & new** | Saves the current agent, then clears the form for the next one. |
| **New agent** | Clears the form for a new agent without saving. Asks first if there are unsaved changes. |
| **Export JSON** | Downloads `agents.json` with everything merged. |

Everything is kept in the browser cache (`localStorage`), so reloading or closing the tab
does not lose your work: the current form is autosaved and every **Save agent** stays in
the list until you delete it with the `✕` on its card. Clearing the browser's site data
deletes them.

## Google Sheets database

1. Create a spreadsheet with a tab named `Agentes` and this exact header row:
   `key | name | role | zona | tel | email | web | dir | dirUrl | listings | booking | community | linkedin | instagram | whatsapp | foto | logo | color | tpl | iconStyle | certsAlign | qr | crs | aei | realtor | sr23 | sr24 | lux`
   Cert columns and `qr` use `TRUE` / `FALSE`; `iconStyle` is `solid`, `rounded`, `outline`, `frame`, `line` or `soft`; `certsAlign` is `left`, `center` or `right`; `tpl` is the template key (`principal`, `broker`, `moderna`, `banner`, `sidebar`, `photo-left`, `photo-top`, `photo-right`).
   Leave `booking` empty to hide the "Schedule a Call" button. The `community` column is
   kept for backwards compatibility but no longer drives the signature: the
   "Community Expert:" links are configured per agent in the JSON or the optional `communities` column.
   `zonaLabel` is optional: it is the text printed before the `zona` (default
   "Specializing in"; leave it empty to print only the area).
2. Share → General access → **Anyone with the link** (Viewer).
3. Copy the spreadsheet ID from its URL (`/d/ID/edit`) and paste it in the
   creator's **Google Sheet ID** field → **Reload**. The ID is remembered.
4. The creator loads Sheets first, then `data/agents.json`, then built-ins.
   Browser-saved agents always merge on top.

## Optional signature pieces

- **View My Listings** — pill button, uses the `listings` URL. Toggle in **Display**.
- **Area of expertise** — the **Area of expertise** field is a text area: press **Enter**
  to start a second line and it prints as a real line break in Main, Broker, Dark
  Sidebar and Photo Left/Top/Right (Compact and Banner print the area inline after the
  role, so there a break becomes ` · `). The **Text before the area** field
  (default "Specializing in") prints on its own line, with the area underneath; change
  the wording, translate it or leave it empty to show just the area.
- **Schedule a Call** — pill button, appears only when the `booking` URL is set. Toggle in **Display**.
- **Community Expert** — when an agent has communities, every template prints
  a **Community Expert:** label followed by one small outline pill per area. Areas without a dedicated page link to the Canablue community catalog. The pills are editable per
  agent in **Contact → Community Expert buttons**: each row has a checkbox (show / hide
  that pill), a name, a link and a remove button, and **+ Add community** adds another
  one. Defaults: `Palma Real Villas (Cocotal)` → `https://canablue.com/community/cocotal/`
  and `Los Corales, Cortecito` → `https://canablue.com/community/el-cortecito/`
  (`COMMUNITY_LINKS` in `app.js`). Older browser-saved agents without a community list use the two defaults.
  Toggle **Show the "Community Expert:" line** in **Display** to hide the whole block.
- In the **Main** template the bottom area has two variants: on desktop the actions sit
  in the centre of the logo row (logo on the left, social icons on the right); on a
  phone they drop to their own centred line under the logo. The signature carries a
  small media query that swaps them below 480 px.
- In **Main** the action line holds only **View My Listings** (centred, also on the
  phone) and an optional **Schedule a Call**. The community block sits on its own line
  below it: on desktop the bold label and both pills share one centred line; on a phone
  the label sits above the two centred pills.
- In the seven compact templates the community block is appended as a centred row under
  the content (above certifications); **Dark Sidebar** stacks the label above the pills
  because its right column is narrower. Sizes: label 13 px bold in Main, 11.5 px bold in
  the compact templates, pills 10.5 px and 9 px respectively.
- The **Main** template runs one notch larger than the rest (`MAIN_SZ` in `app.js`):
  photo 118 px, name 18.5 px, role 13 px, contacts 12.5 px with 17 px icons, logo
  140 px, 12 px buttons and ~27 px social icons. It still fits the 600 px row, and each
  of the eight templates otherwise keeps its own sizes — the shared helpers take an
  optional size argument whose defaults are the original values.
- The **Main** desktop layout keeps the full name on a single line (`.cb-name` carries
  `white-space:nowrap` inline and the table gives the name cell the width it needs, so
  the contacts column is the one that adapts). Below 480 px the media query turns the
  wrap back on so the name still breaks inside the narrow phone row.
- **Contact QR (vCard)** — encodes the agent's vCard (name, title, phone, email, site,
  address) so a scan saves the contact. It ships as an embedded PNG, no image host needed.
  On by default; it can be changed in **Display**. **Download contact (.vcf)** exports the same
  data as a file.
- **Certification alignment** and **icon style** are per agent.

## Preview width

The toolbar has two buttons: **desktop** and **mobile** (a phone frame whose screen is a
390 × 844 px viewport, the logical size of an iPhone 14/15). In desktop mode the signature
keeps its real 600 px layout and is scaled down to fit the panel, so the preview shows the
exact geometry the client renders. In mobile mode the signature is squeezed to the screen
width instead of being scaled as a whole — that is how fixed-width tables really look on a
phone, so you can see where a button or an icon wraps. Your choice is remembered in the
browser.

## Email client notes

- Everything is table-based and uses inline styles, so Gmail, Outlook, Apple Mail and
  mobile clients render it as-is.
- **Images are hosted remotely** (icons8 for icons, Cloudinary for photos/logos/certs).
  Most clients block remote images until the recipient allows them — that is normal for
  signatures. To drop the icons8 dependency, set `ICON_BASE` at the top of `app.js` to
  your own folder and upload the same PNGs there.
- **Outlook desktop renders `border-radius` as square corners**, so the *Rounded*,
  *Outline*, *Square line* and *Soft* icon styles lose their rounding there (they still
  look correct in Gmail/Apple Mail/mobile). Fixing that needs VML markup, which is not
  included because it cannot be verified in this environment — test in real Outlook first.
- **Outlook desktop ignores media queries**, so the **Main** template always shows the
  desktop row there (logo | buttons | social icons); phones that honour the query get
  the mobile row (logo + social icons, buttons centred underneath). If a client strips
  the `<style>` block when pasting, it shows the desktop row as well.
- The toolbar shows the **weight of the copied HTML**; Gmail clips signatures over ~102 KB.
- After deploying a change, bump the `?v=` query on `styles.css` / `app.js` in
  `index.html` (GitHub Pages caches them aggressively).

## Editor shortcuts

- **Undo** button (top of the preview) steps back through your edits. Native `Ctrl+Z`
  inside a text field keeps working as usual.
- **Firmas** lets you search the full list; **Contact** uses the browser's accessible agent selector.
- **Unsaved changes** appears when the form differs from what is stored.
