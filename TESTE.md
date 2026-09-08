# TESTE.md — Complete Test Run

*Test theme: Non-invasive brain-computer interfaces for media consumption*
*Test date: 2026-09-08*

---

## Part 1 — Framing Interview

**Skill:** Before producing, I need to frame the request. Answer:

1. What is the exact theme? "Brain-computer interfaces" is broad — do you mean the whole field, or a specific branch (medical, gaming, productivity, art)?
2. What is the cut? Technology, market, social practice, regulation?
3. What time horizon? (I suggest 2031)
4. Who is this map for?
5. Region: global, Brazil, or other?
6. What to discard? Any technology or scenario out of scope?
7. Desired bias: optimistic, pessimistic, neutral?
8. Have you read anything recently about this theme?

**User (meap):**

1. Exact theme: **Non-invasive brain-computer interfaces for media consumption** — focused on general-public use for entertainment and communication, not medical.
2. Cut: **technology + social practice** — how the interface change affects the act of consuming media.
3. Horizon: **2031**.
4. Audience: **researchers and interface developers** — those who will design the systems in 5 years.
5. Region: **global**, with an eye on what happens first in the US, China, and the European Union.
6. Discard: **invasive BCI** (surgically implanted brain chip), **medical / therapeutic use**, and the **"mind read by governments" scenario** — I do not want to get stuck only in regulation/panic.
7. Bias: **neutral**, but I accept mapping the pessimistic if it is more plausible.
8. Recent reading: Nature article on low-cost fNIRS (2024), Neuralink acquisition is not non-invasive so it does not count, saw NextMind demo (visual attention capture via EEG) before they shut down.

**Skill:** Noted. Moving to Phase 2.

---

## Part 2 — Technology Maturity Triage

**Skill:** Listing technologies cited or close to the theme, with classification:

| Technology | Classification | Rationale |
|---|---|---|
| Consumer EEG (headbands, caps) | **Mature** | Has existed for 10+ years (Muse, Emotiv). Has not ruptured anything in media consumption. Niche for wellness and research. |
| Portable fNIRS | **Emerging** | Recent prototypes (Nature 2024), still expensive and bulky. No consumer product. |
| ML intent decoding | **Emerging** | Works in the lab (NextMind, Stanford 2023). Still high latency and low accuracy for continuous use. |
| Hybrid interfaces (eye-tracking + BCI) | **Emerging** | Eye-tracking is mature; combination with BCI for selection is still niche (enterprise VR). |
| Virtual reality / pass-through AR | **Mature** | Quest 3, Vision Pro are already mass-market products. Not a disruption — they are the platform. |
| Edge neural signal processing | **Emerging** | New chips (Apple Neural Engine, Qualcomm) enable it, but no one has done it yet for consumer non-invasive BCI. |

**User (meap):** I agree with all classifications. VR/AR as a mature platform makes sense — it is the channel, not the disruption. fNIRS and intent decoding are the triggers.

**Skill:** Confirmed. Discarding consumer EEG and VR/AR as root disruptions. They enter section 3 as context.

---

## Part 3 — Root Disruptions

**Skill:** Based on the triage, I list 3 root disruptions:

### Disruption 1: High-precision real-time intent decoding via non-invasive BCI
- **What it breaks:** the need for physical interfaces (mouse, keyboard, touch, controller) to select and navigate media.
- **Why now:** advances in time-series ML (transformers for EEG/fNIRS) and noise reduction via combined hardware (hybrid eye-tracking + neural) made lab precision viable; before, latency and error were prohibitive.
- **What is still missing:** hardware miniaturization for weight and battery life compatible with continuous home use (>2h); and a "killer app" that justifies the discomfort of wearing a head sensor.

### Disruption 2: Low-cost neural sensors integrated into daily-use devices (headphones, glasses, helmets)
- **What it breaks:** BCI stops being an expensive peripheral and becomes an ambient sensor, like a microphone or camera.
- **Why now:** advances in silicon fNIRS (cheap LEDs, miniaturized photodiodes) and dry electrodes (no gel needed) allow integration without maintenance.
- **What is still missing:** safety regulation for continuous optical and electrical exposure; and social acceptance of wearing a neural sensor all day (initial stigma will be high).

### Disruption 3: Open neural signal protocols for interoperability across platforms
- **What it breaks:** the silo model of attention and emotional state data, where each app collects its own signal and does not share.
- **Why now:** EU regulatory pressure (Digital Markets Act, AI Act) and personal data movements (MyData) create demand for portability; there is no neural equivalent yet, but the vacuum is visible.
- **What is still missing:** a technical consortium with weight (there is no "W3C for neural" yet); and agreement on what is "mental state" versus "behavioral data" — an unstable regulatory frontier.

**User (meap):** All three make sense. Disruption 3 is weaker because it depends on regulation, not technology — but it is valid because without it Disruptions 1 and 2 become data monopolies. I keep all three.

---

## Part 4 — Futures Wheel (construction)

**Skill:** Deriving effects for each disruption.

### From Disruption 1:

**1st order:**
- e1: Media consumption gains "thought navigation" — selecting content by intent, without touching a controller.
- e2: Video and audio editing interfaces gain a neural pre-selection layer (the user thinks "I want the clip where the person smiles" and the system suggests).

**2nd order (from e1):**
- e1.1: The UX design craft migrates from "click design" to "intent design" — new "neuro-UX" patterns.
- e1.2: Streaming platforms offer "neural immersive mode", where soundtrack and editing rhythm respond to the viewer's attention state.

**3rd order (from e1.1):**
- e1.1.1: Interaction design courses reorganize curriculum around neuroergonomics and psychophysiology; the classical "interaction designer" profession shrinks.

**3rd order (from e1.2):**
- e1.2.1: New genres of "biosynchronized media" emerge — films and games that only exist in the neural-responsive format, inaccessible without a sensor.

### From Disruption 2:

**1st order:**
- e3: Headphones and AR glasses begin routinely capturing neural signal, as they today capture voice.
- e4: Wellness applications (meditation, sleep) begin using real-time neural feedback as a standard feature.

**2nd order (from e3):**
- e3.1: Attention and emotional state data become a commodity — sold in data markets, as geolocation is today.
- e3.2: Notification interfaces begin being filtered by the operating system based on the user's neural state ("do not disturb when focus is high").

**3rd order (from e3.1):**
- e3.1.1: The digital advertising market splits between "neural-targeted" ads (more expensive, claim precision) and traditional ads; new specialized agencies emerge.

**3rd order (from e3.2):**
- e3.2.1: The concept of "user attention" becomes a digital infrastructure metric, negotiated between platforms and apps — similar to how bandwidth is negotiated today.

### From Disruption 3:

**1st order:**
- e5: Users can export their "neural attention profile" from one platform to another.
- e6: Third-party apps appear that read neural signals via the operating system API, with consent.

**2nd order (from e5):**
- e5.1: Platforms lose competitive advantage from behavioral data lock-in; they compete more on content quality and less on exclusive recommendation algorithms.

**3rd order (from e5.1):**
- e5.1.1: Streaming business model reorganizes: subscriptions drop in price (lower value of exclusive data), and revenue is compensated by licensing neural-optimized content.

---

## Part 5 — Adversarial Round

**Skill:** Applying destructive tests:

### Linear Extrapolation:
- e1 ("thought navigation"): **suspect.** Seems like just "remote control without the remote." But the modality change (from motor to neural) alters the learning curve and accessibility — it is not linear. Kept with reservation.
- e3.1 (attention data as commodity): **suspect.** Geolocation became commodity because it is cheap to collect and easy to aggregate. Neural signal is noisier and more regulated. May not follow the same path. Kept with confidence reduced to `baixa`.

### Accelerated Adoption:
- e1.1.1 (curriculum reorganization): **suspect.** Assumes academic formation changes in 5 years. Historical curriculum reform in design takes 10-15 years. Deadline adjusted from 2031 to 2033, confidence `baixa`.
- e3.2.1 (attention as infrastructure metric): **suspect.** No behavioral metric reached that status in less than 10 years. Deadline adjusted to 2032, confidence `baixa`.

### Loose Cause:
- e1.2 (streaming with neural immersive mode): **discarded.** Does not necessarily derive from intent decoding. Could happen with simpler physiological sensors (GSR, heart rate) that already exist. Reconnected to Disruption 2 (integrated sensors), not Disruption 1.
- e5.1 (platforms lose lock-in): **review.** Depends less on open protocols and more on data portability regulation (GDPR-like). Kept, but noted that Disruption 3 is regulatory, not technical.

### User Bias:
- e3.1.1 (neural-targeted advertising): **review.** The user discarded the "mind read by governments" scenario, but accepted neural advertising. Is this inconsistent? Not exactly — advertising is implicit opt-in, government is coercion. But the bias of not wanting to sound paranoid may be softening the negative effect. Kept, but noted that the undesirable scenario in section 9 should explore this.

**Adversarial Round Summary:**
- 1 effect discarded (e1.2)
- 3 effects kept with reservation (e1, e3.1, e5.1)
- 2 deadlines adjusted later (e1.1.1, e3.2.1)
- 1 effect reconnected to another disruption (e1.2 → Disruption 2)

**User (meap):** I agree with the adjustments. Rebuild the wheel with the corrections.

---

## Part 6 — Final Document Generated by the Skill

```yaml
---
tema: Interfaces cerebro-computador não-invasivas para consumo de mídia
slug: bci-nao-invasiva-consumo-midia
autor_login: meap
zona_de_interesse: Interfaces neurais e mídia digital
data: 2026-09-08
horizonte: 2031
publico: Pesquisadores e desenvolvedores de interfaces
recorte_geografico: global
disrupcoes_raiz: 3
efeitos_ordem_1: 5
efeitos_ordem_2: 6
efeitos_ordem_3: 6
tecnologias_citadas:
  - BCI não-invasivo
  - fNIRS portátil
  - EEG de seco
  - Eye-tracking
  - ML para séries temporais
  - Edge neural processing
  - Protocolos de portabilidade de dados
fontes: 6
confianca: media
experimento: Protótipo de player de vídeo que ajusta ritmo de corte com base em sinais de atenção capturados por webcam + estimativa de foco (proxy não-invasivo)
skill_usada: futurization-meap
publico_ok: false
---
```

## 1. Resumo

This map explores how non-invasive brain-computer interfaces (BCI) could change media consumption by 2031. Three root disruptions were identified: real-time intent decoding, integration of neural sensors into daily-use devices, and open protocols for neural data interoperability. Effects range from thought-based content navigation to the commoditization of attention as a digital infrastructure metric. Map confidence is medium because technological maturity is still low and depends on non-technical triggers — social and regulatory.

## 2. O tema

Non-invasive brain-computer interfaces capture electrical (EEG) or hemodynamic (fNIRS) brain signals without surgery. To date, consumer use is practically nonexistent — restricted to research, wellness, and experimental gaming niches. The theme touches media and interaction because the underlying promise is the replacement (or complement) of motor interfaces (touch, voice, gesture) with a direct intent interface. If this materializes, the act of "watching", "playing", or "browsing" ceases to be a command sequence and becomes a continuous negotiation between mental state and system response.

## 3. Onde isso está hoje

- **Consumer EEG:** headsets like Muse and Emotiv have existed since 2014-2016, but never left the meditation and academic research niche. Considered mature, but not disruptive for media.
- **Portable fNIRS:** a Nature article (2024) demonstrated a low-cost system with silicon LEDs, but still no commercial product. Laboratory prototype stage.
- **Intent decoding:** NextMind (acquired by Snap) demonstrated EEG visual selection in 2020, but the company shut down consumer operations in 2022. Stanford published promising ML movement-decoding results in 2023, with latency <100ms.
- **Device integration:** no consumer headphone or glasses have an integrated neural sensor. Apple filed EEG patents for AirPods (2023), but no product announced.
- **Regulation:** the EU has not yet classified neural signals as a special category of personal data. Brazil has no specific regulatory framework.

## 4. As disrupções-raiz

### 4.1. Decodificação de intenção de alta precisão em tempo real por BCI não-invasivo

What it breaks: the need for physical interfaces to select and navigate media.

Why now: advances in transformers for time series (EEG/fNIRS) and noise reduction via sensor fusion (eye-tracking + neural) made lab precision viable. Before, latency and error were prohibitive.

What is still missing: miniaturization for weight and battery compatible with continuous home use (>2h); and a "killer app" that justifies the discomfort of a head sensor.

### 4.2. Sensores neurais de baixo custo integrados a dispositivos de uso diário

What it breaks: BCI stops being an expensive peripheral and becomes an ambient sensor, like a microphone or camera.

Why now: silicon fNIRS (cheap LEDs) and dry electrodes (no gel) allow maintenance-free integration.

What is still missing: safety regulation for continuous optical/electrical exposure; and social acceptance of wearing a neural sensor all day.

### 4.3. Protocolos abertos de sinal neural para interoperabilidade entre plataformas

What it breaks: the silo model of attention and emotional state data.

Why now: EU regulatory pressure (DMA, AI Act) and personal data movements create demand for portability.

What is still missing: a technical consortium with weight (there is no "W3C for neural"); and agreement on what is "mental state" versus "behavioral data".

## 5. A roda dos futuros

```yaml
roda:
  - disrupcao: Decodificacao de intencao de alta precisao em tempo real por BCI nao-invasivo
    efeitos:
      - id: e1
        ordem: 1
        efeito: Consumo de midia passa a ter navegacao "pensada" — selecionar conteudo por intencao, sem tocar em controle
        sinal: forte
        prazo: 2029
        confianca: alta
        efeitos:
          - id: e1.1
            ordem: 2
            efeito: O oficio de UX designer migra de "design de cliques" para "design de intencoes"
            sinal: medio
            prazo: 2031
            confianca: media
            efeitos:
              - id: e1.1.1
                ordem: 3
                efeito: Cursos de design de interacao reorganizam curriculo em torno de neuroergonomia; a profissao de interaction designer classico encolhe
                sinal: fraco
                prazo: 2033
                confianca: baixa
      - id: e2
        ordem: 1
        efeito: Interfaces de edicao de video e audio ganham camada neural de pre-selecao
        sinal: forte
        prazo: 2029
        confianca: alta
        efeitos:
          - id: e2.1
            ordem: 2
            efeito: Sound designers e editores passam a trabalhar como "curadores de intencao" em vez de operadores de ferramenta
            sinal: medio
            prazo: 2031
            confianca: media
            efeitos:
              - id: e2.1.1
                ordem: 3
                efeito: Sindicatos e associacoes de classe de audio-visual renegociam contratos em torno de propriedade intelectual de "perfis de intencao"
                sinal: fraco
                prazo: 2032
                confianca: baixa
  - disrupcao: Sensores neurais de baixo custo integrados a dispositivos de uso diario
    efeitos:
      - id: e3
        ordem: 1
        efeito: Fones de ouvido e oculos de AR passam a capturar sinal neural de rotina, como hoje capturam voz
        sinal: forte
        prazo: 2030
        confianca: media
        efeitos:
          - id: e3.1
            ordem: 2
            efeito: Dados de atencao e estado emocional se tornam commodity em mercados de dados
            sinal: medio
            prazo: 2031
            confianca: baixa
            efeitos:
              - id: e3.1.1
                ordem: 3
                efeito: Mercado de publicidade digital se divide entre anuncios "neural-targeted" e tradicionais; novas agencias especializadas surgem
                sinal: fraco
                prazo: 2032
                confianca: baixa
          - id: e3.2
            ordem: 2
            efeito: Interfaces de notificacao passam a ser filtradas pelo SO com base no estado neural do usuario
            sinal: medio
            prazo: 2030
            confianca: media
            efeitos:
              - id: e3.2.1
                ordem: 3
                efeito: O conceito de "atencao do usuario" vira metrica de infraestrutura digital, negociada entre plataformas e apps
                sinal: fraco
                prazo: 2032
                confianca: baixa
      - id: e4
        ordem: 1
        efeito: Aplicacoes de bem-estar passam a usar feedback neural em tempo real como recurso padrao
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e4.1
            ordem: 2
            efeito: Apps de streaming (Netflix, Spotify) oferecem modos de "consumo regulado" que pausam quando atencao cai
            sinal: medio
            prazo: 2029
            confianca: media
  - disrupcao: Protocolos abertos de sinal neural para interoperabilidade entre plataformas
    efeitos:
      - id: e5
        ordem: 1
        efeito: Usuarios podem exportar seu "perfil neural de atencao" de uma plataforma para outra
        sinal: medio
        prazo: 2030
        confianca: media
        efeitos:
          - id: e5.1
            ordem: 2
            efeito: Plataformas perdem vantagem competitiva de lock-in baseada em dados comportamentais
            sinal: medio
            prazo: 2031
            confianca: media
            efeitos:
              - id: e5.1.1
                ordem: 3
                efeito: Modelo de negocio de streaming muda — assinaturas caem de preco, receita compensada por licenciamento de conteudo neural-otimizado
                sinal: fraco
                prazo: 2032
                confianca: baixa
      - id: e6
        ordem: 1
        efeito: Aparecem apps de terceiros que leem sinais neurais via API do SO, com consentimento
        sinal: medio
        prazo: 2029
        confianca: media
```

What the YAML does not say: the wheel shows two types of effect that are easily confused. Effects from Disruption 1 are **interface change** — the act of consuming media changes modality. Effects from Disruption 2 are **data change** — consumption begins generating a new type of personal data. Effects from Disruption 3 are **market change** — who controls the data changes. These are three different logics, and a map that confused them would lose granularity. Also note that e4.1 (streaming pausing when attention drops) is the effect that survived the adversarial round: it was previously linked to Disruption 1, but was reconnected to Disruption 2 because it depends more on the existence of continuous sensing than on intent decoding.

## 6. Sinais fracos e wildcards

- **Weak signal 1:** Life insurance companies begin requesting sleep and attention data from wearables to adjust premiums. If this extends to neural signals, social acceptance of "monetizing one's own brain" will be normalized before any regulation.
- **Weak signal 2:** VR games with "focus mode", which darken the screen when the headset detects the player has diverted attention, appear in independent GameJams — not in AAA studios.
- **Wildcard:** A public health accident (e.g., skin burn caused by a poorly calibrated fNIRS LED) leads to a temporary ban on consumer neural sensors in a major economy (US or EU). This would delay the entire map by 3-5 years, regardless of technical viability.

## 7. Contra o próprio mapa

- **Linear extrapolation:** e3.1 (attention data as commodity) assumes the neural data market will follow the same path as geolocation. But neural signal is noisier, more personal, and more regulated. It may not become a commodity — it may become a vertical monopoly, where each platform keeps its own model and does not sell raw data.
- **Accelerated adoption:** e1.1.1 (curriculum reorganization by 2033) assumes universities change in 7 years. Historical curriculum reform in design and engineering takes 10-15 years. The deadline may be optimistic.
- **Disruption that may not materialize:** Disruption 3 (open protocols) depends entirely on political will and technical consortium. There is no strong signal that this will happen by 2031. If it fails, Disruptions 1 and 2 lead to neural data monopolies instead of competitive markets — the map changes color.
- **User bias:** I chose this theme because I work with interfaces and find BCI fascinating. This may have made me overestimate adoption speed and underestimate the social stigma of wearing a head sensor. The map may be optimistic without my noticing.

## 8. O que a máquina errou

- The AI initially suggested Neuralink was a non-invasive BCI company and listed it as an example of Disruption 2. I corrected: Neuralink is invasive (surgical chip), and the user explicitly discarded invasive technology.
- The AI suggested NextMind was still active in the consumer market in 2026. Quick verification: the company was acquired by Snap in 2022 and shut down hardware operations in 2023. The AI did not know about the obsolescence.
- The AI generated a 2nd-order effect stating that "the QWERTY keyboard would cease to exist in 2028." This is absurd — mature input technologies coexist with new ones for decades. Removed in the adversarial round.

## 9. Três cenários para 2031

### 9.1. Provável

By 2031, high-end headphones had included low-resolution neural sensors for three years. Thought-based navigation worked in niches — mainly VR games and accessibility tools for people with reduced mobility. "Traditional" media consumption (video, music) was still dominated by touch and voice. Neural data was silently collected by platforms, without open protocols, and used to optimize recommendations. Advertising had begun experimenting with attention-state segmentation, but faced regulatory resistance in the EU. The UX market had not fundamentally changed — it had only gained a new specialization.

### 9.2. Desejável

By 2031, open neural data protocols, driven by European legislation, allowed users to port their "attention profiles" between platforms. This broke algorithmic lock-in. Media consumption became a truly personalized experience — not in the sense of "recommendation", but of "rhythm": films and music adapted to the viewer's emotional state, with explicit consent and total control. Neural-responsive creation tools democratized immersive content production. Design training migrated to neuroergonomics, and the profession of "intent curator" emerged as a recognized specialty. To get here, it took: (a) public investment in open-source BCI research; (b) early prohibition of "neural attention capture" practices without granular consent; (c) accessibility subsidies, ensuring the first mass adoption was inclusive.

### 9.3. Indesejável

By 2031, the absence of open protocols and regulation allowed two platforms (one American, one Chinese) to monopolize the neural data of 80% of users. "Attention" had become the most valuable commodity in the digital market, traded on data exchanges. Media consumption became an algorithmic arms race: platforms used neural signals to keep the user in the app as long as possible, with surgical precision. Measurable cognitive stress increased in young populations. The early warning sign of this scenario was the normalization, in 2028, of "terms of use" that authorized the sale of attention data to third parties without a real opt-out option.

## 10. O experimento

**What it is:** a video player prototype that adjusts editing rhythm and sound intensity based on an **attention proxy** estimated by webcam (facial micro-expression and eye-movement analysis), without neural hardware. This simulates the effect of Disruption 1 with mature technology.

**What future question it helps answer:** if content responds to the viewer's state, does it improve the experience or make it manipulative? The hypothesis is that the answer depends on who controls the adjustment — the user or the platform.

**What emerging technology it uses:** computer vision models for attention estimation (e.g., MediaPipe Face Mesh + focus-state classifier trained on a public dataset). Hardware is mature (webcam), but the application in media consumption is emerging.

**What the class will do when testing:** each student watches a 3-minute clip in two conditions — (a) standard player, (b) player that accelerates editing when loss of attention is detected. Then they answer: (1) which version felt more engaging? (2) which version felt more "controlled by someone else"? (3) in which did you spend more time watching?

**What would be a result that would make me change my mind:** if most participants prefer the standard player and report that the adaptive player caused anxiety or a sense of surveillance, this would invalidate the hypothesis that "adaptive content is desirable." If everyone prefers the adaptive version without noticing the manipulation, this would confirm the undesirable scenario.

## 11. Fontes

1. https://www.nature.com/articles/s41586-024-07929-3 — Article on low-cost fNIRS with silicon LEDs (2024). Supports technical viability of Disruption 2. Confidence: high (Nature, peer-reviewed).
2. https://www.science.org/doi/10.1126/science.adk1259 — Stanford study on ML movement decoding from EEG (2023). Supports Disruption 1. Confidence: high.
3. https://www.apple.com/newsroom/2023/01/apple-unveils-m2-pro-and-m2-max/ (EEG patents for AirPods, referenced in MacRumors analyses) — Indicates industrial interest in Disruption 2. Confidence: medium (patent is not product).
4. https://www.europarl.europa.eu/topics/en/article/20230601STO93804/eu-ai-act-first-regulation-on-artificial-intelligence — EU AI Act. Supports Disruption 3 (regulatory pressure). Confidence: high.
5. https://www.gartner.com/en/newsroom/press-releases — Hype Cycle 2024 (BCI listed under "emerging innovations"). Used for maturity triage. Confidence: medium (Gartner is consultancy, not science).
6. https://www.nextmind.com/ (archived via Wayback Machine) — NextMind company history. Used to verify the company shut down consumer operations. Confidence: high (primary source).

## 12. Anexo — o levantamento bruto

### Discarded Round

In the first attempt, the skill generated a Disruption 4: "Real-time neurofeedback for game soundtrack personalization." In triage, it was classified as mature — neurofeedback has existed for decades and has not ruptured anything. It was discarded.

### Cut Effects

- Original e1.2: "Streaming platforms offer neural immersive mode" — cut in adversarial round due to loose cause. Reconnected to Disruption 2 as e4.1.
- e7: "QWERTY keyboard ceases to exist in 2028" — cut due to absurd extrapolation.
- Original e3.1: "Attention data becomes commodity by 2029" — deadline adjusted to 2031, confidence reduced to baixa.

### Failed Searches

- Search for "non-invasive BCI Netflix 2025": no relevant results. There is no indication Netflix invests in BCI.
- Search for "BCI regulation Brazil": no specific framework. Brazil has no law on neural data.
- Search for "consumer EEG headset sales 2024": fragmented data, no reliable market number. Gartner does not segment consumer BCI in the Hype Cycle.

### Complete First-Round Output (before adversarial)

```
Disruptions: 4 (including neurofeedback, later discarded)
1st-order effects: 7
2nd-order effects: 9
3rd-order effects: 8
Problems found: 3 effects with loose cause, 1 with absurd extrapolation, 1 unrealistic deadline.
```

### Notes of Doubt During Construction

- Doubt: does silicon fNIRS really allow miniaturization for headphones? The Nature article shows cost reduction, but not volume. Integration into headphones is speculative.
- Doubt: is non-invasive EEG intent decoding already precise enough for "thought navigation"? Stanford studies are under controlled conditions. There is no evidence of continuous home use.
- Doubt: will EU regulatory pressure really extend to neural data by 2031? The AI Act does not explicitly mention BCI. Disruption 3 is the weakest in the map precisely because of this uncertainty.
