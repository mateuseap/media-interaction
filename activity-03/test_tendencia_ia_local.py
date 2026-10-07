import re
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

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
URL_PATTERN = re.compile(r"https://[^\s)]+")


def yaml_block_after(text: str, heading: str) -> str:
    section = text.split(heading, 1)[1].split("\n## ", 1)[0]
    match = re.search(r"```yaml\n(.*?)\n```", section, flags=re.DOTALL)
    assert match, f"missing YAML block after {heading}"
    return match.group(1)


def validate_effect(
    effect: object, parent_id: str | None = None, parent_order: int | None = None
) -> tuple[int, int, int]:
    assert isinstance(effect, dict), "every effect must be a mapping"
    assert EFFECT_FIELDS <= effect.keys(), f"missing effect fields: {EFFECT_FIELDS - effect.keys()}"
    assert isinstance(effect["id"], str) and effect["id"], "effect id must be a nonempty string"
    assert parent_id is None or effect["id"].startswith(f"{parent_id}."), "child id must extend parent id"
    assert effect["ordem"] in {1, 2, 3}, "effect ordem must be 1, 2, or 3"
    assert parent_order is None or effect["ordem"] == parent_order + 1, "child order must follow parent"
    assert isinstance(effect["efeito"], str) and effect["efeito"].endswith("."), "effect must be an affirmative sentence"
    assert effect["sinal"] in {"forte", "medio", "fraco"}, "invalid effect sinal"
    assert isinstance(effect["prazo"], int) and 2026 <= effect["prazo"] <= 2031, "prazo outside horizon"
    assert effect["confianca"] in {"alta", "media", "baixa"}, "invalid effect confianca"

    counts = [0, 0, 0]
    counts[effect["ordem"] - 1] = 1
    children = effect.get("efeitos", [])
    assert isinstance(children, list), "effect children must be a list"
    for child in children:
        child_counts = validate_effect(child, effect["id"], effect["ordem"])
        counts = [left + right for left, right in zip(counts, child_counts)]
    return tuple(counts)


def response_status(url: str, method: str) -> int | None:
    request = Request(url, method=method, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(request, timeout=20) as response:
            return response.status
    except (HTTPError, URLError):
        return None


def assert_http_200(url: str) -> None:
    status = response_status(url, "HEAD")
    if status != 200:
        status = response_status(url, "GET")
    assert status == 200, f"{url} returned {status}"


assert DOCUMENT.exists(), "missing tendencia-ia-local.md"
text = DOCUMENT.read_text(encoding="utf-8")
frontmatter_match = re.match(r"\A---\n(.*?)\n---\n", text, flags=re.DOTALL)
assert frontmatter_match, "missing YAML frontmatter"
frontmatter = yaml.safe_load(frontmatter_match.group(1))
assert isinstance(frontmatter, dict), "frontmatter must be a mapping"
assert REQUIRED_FRONTMATTER <= frontmatter.keys(), (
    f"missing frontmatter fields: {REQUIRED_FRONTMATTER - frontmatter.keys()}"
)
assert frontmatter["autor_login"] == "meap", "autor_login must be meap"
assert frontmatter["horizonte"] == 2031, "horizonte must be 2031"
assert frontmatter["skill_usada"] == "futurization-meap", "skill_usada must be futurization-meap"
assert [line for line in text.splitlines() if line.startswith("## ")] == EXPECTED_TITLES

wheel = yaml.safe_load(yaml_block_after(text, "## 5. A roda dos futuros"))
assert isinstance(wheel, dict) and isinstance(wheel.get("roda"), list), "roda must be a YAML list"
assert len(wheel["roda"]) == frontmatter["disrupcoes_raiz"], "root disruption count differs"
counts = [0, 0, 0]
for root in wheel["roda"]:
    assert isinstance(root, dict), "root disruption must be a mapping"
    assert isinstance(root.get("disrupcao"), str) and root["disrupcao"], "missing root disruption name"
    assert isinstance(root.get("efeitos"), list) and root["efeitos"], "root disruption needs effects"
    for effect in root["efeitos"]:
        effect_counts = validate_effect(effect)
        counts = [left + right for left, right in zip(counts, effect_counts)]
assert counts == [
    frontmatter["efeitos_ordem_1"],
    frontmatter["efeitos_ordem_2"],
    frontmatter["efeitos_ordem_3"],
], "wheel effect counts differ from frontmatter"

sources = text.split("## 11. Fontes", 1)[1].split("## 12. Anexo", 1)[0]
urls = [url.rstrip(".,;:") for url in URL_PATTERN.findall(sources)]
assert urls, "section 11 must cite URLs"
assert len(urls) == frontmatter["fontes"], "source count differs from frontmatter"
for source_url in urls:
    assert_http_200(source_url)

print(f"validated {DOCUMENT.name}: {len(urls)} sources, {sum(counts)} effects")
