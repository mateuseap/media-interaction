import re
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import HTTPRedirectHandler, Request, build_opener

try:
    import yaml
except ImportError as exc:
    raise SystemExit("PyYAML is required to validate tendencia-ia-local.md") from exc

DOCUMENT = Path(__file__).with_name("tendencia-ia-local.md")
EXPECTED_TITLES = [
    "## 1. Resumo",
    "## 2. O tema",
    "## 3. Onde isso está hoje",
    "## 4. As disrupções-raiz",
    "## 5. A roda dos futuros",
    "## 6. Sinais fracos e wildcards",
    "## 7. Contra o próprio mapa",
    "## 8. O que a máquina errou",
    "## 9. Três cenários para 2031",
    "## 10. O experimento",
    "## 11. Fontes",
    "## 12. Anexo — o levantamento bruto",
]
REQUIRED_FRONTMATTER = {
    "tema",
    "slug",
    "autor_login",
    "zona_de_interesse",
    "data",
    "horizonte",
    "publico",
    "recorte_geografico",
    "disrupcoes_raiz",
    "efeitos_ordem_1",
    "efeitos_ordem_2",
    "efeitos_ordem_3",
    "tecnologias_citadas",
    "fontes",
    "confianca",
    "experimento",
    "skill_usada",
    "publico_ok",
}
EFFECT_FIELDS = {"id", "ordem", "efeito", "sinal", "prazo", "confianca"}
SIGNAL_BY_ORDER = {1: "forte", 2: "medio", 3: "fraco"}
URL_PATTERN = re.compile(r"https://[^\s)]+")


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


NO_REDIRECT_OPENER = build_opener(NoRedirect())


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def yaml_block_after(text: str, heading: str) -> str:
    check(heading in text, f"missing section {heading}")
    section = text.split(heading, 1)[1].split("\n## ", 1)[0]
    match = re.search(r"```yaml\n(.*?)\n```", section, flags=re.DOTALL)
    check(match is not None, f"missing YAML block after {heading}")
    return match.group(1)


def validate_effect(
    effect: object, parent_id: str | None = None, parent_order: int | None = None
) -> tuple[int, int, int, int]:
    check(isinstance(effect, dict), "every effect must be a mapping")
    check(EFFECT_FIELDS <= effect.keys(), f"missing effect fields: {EFFECT_FIELDS - effect.keys()}")
    check(isinstance(effect["id"], str) and bool(effect["id"]), "effect id must be a nonempty string")
    check(parent_id is None or effect["id"].startswith(f"{parent_id}."), "child id must extend parent id")
    check(effect["ordem"] in SIGNAL_BY_ORDER, "effect ordem must be 1, 2, or 3")
    check(parent_order is None or effect["ordem"] == parent_order + 1, "child order must follow parent")
    check(isinstance(effect["efeito"], str) and effect["efeito"].endswith("."), "effect must be an affirmative sentence")
    check(effect["sinal"] == SIGNAL_BY_ORDER[effect["ordem"]], "effect signal must match order")
    check(isinstance(effect["prazo"], int) and 2026 <= effect["prazo"] <= 2031, "prazo outside horizon")
    check(effect["confianca"] in {"alta", "media", "baixa"}, "invalid effect confianca")

    counts = [0, 0, 0, 0]
    counts[effect["ordem"] - 1] = 1
    children = effect.get("efeitos", [])
    check(isinstance(children, list), "effect children must be a list")
    if effect["ordem"] == 3:
        counts[3] = 1
        check(not children, "third-order effects cannot have children")
    for child in children:
        child_counts = validate_effect(child, effect["id"], effect["ordem"])
        counts = [left + right for left, right in zip(counts, child_counts)]
    return tuple(counts)


def direct_response_status(url: str, method: str) -> int | None:
    request = Request(url, method=method, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with NO_REDIRECT_OPENER.open(request, timeout=20) as response:
            return response.status
    except HTTPError as error:
        return error.code
    except URLError:
        return None


def check_http_200(url: str) -> None:
    status = direct_response_status(url, "HEAD")
    if status != 200:
        status = direct_response_status(url, "GET")
    check(status == 200, f"{url} returned direct HTTP {status}")


check(DOCUMENT.exists(), "missing tendencia-ia-local.md")
text = DOCUMENT.read_text(encoding="utf-8")
frontmatter_match = re.match(r"\A---\n(.*?)\n---\n", text, flags=re.DOTALL)
check(frontmatter_match is not None, "missing YAML frontmatter")
frontmatter = yaml.safe_load(frontmatter_match.group(1))
check(isinstance(frontmatter, dict), "frontmatter must be a mapping")
check(REQUIRED_FRONTMATTER <= frontmatter.keys(), f"missing frontmatter fields: {REQUIRED_FRONTMATTER - frontmatter.keys()}")
check(frontmatter["autor_login"] == "meap", "autor_login must be meap")
check(frontmatter["horizonte"] == 2031, "horizonte must be 2031")
check(frontmatter["skill_usada"] == "futurization-meap", "skill_usada must be futurization-meap")
check([line for line in text.splitlines() if line.startswith("## ")] == EXPECTED_TITLES, "section titles differ")

wheel = yaml.safe_load(yaml_block_after(text, "## 5. A roda dos futuros"))
check(isinstance(wheel, dict) and isinstance(wheel.get("roda"), list), "roda must be a YAML list")
check(len(wheel["roda"]) == frontmatter["disrupcoes_raiz"], "root disruption count differs")
counts = [0, 0, 0, 0]
for root in wheel["roda"]:
    check(isinstance(root, dict), "root disruption must be a mapping")
    check(isinstance(root.get("disrupcao"), str) and bool(root["disrupcao"]), "missing root disruption name")
    effects = root.get("efeitos")
    check(isinstance(effects, list) and 2 <= len(effects) <= 5, "each root needs 2 to 5 first-order effects")
    for effect in effects:
        effect_counts = validate_effect(effect, parent_order=0)
        counts = [left + right for left, right in zip(counts, effect_counts)]
check(counts[:3] == [
    frontmatter["efeitos_ordem_1"],
    frontmatter["efeitos_ordem_2"],
    frontmatter["efeitos_ordem_3"],
], "wheel effect counts differ from frontmatter")
check(counts[3] >= 3, "wheel needs at least 3 third-order branches")

sources = text.split("## 11. Fontes", 1)[1].split("## 12. Anexo", 1)[0]
urls = [url.rstrip(".,;:") for url in URL_PATTERN.findall(sources)]
check(bool(urls), "section 11 must cite URLs")
check(len(urls) == frontmatter["fontes"], "source count differs from frontmatter")
for source_url in urls:
    check_http_200(source_url)

DECK = Path(__file__).with_name("presentation") / "index.html"
check(DECK.exists(), "missing presentation/index.html")
deck = DECK.read_text(encoding="utf-8")
slide_count = len(re.findall(r'<section class="slide[ "]', deck))
check('<main class="deck"' in deck, "deck needs main.deck")
check(12 <= slide_count <= 14, f"deck needs 12 to 14 slides, has {slide_count}")
for needle in ("keydown", "location.hash", "hashchange", "requestFullscreen", "prefers-reduced-motion", "aria-label"):
    check(needle in deck, f"deck missing {needle}")
check("—" not in deck, "deck must not use em dash")
check(not re.search(r"<script[^>]+src=", deck), "deck must not load external scripts")

print(f"validated {DOCUMENT.name}: {len(urls)} sources, {sum(counts[:3])} effects; deck: {slide_count} slides")
