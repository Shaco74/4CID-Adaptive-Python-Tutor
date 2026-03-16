# 4C/ID Python-Lernsystem – Bachelorarbeit

Dieses Repository enthält den Quellcode, die LaTeX-Thesis und die Studiendaten für das im Rahmen der Bachelorarbeit an der FH Aachen entwickelte Lernsystem.

**Forschungsfrage:** *Inwiefern steigert der Einsatz von KI-generierten Übungsaufgaben die Effektivität beim Erlernen von Python?*

Das System basiert auf dem **4C/ID-Modell** (van Merriënboer) und integriert die **OpenAI API** für adaptive Lernunterstützung.

---

## Inhalt

```
/
+-- thesis/                          LaTeX-Dokument der Bachelorarbeit
|   +-- 000report.tex                Hauptdokument
|   +-- 000report.pdf                Finale PDF-Version
|   +-- doc/                         Kapitel-Dateien (*.tex)
|   +-- bib/quellen.bib              Literaturverzeichnis
|   +-- pic/                         Screenshots der Lernplattform
|   +-- figures/studien_grafiken/    Symlink auf analysis/output/
|   +-- tables/                      LaTeX-Tabellen
|   +-- external/                    Offizielle PDFs (Erklärung, Aufbewahrungspflicht)
|
+-- codebase/                        Quellcode der Lernplattform (Next.js)
|   +-- src/
|   |   +-- app/                     Next.js App Router
|   |   +-- actions/                 Server Actions (OpenAI, Firebase, Export)
|   |   +-- components/              React-Komponenten
|   |   +-- courses/                 Kurs-Inhalte und Drill-Pools
|   |   +-- db/                      Firebase-Integration und Event-Tracking
|   |   +-- types/                   TypeScript-Typen
|   +-- messages/                    i18n-Übersetzungen (Deutsch/Englisch)
|   +-- package.json
|   +-- next.config.ts
|
+-- analysis/                        Datenauswertung
|   +-- Finale_Grafiken_Reproduktion.ipynb   Jupyter Notebook (reproduzierbar)
|   +-- exports/                     Anonymisierte Studiendaten (CSV, P001-P025)
|   +-- output/                      Generierte Grafiken für die Thesis (anonymisiert)
|
+-- LICENSE
+-- README.md
```

---

## Technologie-Stack

- **Frontend**: Next.js 15, TypeScript, Chakra UI v3, Monaco Editor
- **Backend**: Next.js Server Actions, Firebase Firestore
- **KI-Integration**: OpenAI API (gpt-4o)
- **Datenanalyse**: Python (pandas, matplotlib, scipy, pingouin)

---

## Installation (Codebase)

**Voraussetzungen:** Node.js 18+, Yarn, OpenAI API Key, Firebase-Projekt

```bash
git clone https://github.com/Shaco74/Bachelorarbeit-Kacper-Python-Bootcamp.git
cd Bachelorarbeit-Kacper-Python-Bootcamp/codebase

yarn install

cp .env.example .env.local
# .env.local befüllen: OPENAI_API_KEY und Firebase-Konfiguration eintragen

yarn dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## LaTeX kompilieren

```bash
cd thesis
latexmk -pdf 000report.tex
```

---

## Datenanalyse reproduzieren

```bash
cd analysis
jupyter notebook Finale_Grafiken_Reproduktion.ipynb
```

Die anonymisierten Studiendaten liegen in `analysis/exports/` (Teilnehmer-IDs: P001-P025).

---

## Studie

Between-Subjects-Design mit **N=25 Teilnehmenden** (Gesamtstichprobe), davon **N=18 im gefilterten Analyse-Datensatz** (n=9 je Gruppe):

- **Gruppe A**: Statische Drill-Aufgaben (Kontrollgruppe)
- **Gruppe B**: KI-generierte adaptive Drill-Aufgaben (Experimentalgruppe)

Erhoben wurden: Event-Logs, Drill-Performance, Chat-Verläufe (anonymisiert) sowie Fragebögen (Pre-Test, SUS, NASA-TLX, UEQ-S, NPS).

---

## Lizenz

MIT – siehe [LICENSE](LICENSE).
