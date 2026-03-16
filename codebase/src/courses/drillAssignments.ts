/**
 * Drill Assignments - Manuelle Zuordnung von Drills zu Kurs-Steps
 *
 * Jeder Kurs-Step kann eine Liste von Drills zugewiesen bekommen.
 * Die Drills werden nach Priorität (1-10) gewichtet bei der Auswahl.
 * Höhere Priorität = höhere Wahrscheinlichkeit, ausgewählt zu werden.
 */

export interface DrillAssignment {
  drillId: string;    // ID des Drills (z.B. "mcq-print-1", "code-variablen-2")
  priority: number;   // 1-10, höher = wichtiger
}

/**
 * Mapping von Step-IDs zu zugewiesenen Drills
 *
 * Format der Step-ID: "{course-id}-step-{step-number}"
 * Beispiel: "bmi-calculator-step-1"
 *
 * Verfügbare Drill-IDs:
 *
 * MC-Fragen:
 * - mcq-print-1 bis mcq-print-4
 * - mcq-variablen-1 bis mcq-variablen-5
 * - mcq-datentypen-1 bis mcq-datentypen-9
 * - mcq-strings-1, mcq-strings-3 bis mcq-strings-20, mcq-strings-22+ (mcq-strings-2/14/15/21 wurden entfernt - nutzten len())
 * - mcq-listen-1, mcq-listen-2, mcq-listen-5+ (mcq-listen-3/4 wurden entfernt - nutzten len())
 * - mcq-schleifen-1 bis mcq-schleifen-9
 * - mcq-bedingungen-1 bis mcq-bedingungen-15
 *
 * Code-Tasks:
 * - code-print-1, code-print-2
 * - code-variablen-1 bis code-variablen-3
 * - code-datentypen-1 bis code-datentypen-6
 * - code-strings-2 bis code-strings-10, code-strings-12+ (code-strings-1/11 wurden entfernt - nutzten len())
 * - code-listen-1 bis code-listen-4
 * - code-schleifen-1 bis code-schleifen-4
 * - code-bedingungen-1 bis code-bedingungen-5
 */
export const drillAssignments: Record<string, DrillAssignment[]> = {
  // =====================================================
  // BMI Calculator Course
  // =====================================================

  // Step 1: Einfache print-Drills (single line, basic concepts)
  "bmi-calculator-step-1": [
    // MCQs - Grundverständnis
    { drillId: "mcq-print-1", priority: 5 },   // Was macht print()?
    { drillId: "mcq-print-2", priority: 5 },   // Wie gibt man Text aus?
    { drillId: "mcq-print-8", priority: 4 },   // Welche Anführungszeichen?
    { drillId: "mcq-print-10", priority: 4 },  // Fill-blank: ___('Fertig')
    { drillId: "mcq-print-12", priority: 3 },  // Was ist ein Kommentar?
    { drillId: "mcq-print-15", priority: 3 },  // Wie beginnt ein Kommentar?
    { drillId: "mcq-print-13", priority: 4 },  // Predict: print("Zahl: 42")
    { drillId: "mcq-print-19", priority: 4 },  // Predict: print('123')
    { drillId: "mcq-print-24", priority: 4 },  // Predict: print("Das ist ein Test")
    // Code Tasks - Single line output
    { drillId: "code-print-1", priority: 5 },  // Gib 'Willkommen' aus
    { drillId: "code-print-3", priority: 5 },  // Gib 'Guten Morgen' aus
    { drillId: "code-print-5", priority: 4 },  // Gib 'Fertig!' aus
    { drillId: "code-print-8", priority: 4 },  // Gib 'Wie geht es dir?' aus
  ],

  // Step 2: Schwierigere print-Drills (multi-line, error spotting)
  "bmi-calculator-step-2": [
    // MCQs - Predict output (mehrere Zeilen)
    { drillId: "mcq-print-3", priority: 5 },   // Predict: 2 prints
    { drillId: "mcq-print-6", priority: 5 },   // Predict: 3 prints
    { drillId: "mcq-print-9", priority: 4 },   // Predict: Kommentar + print
    { drillId: "mcq-print-16", priority: 4 },  // Predict: A, #B, C
    { drillId: "mcq-print-18", priority: 3 },  // Wie viele Zeilen?
    // MCQs - Fehler finden
    { drillId: "mcq-print-4", priority: 5 },   // Spot error: case-sensitive
    { drillId: "mcq-print-7", priority: 5 },   // Spot error: fehlendes "
    { drillId: "mcq-print-11", priority: 4 },  // Spot error: fehlende Quotes
    { drillId: "mcq-print-14", priority: 4 },  // Spot error: eckige Klammern
    { drillId: "mcq-print-21", priority: 4 },  // Spot error: PRINT
    { drillId: "mcq-print-25", priority: 4 },  // Spot error: fehlende Klammern
    { drillId: "mcq-print-23", priority: 3 },  // Welche Aussage ist FALSCH?
    // Code Tasks - Multi-line output
    { drillId: "code-print-2", priority: 5 },  // 2 Zeilen: Python, Rocks
    { drillId: "code-print-4", priority: 5 },  // 3 Zeilen: Eins, Zwei, Drei
    { drillId: "code-print-7", priority: 4 },  // Leere Zeile + Ende
    { drillId: "code-print-9", priority: 3 },  // 4 Zeilen
  ],

  // Step 3: Erste Variable (weight = 77) - nur int, noch keine floats
  "bmi-calculator-step-3": [
    // MCQs - Variablen Grundlagen (einfach)
    { drillId: "mcq-variablen-1", priority: 5 },   // Was ist eine Variable?
    { drillId: "mcq-variablen-2", priority: 5 },   // Wie weist man Wert zu?
    { drillId: "mcq-variablen-3", priority: 4 },   // Gültiger Variablenname
    { drillId: "mcq-variablen-7", priority: 4 },   // Was bedeutet = ?
    { drillId: "mcq-variablen-8", priority: 3 },   // Predict: stadt = 'Berlin'
    // Code Tasks - Einfache Variable erstellen
    { drillId: "code-variablen-1", priority: 5 },  // age = 25 erstellen
    { drillId: "code-variablen-5", priority: 5 },  // Zahl 42 speichern
    { drillId: "code-variablen-4", priority: 4 },  // Stadt speichern
  ],

  // Step 4: Variablen & Datentypen (height = 1.79, Unterschied Zahl/String)
  "bmi-calculator-step-4": [
    // MCQs - Variablen Grundlagen
    { drillId: "mcq-variablen-1", priority: 5 },   // Was ist eine Variable?
    { drillId: "mcq-variablen-2", priority: 5 },   // Wie weist man Wert zu?
    { drillId: "mcq-variablen-8", priority: 4 },   // Predict: stadt = 'Berlin'
    { drillId: "mcq-variablen-3", priority: 4 },   // Gültiger Variablenname
    // MCQs - Datentypen (wichtig für height als Float!)
    { drillId: "mcq-datentypen-1", priority: 5 },  // Unterschied 77 vs '77'
    { drillId: "mcq-datentypen-4", priority: 5 },  // Text braucht Anführungszeichen
    { drillId: "mcq-datentypen-2", priority: 4 },  // weight = "77" Fehler
    // Code Tasks - Variable erstellen
    { drillId: "code-variablen-1", priority: 5 },  // age = 25 erstellen
    { drillId: "code-variablen-5", priority: 5 },  // Zahl 42 speichern
    { drillId: "code-datentypen-2", priority: 4 }, // price + product (gemischt)
    { drillId: "code-variablen-4", priority: 3 },  // Stadt speichern
    { drillId: "mcq-datentypen-12", priority: 7 }, // float komma vs punkt
    { drillId: "code-datentypen-11", priority: 7 }, // float komma vs punkt
  ],

  // Step 5: Text + Variablen kombinieren (Konkatenation mit str())
  "bmi-calculator-step-5": [
    // MCQs - Strings & Konkatenation
    { drillId: "mcq-strings-1", priority: 5 },    // Wie verkettet man Strings? (+)
    { drillId: "mcq-strings-3", priority: 5 },    // str() Funktion
    { drillId: "mcq-strings-4", priority: 5 },    // spot-the-error: fehlt str()
    { drillId: "mcq-strings-5", priority: 4 },    // fill: str(bmi)
    { drillId: "mcq-strings-16", priority: 4 },   // spot-the-error: 'Wert: ' + zahl
    { drillId: "mcq-datentypen-1", priority: 4 }, // Unterschied 77 vs '77'
    // Code Tasks - Strings kombinieren
    { drillId: "code-strings-5", priority: 5 },   // 'Hallo' + ' ' + 'Welt'
    { drillId: "code-strings-6", priority: 5 },   // 'Willkommen ' + name
    { drillId: "code-strings-3", priority: 4 },   // str(42) ausgeben
  ],

  // Step 6: Variablen mit Berechnungen (BMI = weight / (height * height))
  "bmi-calculator-step-6": [
    // MCQs - Variablen überschreiben & Berechnungen
    { drillId: "mcq-variablen-5", priority: 5 },   // x = 5, x = 10, print(x) → 10
    { drillId: "mcq-variablen-7", priority: 5 },   // Was bedeutet = ?
    { drillId: "mcq-variablen-22", priority: 5 },  // zahl = zahl + 3 → 8
    { drillId: "mcq-variablen-19", priority: 4 },  // y = x → kopiert Wert
    // MCQs - Datentypen & Mathe (BMI Formel!)
    { drillId: "mcq-datentypen-5", priority: 5 },  // Punkt vor Strich
    { drillId: "mcq-datentypen-6", priority: 5 },  // 10 + 5 * 2 = 20
    { drillId: "mcq-datentypen-7", priority: 5 },  // (10 + 5) * 2 = 30 (Klammern!)
    // Code Tasks - Berechnungen
    { drillId: "code-variablen-2", priority: 5 },  // x=5, y=10 ausgeben
    { drillId: "code-datentypen-3", priority: 5 }, // 15 + 7 berechnen
    { drillId: "code-datentypen-4", priority: 4 }, // 20 / 4 in Variable
  ],

  // Step 7: BMI ausgeben mit Text (mehr Übung str() + Konkatenation)
  "bmi-calculator-step-7": [
    // MCQs - Strings fortgeschritten
    { drillId: "mcq-strings-6", priority: 5 },    // Predict: print("Zahl: " + str(x))
    { drillId: "mcq-strings-7", priority: 5 },    // Leerzeichen in Konkatenation
    { drillId: "mcq-strings-8", priority: 4 },    // Mehrfache Konkatenation
    { drillId: "mcq-strings-9", priority: 4 },    // str() bei float
    { drillId: "mcq-datentypen-3", priority: 4 }, // int vs float vs string
    // Code Tasks - Formatierte Ausgabe
    { drillId: "code-strings-4", priority: 5 },   // "Ergebnis: " + str(zahl)
    { drillId: "code-strings-5", priority: 5 },   // Mehrteilige Konkatenation
    { drillId: "code-strings-6", priority: 4 },   // Variable in Satz einbauen
  ],

  // Step 8: Erste Bedingung (if bmi < 25) - NUR if, KEIN elif/else!
  "bmi-calculator-step-8": [
    // MCQs - if Grundlagen (NUR if!)
    { drillId: "mcq-bedingungen-1", priority: 5 }, // if Keyword
    { drillId: "mcq-bedingungen-2", priority: 5 }, // == vs =
    { drillId: "mcq-bedingungen-4", priority: 5 }, // < Operator
    { drillId: "mcq-bedingungen-5", priority: 5 }, // Fehlt Doppelpunkt
    { drillId: "mcq-bedingungen-7", priority: 5 }, // Einrückung fehlt
    { drillId: "mcq-bedingungen-6", priority: 4 }, // if False → nichts ausgeben
    // MCQs - Weitere if-only Drills
    { drillId: "mcq-bedingungen-19", priority: 4 }, // <= Operator
    { drillId: "mcq-bedingungen-21", priority: 4 }, // if nicht erfüllt → danach print läuft
    { drillId: "mcq-bedingungen-23", priority: 4 }, // Spot error: = statt ==
    { drillId: "mcq-bedingungen-25", priority: 3 }, // Fill: > 0
    // Code Tasks - Einfache if-Statements (NUR if!)
    { drillId: "code-bedingungen-1", priority: 5 }, // if zahl > 10
    { drillId: "code-bedingungen-3", priority: 5 }, // if x > 10 → 'Groß'
    { drillId: "code-bedingungen-4", priority: 4 }, // if age >= 18 → 'Erwachsen'
  ],

  // Step 9: elif (mehrere Bedingungen prüfen) - KEIN else hier!
  "bmi-calculator-step-9": [
    // MCQs - elif Verständnis (NUR if/elif, OHNE else!)
    { drillId: "mcq-bedingungen-9", priority: 5 },  // Was bedeutet elif?
    { drillId: "mcq-bedingungen-10", priority: 5 }, // Predict: if/elif/elif (KEIN else!)
    { drillId: "mcq-bedingungen-11", priority: 5 }, // elif braucht Bedingung
    { drillId: "mcq-bedingungen-12", priority: 4 }, // Beliebig viele elif möglich
    { drillId: "mcq-bedingungen-20", priority: 4 }, // Predict: if/elif/elif (KEIN else!)
    { drillId: "mcq-bedingungen-22", priority: 4 }, // Wann elif statt else? (erklärt Unterschied)
    // Code Tasks - if/elif Struktur (KEIN else!)
    { drillId: "code-bedingungen-2", priority: 5 }, // Noten bewerten (if/elif)
  ],

  // Step 10: if/elif mit category Variable (NOCH KEIN else!)
  "bmi-calculator-step-10": [
    // MCQs - elif Verständnis (NUR if/elif, OHNE else!)
    { drillId: "mcq-bedingungen-9", priority: 5 },  // Was bedeutet elif?
    { drillId: "mcq-bedingungen-10", priority: 5 }, // Predict: if/elif/elif (KEIN else!)
    { drillId: "mcq-bedingungen-12", priority: 4 }, // Beliebig viele elif möglich
    { drillId: "mcq-bedingungen-20", priority: 4 }, // Predict: if/elif/elif (KEIN else!)
    // MCQs - Variablen (category = ...)
    { drillId: "mcq-variablen-12", priority: 5 },  // Variablen können überschrieben werden
    { drillId: "mcq-variablen-14", priority: 4 },  // Dreifach überschreiben → letzter Wert
    { drillId: "mcq-variablen-5", priority: 4 },   // x = 5, x = 10 → 10
    // Code Tasks - if/elif (KEIN else!)
    { drillId: "code-bedingungen-2", priority: 5 }, // Noten bewerten (if/elif)
  ],

  // Step 11: else hinzufügen (Standardfall für alle anderen Fälle)
  "bmi-calculator-step-11": [
    // MCQs - else Verständnis (JETZT wird else eingeführt!)
    { drillId: "mcq-bedingungen-13", priority: 5 }, // Wann wird else ausgeführt?
    { drillId: "mcq-bedingungen-14", priority: 5 }, // else braucht keine Bedingung
    { drillId: "mcq-bedingungen-15", priority: 5 }, // Nur ein else pro if
    { drillId: "mcq-bedingungen-30", priority: 5 }, // Fill: else Block
    // MCQs - Predict mit if/elif/else (komplette Struktur)
    { drillId: "mcq-bedingungen-3", priority: 5 },  // Predict: x=100 if/elif/else → C
    { drillId: "mcq-bedingungen-17", priority: 4 }, // Predict: temp if/elif/else → Kühl
    { drillId: "mcq-bedingungen-24", priority: 4 }, // Predict: if/else → Gleich
    { drillId: "mcq-bedingungen-26", priority: 4 }, // Predict: if/elif/else → Null
    // Code Tasks - Komplette if/elif/else Struktur
    { drillId: "code-bedingungen-5", priority: 5 }, // Temperatur: Kalt/Mild/Warm (if/elif/else)
    { drillId: "code-bedingungen-6", priority: 5 }, // Positiv/Negativ (if/else)
  ],

  // Step 12: Komplettes Programm - Review aller Konzepte
  "bmi-calculator-step-12": [
    // MCQs - Komplexere Bedingungen
    { drillId: "mcq-bedingungen-11", priority: 5 }, // Komplexere elif
    { drillId: "mcq-bedingungen-12", priority: 4 }, // else ist immer am Ende
    { drillId: "mcq-bedingungen-13", priority: 4 }, // Erste wahre Bedingung
    // MCQs - Variablen Review
    { drillId: "mcq-variablen-24", priority: 5 },  // Case sensitivity: Name vs name
    { drillId: "mcq-variablen-25", priority: 4 },  // Variable vor Zuweisung verwendet
    { drillId: "mcq-variablen-16", priority: 3 },  // Mehrfach überschreiben
    // Code Tasks - Kombiniert
    { drillId: "code-bedingungen-6", priority: 5 }, // Positiv/Negativ prüfen
    { drillId: "code-variablen-6", priority: 4 },  // Variable überschreiben
    { drillId: "code-datentypen-6", priority: 3 }, // Rabatt berechnen
  ],

  // =====================================================
  // Interest Calculator Course
  // =====================================================

  // Step 1: f-Strings (moderne Ausgabe statt str() + "+")
  "interest-calculator-step-1": [
    // MCQs - Strings Grundlagen (f-Strings bauen auf String-Wissen auf)
    { drillId: "mcq-strings-10", priority: 5 },   // f-String Syntax
    { drillId: "mcq-strings-11", priority: 5 },   // f-String mit Variable
    { drillId: "mcq-strings-12", priority: 4 },   // f-String vergessenes f
    { drillId: "mcq-strings-19", priority: 4 },   // f-String Vorteil
    // Code Tasks - f-Strings nutzen
    { drillId: "code-strings-7", priority: 5 },   // f-String: 'Hallo Max'
    { drillId: "code-strings-8", priority: 5 },   // f-String mit Zahl
    { drillId: "code-strings-12", priority: 4 },  // f-String mit zwei Variablen
  ],

  // Step 2: Prozentrechnung (Zinsen für 1 Jahr)
  "interest-calculator-step-2": [
    // MCQs - Datentypen & Mathe (Prozentrechnung)
    { drillId: "mcq-datentypen-5", priority: 5 },  // Punkt vor Strich
    { drillId: "mcq-datentypen-6", priority: 5 },  // Berechnung ohne Klammern
    { drillId: "mcq-datentypen-7", priority: 5 },  // Berechnung mit Klammern
    { drillId: "mcq-datentypen-8", priority: 4 },  // Division in Python
    { drillId: "mcq-variablen-22", priority: 4 },  // Variable überschreiben mit Berechnung
    // Code Tasks - Berechnungen
    { drillId: "code-datentypen-3", priority: 5 }, // Addition berechnen
    { drillId: "code-datentypen-4", priority: 5 }, // Division in Variable
    { drillId: "code-datentypen-5", priority: 4 }, // Komplexe Berechnung
  ],

  // Step 3: for-Schleifen (NEUES KONZEPT)
  "interest-calculator-step-3": [
    // MCQs - Schleifen Grundlagen
    { drillId: "mcq-schleifen-1", priority: 5 },  // Was macht eine for-Schleife?
    { drillId: "mcq-schleifen-2", priority: 5 },  // range() Syntax
    { drillId: "mcq-schleifen-3", priority: 5 },  // range(1, 4) gibt was aus?
    { drillId: "mcq-schleifen-4", priority: 4 },  // Laufvariable verstehen
    { drillId: "mcq-schleifen-5", priority: 4 },  // Einrückung wichtig
    { drillId: "mcq-schleifen-6", priority: 3 },  // range() exklusiver Stop
    // Code Tasks - Einfache Schleifen
    { drillId: "code-schleifen-1", priority: 5 }, // Zahlen 1-5 ausgeben
    { drillId: "code-schleifen-2", priority: 5 }, // Schleife mit range()
  ],

  // Step 4: Zinseszins (Schleifen für Berechnungen)
  "interest-calculator-step-4": [
    // MCQs - Schleifen fortgeschritten
    { drillId: "mcq-schleifen-7", priority: 5 },  // Variable in Schleife ändern
    { drillId: "mcq-schleifen-8", priority: 5 },  // Akkumulator Pattern
    { drillId: "mcq-schleifen-9", priority: 4 },  // Schleife mit Berechnung
    { drillId: "mcq-variablen-5", priority: 4 },  // Variable überschreiben
    { drillId: "mcq-variablen-22", priority: 3 }, // x = x + 3 verstehen
    // Code Tasks - Schleifen mit Berechnungen
    { drillId: "code-schleifen-3", priority: 5 }, // Summe in Schleife
    { drillId: "code-schleifen-4", priority: 5 }, // Variable in Schleife aktualisieren
  ],

  // Step 5: Listen (NEUES KONZEPT)
  "interest-calculator-step-5": [
    // MCQs - Listen Grundlagen
    { drillId: "mcq-listen-5", priority: 5 },     // Wie erstellt man leere Liste? (alt)
    { drillId: "mcq-listen-6", priority: 5 },     // Wie fügt man Element hinzu? append()
    { drillId: "mcq-listen-7", priority: 4 },     // Predict: append(10), append(20)
    { drillId: "mcq-listen-12", priority: 4 },    // Fill: einkauf.___("Milch")
    { drillId: "mcq-listen-18", priority: 3 },    // Fill: meine_liste = ___
    // Code Tasks - Listen erstellen
    { drillId: "code-listen-1", priority: 5 },    // Leere Liste erstellen
    { drillId: "code-listen-2", priority: 5 },    // Werte mit append hinzufügen
  ],

  // Step 6: Schleifen + Listen kombinieren
  "interest-calculator-step-6": [
    // MCQs - Listen in Schleifen
    { drillId: "mcq-listen-7", priority: 5 },     // append in Schleife
    { drillId: "mcq-listen-8", priority: 5 },     // Liste nach Schleife
    { drillId: "mcq-listen-9", priority: 4 },     // Komplexeres Beispiel
    { drillId: "mcq-schleifen-7", priority: 4 },  // Variable in Schleife ändern
    { drillId: "mcq-schleifen-8", priority: 3 },  // Akkumulator Pattern
    // Code Tasks - Listen in Schleifen
    { drillId: "code-listen-3", priority: 5 },    // Liste in Schleife füllen
    { drillId: "code-listen-4", priority: 5 },    // Berechnete Werte speichern
  ],

  // Step 7: if/elif/else Review (Gewinn kategorisieren)
  // NOTE: User hat if/elif/else bereits in BMI-Calculator Step 11 gelernt!
  "interest-calculator-step-7": [
    // MCQs - Bedingungen Review
    { drillId: "mcq-bedingungen-1", priority: 5 }, // if Keyword
    { drillId: "mcq-bedingungen-9", priority: 5 }, // Was bedeutet elif?
    { drillId: "mcq-bedingungen-3", priority: 5 }, // Predict: if/elif/else
    { drillId: "mcq-bedingungen-10", priority: 4 }, // Predict mit elif
    { drillId: "mcq-bedingungen-12", priority: 4 }, // else am Ende
    // Code Tasks - Kategorisierung
    { drillId: "code-bedingungen-2", priority: 5 }, // Noten bewerten
    { drillId: "code-bedingungen-5", priority: 5 }, // Temperatur klassifizieren (if/elif/else)
  ],

  // Step 8: Komplettes Programm - Review aller Konzepte
  "interest-calculator-step-8": [
    // MCQs - Gemischte Wiederholung
    { drillId: "mcq-schleifen-9", priority: 5 },   // Schleife komplex
    { drillId: "mcq-listen-9", priority: 5 },      // Listen komplex
    { drillId: "mcq-bedingungen-13", priority: 4 }, // Erste wahre Bedingung
    { drillId: "mcq-variablen-24", priority: 4 },  // Case sensitivity
    { drillId: "mcq-datentypen-7", priority: 3 },  // Klammern in Berechnungen
    // Code Tasks - Kombiniert
    { drillId: "code-schleifen-4", priority: 5 },  // Variable in Schleife
    { drillId: "code-listen-4", priority: 5 },     // Werte in Liste sammeln
    { drillId: "code-bedingungen-6", priority: 4 }, // Kategorisierung
  ],
};

/**
 * Hilfsfunktion: Holt die zugewiesenen Drills für einen Step
 */
export function getDrillsForStep(stepId: string): DrillAssignment[] {
  return drillAssignments[stepId] || [];
}

/**
 * Hilfsfunktion: Holt ALLE Drills bis zu einem bestimmten Step (kumulativ)
 * Neuere Steps bekommen einen Prioritäts-Boost (+3 pro Step näher am aktuellen)
 *
 * Beispiel für currentStep = 3:
 * - Step 1 Drills: Basis-Priorität + 0 (älteste)
 * - Step 2 Drills: Basis-Priorität + 3
 * - Step 3 Drills: Basis-Priorität + 6 (neueste = höchste Prio)
 */
export function getCumulativeDrillsUpToStep(courseId: string, currentStep: number): DrillAssignment[] {
  const allDrills: DrillAssignment[] = [];
  const PRIORITY_BOOST_PER_STEP = 3;

  for (let step = 1; step <= currentStep; step++) {
    const stepId = `${courseId}-step-${step}`;
    const stepDrills = drillAssignments[stepId] || [];

    // Neuere Steps = höherer Boost
    // Step 1 bekommt 0, Step 2 bekommt 3, Step 3 bekommt 6, etc.
    const priorityBoost = (step - 1) * PRIORITY_BOOST_PER_STEP;

    // Füge Drills mit angepasster Priorität hinzu
    stepDrills.forEach(drill => {
      // Prüfe ob Drill schon existiert (Duplikat-Vermeidung)
      const existing = allDrills.find(d => d.drillId === drill.drillId);
      if (!existing) {
        allDrills.push({
          drillId: drill.drillId,
          priority: drill.priority + priorityBoost,
        });
      }
    });
  }

  return allDrills;
}

/**
 * Debug-Hilfsfunktion: Zeigt alle Drills pro Step mit Prioritäten
 */
export function logCumulativeDrills(courseId: string, currentStep: number): void {
  console.log(`\n📚 KUMULATIVE DRILL-LISTE für ${courseId} bis Step ${currentStep}:`);
  console.log(`   (Neuere Steps haben höhere Priorität)\n`);

  for (let step = 1; step <= currentStep; step++) {
    const stepId = `${courseId}-step-${step}`;
    const stepDrills = drillAssignments[stepId] || [];

    if (stepDrills.length > 0) {
      const isCurrentStep = step === currentStep;
      const marker = isCurrentStep ? "🆕" : "  ";
      console.log(`   ${marker} Step ${step} (${stepId}):`);
      stepDrills.forEach(d => {
        console.log(`      - ${d.drillId} (Basis-Prio: ${d.priority})`);
      });
    }
  }

  const cumulative = getCumulativeDrillsUpToStep(courseId, currentStep);
  console.log(`\n   📊 GESAMT-POOL (${cumulative.length} Drills, sortiert nach Priorität):`);
  cumulative
    .sort((a, b) => b.priority - a.priority)
    .forEach(d => {
      console.log(`      - ${d.drillId} (effektive Prio: ${d.priority})`);
    });
}

/**
 * Hilfsfunktion: Prüft ob ein Drill einem Step zugewiesen ist
 */
export function isDrillAssignedToStep(drillId: string, stepId: string): boolean {
  const assignments = drillAssignments[stepId];
  return assignments ? assignments.some(a => a.drillId === drillId) : false;
}

/**
 * Hilfsfunktion: Findet alle Steps, denen ein Drill zugewiesen ist
 */
export function getStepsForDrill(drillId: string): string[] {
  return Object.entries(drillAssignments)
    .filter(([, assignments]) => assignments.some(a => a.drillId === drillId))
    .map(([stepId]) => stepId);
}
