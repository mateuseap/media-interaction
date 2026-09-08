# DUVIDAS.md — Where the Machine Erred

*Mateus Elias — login meap*

---

## Error 1: Confusing Company and Technology Modality

**What the AI said:** "Neuralink is an example of non-invasive BCI for consumers, and its demonstration with paralyzed patients shows the technology is close to the general public."

**Why it is wrong:** Neuralink is **invasive**. The chip is surgically implanted in the brain. The user explicitly discarded invasive BCI in the framing. Moreover, Neuralink's tests are medical — not consumer. The AI mixed three different categories: invasive/non-invasive, medical/consumer, and present/future.

**How I noticed:** The name "Neuralink" appeared in the technology list cited by the skill during Phase 2. I stopped and asked: "Is Neuralink non-invasive?" The AI answered yes. I corrected it based on prior knowledge (2024 news about human implants). If I had not known this, the error would have entered the map.

---

## Error 2: Obsolete Source Presented as Current

**What the AI said:** "NextMind is an active company selling developer kits for non-invasive consumer BCI, at an affordable price."

**Why it is wrong:** NextMind was acquired by Snap in 2022 and **shut down consumer hardware operations in 2023**. There is no product for sale. The AI used a world state from 2021-2022 as if it were 2026.

**How I noticed:** During Phase 3, the AI cited NextMind as evidence that Disruption 1 already has players in the market. I was suspicious because I remembered a news story about the shutdown. I checked the company website (redirects to Snap) and the Wayback Machine — the last functional snapshot is from 2022. The AI had no access to the information that the company closed, but presented the data with high confidence.

---

## Error 3: Absurd Mechanical Extrapolation

**What the AI said:** "By 2028, the QWERTY keyboard will cease to exist as an input device, replaced by non-invasive BCI on all personal computers."

**Why it is wrong:** Mature input technologies coexist with new ones for decades. The mouse did not kill the keyboard. Touch did not kill the mouse. Voice did not kill touch. The AI applied a "total replacement" logic that has no historical precedent in computing interfaces.

**How I noticed:** The effect appeared in the first derivation of the wheel. I immediately suspected: "where have we seen a mature input technology disappear in 2 years?" I applied the accelerated adoption test from the adversarial round: no input technology displaced a predecessor in less than 15-20 years. I removed the effect.

---

## Error 4: Round Number Without Source

**What the AI said:** "The global non-invasive BCI consumer market will be 12 billion dollars in 2030."

**Why it is wrong:** There is no source. The number is round and plausible, which makes it dangerous. The AI invented a market projection.

**How I noticed:** I asked for the source. The AI answered: "data from market reports." I asked: "which report, which company, which year?" The AI admitted it had no specific source. I removed the number from the document. Round numbers (12B, 50%, 2030) are a classic signal of statistical hallucination in language models.

---

## Error 5: Cause That Does Not Follow — Loose 2nd-Order Effect

**What the AI said:** "With intent decoding, streaming platforms will offer immersive neural modes where the soundtrack responds to the viewer's emotional state."

**Why it is wrong:** This effect does not necessarily derive from Disruption 1 (intent decoding). It derives from the existence of a continuous emotional state sensor — which is Disruption 2 (integrated sensors). The AI connected the effect to the wrong root. A map with loose causes looks coherent, but breaks when tested: remove Disruption 1, and the effect happens anyway.

**How I noticed:** I applied the "loose cause" test from the adversarial round. I asked: "if intent decoding did not exist, but a continuous emotional state sensor did, would this effect still happen?" Answer: yes. Then the root is another. I reconnected the effect to Disruption 2.

---

## Error 6: Swapped Authorship

**What the AI said:** "The Futures Wheel method was proposed by Joseph Coates in 1971, at the Institute for the Future (IFTF)."

**Why it is wrong:** The Futures Wheel was proposed by **Jerome C. Glenn** in **1972**, at the **Institute for the Future (IFF)** — not IFTF. Joseph Coates is another futurist who worked on technology forecasting methods, but did not create the Futures Wheel. The AI swapped the author and the year.

**How I noticed:** While writing ESTUDO.md, I myself wrote the correct version (Glenn, 1972) based on prior reading. When the skill was run in another test context, it produced the wrong version (Coates, 1971). I compared the two and verified against the primary source: the original article is "Futurizing Teaching vs Futures Course", Social Science Record, Spring 1972, by Jerome C. Glenn. The AI had hallucinated the authorship.

---

## Summary

| Error | Type | How I Noticed |
|---|---|---|
| Neuralink as non-invasive | Factual confusion | Prior knowledge + direct question |
| NextMind active | Obsolete information | Suspicion + website/Wayback check |
| QWERTY gone by 2028 | Absurd extrapolation | Historical precedent test |
| 12 billion by 2030 | Invented number | Asked for source; AI admitted none |
| Effect connected to wrong root | Loose cause | Root removal test |
| Coates instead of Glenn | Swapped authorship | Primary source verification |

In two hours of work, I found six specific errors. All were plausible and convincing on first reading. The common pattern: the AI generates superficial coherence. It connects concepts that frequently appear together in training text, not concepts that are actually connected in the world. The discipline of the method — interview, triage, adversarial — is what exposes these false connections.
