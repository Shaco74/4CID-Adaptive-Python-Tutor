import { CourseData } from "@/types/courseTypes";

export const bmiCalculatorCourseData: CourseData = {
	id: "bmi-calculator",
	title: "BMI-Rechner",
	description:
		"Entwickle einen Body-Mass-Index Rechner. Du lernst Variablen, Mathematik, Bedingungen und Funktionen.",
	tasks: [
		{
			id: "bmi-calculator-step-1",
			hasDrill: true,
			step: 1,
			title: "Deine erste Ausgabe - Hello World",
			description: "Lerne die print() Funktion und Strings kennen.",
			blocks: [
				{
					type: "text",
					content:
						"Willkommen beim BMI-Rechner Projekt! Bevor wir mit dem eigentlichen Rechner beginnen, lernst du die **print()** Funktion und den Unterschied zwischen **Text** und **Zahlen** kennen.",
				},
				{
					type: "text",
					content:
						"## Strings vs. Zahlen\n\nIn Python gibt es zwei grundlegende Datentypen:\n\n- **Strings (Text)** → Immer MIT Anführungszeichen\n- **Zahlen (Numbers)** → Immer OHNE Anführungszeichen",
				},
				{
					type: "code",
					title: "Der Unterschied",
					language: "python",
					content: `# STRINGS - Text in Anführungszeichen
"Hello World"      # Ein String
"42"               # Auch ein String! (nur Text, keine Zahl)

# ZAHLEN - Ohne Anführungszeichen
42                 # Eine ganze Zahl (Integer)
3.14               # Eine Dezimalzahl (Float)

# Merke: "42" (String) ≠ 42 (Zahl)
# Mit Text kann man nicht rechnen, mit Zahlen schon!`,
				},
				{
					type: "text",
					content:
						"## Die print() Funktion\n\nMit `print()` gibst du Text in der Konsole aus. Der Text muss ein String sein - also in Anführungszeichen stehen.",
				},
				{
					type: "code",
					title: "So funktioniert print()",
					language: "python",
					content: `# Text ausgeben
print("Willkommen!")

# Jeder print macht eine neue Zeile
print("Erste Zeile")
print("Zweite Zeile")

# Kommentare starten mit # und werden ignoriert
print("Sichtbar")  # Kommentar wird ignoriert`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Ohne Anführungszeichen = Fehler!**\n\nPython muss wissen, was Code ist und was Text ist. Ohne `\"...\"` sucht Python nach einem Befehl namens `Hello` - den gibt es nicht!",
				},
				{
					type: "task",
					content:
						"Gib den Text `Hello World` in der Konsole aus. Nutze dafür die `print()` Funktion mit einem String.",
				},
				{
					type: "hint",
					content:
						"**Aufbau:** `print(\"Dein Text\")`\n\n`print` → `(` → `\"...\"` → `)`",
					severity: "info",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/1",
			courseId: "bmi-calculator",
			topics: ["print"],
			solutionString: ["Hello World"],
			solutionCode: ["print("],
			starterCode: `# Mein BMI-Rechner

# Gib hier "Hello World" mit print() in die Konsole aus`,
		},
		{
			id: "bmi-calculator-step-2",
			step: 2,
			title: "Projekt-Titel ausgeben",
			description: "Ändere die Ausgabe zu unserem Projektnamen.",
			blocks: [
				{
					type: "text",
					content:
						"Super! Du hast deine erste Ausgabe gemacht. Jetzt passen wir den Text an unser Projekt an.",
				},
				{
					type: "text",
					content:
						"## Funktionen und Argumente\n\n`print()` ist eine **Funktion** - ein vordefinierter Befehl, der eine bestimmte Aufgabe erledigt.\n\nDer Text in den Klammern ist das **Argument** - die Information, die wir der Funktion übergeben.",
				},
				{
					type: "code",
					title: "Funktion und Argument",
					language: "python",
					content: `#       Funktion
#          ↓
         print("Hello World")
#              ↑___________↑
#              Das Argument (ein String)

# Die Anführungszeichen machen den Text zum String
# Der String wird an print() übergeben
# print() gibt ihn in der Konsole aus`,
				},
				{
					type: "text",
					content:
						"**Merke:** Die Anführungszeichen `\"...\"` erzeugen einen String. Dieser String wird als Argument an `print()` übergeben. Du kannst den Text zwischen den Anführungszeichen beliebig ändern!",
				},
				{
					type: "task",
					content:
						"Ändere das Argument von `\"Hello World\"` zu `\"Mein BMI-Rechner\"`. Der Kommentar soll bleiben!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/2",
			courseId: "bmi-calculator",
			topics: ["print"],
			solutionString: ["Mein BMI-Rechner"],
			solutionCode: ["print("],
			starterCode: `# Mein BMI-Rechner

# Ändere diesen Text
print("Hello World")`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-3",
			step: 3,
			hasDrill: true,
			title: "Deine erste Variable - Gewicht",
			description: "Speichere das Gewicht in einer Variable.",
			blocks: [
				{
					type: "text",
					content:
						"Jetzt lernst du **Variablen** kennen - damit können wir Werte speichern und später wiederverwenden.",
				},
				{
					type: "text",
					content:
						"## Was ist eine Variable?\n\nStell dir eine Variable wie eine **beschriftete Box** vor:\n\n- Die **Beschriftung** ist der Name (z.B. `alter`)\n- Der **Inhalt** ist der gespeicherte Wert (z.B. `25`)",
				},
				{
					type: "code",
					title: "Variable erstellen",
					language: "python",
					content: `#    Name       Wert
#      ↓          ↓
     alter   =   25
#            ↑
#    Zuweisungsoperator
#    "Speichere 25 in alter"`,
				},
				{
					type: "text",
					content:
						"## Variable als Argument\n\nDas Besondere: Du kannst eine Variable als **Argument** an `print()` übergeben - genau wie einen String! Python ersetzt dann den Variablennamen durch den gespeicherten Wert.",
				},
				{
					type: "code",
					title: "Variable ausgeben",
					language: "python",
					content: `punkte = 100

# Variable als Argument (OHNE Anführungszeichen!)
print(punkte)    # Ausgabe: 100

# Mit Anführungszeichen wäre es ein String:
print("punkte")  # Ausgabe: punkte (der Text, nicht der Wert!)`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Variablen OHNE Anführungszeichen!**\n\n`print(punkte)` → gibt den Wert `100` aus\n\n`print(\"punkte\")` → gibt den Text `punkte` aus",
				},
				{
					type: "task",
					content:
						"Erstelle eine Variable `weight` mit dem Wert `77`. Gib dann die Variable mit `print()` aus, sodass `77` in der Konsole erscheint.",
				},
				{
					type: "hint",
					content: "**Zwei Zeilen:**\n\n1. Variable erstellen: `name = wert`\n2. Variable ausgeben: `print(name)` - ohne Anführungszeichen!",
					severity: "info",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/3",
			courseId: "bmi-calculator",
			topics: ["Variablen"],
			solutionString: ["77"],
			solutionCode: ["weight=77", "print(weight)"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

# Erstelle hier die Variable

# Gib die Variable in die Konsole aus`,
		},
		{
			id: "bmi-calculator-step-4",
			step: 4,
			title: "Zweite Variable - Größe",
			description: "Füge die Körpergröße hinzu und lerne Dezimalzahlen kennen.",
			blocks: [
				{
					type: "text",
					content:
						"Gut gemacht! Jetzt brauchen wir noch die Körpergröße für unseren BMI-Rechner.",
				},
				{
					type: "text",
					content:
						"## Zwei Arten von Zahlen\n\nBisher hast du mit `77` gearbeitet - einer **ganzen Zahl**. Die Körpergröße `1.79` ist aber eine **Dezimalzahl**.\n\n- **Integer (int)** → Ganze Zahlen: `77`, `100`, `-5`\n- **Float** → Dezimalzahlen: `1.79`, `3.14`, `0.5`",
				},
				{
					type: "code",
					title: "Dezimalzahlen in Python",
					language: "python",
					content: `# Ganze Zahl (Integer)
alter = 25

# Dezimalzahl (Float) - mit PUNKT, nicht Komma!
preis = 9.99
temperatur = 36.5

#  ✅ Richtig: 3.14 (Punkt)
#  ❌ Falsch:  3,14 (Komma geht nicht!)`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Punkt statt Komma!**\n\nIm Deutschen schreiben wir `1,79` - aber Python verwendet den **Punkt** als Dezimaltrennzeichen.",
				},
				{
					type: "task",
					content:
						"Erstelle eine Variable `height` mit dem Wert `1.79` und gib sie mit `print()` aus.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"Gleich wie bei `weight` - nur mit anderem Namen und einer Dezimalzahl als Wert.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/4",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Datentypen"],
			solutionString: ["77", "1.79"],
			solutionCode: ["height=1.79", "print(height)"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
print(weight)

# Erstelle hier die Variable

# Gib die Variable in die Konsole aus`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-5",
			step: 5,
			hasDrill: true,
			title: "Bessere Ausgaben - Text und Variablen",
			description: "Kombiniere Text mit deinen Variablen.",
			blocks: [
				{
					type: "text",
					content:
						"Die Ausgaben `77` und `1.79` sind nicht sehr informativ. Was bedeuten diese Zahlen? Lass uns **Text und Variablen kombinieren**!",
				},
				{
					type: "text",
					content:
						"## Das Problem: Unterschiedliche Typen\n\nMit `+` kannst du Texte zusammenfügen. Aber Python kann nicht automatisch eine Zahl mit Text verbinden - das sind verschiedene Datentypen!",
				},
				{
					type: "code",
					title: "Das Problem",
					language: "python",
					content: `punkte = 42

# Das funktioniert NICHT:
print("Punkte: " + punkte)
#                  ↑
# Fehler! String + Integer geht nicht`,
				},
				{
					type: "text",
					content:
						"## Die Lösung: str()\n\nDie Funktion `str()` wandelt eine Zahl in einen String um. Dann können wir beide mit `+` verbinden.",
				},
				{
					type: "code",
					title: "Die Lösung mit str()",
					language: "python",
					content: `punkte = 42

# str() wandelt die Zahl in Text um
#         ↓
print("Punkte: " + str(punkte))
#                  ↑__________↑
#                  Aus 42 wird "42"

# Ausgabe: Punkte: 42`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**str() ist auch eine Funktion!**\n\nGenau wie `print()` nimmt `str()` ein Argument entgegen:\n\n`str(77)` → gibt `\"77\"` zurück (als String)",
				},
				{
					type: "task",
					content:
						"Ändere die Ausgaben zu:\n\n- `Gewicht: 77`\n- `Größe: 1.79`\n\nNutze `+` und `str()` um Text und Variable zu verbinden.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Schema:** `print(\"Text: \" + str(variable))`\n\nAchte auf das Leerzeichen nach dem Doppelpunkt!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/5",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Strings"],
			solutionString: ["Gewicht: 77", "Größe: 1.79"],
			solutionCode: ["str(weight)", "str(height)"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

# Ändere diese Zeilen
print(weight)
print(height)`,
		},
		{
			id: "bmi-calculator-step-6",
			step: 6,
			title: "BMI berechnen - Mathematische Operationen",
			description: "Berechne den BMI mit der offiziellen Formel.",
			blocks: [
				{
					type: "text",
					content:
						"Jetzt kommt der spannende Teil! Wir berechnen den **BMI** mit der offiziellen Formel.",
				},
				{
					type: "text",
					content:
						"## Die BMI-Formel\n\n**BMI = Gewicht ÷ (Größe × Größe)**\n\nBeispiel für 77 kg und 1.79 m:\n\n1. Größe quadrieren: 1.79 × 1.79 = 3.2041\n2. Gewicht dividieren: 77 ÷ 3.2041 = **24.03**",
				},
				{
					type: "text",
					content:
						"## Mathematik in Python\n\nPython kann rechnen! Das Ergebnis speichern wir direkt in einer Variable.",
				},
				{
					type: "code",
					title: "Rechenoperatoren",
					language: "python",
					content: `# Grundrechenarten
5 + 3      # Addition = 8
10 - 4     # Subtraktion = 6
6 * 7      # Multiplikation = 42
20 / 4     # Division = 5.0

# Ergebnis in Variable speichern
ergebnis = 10 * 5    # ergebnis = 50`,
				},
				{
					type: "code",
					title: "Beispiel: Fläche berechnen",
					language: "python",
					content: `laenge = 5
breite = 3

# Formel in Variable speichern
flaeche = laenge * breite

print(flaeche)  # Ausgabe: 15`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Klammern sind wichtig!**\n\n`a / b * c` rechnet links nach rechts\n\n`a / (b * c)` rechnet Klammer zuerst\n\nBeim BMI muss erst `height * height` berechnet werden!",
				},
				{
					type: "task",
					content:
						"Berechne den BMI: Gewicht geteilt durch (Größe mal Größe).\n\nSpeichere das Ergebnis in `bmi` und gib es aus.",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Formel:** Gewicht / (Größe * Größe)\n\nDenk an die Klammern!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/6",
			courseId: "bmi-calculator",
			topics: ["Variablen"],
			solutionString: [
				"Gewicht: 77",
				"Größe: 1.79",
				"24.031709372366656",
			],
			solutionCode: ["bmi=weight/(height*height)", "print(bmi)"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

# Berechne hier den BMI und gib ihn aus`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-7",
			step: 7,
			hasDrill: true,
			title: "BMI ausgeben mit Text",
			description: "Verbessere die Ausgabe des BMI-Werts.",
			blocks: [
				{
					type: "text",
					content:
						"Die Ausgabe `24.031709...` ist nicht sehr benutzerfreundlich. Lass uns einen beschreibenden Text hinzufügen!",
				},
				{
					type: "text",
					content:
						"## Wiederholung: Text + Variable\n\nIn Step 5 hast du gelernt, wie man Text und Zahlen kombiniert. Das wenden wir jetzt auf den BMI an.",
				},
				{
					type: "code",
					title: "Schema wiederholen",
					language: "python",
					content: `# Das Schema aus Step 5:
print("Text: " + str(variable))

# Beispiel:
ergebnis = 99.5
print("Ergebnis: " + str(ergebnis))
# Ausgabe: Ergebnis: 99.5`,
				},
				{
					type: "task",
					content:
						"Ändere `print(bmi)` so, dass die Ausgabe `Dein BMI: 24.031709372366656` lautet.\n\nKombiniere den Text mit der Variable.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/7",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Strings"],
			solutionString: [
				"Mein BMI-Rechner",
				"Gewicht: 77",
				"Größe: 1.79",
				"Dein BMI: 24.031709372366656",
			],
			solutionCode: ["str(bmi)"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

# Ändere diese Zeile
print(bmi)`,
		},
		{
			id: "bmi-calculator-step-8",
			step: 8,
			title: "Erste Bedingung - if einführen",
			description: "Prüfe ob der BMI im Normalbereich liegt.",
			blocks: [
				{
					type: "text",
					content:
						"Jetzt wird es spannend! Wir bringen deinem Programm bei, **Entscheidungen zu treffen**.",
				},
				{
					type: "text",
					content:
						"## Was ist eine Bedingung?\n\nMit `if` kannst du Code nur ausführen, **wenn** eine Bedingung erfüllt ist.\n\n- Bedingung **wahr** → Code wird ausgeführt\n- Bedingung **falsch** → Code wird übersprungen",
				},
				{
					type: "code",
					title: "Aufbau einer if-Bedingung",
					language: "python",
					content: `#  Schlüsselwort  Bedingung  Doppelpunkt
#       ↓            ↓           ↓
       if       alter >= 18      :
           print("Volljährig")
#          ↑
#     EINGERÜCKT! (Tab oder 4 Leerzeichen)`,
				},
				{
					type: "text",
					content:
						"## Vergleichsoperatoren\n\nMit diesen Operatoren vergleichst du Werte:\n\n- `<` kleiner als\n- `>` größer als\n- `<=` kleiner oder gleich\n- `>=` größer oder gleich\n- `==` ist gleich (zwei Gleichheitszeichen!)",
				},
				{
					type: "code",
					title: "Beispiel",
					language: "python",
					content: `temperatur = 30

if temperatur > 25:
    print("Es ist warm!")  # Wird ausgeführt (30 > 25)

# Diese Zeile ist NICHT eingerückt
# Sie wird IMMER ausgeführt
print("Fertig")`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Zwei Dinge nicht vergessen:**\n\n1. **Doppelpunkt** am Ende der if-Zeile\n2. **Einrückung** für den Code-Block (Tab-Taste)",
				},
				{
					type: "task",
					content:
						"Schreibe eine if-Bedingung: Wenn der BMI kleiner als 25 ist, gib `Normalgewicht` aus.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/8",
			courseId: "bmi-calculator",
			topics: ["Bedingungen"],
			solutionString: [
				"Gewicht: 77",
				"Größe: 1.79",
				"Dein BMI: 24.031709372366656",
				"Normalgewicht",
			],
			solutionCode: ["if bmi"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

print("Dein BMI: " + str(bmi))

# Deine if-Bedingung hier`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-9",
			step: 9,
			hasDrill: true,
			title: "Mehrere Bedingungen - elif",
			description: "Füge weitere BMI-Kategorien hinzu.",
			blocks: [
				{
					type: "text",
					content:
						"Eine Kategorie reicht nicht! Wir brauchen mehrere BMI-Kategorien. Dafür gibt es `elif`.",
				},
				{
					type: "text",
					content:
						"## BMI-Kategorien (WHO)\n\n- **Untergewicht:** BMI < 18.5\n- **Normalgewicht:** BMI 18.5 - 24.9\n- **Übergewicht:** BMI 25.0 - 29.9\n- **Adipositas:** BMI ≥ 30",
				},
				{
					type: "text",
					content:
						"## Was ist elif?\n\n`elif` = **else if** (\"sonst wenn\")\n\nPython prüft von oben nach unten. Sobald eine Bedingung wahr ist, werden alle anderen **übersprungen**.",
				},
				{
					type: "code",
					title: "if-elif Kette (Beispiel: Noten)",
					language: "python",
					content: `note = 2.3

if note < 1.5:
    print("sehr gut")      # Falsch, weiter
elif note < 2.5:
    print("gut")           # WAHR! → Ausgabe, STOPP
elif note < 3.5:
    print("befriedigend")  # Wird übersprungen!`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**Reihenfolge wichtig!**\n\nDie Bedingungen müssen aufsteigend sein, weil Python bei der ersten wahren Bedingung stoppt.",
				},
				{
					type: "task",
					content:
						"Erweitere zu 3 BMI-Kategorien:\n\n1. Untergewicht (< 18.5)\n2. Normalgewicht (< 25)\n3. Übergewicht (< 30)\n\nÄndere das bestehende `if` und füge zwei `elif` hinzu.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/9",
			courseId: "bmi-calculator",
			topics: ["Bedingungen"],
			solutionString: [
				"Gewicht: 77",
				"Größe: 1.79",
				"Dein BMI: 24.031709372366656",
				"Normalgewicht",
			],
			solutionCode: ["if bmi", "elif bmi"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

print("Dein BMI: " + str(bmi))

# Erweitere diese Bedingung für 3 Kategorien
if bmi < 25:
    print("Normalgewicht")`,
		},
		{
			id: "bmi-calculator-step-10",
			step: 10,
			title: "Code verbessern - Variable statt direkter Ausgabe",
			description: "Refactoring: Speichere die Kategorie in einer Variable.",
			blocks: [
				{
					type: "text",
					content:
						"Der Code funktioniert, aber wir können ihn **verbessern**! Statt in jedem Block `print()` aufzurufen, speichern wir die Kategorie in einer Variable.",
				},
				{
					type: "text",
					content:
						"## Warum ist das besser?\n\n**Vorher:** Jeder Block gibt direkt aus - die Kategorie ist danach \"weg\"\n\n**Nachher:** Die Kategorie wird gespeichert und kann weiterverwendet werden",
				},
				{
					type: "code",
					title: "Vorher vs. Nachher",
					language: "python",
				content: `# VORHER: Direkte Ausgabe
if alter >= 18:
    print("Erwachsen")  # Status ist weg

# NACHHER: In Variable speichern
status = None  # Startwert

if alter >= 18:
    status = "Erwachsen"  # Gespeichert!

print("Status: " + status)  # Eine Ausgabe am Ende`,
				},
				{
					type: "text",
					content:
						"## Was ist None?\n\n`None` ist Pythons Wert für \"nichts\" oder \"noch nicht gesetzt\". Wir verwenden es als Startwert, bevor die Bedingungen geprüft werden.",
				},
				{
					type: "task",
					content:
						"Refactoring:\n\n1. Erstelle `category = None` vor dem `if`\n2. Ersetze alle `print(\"...\")` durch `category = \"...\"`\n\n**Hinweis:** Das Ausgeben der Kategorie kommt im nächsten Schritt!",
				},
				{
					type: "hint",
					severity: "info",
					content:
						"**Tipp:** Die Variable `category` wird noch nicht ausgegeben - das machen wir erst im nächsten Schritt, wenn alle Kategorien abgedeckt sind.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/10",
			courseId: "bmi-calculator",
			topics: ["Bedingungen", "Variablen"],
			solutionString: [],
			solutionCode: ["category=None", "category=\"Untergewicht\"", "category=\"Normalgewicht\"", "category=\"Übergewicht\""],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

print("Dein BMI: " + str(bmi))

# Erstelle hier category = None

# Ändere print() zu category = "..."
if bmi < 18.5:
    print("Untergewicht")
elif bmi < 25:
    print("Normalgewicht")
elif bmi < 30:
    print("Übergewicht")`,
			hasDrill: true,
		},
		{
			id: "bmi-calculator-step-11",
			step: 11,
			hasDrill: true,
			title: "Else hinzufügen - Vollständige Abdeckung",
			description: "Vervollständige mit else für alle restlichen Fälle.",
			blocks: [
				{
					type: "text",
					content:
						"Fast fertig! Aber was passiert bei BMI ≥ 30? Wir brauchen noch **Adipositas** als vierte Kategorie.",
				},
				{
					type: "text",
					content:
						"## Was ist else?\n\n`else` fängt **alle restlichen Fälle** ab - ohne eigene Bedingung.\n\nWenn keine der vorherigen Bedingungen wahr war, wird `else` ausgeführt.",
				},
				{
					type: "code",
					title: "Beispiel: Notensystem mit else",
					language: "python",
					content: `# Schulnoten: 1 (sehr gut) bis 6 (ungenügend)
note = 4.2

if note < 1.5:
    bewertung = "Sehr gut"
elif note < 2.5:
    bewertung = "Gut"
elif note < 3.5:
    bewertung = "Befriedigend"
else:
    bewertung = "Nicht bestanden"  # Alle anderen (≥ 3.5)
#   ↑
# Keine Bedingung nötig!`,
				},
				{
					type: "hint",
					severity: "warning",
					content:
						"**else hat keine Bedingung!**\n\nNicht `else bmi >= 30:` sondern einfach `else:`\n\nWenn BMI nicht < 18.5, < 25 oder < 30 ist, muss er ≥ 30 sein.",
				},
				{
					type: "task",
					content:
						"1. Füge nach dem letzten `elif` ein `else:` hinzu und weise `category = \"Adipositas\"` zu.\n2. Gib am Ende die Kategorie aus: `print(\"Kategorie: \" + category)`\n\nTeste: Mit `weight = 100` sollte `Kategorie: Adipositas` erscheinen.",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/11",
			courseId: "bmi-calculator",
			topics: ["Bedingungen", "Variablen"],
			solutionString: [
				"Mein BMI-Rechner",
				"Kategorie:",
			],
			solutionCode: ["if bmi", "elif bmi", "else:", "print(\"Kategorie"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

print("Dein BMI: " + str(bmi))

category = None

if bmi < 18.5:
    category = "Untergewicht"
elif bmi < 25:
    category = "Normalgewicht"
elif bmi < 30:
    category = "Übergewicht"
# Füge hier else für die vierte Kategorie hinzu

# Gib hier category aus`,
		},
		{
			id: "bmi-calculator-step-12",
			step: 12,
			title: "Dein BMI-Rechner ist fertig!",
			description: "Teste deinen Rechner mit verschiedenen Werten.",
			blocks: [
				{
					type: "text",
					content:
						"**Herzlichen Glückwunsch!** Dein BMI-Rechner ist vollständig und funktioniert!",
				},
				{
					type: "text",
					content:
						"## Teste deinen Rechner\n\nÄndere die Werte von `weight` und `height` am Anfang des Codes. Der Rest berechnet automatisch den BMI und zeigt die richtige Kategorie an.",
				},
				{
					type: "code",
					title: "Beispiel-Werte zum Testen",
					language: "python",
					content: `# Probiere verschiedene Werte aus!
# BMI = weight / (height * height)

# Beispiel 1: Person mit 60kg bei 1.70m
weight = 60
height = 1.70  # BMI ≈ 20.8 → Normalgewicht

# Beispiel 2: Person mit 55kg bei 1.80m  
weight = 55
height = 1.80  # BMI ≈ 17.0 → Untergewicht

# Welche Werte ergeben Adipositas (BMI ≥ 30)?
# Tipp: BMI = weight / (height * height)`,
				},
				{
					type: "task",
					content:
						"Ändere `weight` und `height` so, dass `Kategorie: Adipositas` ausgegeben wird (BMI ≥ 30).",
				},
				{
					type: "text",
					content:
						"## Was du gelernt hast\n\n- `print()` - Ausgabe in der Konsole\n- **Variablen** - Werte speichern\n- **Strings vs. Zahlen** - Mit und ohne Anführungszeichen\n- `str()` - Zahlen in Text umwandeln\n- **Mathematik** - Rechnen mit `+`, `-`, `*`, `/`\n- `if`/`elif`/`else` - Bedingungen prüfen",
				},
				{
					type: "hint",
					severity: "success",
					content:
						"**Gut gemacht!** Das sind die Grundbausteine von Python. Du kannst jetzt eigene Programme schreiben!",
				},
			],
			showHints: true,
			path: "/pfade/bmi-calculator/12",
			courseId: "bmi-calculator",
			topics: ["Variablen", "Bedingungen"],
			solutionString: [
				"Mein BMI-Rechner",
				"Kategorie: Adipositas",
			],
			solutionCode: ["if bmi", "elif bmi", "else:"],
			starterCode: `# Mein BMI-Rechner

print("Mein BMI-Rechner")

# Ändere diese Werte, um verschiedene BMI-Kategorien zu testen!
weight = 77
height = 1.79

print("Gewicht: " + str(weight))
print("Größe: " + str(height))

bmi = weight / (height * height)

print("Dein BMI: " + str(bmi))

category = None

if bmi < 18.5:
    category = "Untergewicht"
elif bmi < 25:
    category = "Normalgewicht"
elif bmi < 30:
    category = "Übergewicht"
else:
    category = "Adipositas"

print("Kategorie: " + category)`,
			hasDrill: true,
		},
	],
};

export function getBmiCalculatorCourseTask(step: number) {
	const task = bmiCalculatorCourseData.tasks.find((task) => task.step === step);
	const path = `/pfade/bmi-calculator/${step}`;
	if (task) {
		return {
			...task,
			path,
			courseId: bmiCalculatorCourseData.id,
		};
	}
	return null;
}
