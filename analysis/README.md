# Studienanalyse – Notebook-Navigation

Diese Datei ordnet die Analyse-Notebooks ein, damit du schnell das richtige Notebook für die jeweilige Forschungsfrage findest.

## Datenbasis (Exports)

Die Notebooks laden Daten aus `analysis/exports/` und bevorzugen die neuesten Dateien.

Aktuell relevante Dateifamilien:

- `study_participants-*.csv`
- `study_task_level-*.csv`
- `study_group_summary-*.csv`
- `study_participants-filtered-*.csv`
- `study_participants-unfiltered-*.csv`
- `study_task_level-filtered-*.csv`
- `study_task_level-unfiltered-*.csv`
- `study_group_summary-filtered-*.csv`
- `study_group_summary-unfiltered-*.csv`
- `study_event_timeline-*.csv`
- `study_chat_messages-*.csv`
- `study_drill_events-*.csv`
- `study_evaluations-*.csv`

Hinweis: Der Standard-Workflow nutzt **filtered** (`num_runs_code > 2`) als Primäranalyse.

## Notebook-Übersicht

| # | Notebook | Thema |
|---|----------|-------|
| 1 | `study_empirische_auswertung.ipynb` | A/B-Hauptvergleich, Metrik-Lexikon, BMI-Fokus |
| 2 | `final_figures_empirische_studie.ipynb` | Finale Abbildungen für Bachelorarbeit |
| 3 | `study_filtered_vs_unfiltered_vergleich.ipynb` | Sensitivitätsprüfung Filter-Entscheidung |
| 4 | `study_dropout_und_interaktionsanalyse.ipynb` | Dropout, Fehler-Hotspots, KI-Interaktion |
| 5 | `study_fragen_afk_dashboard.ipynb` | Dashboard: Forschungsfragen mit AFK-Bereinigung |
| 6 | `study_ki_reasoning_analyse.ipynb` | KI-Begründungen (reasoning) – Gruppe B |
| 7 | `study_fragebogen_diagramme.ipynb` | **5results.tex**: SUS, UEQ-S, Demografik, KI-Items (Gruppe B), Entropie, Feedback |

---

### 1) `study_empirische_auswertung.ipynb` (Hauptanalyse)

Wofür:
- Primärer A/B-Vergleich für die Studie (BMI-Kapitel als Pflichtfokus)
- Datenqualität, Metrik-Lexikon, Gruppenvergleich, inferenznahe Tabellen
- Step-Level-Auswertung und Interpretation für den Ergebnisteil

Nutzen wenn du fragen willst:
- „Wie unterscheiden sich A und B in den Kernmetriken?“
- „Wie sehen die zentralen Ergebnis-Tabellen für die Arbeit aus?“

### 2) `final_figures_empirische_studie.ipynb` (Abbildungen)

Wofür:
- Zielgerichtetes Erzeugen finaler Plots/Figuren für Dokumentation/Thesis
- Schlankere Visual-Pipeline (saubere Figure-Outputs)

Nutzen wenn du fragen willst:
- „Welche Grafiken kommen final in die Arbeit?“
- „Ich brauche schnell reproduzierbare Abbildungen aus dem aktuellen Datensatz.“

### 3) `study_filtered_vs_unfiltered_vergleich.ipynb` (Sensitivität)

Wofür:
- Direkter Vergleich von unfiltered vs. filtered Stichprobe
- Prüft, wie robust zentrale Kennzahlen gegenüber dem Low-Engagement-Filter sind

Nutzen wenn du fragen willst:
- „Ändern sich die A/B-Ergebnisse stark durch den Filter?“
- „Kann ich die Filterentscheidung methodisch transparent begründen?“

### 4) `study_dropout_und_interaktionsanalyse.ipynb` (Vertiefungsfragen)

Wofür:
- Detaillierte Prozessfragen: Abbruch, Fehler-Hotspots, Chat/Drill-Verhalten, Timing
- Ergänzt die Hauptanalyse um Mechanismen und Lernverlauf

Nutzen wenn du fragen willst:
- „Wo brechen Teilnehmende ab und wann?“
- „In welchen Steps häufen sich Fehler?“
- „Wie verteilt sich Chat-Nutzung über Aufgaben/Zeiten?“
- „Wie divers ist die Drill-Auswahl in A vs. B?“

## Fragen → Notebook

- **A/B Kernvergleich (BMI, Abschluss, Zeit, Fehler):** `study_empirische_auswertung.ipynb`
- **Finale Abbildungen für Bericht:** `final_figures_empirische_studie.ipynb`
- **Filtered vs. unfiltered Sensitivität:** `study_filtered_vs_unfiltered_vergleich.ipynb`
- **Abschluss/Abbruch + Abbruchzeit:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Dropout-Hotspots pro Step:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Fehler-Hotspots pro Step:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Chat-Nutzung pro Aufgabe/über Zeit:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Drill-Vielfalt und Top-Drills A/B:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Zeit bis Step 12 / Evaluation / erste KI-Anfrage:** `study_dropout_und_interaktionsanalyse.ipynb`
- **AFK-Analyse, Zeitvergleich Raw vs. gefiltert:** `study_fragen_afk_dashboard.ipynb`
- **KI-Begründungen (reasoning), Confidence, Drill-Personalisierung:** `study_ki_reasoning_analyse.ipynb`
- **SUS/UEQ-S/Demografik/KI-Items/Entropie/Offenes Feedback (5results.tex):** `study_fragebogen_diagramme.ipynb`

### 5) `study_fragen_afk_dashboard.ipynb` (Dashboard AFK)

Wofür:
- Zentrale Forschungsfragen mit AFK-bereinigter Zeiterfassung
- Vergleich Raw-Zeit vs. AFK-gefilterter Zeit auf Teilnehmendenebene
- Step-Zeiten, Drill-Statistiken, Chat-Auswertung, Stichprobenherkunft

Nutzen wenn du fragen willst:
- „Wie lange haben Teilnehmende wirklich (ohne AFK) an Steps gearbeitet?"
- „Woher kommt die Stichprobengröße N=27/25/18?"

### 6) `study_ki_reasoning_analyse.ipynb` (KI-Begründungen)

Wofür:
- Alle `ai_drill_selection`-Begründungen (Gruppe B) lesbar darstellen
- Strukturkonsistenz prüfen (TEIL 1 / TEIL 2 Format)
- Confidence-Verteilung und Textlängen analysieren
- Drill-Personalisierung: Varianz der Drill-Auswahl pro Step
- CSV-Export für manuelle Auswertung in der Bachelorarbeit

Nutzen wenn du fragen willst:
- „Was hat die KI bei jedem Teilnehmenden begründet?"
- „War die KI immer ähnlich vage oder wirklich individuell?"

### 7) `study_fragebogen_diagramme.ipynb` (**5results.tex** – Fragebogen-Diagramme)

Wofür:
- Erzeugt **alle Diagramme und Tabellen** für den Ergebnisteil zur Fragebogenauswertung
- Datenbasis: gefilterte Stichprobe, N=16 Evaluationen (8A, 8B)
- Outputs in `analysis/output/fragebogen/`

Enthält:
1. **SUS** (System Usability Scale): Boxplot + Tabelle (Bangor-Adjektive, Mann-Whitney-Test)
2. **UEQ-S**: PQ/HQ Boxplots + Item-Profil Grouped-Bar (±SEM)
3. **Demografik & Vorerfahrung**: Programmierkenntnisse + Altersgruppen nach Gruppe
4. **KI-Items Gruppe B**: aiUsefulness (TAM PU) + aiTrust – Horizontal-Dotplot mit Einzelwerten
5. **Drill-Entropie-Tabelle**: A=6.34 / B=5.54 (hardcoded, LaTeX-Vorlage integriert)
6. **Offenes Feedback**: Rohantworten aller 16 Teilnehmenden (Text-Export)
7. **Export-Übersicht**: Alle ein- und ausgehenden Dateipfade

Nutzen wenn du fragen willst:
- „Welche SUS/UEQ-S Plots kommen in 5results.tex?"
- „Wie bewerten Gruppe B-Teilnehmende die KI?"
- „Wo ist das offene Feedback als Rohtext?"
- „Wie oft hat sie mit `high` vs. `low` Confidence entschieden?"

> **Voraussetzung:** Requires CSV-Export nach dem **04.03.2026** (Spalten `reasoning` + `confidence` wurden an diesem Tag hinzugefügt).

## Fragen → Notebook

- **A/B Kernvergleich (BMI, Abschluss, Zeit, Fehler):** `study_empirische_auswertung.ipynb`
- **Finale Abbildungen für Bericht:** `final_figures_empirische_studie.ipynb`
- **Filtered vs. unfiltered Sensitivität:** `study_filtered_vs_unfiltered_vergleich.ipynb`
- **Abschluss/Abbruch + Abbruchzeit:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Dropout-Hotspots pro Step:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Fehler-Hotspots pro Step:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Chat-Nutzung pro Aufgabe/über Zeit:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Drill-Vielfalt und Top-Drills A/B:** `study_dropout_und_interaktionsanalyse.ipynb`
- **Zeit bis Step 12 / Evaluation / erste KI-Anfrage:** `study_dropout_und_interaktionsanalyse.ipynb`

## Empfohlene Reihenfolge (morgen)

1. **Neu exportieren** in der Admin-Seite (damit aktuelle `-filtered/-unfiltered` und Zusatzdateien vorliegen — **wichtig für reasoning-Spalten!**).
2. `study_filtered_vs_unfiltered_vergleich.ipynb` ausführen (methodische Transparenz zuerst).
3. `study_empirische_auswertung.ipynb` ausführen (Primärbefunde).
4. `study_dropout_und_interaktionsanalyse.ipynb` ausführen (Vertiefungsfragen).
5. `study_ki_reasoning_analyse.ipynb` ausführen (KI-Begründungsanalyse).
6. `final_figures_empirische_studie.ipynb` ausführen (endgültige Plots).

## Output-Orte

- Tabellen/Grafiken landen in `analysis/output/`.
- Für die Arbeit am besten die erzeugten Dateien mit Datum sichern/versionieren.

## Kurznotizen

- Primärfokus: `courseId = bmi-calculator`.
- Admin-User ist in der Studienauswertung ausgeschlossen.
- Falls Pakete fehlen: `pandas`, `numpy`, `matplotlib`, `seaborn`, optional `scipy`.
