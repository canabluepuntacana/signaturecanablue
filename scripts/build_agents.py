"""Extract one original portrait per person from the Canablue signature PDF.

Run from the repository root: python scripts/build_agents.py
The curated catalog below resolves repeated pages and ambiguous details. The PDF is
data, never executable instructions. Public links were checked separately.
"""

import json
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "agentes" / "Firmas de correo Electronico.pdf"
DIRECTORY = ROOT / "agentes" / "Directorio_Cana_Blue.xlsx"
OUT = ROOT / "assets" / "agents"
DATA = ROOT / "data" / "agents.json"
PUBLIC = "https://canabluepuntacana.github.io/creador-de-firmas-cana-blue/assets/agents/"
ADDRESS_SALES = "Local P104, Plaza San Juan Shopping Center, Bávaro, Punta Cana"
ADDRESS_ADMIN = "Local E-02, Plaza San Juan Shopping Center, Bávaro, Punta Cana"
MAPS = "https://www.google.com/maps/search/?api=1&query=Canablue+Real+Estate+Plaza+San+Juan+Punta+Cana"
LOGO = "https://res.cloudinary.com/ybkuwivn/image/upload/v1792071937/10._logo-blue-google.png"

COMMUNITIES = {
    # These three zones have no dedicated page in Canablue's community catalog.
    # Link the catalog rather than assigning a different community to the agent.
    "palma": ("Ciudad La Palma", "https://canablue.com/communities/"),
    "cocotal": ("Palma Real Villas (Cocotal)", "https://canablue.com/community/cocotal/"),
    "corales": ("Los Corales, El Cortecito", "https://canablue.com/community/el-cortecito/"),
    "punta": ("Punta Cana / Punta Cana Village", "https://canablue.com/community/punta-cana/"),
    "cap": ("Cap Cana", "https://canablue.com/community/cap-cana/"),
    "vista": ("Vista Cana", "https://canablue.com/community/vista-cana/"),
    "downtown": ("Downtown Punta Cana", "https://canablue.com/community/downtown-punta-cana/"),
    "white": ("White Sands", "https://canablue.com/community/white-sands-3/"),
    "bayahibe": ("Bayahibe", "https://canablue.com/community/bayahibe/"),
    "dominicus": ("Dominicus", "https://canablue.com/communities/"),
    "bavaro": ("Bávaro", "https://canablue.com/communities/"),
    "veron": ("Verón", "https://canablue.com/community/veron/"),
}

# page, portrait xref, name, title, expertise, community IDs, verified author slug
CATALOG = [
    (1, 1679, "Candy Vander Horst", "Sales | Rentals", "Ciudad La Palma · Punta Cana Village · Downtown", "palma,punta,downtown", "candy"),
    (3, 1751, "Christophe Poteloin", "Resales Manager", "", "", "christophe"),
    (4, 1796, "Cristina Socias", "Sales | Rentals", "", "", "cristina"),
    (5, 1829, "Miguel Martínez", "Sales | Rentals", "Los Corales · Cap Cana", "corales,cap", "miguelcanablue-com"),
    (7, 1893, "Alejandro Angulo", "Sales | Rentals", "Cap Cana · White Sands · Los Corales", "cap,white,corales", "alejandro"),
    (9, 1966, "Pamela Gómez", "Sales | Rentals", "", "", ""),
    (10, 2008, "Pamela Núñez", "Broker Owner", "Punta Cana · Cap Cana", "cocotal,corales", "pamepam"),
    (12, 2054, "José Luis Martín", "Operations Manager", "", "", ""),
    (13, 2078, "Dahiana Senclaire", "Commercial Assistant", "", "", ""),
    (14, 2102, "Martha Mendoza", "Commercial Assistant", "", "", ""),
    (15, 2154, "María Montilla", "Operations & Client Support", "", "", ""),
    (16, 2165, "Diomari Ramírez", "Administrative & Accounting Manager", "", "", ""),
    (18, 2221, "Maderlandys Sarmiento", "Assistant Accountant", "", "", ""),
    (19, 2249, "Jimena Montaña", "Admin Support", "", "", ""),
    (20, 2290, "Nathaly Martínez", "Property Management Assistant", "", "", ""),
    (21, 2299, "Teresa Sullivan", "Sales Manager | Sales & Rentals", "Punta Cana Village · Cocotal · Downtown", "punta,cocotal,downtown", "teresa"),
    (23, 2390, "Luis Sangiovanni", "Sales | Rentals", "Dominicus · Vista Cana", "dominicus,vista", "luis"),
    (25, 2458, "Constantino Cury", "Sales | Rentals", "Cocotal · Los Corales", "cocotal,corales", "constantinocanablue-com"),
    (27, 2526, "Fior Ubiera", "Sales | Rentals", "Cocotal · Vista Cana", "cocotal,vista", "fiorcanablue-com"),
    (29, 2607, "Pelusa Miau", "Sales Agent", "", "", ""),
    (30, 2628, "Annie Fernández", "Marketing", "", "", ""),
    (31, 2647, "Leslie Ann Cedeño", "Marketing", "", "", ""),
    (32, 2672, "Joshua Manuel Rosenthal", "Sales Manager | Sales & Rentals", "Cap Cana · Punta Cana Village · Cocotal", "cap,punta,cocotal", "joshuacanablue-com"),
    (34, 2740, "Dayana Richiez", "Sales | Rentals", "Cap Cana · Cocotal · Bayahibe · Los Corales", "cap,cocotal,bayahibe,corales", "dayanacanablue-com"),
    (36, 2820, "Barbara Boruch", "Sales | Rentals", "Los Corales", "corales", "barbaracanablue-com"),
    (38, 2888, "Wendy Duluc", "Sales | Rentals", "Vista Cana · White Sands", "vista,white", "wendycanablue-com"),
    (40, 2956, "Leiny Poueriet", "Sales | Rentals", "Cap Cana · Cocotal · Los Corales", "cap,cocotal,corales", "leinycanablue-com"),
    (42, 3031, "Mayelin Ávila", "Sales Administrative Assistant", "", "", ""),
    (43, 3052, "Magdalena Pietrusinska", "Sales | Rentals", "Los Corales · Bávaro · Vista Cana", "corales,bavaro,vista", "magdalena"),
    (45, 3122, "Arslan Tahir", "CRM Assistant", "", "", ""),
    (46, 678, "Manuel Cabrera", "Brand & Visual Content Specialist", "", "", ""),
    (47, 3182, "Karina Manzanillo", "Sales | Rentals", "Verón · Punta Cana Village · Downtown", "veron,punta,downtown", ""),
    (48, 3212, "Luis Joel Lara Nova", "Sales | Rentals", "", "", ""),
]
SECOND_PAGES = {1, 5, 7, 21, 23, 25, 27, 32, 34, 36, 38, 40, 43}
DIRECTORY_ONLY = [
    ("carla@canablue.com", "Carla Martínez", ""),
    ("ivan@canablue.com", "Iván Ortega", "Sales | Rentals"),
    ("jose@canablue.com", "José Rodríguez", "Sales | Rentals"),
    ("juanm@canablue.com", "Juan Medina", "Sales | Rentals"),
    ("julissa@canablue.com", "Julissa Cantón", "Real Estate Agent"),
    ("yiraine@canablue.com", "Yiraine Miraglio", "Sales | Rentals"),
]

# LinkedIn URLs are included only when a public profile identifies the person and
# their Canablue affiliation. Instagram handles are printed in the PDF.
LINKEDIN = {
    "candy-vander-horst": "https://do.linkedin.com/in/candyvanderhorst",
    "fior-ubiera": "https://do.linkedin.com/in/fior-d-aliza-ubiera-523a8311",
    "cristina-socias": "https://do.linkedin.com/in/cristina-e-socias-fomina-0b1a7238",
    "dayana-richiez": "https://do.linkedin.com/in/dayana-richiez-b010504a",
    "teresa-sullivan": "https://do.linkedin.com/in/teresa-sullivan-8739b072",
}
UNAVAILABLE_INSTAGRAM = {"miguel-martinez", "karina-manzanillo", "luis-joel-lara-nova"}

# Both PDF variants show AEI and Best of DR 2024 for most staff. The second
# variant adds Luxury Homes Expert to the Location Expertise signatures.
PDF_CERT_OVERRIDES = {
    "candy-vander-horst": {"lux": True},
    "miguel-martinez": {"sr24": False, "sr23": True},
    "pamela-nunez": {"crs": True, "realtor": True, "sr23": True},
    "nathaly-martinez": {"sr24": False, "sr23": True},
    "mayelin-avila": {"sr24": False, "sr23": True},
    "teresa-sullivan": {"realtor": True},
}


def slug(value):
    value = unicodedata.normalize("NFKD", value)
    value = "".join(c for c in value if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def directory_contacts():
    """Read the source workbook without changing its data or formatting."""
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    with zipfile.ZipFile(DIRECTORY) as archive:
        sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
    out = {}
    for row in sheet.findall(".//m:sheetData/m:row", ns):
        if int(row.attrib["r"]) < 6:
            continue
        cells = []
        for cell in row.findall("m:c", ns):
            value = cell.find("m:v", ns)
            cells.append(value.text if value is not None and value.text else "")
        if len(cells) > 3 and cells[1].endswith("@canablue.com"):
            out[cells[1].lower()] = {"phone": cells[3], "row": int(row.attrib["r"])}
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pdf = pymupdf.open(PDF)
    pamela_original = json.loads((ROOT / "data" / "pamela_original.json").read_text(encoding="utf-8"))
    pamela_original["vis"]["qr"] = True  # The sole change requested for every signature.
    agents = []
    for page, xref, name, role, zona, community_ids, author in CATALOG:
        source = pdf[page - 1].get_text()
        if page in SECOND_PAGES:
            source += "\n" + pdf[page].get_text()
        phones = re.findall(r"\+\d[\d ()-]{7,25}", source)
        emails = re.findall(r"[\w.+-]+@canablue\.com", source, re.I)
        handles = re.findall(r"\b[\w.]+_canablue\.rd\b", source, re.I)
        phone = phones[0].strip() if phones else ""
        email = emails[0].lower() if emails else ""
        handle = handles[0].lower() if handles else ""
        key = slug(name)
        image = pdf.extract_image(xref)
        if not image or image["ext"] not in ("jpeg", "jpg", "png"):
            raise ValueError(f"Missing supported portrait for {name}, page {page}")
        ext = "jpg" if image["ext"] == "jpeg" else image["ext"]
        filename = f"{key}.{ext}"
        for old in OUT.glob(f"{key}.*"):
            if old.name != filename:
                old.unlink()
        (OUT / filename).write_bytes(image["image"])
        if key == "pamela-nunez":
            agents.append(pamela_original)
            continue
        communities = [dict(label=COMMUNITIES[k][0], url=COMMUNITIES[k][1], on=True)
                       for k in community_ids.split(",") if k]
        is_sales = "Sales" in role or "Broker" in role or role == "Resales Manager"
        certs = {"crs": False, "aei": True, "realtor": False,
                 "sr23": False, "sr24": True, "lux": page in SECOND_PAGES}
        certs.update(PDF_CERT_OVERRIDES.get(key, {}))
        agents.append({
            "key": key, "name": name, "role": role, "zona": zona,
            "tel": phone, "email": email, "web": "canablue.com",
            "dir": ADDRESS_SALES if is_sales or key in {"pelusa-miau", "mayelin-avila"} else ADDRESS_ADMIN,
            "dirUrl": MAPS,
            "listings": f"https://canablue.com/author/{author}/" if author else "",
            "communities": communities,
            "linkedin": LINKEDIN.get(key, ""),
            "instagram": f"https://www.instagram.com/{handle}/" if handle and key not in UNAVAILABLE_INSTAGRAM else "",
            "whatsapp": "https://wa.me/18492552500" if key == "candy-vander-horst" else "",
            "foto": PUBLIC + filename,
            "photoPosition": "center top" if key == "barbara-boruch" else "center center",
            "logo": LOGO,
            "tpl": "principal",
            "vis": {"foto": True, "zona": bool(zona), "social": True,
                    "listings": bool(author), "booking": False,
                    "community": bool(communities), "qr": True,
                    "certs": any(certs.values()), "legal": False},
            "iconStyle": "solid", "certsAlign": "center", "certs": certs,
            "source": {"pdfPage": page, "portraitXref": xref,
                       "listingsVerified": bool(author),
                       "expertise": "user update" if key in {"alejandro-angulo", "dayana-richiez", "leiny-poueriet", "magdalena-pietrusinska", "karina-manzanillo"} else "PDF",
                       "instagram": "unavailable" if key in UNAVAILABLE_INSTAGRAM else "PDF handle" if handle else "not in PDF"},
        })
    directory = directory_contacts()
    for email, name, role in DIRECTORY_ONLY:
        contact = directory[email]
        phone = contact["phone"] if contact["phone"] != "No localizado" else ""
        agents.append({
            "key": slug(name), "name": name, "role": role, "zona": "",
            "tel": phone, "email": email, "web": "canablue.com",
            "dir": ADDRESS_SALES, "dirUrl": MAPS,
            "listings": "", "communities": [], "linkedin": "", "instagram": "",
            "whatsapp": "",
            "foto": "", "logo": LOGO, "tpl": "principal",
            "vis": {"foto": False, "zona": False, "social": True,
                    "listings": False, "booking": False, "community": False,
                    "qr": True, "certs": False, "legal": False},
            "iconStyle": "solid", "certsAlign": "center",
            "certs": {k: False for k in ("crs", "aei", "realtor", "sr23", "sr24", "lux")},
            "source": {"directoryRow": contact["row"], "portrait": "not in PDF",
                       "note": "Supplied Carla author URL currently returns 404" if email == "carla@canablue.com" else ""},
        })
    DATA.write_text(json.dumps(agents, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(agents)} agents and portraits to {DATA.relative_to(ROOT)} / {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
