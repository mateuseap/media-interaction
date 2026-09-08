---
name: futurization-meap
description: Use when the user wants to map futures of a technology or media theme, producing a structured trend document with root disruptions, 1st/2nd/3rd order effects, and scenarios.
---

# Futurization Skill — meap

**Tested on:** Claude Code (Anthropic) and as a system instruction in GPT-4o chat.

## Core Principle

This skill does not produce future maps from guesses. It applies a structured futurology method — derived from Jerome Glenn's Futures Wheel, with technology-maturity filters and an adversarial round — to generate a trend document in the format required by course CIN0055.

The output **always** follows the fixed 12-section skeleton with YAML frontmatter. Never deliver only the wheel or only the summary.

---

## Phase 1 — Framing Interview

When receiving a vague theme or request, **stop immediately** and ask the questions below, one by one, waiting for an answer before continuing.

Mandatory questions (minimum):

1. **What is the exact theme?** Give a name of 3 to 7 words.
2. **What is the cut?** Technology, social practice, market, regulation, or infrastructure?
3. **Time horizon:** until what year? (suggest 5 to 10 years ahead)
4. **Who is this map for?** Researcher, company, policy maker, or general?
5. **Geographic scope:** global, Brazil, or another cut?
6. **What is already discarded?** Are there technologies or scenarios the user does not want to consider?
7. **Desired bias:** does the user want an optimistic, pessimistic, or neutral map?
8. **What does the user already know:** have they read anything recently? Do they have trusted or distrusted sources?

Only advance to Phase 2 when all questions have answers. If the user says "I don't know", note it as `null` and proceed.

---

## Phase 2 — Technology Maturity Triage

Before identifying root disruptions, classify every mentioned technology into one of three categories. **Write the classification explicitly.**

### Classification Criterion

| Category | Operational Definition | Rejection Test |
|---|---|---|
| **Mature** | Already a commodity or market standard for 3+ years. Works without surprise for most users. | If you cannot say what it *breaks* right now, it is mature. Reject as a root disruption. |
| **Emerging** | Exists as prototype, pilot, or niche. Has not scaled yet, but technical viability has been demonstrated. | Can enter as a root disruption *if* the user confirms a trigger to scale is still missing. |
| **Disruptive** | Breaks an established value chain or creates a new logic of use. Can be emerging or mature, but the effect is rupture, not incremental improvement. | Always a candidate for root disruption. |

**Golden rule:** if a technology appears in more than 50% of the target audience's devices or services, it is mature. If it has been a keynote topic for more than 5 years and still has not changed anything fundamental, it is mature.

List the technologies cited by the user, classify each one, and **ask for confirmation** before proceeding. If the user disagrees with the classification, discuss until convergence.

---

## Phase 3 — Root Disruption Identification

Based on the theme and Phase 1 answers, and respecting Phase 2 triage, list 2 to 4 root disruptions.

For each disruption, fill in:

- **What it breaks:** which practice, market, or expectation does it rupture?
- **Why now:** which technical, economic, regulatory, or social change made it possible *at this moment*?
- **What is still missing:** which trigger has not yet happened for it to materialize within the horizon?

If a disruption is classified as "probably mature" in Phase 2, **discard it** and inform the user why.

---

## Phase 4 — Futures Wheel Construction

For each root disruption, derive effects in three orders:

- **1st order:** direct, immediate, almost mechanical consequence.
- **2nd order:** consequence of the consequence — changes a behavior, a market, or an institution.
- **3rd order:** consequence of the second — restructuring of a field, of training, of value.

**Derivation rules:**

1. Each effect must be an affirmative sentence, one line.
2. Use `sinal: forte` for 1st order, `medio` for 2nd, `fraco` for 3rd.
3. Prazo: estimated year, within or near the horizon.
4. `confianca`: `alta` for 1st, `media` for 2nd, `baixa` for 3rd — and may be even lower if the effect is speculative.
5. Hierarchical IDs: `e1`, `e1.1`, `e1.1.1`.
6. Minimum 2, maximum 5 1st-order effects per disruption.
7. Not every N-order effect needs children — but the tree must have at least 3 branches with depth 3.

**Stopping criterion:** stop deriving when the effect becomes so indirect that you cannot name a specific causal mechanism. "Changes society" is not a 3rd-order effect — it is empty.

---

## Phase 5 — Adversarial Round (Doubt the Result)

Before formatting the output, **mandatorily** run the following destructive tests on every generated effect:

1. **Linear extrapolation:** is this effect just "what already happens, only more"? If yes, mark as `suspect`.
2. **Accelerated adoption:** does this effect assume a technology will be adopted faster than any comparable historical precedent? If yes, mark as `suspect`.
3. **Loose cause:** remove the root disruption. Would the 2nd or 3rd-order effect still happen for another reason? If yes, it does not derive from that root — mark as `discarded` or `reconnected`.
4. **User bias:** does the effect confirm the user's pre-existing belief about the theme? If yes, mark as `review`.

At the end of the adversarial round, produce a summary of failures found:
- How many effects were discarded?
- How many were kept with reservations?
- How many were rewritten?

Show this summary to the user. **Ask if they want to re-run any disruption.**

---

## Phase 6 — Formatting in the Course Standard

Generate the final document exactly in this structure. Do not omit sections. Do not change titles.

> **Note on language:** this skill operates in English, but the final trend document uses the literal section titles in Portuguese as required by course CIN0055's processing pipeline. All frontmatter keys and section headings must match the canonical Portuguese strings exactly.

### YAML Frontmatter (mandatory, at the top)

```yaml
---
tema: <theme name>
slug: <theme-slug>
autor_login: meap
zona_de_interesse: <area>
data: <YYYY-MM-DD>
horizonte: <year>
publico: <who it serves, or null>
recorte_geografico: <global|brasil|...>
disrupcoes_raiz: <number>
efeitos_ordem_1: <number>
efeitos_ordem_2: <number>
efeitos_ordem_3: <number>
tecnologias_citadas: [<list>]
fontes: <number of sources listed in section 11>
confianca: <alta|media|baixa>
experimento: <description of proposed experiment>
skill_usada: futurization-meap
publico_ok: false
---
```

### Fixed Sections (literal titles, numbered)

```markdown
## 1. Resumo

<5-8 line paragraph>

## 2. O tema

<definition, fit in media and interaction, why it deserves a future map>

## 3. Onde isso está hoje

<current state with anchor sources in the present>

## 4. As disrupções-raiz

### 4.1. <disruption 1 name>
<what it breaks, why now, what is missing>

### 4.2. <disruption 2 name>
(...)

## 5. A roda dos futuros

```yaml
roda:
  - disrupcao: <name>
    efeitos:
      - id: e1
        ordem: 1
        efeito: <affirmative sentence>
        sinal: forte
        prazo: <year>
        confianca: alta
        efeitos:
          - id: e1.1
            ordem: 2
            efeito: <...>
            sinal: medio
            prazo: <year>
            confianca: media
            efeitos:
              - id: e1.1.1
                ordem: 3
                efeito: <...>
                sinal: fraco
                prazo: <year>
                confianca: baixa
```

<prose commenting what the YAML cannot say>

## 6. Sinais fracos e wildcards

<what barely appears today but would change the whole map>

## 7. Contra o próprio mapa

<likely errors, extrapolations, user bias>

## 8. O que a máquina errou

<AI errors during construction>

## 9. Três cenários para <horizon year>

### 9.1. Provável
<past-tense paragraph>

### 9.2. Desejável
<...>

### 9.3. Indesejável
<...>

## 10. O experimento

<what can be built today>

## 11. Fontes

1. <link> — <what it supports> — <reliability assessment>
2. (...)

## 12. Anexo — o levantamento bruto

<complete skill outputs, discarded rounds, cut effects, abandoned paths, failed searches>
```

---

## Output Instructions for the Agent

- Never produce the final document without going through Phases 1 to 5.
- Never accept a theme without an interview.
- Never classify a technology as disruptive without applying the maturity test.
- Never omit the adversarial round.
- Never alter the 12 section titles.
- Always include the wheel YAML exactly in the specified structure.
- Always fill all frontmatter fields; use `null` when not applicable.
- Always write the scenarios in section 9 in the past tense, as if the horizon year had already arrived.
- Always include section 12, even if long and messy — it is the raw process record.

---

## Minimal Interaction Example

**User:** "I want a future map for XR."

**Skill:** "Before producing, I need to frame the request. Answer:
1. What is the exact theme? 'XR' is broad — do you mean extended reality in general, or a specific branch (AR, VR, MR)?
2. What is the cut? Technology, market, social practice, regulation?
3. What time horizon? (I suggest 2030)
4. Who is this map for?
5. Region: global, Brazil, or other?
6. What to discard? Any technology or scenario out of scope?
7. Desired bias: optimistic, pessimistic, neutral?
8. Have you read anything recently about this theme?"

[Waits for answers.]

[Executes Phases 2 to 6.]
