import type { DrillTask } from "@/types/courseTypes";

export const pythonDrillTasks: DrillTask[] = [
  {
    topic: "print",
    mcQuestions: [
      {
        id: "mcq-print-1",
        type: 'multiple-choice',
        question: "Was macht die print()-Funktion?",
        options: [
          "Speichert Daten auf der Festplatte",
          "Gibt Text in der Konsole aus",
          "Erstellt eine Variable",
          "Rechnet Zahlen aus"
        ],
        correctAnswer: "Gibt Text in der Konsole aus"
      },
      {
        id: "mcq-print-2",
        type: 'multiple-choice',
        question: "Wie gibt man 'Python lernen' aus?",
        options: [
          "print(Python lernen)",
          "print('Python lernen')",
          "Print('Python lernen')",
          "// console.log('Python lernen')"
        ],
        correctAnswer: "print('Python lernen')"
      },
      {
        id: "mcq-print-3",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print('Python')\nprint('Lernen')",
        options: [
          "Python Lernen",
          "Python\nLernen",
          "PythonLernen",
          "Error"
        ],
        correctAnswer: "Python\nLernen",
        explanation: "Jedes print() macht eine neue Zeile. Also zwei Zeilen: Python und Lernen."
      },
      {
        id: "mcq-print-4",
        type: "spot-the-error",
        question: "Welcher Code ist korrekt?",
        code: "A: print('Hallo')\nB: print(Hallo)\nC: Print('Hallo')\nD: PRINT('Hallo')",
        options: [
          "Nur A ist korrekt",
          "A und C sind korrekt",
          "Alle sind korrekt",
          "B und D sind korrekt"
        ],
        correctAnswer: "Nur A ist korrekt",
        explanation: "Python ist case-sensitive (print, nicht Print) und Text braucht Anführungszeichen."
      },
      {
        id: "mcq-print-6",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print('Guten')\nprint('Tag')\nprint('!')",
        options: [
          "Guten Tag !",
          "Guten\nTag\n!",
          "GutenTag!",
          "Error"
        ],
        correctAnswer: "Guten\nTag\n!",
        explanation: "Jedes print() erzeugt eine neue Zeile. Also drei separate Zeilen."
      },
      {
        id: "mcq-print-7",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "print('Heute ist Montag)",
        options: [
          "Es fehlt das schließende Anführungszeichen",
          "print muss großgeschrieben werden",
          "Es fehlt ein Semikolon",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt das schließende Anführungszeichen",
        explanation: "Strings müssen mit dem gleichen Anführungszeichen enden, mit dem sie beginnen."
      },
      {
        id: "mcq-print-8",
        type: "multiple-choice",
        question: "Welche Anführungszeichen sind für Strings in Python erlaubt?",
        options: [
          "Nur doppelte: \"...\"",
          "Nur einfache: '...'",
          "Beide: \"...\" und '...'",
          "Keine, Python braucht keine Anführungszeichen"
        ],
        correctAnswer: "Beide: \"...\" und '...'"
      },
      {
        id: "mcq-print-9",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "# print('Geheim')\nprint('Sichtbar')",
        options: [
          "Geheim\nSichtbar",
          "Sichtbar",
          "# print('Geheim')\nSichtbar",
          "Error"
        ],
        correctAnswer: "Sichtbar",
        explanation: "Die erste Zeile ist ein Kommentar (#) und wird von Python ignoriert."
      },
      {
        id: "mcq-print-10",
        type: "fill-the-blank",
        question: "Vervollständige den Code für die Ausgabe 'Fertig':",
        code: "___('Fertig')",
        options: ["Print", "print", "PRINT", "ausgabe"],
        correctAnswer: "print",
        explanation: "In Python ist alles kleingeschrieben: print (nicht Print oder PRINT)."
      },
      {
        id: "mcq-print-11",
        type: "spot-the-error",
        question: "Warum funktioniert dieser Code nicht?",
        code: "print(Guten Morgen)",
        options: [
          "Es fehlen Anführungszeichen um den Text",
          "print ist falsch geschrieben",
          "Es fehlt ein Doppelpunkt",
          "Leerzeichen sind nicht erlaubt"
        ],
        correctAnswer: "Es fehlen Anführungszeichen um den Text",
        explanation: "Text muss immer in Anführungszeichen stehen: print('Guten Morgen')"
      },
      {
        id: "mcq-print-12",
        type: "multiple-choice",
        question: "Was ist ein Kommentar in Python?",
        options: [
          "Text, der vom Programm ausgeführt wird",
          "Eine Notiz für Menschen, die Python ignoriert",
          "Eine spezielle Funktion",
          "Ein Fehler im Code"
        ],
        correctAnswer: "Eine Notiz für Menschen, die Python ignoriert"
      },
      {
        id: "mcq-print-13",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print(\"Zahl: 42\")",
        options: [
          "Zahl: 42",
          "\"Zahl: 42\"",
          "42",
          "Error"
        ],
        correctAnswer: "Zahl: 42",
        explanation: "Die Anführungszeichen markieren nur den String, sie werden nicht mit ausgegeben."
      },
      {
        id: "mcq-print-14",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "print['Fehler']",
        options: [
          "Eckige Klammern statt runde Klammern",
          "Das Wort 'Fehler' ist reserviert",
          "print muss großgeschrieben sein",
          "Kein Fehler"
        ],
        correctAnswer: "Eckige Klammern statt runde Klammern",
        explanation: "Funktionen wie print() verwenden runde Klammern (), nicht eckige []."
      },
      {
        id: "mcq-print-15",
        type: "multiple-choice",
        question: "Wie beginnt ein Kommentar in Python?",
        options: [
          "// (zwei Schrägstriche)",
          "# (Raute/Hashtag)",
          "/* ... */",
          "-- (zwei Bindestriche)"
        ],
        correctAnswer: "# (Raute/Hashtag)"
      },
      {
        id: "mcq-print-16",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print('A')\n# print('B')\nprint('C')",
        options: ["A\nB\nC", "A\nC", "A B C", "Error"],
        correctAnswer: "A\nC",
        explanation: "Die mittlere Zeile ist ein Kommentar und wird ignoriert."
      },
      {
        id: "mcq-print-18",
        type: "multiple-choice",
        question: "Wie viele Zeilen gibt print('Eins')\\nprint('Zwei') aus?",
        options: ["1 Zeile", "2 Zeilen", "3 Zeilen", "0 Zeilen"],
        correctAnswer: "2 Zeilen"
      },
      {
        id: "mcq-print-19",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print('123')",
        options: ["123", "einhundertdreiundzwanzig", "'123'", "Error"],
        correctAnswer: "123",
        explanation: "'123' ist ein String (Text). Die Anführungszeichen werden nicht mit ausgegeben."
      },
      {
        id: "mcq-print-21",
        type: "spot-the-error",
        question: "Was stimmt nicht?",
        code: "PRINT('Fehler')",
        options: [
          "PRINT muss kleingeschrieben sein",
          "Es fehlen Anführungszeichen",
          "Klammern sind falsch",
          "Kein Fehler"
        ],
        correctAnswer: "PRINT muss kleingeschrieben sein",
        explanation: "Python ist case-sensitive: print (nicht PRINT oder Print)"
      },
      {
        id: "mcq-print-23",
        type: "multiple-choice",
        question: "Welche Aussage ist FALSCH?",
        options: [
          "print() gibt Text in der Konsole aus",
          "Strings brauchen Anführungszeichen",
          "Kommentare beginnen mit #",
          "print muss großgeschrieben werden"
        ],
        correctAnswer: "print muss großgeschrieben werden"
      },
      {
        id: "mcq-print-24",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print(\"Das ist ein Test\")",
        options: ["Das ist ein Test", "\"Das ist ein Test\"", "Error", "Nichts"],
        correctAnswer: "Das ist ein Test",
        explanation: "Doppelte Anführungszeichen funktionieren genauso wie einfache."
      },
      {
        id: "mcq-print-25",
        type: "spot-the-error",
        question: "Was ist der Syntaxfehler?",
        code: "print 'Hallo'",
        options: [
          "Es fehlen die Klammern um 'Hallo'",
          "Hallo muss großgeschrieben sein",
          "Es fehlt ein Semikolon",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlen die Klammern um 'Hallo'",
        explanation: "In Python 3 braucht print() immer Klammern: print('Hallo')"
      }
    ],
    codeTasks: [
      {
        id: "code-print-1",
        step: 1,
        title: "Text ausgeben",
        description: "Gib 'Willkommen' in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Schreibe hier deinen Code"
          }
        ],
        showHints: false,
        path: "/drills/print/1",
        courseId: "python-drills",
        prompt: "Gib den Text 'Willkommen' in der Konsole aus. Nutze print() direkt mit dem Text - du brauchst keine Variable.",
        starterCode: "# Schreibe hier deinen Code",
        solutionString: "Willkommen",
        solutionCode: ["print(", "Willkommen"],
        hint: "Schreibe einfach: print('Willkommen')"
      },
      {
        id: "code-print-2",
        step: 2,
        title: "Mehrere Zeilen ausgeben",
        description: "Gib 'Python' und 'Rocks' in zwei Zeilen in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Schreibe hier deinen Code"
          }
        ],
        showHints: false,
        path: "/drills/print/2",
        courseId: "python-drills",
        prompt: "Gib 'Python' in Zeile 1 und 'Rocks' in Zeile 2 in die Konsole aus. Nutze zwei separate print()-Aufrufe - du brauchst keine Variablen.",
        starterCode: "# Schreibe hier deinen Code",
        solutionString: "Python\nRocks",
        solutionCode: ["print(", "Python", "print(", "Rocks"],
        hint: "Zwei print-Befehle untereinander: print('Python') und dann print('Rocks')"
      },
      {
        id: "code-print-3",
        step: 3,
        title: "Begrüßung ausgeben",
        description: "Gib 'Guten Morgen' in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe eine Begrüßung in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/3",
        courseId: "python-drills",
        prompt: "Gib den Text 'Guten Morgen' in der Konsole aus. Nutze print() direkt - du brauchst keine Variable. Achte auf das Leerzeichen zwischen 'Guten' und 'Morgen'!",
        starterCode: "# Gebe eine Begrüßung in die Konsole aus",
        solutionString: "Guten Morgen",
        solutionCode: ["print(", "Guten Morgen"],
        hint: "Der Text muss exakt 'Guten Morgen' lauten (mit Leerzeichen)."
      },
      {
        id: "code-print-4",
        step: 4,
        title: "Drei Zeilen ausgeben",
        description: "Gib 'Eins', 'Zwei' und 'Drei' jeweils in einer eigenen Zeile in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe drei Zeilen in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/4",
        courseId: "python-drills",
        prompt: "Gib 'Eins', 'Zwei' und 'Drei' in drei separaten Zeilen in die Konsole aus. Nutze drei print()-Aufrufe - du brauchst keine Variablen.",
        starterCode: "# Gebe drei Zeilen in die Konsole aus",
        solutionString: "Eins\nZwei\nDrei",
        solutionCode: ["print(", "Eins", "print(", "Zwei", "print(", "Drei"],
        hint: "Drei print-Befehle untereinander."
      },
      {
        id: "code-print-5",
        step: 5,
        title: "Satz mit Satzzeichen",
        description: "Gib 'Fertig!' mit Ausrufezeichen in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe den Text in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/5",
        courseId: "python-drills",
        prompt: "Gib den Text 'Fertig!' (mit Ausrufezeichen) in der Konsole aus. Nutze print() direkt - du brauchst keine Variable.",
        starterCode: "# Gebe den Text in die Konsole aus",
        solutionString: "Fertig!",
        solutionCode: ["print(", "Fertig!"],
        hint: "Schreibe einfach: print('Fertig!')"
      },
      {
        id: "code-print-7",
        step: 7,
        title: "Leere Zeile und Text",
        description: "Gib erst eine leere Zeile aus, dann 'Ende' in die Konsole.",
        blocks: [
          {
            type: "code",
            content: "# Erst leere Zeile, dann Text"
          }
        ],
        showHints: false,
        path: "/drills/print/7",
        courseId: "python-drills",
        prompt: "Gib erst eine leere Zeile aus (print() ohne Inhalt), dann 'Ende' in der nächsten Zeile. Du brauchst keine Variablen - nutze zwei print()-Aufrufe.",
        starterCode: "# Erst leere Zeile, dann Text",
        solutionString: "\nEnde",
        solutionCode: ["print()", "print(", "Ende"],
        hint: "Erst print() ohne Inhalt für die leere Zeile, dann print('Ende')."
      },
      {
        id: "code-print-8",
        step: 8,
        title: "Frage ausgeben",
        description: "Gib 'Wie geht es dir?' in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe eine Frage in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/8",
        courseId: "python-drills",
        prompt: "Gib den Text 'Wie geht es dir?' in der Konsole aus. Nutze print() direkt - du brauchst keine Variable. Achte auf die Leerzeichen im Text!",
        starterCode: "# Gebe eine Frage in die Konsole aus",
        solutionString: "Wie geht es dir?",
        solutionCode: ["print(", "Wie geht es dir?"],
        hint: "Der Text muss exakt 'Wie geht es dir?' lauten (mit allen Leerzeichen)."
      },
      {
        id: "code-print-9",
        step: 9,
        title: "Vier Zeilen ausgeben",
        description: "Gib 'A', 'B', 'C', 'D' in vier Zeilen in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe vier Buchstaben in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/9",
        courseId: "python-drills",
        prompt: "Gib 'A', 'B', 'C' und 'D' jeweils in einer eigenen Zeile in die Konsole aus. Nutze vier print()-Aufrufe - du brauchst keine Variablen.",
        starterCode: "# Gebe vier Buchstaben in die Konsole aus",
        solutionString: "A\nB\nC\nD",
        solutionCode: ["print(", "'A'", "print(", "'B'", "print(", "'C'", "print(", "'D'"],
        hint: "Vier print-Befehle untereinander: print('A'), print('B'), print('C'), print('D')."
      },
      {
        id: "code-print-10",
        step: 10,
        title: "Satz mit Punkt",
        description: "Gib 'Das ist ein Satz.' mit Punkt am Ende in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Gebe einen vollständigen Satz in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/print/10",
        courseId: "python-drills",
        prompt: "Gib 'Das ist ein Satz.' (mit Punkt am Ende) in der Konsole aus. Nutze print() direkt - du brauchst keine Variable. Achte auf alle Leerzeichen im Satz!",
        starterCode: "# Gebe einen vollständigen Satz in die Konsole aus",
        solutionString: "Das ist ein Satz.",
        solutionCode: ["print(", "Das ist ein Satz."],
        hint: "Der Text muss exakt 'Das ist ein Satz.' lauten (mit Leerzeichen und Punkt)."
      },
      {
        id: "code-print-12",
        step: 12,
        title: "Begrüßung mit Name",
        description: "Gib 'Hallo, ich bin Python!' in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Begrüße den Nutzer"
          }
        ],
        showHints: false,
        path: "/drills/print/12",
        courseId: "python-drills",
        prompt: "Gib 'Hallo, ich bin Python!' in der Konsole aus. Nutze print() direkt - du brauchst keine Variable. Achte auf die Leerzeichen und das Komma!",
        starterCode: "# Begrüße den Nutzer",
        solutionString: "Hallo, ich bin Python!",
        solutionCode: ["print(", "Hallo, ich bin Python!"],
        hint: "Der Text muss exakt 'Hallo, ich bin Python!' lauten."
      },
      {
        id: "code-print-13",
        step: 13,
        title: "Leerzeile zwischen Text",
        description: "Gib 'Start', eine Leerzeile und 'Ende' in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Start, Leerzeile, Ende"
          }
        ],
        showHints: false,
        path: "/drills/print/13",
        courseId: "python-drills",
        prompt: "Gib 'Start' aus, dann eine Leerzeile (print() ohne Inhalt), dann 'Ende' in die Konsole. Du brauchst keine Variablen - nutze drei print()-Aufrufe.",
        starterCode: "# Start, Leerzeile, Ende",
        solutionString: "Start\n\nEnde",
        solutionCode: ["print(", "'Start'", "print()", "print(", "'Ende'"],
        hint: "Drei Zeilen: print('Start'), dann print() für die Leerzeile, dann print('Ende')."
      },
      {
        id: "code-print-15",
        step: 15,
        title: "Countdown ausgeben",
        description: "Gib '3', '2', '1', 'Los!' in vier Zeilen in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Countdown ausgeben"
          }
        ],
        showHints: false,
        path: "/drills/print/15",
        courseId: "python-drills",
        prompt: "Gib '3', '2', '1' und 'Los!' jeweils in einer eigenen Zeile in die Konsole aus. Nutze vier print()-Aufrufe - du brauchst keine Variablen.",
        starterCode: "# Countdown ausgeben",
        solutionString: "3\n2\n1\nLos!",
        solutionCode: ["print(", "'3'", "print(", "'2'", "print(", "'1'", "print(", "'Los!'"],
        hint: "Vier print-Befehle: print('3'), print('2'), print('1'), print('Los!')."
      }
    ]
  },
  {
    topic: "Variablen",
    mcQuestions: [
      {
        id: "mcq-variablen-1",
        type: 'multiple-choice',
        question: "Was ist eine Variable in Python?",
        options: [
          "Ein fester Wert, der sich nicht ändert",
          "Ein Speicherort für Daten",
          "Eine Funktion",
          "Ein Kommentar"
        ],
        correctAnswer: "Ein Speicherort für Daten"
      },
      {
        id: "mcq-variablen-2",
        type: 'multiple-choice',
        question: "Wie weist man einer Variable den Wert 10 zu?",
        options: ["var = 10", "10 = var", "var == 10", "var := 10"],
        correctAnswer: "var = 10"
      },
      {
        id: "mcq-variablen-3",
        type: 'multiple-choice',
        question: "Welche der folgenden Variablenbezeichnungen ist gültig?",
        options: ["1variable", "variable_1", "variable-1", "variable 1"],
        correctAnswer: "variable_1"
      },
      {
        id: "mcq-variablen-4",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "25 = age\nprint(age)",
        options: [
          "Die Zuweisung ist verkehrt herum",
          "Es fehlt das Schlüsselwort 'var'",
          "print muss großgeschrieben sein",
          "Kein Fehler"
        ],
        correctAnswer: "Die Zuweisung ist verkehrt herum",
        explanation: "Korrekt: age = 25 (Variable auf der linken Seite, Wert rechts)"
      },
      {
        id: "mcq-variablen-5",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 5\nx = 10\nprint(x)",
        options: ["5", "10", "5 10", "Error"],
        correctAnswer: "10",
        explanation: "Die zweite Zuweisung überschreibt den ersten Wert. x hat am Ende den Wert 10."
      },
      {
        id: "mcq-variablen-6",
        type: "spot-the-error",
        question: "Welcher Variablenname ist UNGÜLTIG?",
        code: "A: spieler1\nB: 1spieler\nC: spieler_name\nD: spielerName",
        options: [
          "A ist ungültig",
          "B ist ungültig",
          "C ist ungültig",
          "Alle sind gültig"
        ],
        correctAnswer: "B ist ungültig",
        explanation: "Variablennamen dürfen nicht mit einer Zahl beginnen. '1spieler' ist ungültig."
      },
      {
        id: "mcq-variablen-7",
        type: "multiple-choice",
        question: "Was bedeutet das = Zeichen in Python?",
        options: [
          "Prüft ob zwei Werte gleich sind",
          "Weist einer Variable einen Wert zu",
          "Addiert zwei Werte",
          "Löscht eine Variable"
        ],
        correctAnswer: "Weist einer Variable einen Wert zu"
      },
      {
        id: "mcq-variablen-8",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "stadt = 'Berlin'\nprint(stadt)",
        options: ["stadt", "Berlin", "'Berlin'", "Error"],
        correctAnswer: "Berlin",
        explanation: "print(stadt) gibt den WERT der Variable aus, nicht den Namen."
      },
      {
        id: "mcq-variablen-9",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "mein-wert = 100",
        options: [
          "Bindestriche sind in Variablennamen nicht erlaubt",
          "100 ist zu groß",
          "Es fehlt ein Semikolon",
          "Kein Fehler"
        ],
        correctAnswer: "Bindestriche sind in Variablennamen nicht erlaubt",
        explanation: "Nutze stattdessen Unterstriche: mein_wert = 100"
      },
      {
        id: "mcq-variablen-10",
        type: "fill-the-blank",
        question: "Vervollständige: Speichere 50 in der Variable 'punkte'",
        code: "punkte ___ 50",
        options: ["==", "=", ":", "->"],
        correctAnswer: "=",
        explanation: "Mit = weist man einer Variable einen Wert zu."
      },
      {
        id: "mcq-variablen-11",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "a = 3\nb = 7\nprint(a)\nprint(b)",
        options: ["3 7", "3\n7", "a b", "Error"],
        correctAnswer: "3\n7",
        explanation: "Jedes print() erzeugt eine neue Zeile. Erst 3, dann 7."
      },
      {
        id: "mcq-variablen-12",
        type: "multiple-choice",
        question: "Welche Aussage über Variablen ist RICHTIG?",
        options: [
          "Variablen können ihren Wert nie ändern",
          "Variablen können jederzeit überschrieben werden",
          "Variablennamen müssen Großbuchstaben sein",
          "Jede Variable braucht das Wort 'var'"
        ],
        correctAnswer: "Variablen können jederzeit überschrieben werden"
      },
      {
        id: "mcq-variablen-13",
        type: "spot-the-error",
        question: "Welcher Name enthält einen Fehler?",
        code: "A: user_id\nB: userId\nC: user id\nD: user2",
        options: [
          "A hat einen Fehler",
          "B hat einen Fehler",
          "C hat einen Fehler",
          "D hat einen Fehler"
        ],
        correctAnswer: "C hat einen Fehler",
        explanation: "Leerzeichen sind in Variablennamen nicht erlaubt. 'user id' ist ungültig."
      },
      {
        id: "mcq-variablen-14",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "wert = 1\nwert = 2\nwert = 3\nprint(wert)",
        options: ["1", "2", "3", "1 2 3"],
        correctAnswer: "3",
        explanation: "Die Variable wird dreimal überschrieben. Am Ende hat sie den Wert 3."
      },
      {
        id: "mcq-variablen-15",
        type: "multiple-choice",
        question: "Auf welcher Seite steht die Variable bei einer Zuweisung?",
        options: [
          "Rechts vom = Zeichen",
          "Links vom = Zeichen",
          "Egal, beide Seiten funktionieren",
          "In der Mitte"
        ],
        correctAnswer: "Links vom = Zeichen",
        explanation: "Format: variable = wert (Variable links, Wert rechts)"
      },
      {
        id: "mcq-variablen-16",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "tier = 'Hund'\ntier = 'Katze'\ntier = 'Vogel'\nprint(tier)",
        options: ["Hund", "Katze", "Vogel", "Hund Katze Vogel"],
        correctAnswer: "Vogel",
        explanation: "Die Variable wird mehrfach überschrieben. Am Ende hat sie den Wert 'Vogel'."
      },
      {
        id: "mcq-variablen-17",
        type: "spot-the-error",
        question: "Welcher Code hat einen Fehler?",
        code: "A: preis = 50\nB: _preis = 50\nC: 50preis = 50\nD: preis50 = 50",
        options: [
          "A hat einen Fehler",
          "B hat einen Fehler",
          "C hat einen Fehler",
          "D hat einen Fehler"
        ],
        correctAnswer: "C hat einen Fehler",
        explanation: "Variablennamen dürfen nicht mit einer Zahl beginnen."
      },
      {
        id: "mcq-variablen-18",
        type: "multiple-choice",
        question: "Welches Zeichen ist in Variablennamen erlaubt?",
        options: [
          "Bindestrich (-)",
          "Leerzeichen ( )",
          "Unterstrich (_)",
          "Punkt (.)"
        ],
        correctAnswer: "Unterstrich (_)"
      },
      {
        id: "mcq-variablen-19",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 100\ny = x\nprint(y)",
        options: ["x", "y", "100", "Error"],
        correctAnswer: "100",
        explanation: "y bekommt den Wert von x (100). print(y) gibt also 100 aus."
      },
      {
        id: "mcq-variablen-20",
        type: "fill-the-blank",
        question: "Wie speichert man 'Apfel' in der Variable 'frucht'?",
        code: "frucht ___ 'Apfel'",
        options: ["==", "=", ":", "->"],
        correctAnswer: "=",
        explanation: "Mit = weist man einer Variable einen Wert zu."
      },
      {
        id: "mcq-variablen-22",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "zahl = 5\nzahl = zahl + 3\nprint(zahl)",
        options: ["5", "3", "8", "Error"],
        correctAnswer: "8",
        explanation: "zahl = zahl + 3 nimmt den alten Wert (5), addiert 3, ergibt 8."
      },
      {
        id: "mcq-variablen-23",
        type: "multiple-choice",
        question: "Welche Aussage über Python-Variablen ist RICHTIG?",
        options: [
          "Variablen müssen einen Typ deklarieren (z.B. int x = 5)",
          "Variablen brauchen kein Schlüsselwort wie 'var' oder 'let'",
          "Variablen können nicht überschrieben werden",
          "Variablennamen sind nicht case-sensitive"
        ],
        correctAnswer: "Variablen brauchen kein Schlüsselwort wie 'var' oder 'let'"
      },
      {
        id: "mcq-variablen-24",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "Name = 'Tim'\nname = 'Tom'\nprint(name)",
        options: ["Tim", "Tom", "Error", "name"],
        correctAnswer: "Tom",
        explanation: "Python ist case-sensitive. Name und name sind zwei verschiedene Variablen."
      },
      {
        id: "mcq-variablen-25",
        type: "spot-the-error",
        question: "Warum funktioniert dieser Code nicht?",
        code: "print(message)\nmessage = 'Hallo'",
        options: [
          "Variable wird vor der Zuweisung verwendet",
          "message ist kein gültiger Name",
          "print ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "Variable wird vor der Zuweisung verwendet",
        explanation: "Man muss eine Variable erst erstellen, bevor man sie verwendet."
      }
    ],
    codeTasks: [
      {
        id: "code-variablen-1",
        step: 1,
        title: "Variable deklarieren",
        description: "Erstelle eine Variable namens `score` und weise ihr den Wert 100 zu.",
        blocks: [
          {
            type: "code",
            content: "# Schreibe hier deinen Code"
          }
        ],
        showHints: false,
        path: "/drills/variablen/1",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable namens 'score' und weise ihr den Wert 100 zu. Gib anschließend 'score' in der Konsole aus mit print(score).",
        starterCode: "# Schreibe hier deinen Code",
        solutionString: "100",
        solutionCode: ["score", "= 100", "print("],
        hint: "Zwei Zeilen: 1) score = 100 und 2) print(score)"
      },
      {
        id: "code-variablen-2",
        step: 2,
        title: "Variablen ausgeben",
        description: "Erstelle zwei Variablen `x` und `y` mit den Werten 5 und 10. Gebe beide Variablen in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Schreibe hier deinen Code"
          }
        ],
        showHints: false,
        path: "/drills/variablen/2",
        courseId: "python-drills",
        prompt: "Erstelle zwei Variablen 'x' mit Wert 5 und 'y' mit Wert 10. Gib beide Variablen nacheinander in der Konsole aus (erst x, dann y in separaten Zeilen).",
        starterCode: "# Schreibe hier deinen Code",
        solutionString: "5\n10",
        solutionCode: ["x", "y", "= 5", "= 10", "print("],
        hint: "Vier Zeilen: x = 5, y = 10, print(x), print(y)"
      },
      {
        id: "code-variablen-3",
        step: 3,
        title: "Variable ändern",
        description: "Ändere den Wert der Variablen `name` zu 'Anna' und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "name = 'Peter'\n# Ändere hier den Wert"
          }
        ],
        showHints: false,
        path: "/drills/variablen/3",
        courseId: "python-drills",
        prompt: "Die Variable 'name' hat bereits den Wert 'Peter'. Überschreibe sie mit dem neuen Wert 'Anna' und gib die Variable danach in der Konsole aus.",
        starterCode: "name = 'Peter'\n# Ändere hier den Wert",
        solutionString: "Anna",
        solutionCode: ["name", "=", "Anna", "print("],
        hint: "Schreibe: name = 'Anna' und dann print(name)"
      },
      {
        id: "code-variablen-4",
        step: 4,
        title: "Stadt speichern",
        description: "Speichere 'Hamburg' in einer Variable und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle eine Variable für die Stadt"
          }
        ],
        showHints: false,
        path: "/drills/variablen/4",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'stadt' mit dem Wert 'Hamburg' (als String mit Anführungszeichen). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Erstelle eine Variable für die Stadt",
        solutionString: "Hamburg",
        solutionCode: ["stadt", "=", "Hamburg", "print("],
        hint: "Zwei Zeilen: stadt = 'Hamburg' und print(stadt)"
      },
      {
        id: "code-variablen-5",
        step: 5,
        title: "Zahl speichern und ausgeben",
        description: "Speichere die Zahl 42 in einer Variable und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Speichere eine Zahl"
          }
        ],
        showHints: false,
        path: "/drills/variablen/5",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'antwort' mit dem Wert 42 (als Zahl, OHNE Anführungszeichen). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Speichere eine Zahl",
        solutionString: "42",
        solutionCode: ["antwort", "= 42", "print("],
        hint: "Zwei Zeilen: antwort = 42 (ohne '') und print(antwort)"
      },
      {
        id: "code-variablen-6",
        step: 6,
        title: "Variable überschreiben",
        description: "Überschreibe eine Variable mit einem neuen Wert.",
        blocks: [
          {
            type: "code",
            content: "farbe = 'rot'\n# Ändere farbe zu 'blau' und gebe sie in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/variablen/6",
        courseId: "python-drills",
        prompt: "Die Variable 'farbe' hat den Wert 'rot'. Überschreibe sie mit dem Wert 'blau' und gib die Variable danach in der Konsole aus.",
        starterCode: "farbe = 'rot'\n# Ändere farbe zu 'blau' und gebe sie in die Konsole aus",
        solutionString: "blau",
        solutionCode: ["farbe", "=", "blau", "print("],
        hint: "Schreibe: farbe = 'blau' und dann print(farbe)"
      },
      {
        id: "code-variablen-7",
        step: 7,
        title: "Zwei Variablen erstellen",
        description: "Erstelle zwei Variablen und gebe beide in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle zwei Variablen"
          }
        ],
        showHints: false,
        path: "/drills/variablen/7",
        courseId: "python-drills",
        prompt: "Erstelle 'vorname' mit Wert 'Lisa' und 'nachname' mit Wert 'Schmidt'. Gib beide Variablen nacheinander in der Konsole aus (erst vorname, dann nachname in separaten Zeilen).",
        starterCode: "# Erstelle zwei Variablen",
        solutionString: "Lisa\nSchmidt",
        solutionCode: ["vorname", "nachname", "Lisa", "Schmidt", "print("],
        hint: "Vier Zeilen: vorname = 'Lisa', nachname = 'Schmidt', print(vorname), print(nachname)"
      },
      {
        id: "code-variablen-8",
        step: 8,
        title: "Temperatur speichern",
        description: "Speichere eine Dezimalzahl in einer Variable.",
        blocks: [
          {
            type: "code",
            content: "# Speichere die Temperatur"
          }
        ],
        showHints: false,
        path: "/drills/variablen/8",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'temperatur' mit dem Wert 23.5 (Dezimalzahl mit Punkt, nicht Komma!). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Speichere die Temperatur",
        solutionString: "23.5",
        solutionCode: ["temperatur", "= 23.5", "print("],
        hint: "Zwei Zeilen: temperatur = 23.5 und print(temperatur). Achtung: Punkt statt Komma!"
      },
      {
        id: "code-variablen-9",
        step: 9,
        title: "Variable kopieren",
        description: "Kopiere den Wert einer Variable in eine andere.",
        blocks: [
          {
            type: "code",
            content: "original = 50\n# Kopiere in 'kopie' und gebe kopie in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/variablen/9",
        courseId: "python-drills",
        prompt: "Kopiere den Wert von 'original' (50) in eine neue Variable 'kopie' und gib 'kopie' in der Konsole aus. Nutze dafür: kopie = original",
        starterCode: "original = 50\n# Kopiere in 'kopie' und gebe kopie in die Konsole aus",
        solutionString: "50",
        solutionCode: ["kopie", "= original", "print("],
        hint: "Schreibe: kopie = original und dann print(kopie)"
      },
      {
        id: "code-variablen-10",
        step: 10,
        title: "Drei Variablen",
        description: "Erstelle drei Variablen und gebe alle in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle a, b, c"
          }
        ],
        showHints: false,
        path: "/drills/variablen/10",
        courseId: "python-drills",
        prompt: "Erstelle drei Variablen: 'a' mit Wert 1, 'b' mit Wert 2, 'c' mit Wert 3. Gib alle drei nacheinander in der Konsole aus (a, dann b, dann c in separaten Zeilen).",
        starterCode: "# Erstelle a, b, c",
        solutionString: "1\n2\n3",
        solutionCode: ["a", "= 1", "b", "= 2", "c", "= 3", "print("],
        hint: "Sechs Zeilen: a = 1, b = 2, c = 3, print(a), print(b), print(c)"
      },
      {
        id: "code-variablen-11",
        step: 11,
        title: "Variable erhöhen",
        description: "Erhöhe eine Variable um 10.",
        blocks: [
          {
            type: "code",
            content: "wert = 5\n# Erhöhe wert um 10 und gib aus"
          }
        ],
        showHints: false,
        path: "/drills/variablen/11",
        courseId: "python-drills",
        prompt: "Die Variable 'wert' ist 5. Erhöhe sie um 10 mit der Formel: wert = wert + 10. Gib das Ergebnis anschließend in der Konsole aus.",
        starterCode: "wert = 5\n# Erhöhe wert um 10 und gib aus",
        solutionString: "15",
        solutionCode: ["wert", "= wert + 10", "print("],
        hint: "Schreibe: wert = wert + 10 und dann print(wert)"
      },
      {
        id: "code-variablen-12",
        step: 12,
        title: "Text-Variable ändern",
        description: "Ändere eine Text-Variable.",
        blocks: [
          {
            type: "code",
            content: "status = 'wartend'\n# Ändere zu 'fertig' und gib aus"
          }
        ],
        showHints: false,
        path: "/drills/variablen/12",
        courseId: "python-drills",
        prompt: "Die Variable 'status' hat den Wert 'wartend'. Ändere sie zu 'fertig' und gib die Variable anschließend in der Konsole aus.",
        starterCode: "status = 'wartend'\n# Ändere zu 'fertig' und gib aus",
        solutionString: "fertig",
        solutionCode: ["status", "= 'fertig'", "print("],
        hint: "Schreibe: status = 'fertig' und dann print(status)"
      },
      {
        id: "code-variablen-13",
        step: 13,
        title: "Produkt speichern",
        description: "Speichere einen Produktnamen.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle Variable für Produktname"
          }
        ],
        showHints: false,
        path: "/drills/variablen/13",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'produkt' mit dem Wert 'Laptop' (als String mit Anführungszeichen). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Erstelle Variable für Produktname",
        solutionString: "Laptop",
        solutionCode: ["produkt", "= 'Laptop'", "print("],
        hint: "Zwei Zeilen: produkt = 'Laptop' und print(produkt)"
      },
      {
        id: "code-variablen-14",
        step: 14,
        title: "Zwei Werte tauschen",
        description: "Gib zwei Variablen in umgekehrter Reihenfolge in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "erster = 'A'\nzweiter = 'B'\n# Gebe erst zweiter, dann erster in die Konsole aus"
          }
        ],
        showHints: false,
        path: "/drills/variablen/14",
        courseId: "python-drills",
        prompt: "Gib die beiden Variablen in umgekehrter Reihenfolge aus: Erst 'zweiter' (B), dann 'erster' (A). Du brauchst keine neuen Variablen - nutze einfach print().",
        starterCode: "erster = 'A'\nzweiter = 'B'\n# Gebe erst zweiter, dann erster in die Konsole aus",
        solutionString: "B\nA",
        solutionCode: ["print(zweiter)", "print(erster)"],
        hint: "Zwei Zeilen: print(zweiter) und print(erster)"
      },
      {
        id: "code-variablen-15",
        step: 15,
        title: "Preis mit Unterstrich",
        description: "Nutze Unterstrich im Variablennamen. Erstelle die Variable `max_preis` mit dem Wert 999. Und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle max_preis"
          }
        ],
        showHints: false,
        path: "/drills/variablen/15",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'max_preis' (mit Unterstrich!) mit dem Wert 999 und gib sie in der Konsole aus.",
        starterCode: "# Erstelle max_preis",
        solutionString: "999",
        solutionCode: ["max_preis", "= 999", "print("],
        hint: "Zwei Zeilen: max_preis = 999 und print(max_preis)"
      }
    ]
  },
  {
    topic: "Datentypen",
    mcQuestions: [
      {
        id: "mcq-datentypen-1",
        type: "multiple-choice",
        question: "Was ist der Unterschied zwischen 77 und '77'?",
        options: [
          "Keiner, beides ist gleich",
          "77 ist eine Zahl, '77' ist Text",
          "'77' ist eine Zahl, 77 ist Text",
          "77 ist schneller als '77'"
        ],
        correctAnswer: "77 ist eine Zahl, '77' ist Text",
        explanation: "Ohne Anführungszeichen = Zahl, mit Anführungszeichen = Text (String)"
      },
      {
        id: "mcq-datentypen-2",
        type: "spot-the-error",
        question: "Finde den Fehler - wir wollen das Gewicht als Zahl speichern:",
        code: "weight = \"77\"",
        options: [
          "Es fehlt ein Semikolon",
          "weight ist kein gültiger Name",
          "Die Anführungszeichen machen 77 zu Text statt einer Zahl",
          "Kein Fehler"
        ],
        correctAnswer: "Die Anführungszeichen machen 77 zu Text statt einer Zahl",
        explanation: "Für Berechnungen brauchen wir Zahlen: weight = 77 (ohne Anführungszeichen)"
      },
      {
        id: "mcq-datentypen-3",
        type: "predict-output",
        question: "Was passiert bei diesem Code?",
        code: "x = \"10\"\ny = 5\nresult = x + y\nprint(result)",
        options: [
          "15",
          "105",
          "Error",
          "10 5"
        ],
        correctAnswer: "Error",
        explanation: "Man kann keinen Text ('10') mit einer Zahl (5) addieren. Ergibt einen TypeError."
      },
      {
        id: "mcq-datentypen-4",
        type: "multiple-choice",
        question: "Welche Aussage ist korrekt?",
        options: [
          "Text braucht immer Anführungszeichen in Python",
          "Zahlen brauchen Anführungszeichen",
          "Beides braucht Anführungszeichen",
          "Nichts braucht Anführungszeichen"
        ],
        correctAnswer: "Text braucht immer Anführungszeichen in Python",
        explanation: "Text/Strings: 'Hallo' oder \"Hallo\". Zahlen: 42 oder 3.14 (ohne Anführungszeichen)"
      },
      {
        id: "mcq-datentypen-5",
        type: "multiple-choice",
        question: "Welche Rechenregel gilt in Python?",
        options: [
          "Von links nach rechts",
          "Punkt vor Strich (dann links nach rechts)",
          "Klammer vor Punkt vor Strich",
          "Strich vor Punkt"
        ],
        correctAnswer: "Klammer vor Punkt vor Strich",
        explanation: "Wie in Mathe: Klammern zuerst, dann * und /, dann + und -"
      },
      {
        id: "mcq-datentypen-6",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "result = 10 + 5 * 2\nprint(result)",
        options: ["30", "20", "15", "Error"],
        correctAnswer: "20",
        explanation: "Punkt vor Strich: 5 * 2 = 10, dann 10 + 10 = 20"
      },
      {
        id: "mcq-datentypen-7",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "result = (10 + 5) * 2\nprint(result)",
        options: ["30", "20", "15", "17"],
        correctAnswer: "30",
        explanation: "Klammern zuerst: (10 + 5) = 15, dann 15 * 2 = 30"
      },
      {
        id: "mcq-datentypen-8",
        type: "multiple-choice",
        question: "Wie berechnet man 5% von 100?",
        options: [
          "100 * 5",
          "100 * 0.05",
          "100 / 5",
          "100 + 5"
        ],
        correctAnswer: "100 * 0.05",
        explanation: "5% = 5/100 = 0.05, also 100 * 0.05 = 5"
      },
      {
        id: "mcq-datentypen-9",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "price = 100\nrabatt = 20\nnew_price = price * (1 - rabatt/100)\nprint(new_price)",
        options: ["80", "80.0", "120", "20"],
        correctAnswer: "80.0",
        explanation: "20% Rabatt: 100 * (1 - 0.20) = 100 * 0.80 = 80.0"
      },
      {
        id: "mcq-datentypen-10",
        type: "multiple-choice",
        question: "Was ist der Datentyp von 3.14?",
        options: [
          "int (Ganzzahl)",
          "float (Dezimalzahl)",
          "str (Text)",
          "bool (Wahrheitswert)"
        ],
        correctAnswer: "float (Dezimalzahl)"
      },
      {
        id: "mcq-datentypen-11",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "print(8 / 2)",
        options: ["4", "4.0", "4,0", "Error"],
        correctAnswer: "4.0",
        explanation: "Division (/) gibt in Python IMMER einen float zurück, auch bei ganzen Zahlen."
      },
      {
        id: "mcq-datentypen-12",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "temperatur = 22,5",
        options: [
          "Komma statt Punkt für Dezimalzahl",
          "temperatur ist ein reserviertes Wort",
          "Es fehlen Anführungszeichen",
          "Kein Fehler"
        ],
        correctAnswer: "Komma statt Punkt für Dezimalzahl",
        explanation: "Python nutzt den PUNKT für Dezimalzahlen: 22.5 (nicht 22,5)"
      },
      {
        id: "mcq-datentypen-13",
        type: "predict-output",
        question: "Was ergibt 7 + 3 * 2?",
        code: "print(7 + 3 * 2)",
        options: ["13", "20", "17", "Error"],
        correctAnswer: "13",
        explanation: "Punkt vor Strich: Erst 3 * 2 = 6, dann 7 + 6 = 13"
      },
      {
        id: "mcq-datentypen-14",
        type: "fill-the-blank",
        question: "Was fehlt für das Ergebnis 36?",
        code: "print((4 + 2) ___ 6)",
        options: ["+", "-", "*", "/"],
        correctAnswer: "*",
        explanation: "(4 + 2) = 6, und 6 * 6 = 36"
      },
      {
        id: "mcq-datentypen-15",
        type: "multiple-choice",
        question: "Welcher Datentyp wird für ganze Zahlen verwendet?",
        options: [
          "float",
          "int",
          "str",
          "num"
        ],
        correctAnswer: "int"
      },
      {
        id: "mcq-datentypen-16",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "print(50 - 20 + 10)",
        options: ["40", "20", "60", "Error"],
        correctAnswer: "40",
        explanation: "Von links nach rechts: 50 - 20 = 30, dann 30 + 10 = 40"
      },
      {
        id: "mcq-datentypen-17",
        type: "spot-the-error",
        question: "Warum funktioniert diese Berechnung nicht?",
        code: "summe = '5' + 3",
        options: [
          "Man kann Text ('5') nicht mit einer Zahl (3) addieren",
          "summe ist ein reserviertes Wort",
          "Es fehlt print()",
          "Kein Fehler"
        ],
        correctAnswer: "Man kann Text ('5') nicht mit einer Zahl (3) addieren",
        explanation: "'5' ist ein String (Text), 3 ist ein int. Das ergibt einen TypeError."
      },
      {
        id: "mcq-datentypen-18",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "print(2 * 3 + 4 * 2)",
        options: ["14", "20", "28", "Error"],
        correctAnswer: "14",
        explanation: "Erst Multiplikationen: 2*3=6 und 4*2=8, dann 6+8=14"
      },
      {
        id: "mcq-datentypen-19",
        type: "multiple-choice",
        question: "Was ist 5.0 für ein Datentyp?",
        options: ["int", "float", "str", "double"],
        correctAnswer: "float",
        explanation: "Zahlen mit Dezimalpunkt sind immer float, auch wenn sie .0 haben."
      },
      {
        id: "mcq-datentypen-20",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "print(10 - 3 - 2)",
        options: ["5", "9", "3", "Error"],
        correctAnswer: "5",
        explanation: "Von links nach rechts: 10-3=7, dann 7-2=5"
      },
      {
        id: "mcq-datentypen-21",
        type: "spot-the-error",
        question: "Was ist das Problem?",
        code: "resultat = 10 / 0",
        options: [
          "Division durch Null ist nicht erlaubt",
          "resultat ist falsch geschrieben",
          "Es fehlt print()",
          "Kein Fehler"
        ],
        correctAnswer: "Division durch Null ist nicht erlaubt",
        explanation: "Division durch 0 erzeugt einen ZeroDivisionError."
      },
      {
        id: "mcq-datentypen-22",
        type: "fill-the-blank",
        question: "Welcher Operator für Multiplikation?",
        code: "print(5 ___ 4)  # Ergebnis: 20",
        options: ["+", "-", "*", "/"],
        correctAnswer: "*",
        explanation: "* ist der Multiplikationsoperator. 5 * 4 = 20"
      },
      {
        id: "mcq-datentypen-23",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "print((8 - 2) * (1 + 2))",
        options: ["18", "12", "9", "Error"],
        correctAnswer: "18",
        explanation: "(8-2)=6 und (1+2)=3, dann 6*3=18"
      },
      {
        id: "mcq-datentypen-24",
        type: "multiple-choice",
        question: "Was passiert bei 5 / 2?",
        options: [
          "Ergebnis ist 2 (Ganzzahl)",
          "Ergebnis ist 2.5 (Dezimalzahl)",
          "Error",
          "Ergebnis ist 3"
        ],
        correctAnswer: "Ergebnis ist 2.5 (Dezimalzahl)",
        explanation: "Division (/) gibt immer einen float zurück."
      },
      {
        id: "mcq-datentypen-25",
        type: "predict-output",
        question: "Was ergibt dieser Code?",
        code: "x = 10\ny = 3\nprint(x - y)",
        options: ["7", "13", "30", "Error"],
        correctAnswer: "7",
        explanation: "10 - 3 = 7"
      }
    ],
    codeTasks: [
      {
        id: "code-datentypen-1",
        step: 1,
        title: "Text-Variable erstellen",
        description: "Erstelle eine Variable 'name' als Text mit dem Wert 'Max'. Gib sie in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/1",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'name' mit dem Text 'Max' (mit Anführungszeichen!). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Dein Code hier",
        solutionString: "Max",
        solutionCode: ["name", "= ", "'", "print("],
        hint: "Zwei Zeilen: name = 'Max' und print(name)"
      },
      {
        id: "code-datentypen-2",
        step: 2,
        title: "Gemischte Datentypen",
        description: "Erstelle 'price' als Zahl 19.99 und 'product' als Text 'Buch'. Gib beide in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/2",
        courseId: "python-drills",
        prompt: "Erstelle 'price' als Zahl 19.99 (OHNE Anführungszeichen) und 'product' als Text 'Buch' (MIT Anführungszeichen). Gib beide Werte nacheinander in der Konsole aus (erst price, dann product).",
        starterCode: "# Dein Code hier",
        solutionString: "19.99\nBuch",
        solutionCode: ["price", "product", "= 19.99", "= ", "'", "print(price"],
        hint: "Vier Zeilen: price = 19.99, product = 'Buch', print(price), print(product)"
      },
      {
        id: "code-datentypen-3",
        step: 4,
        title: "Mathematische Operation",
        description: "Berechne 15 + 7 und gib das Ergebnis in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/4",
        courseId: "python-drills",
        prompt: "Berechne 15 + 7 und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable - print(15 + 7) reicht!",
        starterCode: "# Dein Code hier",
        solutionString: "22",
        solutionCode: ["15", "+", "7", "print("],
        hint: "Eine Zeile reicht: print(15 + 7)"
      },
      {
        id: "code-datentypen-4",
        step: 5,
        title: "Division und Variable",
        description: "Berechne 20 / 4 und speichere in Variable 'result'. Gib result in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/5",
        courseId: "python-drills",
        prompt: "Berechne 20 / 4 und speichere das Ergebnis in der Variable 'result'. Gib 'result' anschließend in der Konsole aus. Hinweis: Division gibt immer eine Dezimalzahl (5.0)!",
        starterCode: "# Dein Code hier",
        solutionString: "5.0",
        solutionCode: ["result", "= ", "20", "/", "4", "print("],
        hint: "Zwei Zeilen: result = 20 / 4 und print(result)"
      },
      {
        id: "code-datentypen-5",
        step: 6,
        title: "Prozentrechnung",
        description: "Berechne 10% von 200 und gib das Ergebnis in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/6",
        courseId: "python-drills",
        prompt: "Berechne 10% von 200 mit der Formel: 200 * 0.10. Gib das Ergebnis direkt in der Konsole aus - du brauchst keine Variable!",
        starterCode: "# Dein Code hier",
        solutionString: "20.0",
        solutionCode: ["200", "*", "0.1", "print("],
        hint: "Eine Zeile reicht: print(200 * 0.10) oder print(200 * 0.1)"
      },
      {
        id: "code-datentypen-6",
        step: 7,
        title: "Rabatt berechnen",
        description: "price = 100, rabatt = 25%. Berechne neuen Preis nach Rabatt und gib ihn in der Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "price = 100\nrabatt = 25\n# Dein Code hier"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/7",
        courseId: "python-drills",
        prompt: "Die Variablen price = 100 und rabatt = 25 sind gegeben. Berechne den Preis nach 25% Rabatt mit der Formel: price * (1 - rabatt/100). Gib das Ergebnis in der Konsole aus.",
        starterCode: "price = 100\nrabatt = 25\n# Dein Code hier",
        solutionString: "75.0",
        solutionCode: ["price", "*", "(1", "-", "rabatt", "/100", "print("],
        hint: "Formel: print(price * (1 - rabatt/100)) ergibt 75.0"
      },
      {
        id: "code-datentypen-7",
        step: 8,
        title: "Multiplikation",
        description: "Berechne 7 * 8 und gebe das Ergebnis in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Berechne 7 mal 8"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/8",
        courseId: "python-drills",
        prompt: "Berechne 7 * 8 und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable - print(7 * 8) reicht!",
        starterCode: "# Berechne 7 mal 8",
        solutionString: "56",
        solutionCode: ["7", "*", "8", "print("],
        hint: "Eine Zeile reicht: print(7 * 8)"
      },
      {
        id: "code-datentypen-8",
        step: 9,
        title: "Klammern nutzen",
        description: "Berechne (5 + 3) * 4 und gebe das Ergebnis in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Berechne (5 + 3) * 4"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/9",
        courseId: "python-drills",
        prompt: "Berechne (5 + 3) * 4 und gib das Ergebnis direkt in der Konsole aus. Nutze Klammern - du brauchst keine Variable!",
        starterCode: "# Berechne (5 + 3) * 4",
        solutionString: "32",
        solutionCode: ["(5", "+", "3)", "*", "4", "print("],
        hint: "Eine Zeile reicht: print((5 + 3) * 4)"
      },
      {
        id: "code-datentypen-9",
        step: 10,
        title: "Division mit Variable",
        description: "Teile 100 durch 4 und speichere das Ergebnis.",
        blocks: [
          {
            type: "code",
            content: "# Berechne und speichere das Ergebnis"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/10",
        courseId: "python-drills",
        prompt: "Berechne 100 / 4 und speichere das Ergebnis in der Variable 'ergebnis'. Gib 'ergebnis' anschließend in der Konsole aus. Hinweis: Division gibt immer eine Dezimalzahl (25.0)!",
        starterCode: "# Berechne und speichere das Ergebnis",
        solutionString: "25.0",
        solutionCode: ["ergebnis", "=", "100", "/", "4", "print("],
        hint: "Zwei Zeilen: ergebnis = 100 / 4 und print(ergebnis)"
      },
      {
        id: "code-datentypen-10",
        step: 11,
        title: "Mehrere Operationen",
        description: "Berechne 10 + 5 - 3 und gebe das Ergebnis in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Berechne 10 + 5 - 3"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/11",
        courseId: "python-drills",
        prompt: "Berechne 10 + 5 - 3 und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable!",
        starterCode: "# Berechne 10 + 5 - 3",
        solutionString: "12",
        solutionCode: ["10", "+", "5", "-", "3", "print("],
        hint: "Eine Zeile reicht: print(10 + 5 - 3)"
      },
      {
        id: "code-datentypen-11",
        step: 12,
        title: "Dezimalzahl erstellen",
        description: "Erstelle eine Dezimalzahl und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle eine Dezimalzahl"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/12",
        courseId: "python-drills",
        prompt: "Erstelle eine Variable 'pi' mit dem Wert 3.14 (Dezimalzahl mit Punkt, nicht Komma!). Gib die Variable anschließend in der Konsole aus.",
        starterCode: "# Erstelle eine Dezimalzahl",
        solutionString: "3.14",
        solutionCode: ["pi", "= 3.14", "print("],
        hint: "Zwei Zeilen: pi = 3.14 und print(pi)"
      },
      {
        id: "code-datentypen-12",
        step: 13,
        title: "Zwei Zahlen multiplizieren",
        description: "Multipliziere zwei Variablen.",
        blocks: [
          {
            type: "code",
            content: "a = 6\nb = 9\n# Multipliziere und gib aus"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/13",
        courseId: "python-drills",
        prompt: "Multipliziere die Variablen a und b und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine neue Variable - print(a * b) reicht!",
        starterCode: "a = 6\nb = 9\n# Multipliziere und gib aus",
        solutionString: "54",
        solutionCode: ["a", "*", "b", "print("],
        hint: "Eine Zeile reicht: print(a * b)"
      },
      {
        id: "code-datentypen-13",
        step: 14,
        title: "Komplexe Klammern",
        description: "Berechne ((2 + 3) * 4) und gebe das Ergebnis in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Berechne ((2 + 3) * 4)"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/14",
        courseId: "python-drills",
        prompt: "Berechne (2 + 3) * 4 und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable!",
        starterCode: "# Berechne ((2 + 3) * 4)",
        solutionString: "20",
        solutionCode: ["(2", "+", "3)", "*", "4", "print("],
        hint: "Eine Zeile reicht: print((2 + 3) * 4)"
      },
      {
        id: "code-datentypen-14",
        step: 15,
        title: "Subtraktion mit Variablen",
        description: "Subtrahiere zwei Variablen.",
        blocks: [
          {
            type: "code",
            content: "gross = 100\nklein = 37\n# Berechne die Differenz"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/15",
        courseId: "python-drills",
        prompt: "Berechne gross - klein und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine neue Variable - print(gross - klein) reicht!",
        starterCode: "gross = 100\nklein = 37\n# Berechne die Differenz",
        solutionString: "63",
        solutionCode: ["gross", "-", "klein", "print("],
        hint: "Eine Zeile reicht: print(gross - klein)"
      },
      {
        id: "code-datentypen-15",
        step: 16,
        title: "Addition dreier Zahlen",
        description: "Addiere drei Zahlen.",
        blocks: [
          {
            type: "code",
            content: "# Berechne 11 + 22 + 33"
          }
        ],
        showHints: false,
        path: "/drills/datentypen/16",
        courseId: "python-drills",
        prompt: "Berechne 11 + 22 + 33 und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable!",
        starterCode: "# Berechne 11 + 22 + 33",
        solutionString: "66",
        solutionCode: ["11", "+", "22", "+", "33", "print("],
        hint: "Eine Zeile reicht: print(11 + 22 + 33)"
      }
    ]
  },
  {
    topic: "Strings",
    mcQuestions: [
      {
        id: "mcq-strings-1",
        type: 'multiple-choice',
        question: "Wie verkettet man zwei Strings in Python?",
        options: ["str1 + str2", "str1 & str2", "str1 . str2", "concat(str1, str2)"],
        correctAnswer: "str1 + str2"
      },
      {
        id: "mcq-strings-3",
        type: "multiple-choice",
        question: "Wozu braucht man str()?",
        options: [
          "Um Zahlen zu addieren",
          "Um Zahlen in Text umzuwandeln",
          "Um Text in Zahlen umzuwandeln",
          "Um Text zu löschen"
        ],
        correctAnswer: "Um Zahlen in Text umzuwandeln",
        explanation: "str() konvertiert Zahlen (z.B. 77) in Text (\"77\"), damit man sie mit + verbinden kann."
      },
      {
        id: "mcq-strings-4",
        type: "spot-the-error",
        question: "Was ist der Fehler in diesem Code?",
        code: "weight = 77\nprint(\"Gewicht: \" + weight)",
        options: [
          "weight sollte Text sein",
          "Es fehlt str() um weight",
          "Es fehlt ein Komma statt +",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt str() um weight",
        explanation: "Korrekt: print(\"Gewicht: \" + str(weight)) - Man kann nur Text + Text verbinden."
      },
      {
        id: "mcq-strings-5",
        type: "fill-the-blank",
        question: "Vervollständige den Code:",
        code: "bmi = 24.5\nprint(\"BMI: \" + ___(bmi))",
        options: ["str", "int", "float", "text"],
        correctAnswer: "str",
        explanation: "str(bmi) wandelt die Zahl 24.5 in Text um für die Konkatenation."
      },
      {
        id: "mcq-strings-6",
        type: "multiple-choice",
        question: "Wie verbindet man Text mit Variablen in Python (alte Methode)?",
        options: [
          "Text & Variable",
          "Text + str(Variable)",
          "Text . Variable",
          "concat(Text, Variable)"
        ],
        correctAnswer: "Text + str(Variable)",
        explanation: "Mit + kann man Strings verbinden: \"Hallo\" + str(age)"
      },
      {
        id: "mcq-strings-7",
        type: "spot-the-error",
        question: "Finde den Fehler:",
        code: "name = 'Anna'\nprint('Hallo' + name)",
        options: [
          "Es fehlt str()",
          "Es fehlt ein Leerzeichen",
          "name sollte eine Zahl sein",
          "Kein Fehler - aber 'Hallo' und name kleben zusammen"
        ],
        correctAnswer: "Kein Fehler - aber 'Hallo' und name kleben zusammen",
        explanation: "Der Code läuft, gibt aber 'HalloAnna' aus. Besser: 'Hallo ' + name (mit Leerzeichen)"
      },
      {
        id: "mcq-strings-8",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 'Python'\ny = 'Rocks'\nprint(x + ' ' + y)",
        options: [
          "Python Rocks",
          "PythonRocks",
          "Python'+'Rocks",
          "Error"
        ],
        correctAnswer: "Python Rocks",
        explanation: "Die drei Strings werden verbunden: 'Python' + ' ' + 'Rocks' = 'Python Rocks'"
      },
      {
        id: "mcq-strings-9",
        type: "fill-the-blank",
        question: "Vervollständige für Ausgabe 'Alter: 30':",
        code: "age = 30\nprint('Alter: ' ___ ___(age))",
        options: [
          "+ str",
          ", str",
          "+ int",
          "& str"
        ],
        correctAnswer: "+ str",
        explanation: "Für Konkatenation: + zum Verbinden, str() zum Umwandeln"
      },
      {
        id: "mcq-strings-10",
        type: "multiple-choice",
        question: "Was ist der Vorteil von f-Strings?",
        options: [
          "Schneller als print()",
          "Einfacher als str() + '+' Konkatenation",
          "Man braucht keine Variablen",
          "Funktioniert nur mit Zahlen"
        ],
        correctAnswer: "Einfacher als str() + '+' Konkatenation",
        explanation: "f-Strings sind kürzer und lesbarer: f'Wert: {x}' statt 'Wert: ' + str(x)"
      },
      {
        id: "mcq-strings-11",
        type: "spot-the-error",
        question: "Was fehlt in diesem Code?",
        code: "name = 'Anna'\nprint('Hallo {name}')",
        options: [
          "Das f vor dem String",
          "str() um name",
          "Klammern um name",
          "Kein Fehler"
        ],
        correctAnswer: "Das f vor dem String",
        explanation: "f-Strings brauchen das f davor: print(f'Hallo {name}')"
      },
      {
        id: "mcq-strings-12",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 10\ny = 20\nprint(f'{x} + {y} = {x + y}')",
        options: [
          "10 + 20 = 30",
          "x + y = x + y",
          "{10} + {20} = {30}",
          "Error"
        ],
        correctAnswer: "10 + 20 = 30",
        explanation: "f-Strings können Variablen UND Berechnungen: {x + y} wird zu 30"
      },
      {
        id: "mcq-strings-13",
        type: "fill-the-blank",
        question: "Vervollständige für Ausgabe 'Betrag: 100€':",
        code: "amount = 100\nprint(___'Betrag: {amount}€')",
        options: ["f", "s", "t", "format"],
        correctAnswer: "f",
        explanation: "Das f vor dem String aktiviert f-String-Formatierung"
      },
      {
        id: "mcq-strings-16",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "zahl = 50\nprint('Wert: ' + zahl)",
        options: [
          "Es fehlt str() um zahl",
          "Das + ist falsch",
          "print ist falsch geschrieben",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt str() um zahl",
        explanation: "Zahlen müssen mit str() in Text umgewandelt werden: 'Wert: ' + str(zahl)"
      },
      {
        id: "mcq-strings-17",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "a = 'Ja'\nb = 'wohl'\nprint(a + b)",
        options: ["Ja wohl", "Jawohl", "Ja\nwohl", "Error"],
        correctAnswer: "Jawohl",
        explanation: "String-Konkatenation fügt Strings direkt zusammen, ohne Leerzeichen."
      },
      {
        id: "mcq-strings-18",
        type: "fill-the-blank",
        question: "Wie wandelt man die Zahl 99 in Text um?",
        code: "text = ___(99)",
        options: ["str", "int", "text", "string"],
        correctAnswer: "str",
        explanation: "str() wandelt jeden Wert in einen String (Text) um."
      },
      {
        id: "mcq-strings-19",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "zahl = 7\nprint(f'Die Zahl ist {zahl}')",
        options: [
          "Die Zahl ist 7",
          "Die Zahl ist {zahl}",
          "Die Zahl ist zahl",
          "Error"
        ],
        correctAnswer: "Die Zahl ist 7",
        explanation: "f-Strings ersetzen {zahl} durch den Wert der Variable (7)."
      },
      {
        id: "mcq-strings-20",
        type: "multiple-choice",
        question: "Welche Aussage über f-Strings ist RICHTIG?",
        options: [
          "Man braucht str() für Zahlen in f-Strings",
          "f-Strings brauchen kein str() für Zahlen",
          "f-Strings funktionieren nur mit Text",
          "Das f muss am Ende des Strings stehen"
        ],
        correctAnswer: "f-Strings brauchen kein str() für Zahlen",
        explanation: "f-Strings wandeln Zahlen automatisch in Text um."
      },
      {
        id: "mcq-strings-22",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "print(f'Wert: {wert}')",
        options: [
          "Variable 'wert' wurde nicht definiert",
          "f-String Syntax ist falsch",
          "Es fehlen Klammern",
          "Kein Fehler möglich"
        ],
        correctAnswer: "Variable 'wert' wurde nicht definiert",
        explanation: "Bevor man eine Variable in einem f-String nutzt, muss sie existieren."
      },
      {
        id: "mcq-strings-23",
        type: "fill-the-blank",
        question: "Wie gibt man 'Ergebnis: 50' aus?",
        code: "x = 50\nprint(___'Ergebnis: {x}')",
        options: ["f", "s", "str", "format"],
        correctAnswer: "f",
        explanation: "f vor dem String für f-String Formatierung."
      },
      {
        id: "mcq-strings-24",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "a = 'Hallo'\nb = 'Welt'\nprint(a + ' ' + b)",
        options: ["Hallo Welt", "HalloWelt", "a b", "Error"],
        correctAnswer: "Hallo Welt",
        explanation: "Die Strings werden mit Leerzeichen verbunden."
      },
      {
        id: "mcq-strings-25",
        type: "multiple-choice",
        question: "Welche Funktion wandelt eine Zahl in Text um?",
        options: ["int()", "str()", "float()", "text()"],
        correctAnswer: "str()",
        explanation: "str() wandelt jeden Wert in einen String (Text) um."
      }
    ],
    codeTasks: [
      {
        id: "code-strings-2",
        step: 2,
        title: "String-Formatierung",
        description: "Verwende f-Strings, um eine Begrüßung zu erstellen.",
        blocks: [{
          type: "code",
          content: "name = 'Anna'\n# Erstelle die Ausgabe: 'Hallo Anna! Willkommen!"
        }],
        showHints: false,
        path: "/drills/strings/2",
        courseId: "python-drills",
        prompt: "Verwende einen f-String um 'Hallo Anna! Willkommen!' auszugeben. Achte auf die Leerzeichen: nach 'Hallo' und vor 'Willkommen'!",
        starterCode: "name = 'Anna'\n# Erstelle die Ausgabe: 'Hallo Anna! Willkommen!'",
        solutionString: "Hallo Anna! Willkommen!",
        solutionCode: ["f\"", "{name}", "print("],
        hint: "Schreibe: print(f'Hallo {name}! Willkommen!') - Achte auf die Leerzeichen!"
      },
      {
        id: "code-strings-3",
        step: 3,
        title: "str() - Typ-Konvertierung",
        description: "Wandle die Zahl 42 in Text um mit str() und gib das Ergebnis in der Konsole aus.",
        blocks: [{
          type: "code",
          content: "# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/3",
        courseId: "python-drills",
        prompt: "Wandle die Zahl 42 in Text um mit str() und gib das Ergebnis direkt in der Konsole aus. Du brauchst keine Variable - print(str(42)) reicht!",
        starterCode: "# Dein Code hier",
        solutionString: "42",
        solutionCode: ["str(", "42", "print("],
        hint: "Eine Zeile reicht: print(str(42))"
      },
      {
        id: "code-strings-4",
        step: 4,
        title: "str() - Konkatenation",
        description: "Variable 'count' hat Wert 10. Gib 'Anzahl: 10' in der Konsole aus mit str().",
        blocks: [{
          type: "code",
          content: "count = 10\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/4",
        courseId: "python-drills",
        prompt: "Variable 'count' hat Wert 10. Gib 'Anzahl: 10' in der Konsole aus. WICHTIG: Achte auf das Leerzeichen nach dem Doppelpunkt! Nutze str() oder f-String.",
        starterCode: "count = 10\n# Dein Code hier",
        solutionString: "Anzahl: 10",
        solutionCode: ["str(", "count", "print(", "+"],
        hint: "Mit Konkatenation: print('Anzahl: ' + str(count)) - Beachte das Leerzeichen nach ':'!"
      },
      {
        id: "code-strings-5",
        step: 5,
        title: "String-Konkatenation",
        description: "Verbinde 'Hallo' und 'Welt' mit einem Leerzeichen dazwischen und gib das Ergebnis in der Konsole aus.",
        blocks: [{
          type: "code",
          content: "# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/5",
        courseId: "python-drills",
        prompt: "Verbinde 'Hallo' und 'Welt' mit einem Leerzeichen dazwischen. WICHTIG: Das Leerzeichen ist ein eigener String: ' '. Gib 'Hallo Welt' (mit Leerzeichen!) in der Konsole aus.",
        starterCode: "# Dein Code hier",
        solutionString: "Hallo Welt",
        solutionCode: ["'Hallo'", "+", "' '", "'Welt'", "print("],
        hint: "Drei Strings verbinden: print('Hallo' + ' ' + 'Welt') - Das Leerzeichen braucht eigene Anführungszeichen!"
      },
      {
        id: "code-strings-6",
        step: 6,
        title: "String-Konkatenation mit Variable",
        description: "name = 'Max'. Gib 'Willkommen Max' in der Konsole aus mit Konkatenation.",
        blocks: [{
          type: "code",
          content: "name = 'Max'\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/6",
        courseId: "python-drills",
        prompt: "Variable 'name' hat den Wert 'Max'. Gib 'Willkommen Max' in der Konsole aus. WICHTIG: Achte auf das Leerzeichen nach 'Willkommen'! Nutze String-Konkatenation (+).",
        starterCode: "name = 'Max'\n# Dein Code hier",
        solutionString: "Willkommen Max",
        solutionCode: ["'Willkommen '", "+", "name", "print("],
        hint: "Schreibe: print('Willkommen ' + name) - Beachte das Leerzeichen VOR dem Anführungszeichen!"
      },
      {
        id: "code-strings-7",
        step: 7,
        title: "f-String Grundlagen",
        description: "name = 'Max'. Gib 'Hallo Max' in der Konsole aus mit f-String.",
        blocks: [{
          type: "code",
          content: "name = 'Max'\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/7",
        courseId: "python-drills",
        prompt: "Variable 'name' hat den Wert 'Max'. Gib 'Hallo Max' in der Konsole aus mit f-String. WICHTIG: Achte auf das Leerzeichen zwischen 'Hallo' und '{name}'!",
        starterCode: "name = 'Max'\n# Dein Code hier",
        solutionString: "Hallo Max",
        solutionCode: ["f'", "{name}", "print("],
        hint: "Schreibe: print(f'Hallo {name}') - Leerzeichen vor {name}!"
      },
      {
        id: "code-strings-8",
        step: 8,
        title: "f-String mit Zahl",
        description: "age = 25. Gib 'Alter: 25 Jahre' in der Konsole aus mit f-String.",
        blocks: [{
          type: "code",
          content: "age = 25\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/8",
        courseId: "python-drills",
        prompt: "Variable 'age' hat den Wert 25. Gib 'Alter: 25 Jahre' in der Konsole aus mit f-String. WICHTIG: Achte auf alle Leerzeichen: nach 'Alter:' und vor 'Jahre'!",
        starterCode: "age = 25\n# Dein Code hier",
        solutionString: "Alter: 25 Jahre",
        solutionCode: ["f'", "{age}", "print(", "Jahre"],
        hint: "Schreibe: print(f'Alter: {age} Jahre') - Leerzeichen nach ':' und vor 'Jahre'!"
      },
      {
        id: "code-strings-9",
        step: 9,
        title: "Zwei Strings verbinden",
        description: "Verbinde 'Guten' und 'Tag' mit einem Leerzeichen.",
        blocks: [{
          type: "code",
          content: "# Verbinde die Wörter"
        }],
        showHints: false,
        path: "/drills/strings/9",
        courseId: "python-drills",
        prompt: "Verbinde 'Guten' und 'Tag' mit einem Leerzeichen dazwischen. WICHTIG: Das Leerzeichen ist ein eigener String: ' '. Gib 'Guten Tag' in der Konsole aus.",
        starterCode: "# Verbinde die Wörter",
        solutionString: "Guten Tag",
        solutionCode: ["'Guten'", "+", "' '", "'Tag'", "print("],
        hint: "Drei Strings: print('Guten' + ' ' + 'Tag') - Das Leerzeichen braucht eigene Anführungszeichen!"
      },
      {
        id: "code-strings-10",
        step: 10,
        title: "Zahl mit str() verbinden",
        description: "Verbinde 'Punkte: ' mit der Zahl 100.",
        blocks: [{
          type: "code",
          content: "punkte = 100\n# Gebe 'Punkte: 100' in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/strings/10",
        courseId: "python-drills",
        prompt: "Verbinde 'Punkte: ' mit der Variable punkte (100). WICHTIG: Achte auf das Leerzeichen nach dem Doppelpunkt im Text! Nutze str() um die Zahl in Text umzuwandeln.",
        starterCode: "punkte = 100\n# Gebe 'Punkte: 100' in die Konsole aus",
        solutionString: "Punkte: 100",
        solutionCode: ["'Punkte: '", "+", "str(", "punkte", "print("],
        hint: "Schreibe: print('Punkte: ' + str(punkte)) - Beachte das Leerzeichen nach ':'!"
      },
      {
        id: "code-strings-12",
        step: 12,
        title: "f-String mit zwei Variablen",
        description: "Gib 'Stadt: Berlin, Land: Deutschland' mit f-String in die Konsole aus.",
        blocks: [{
          type: "code",
          content: "stadt = 'Berlin'\nland = 'Deutschland'\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/12",
        courseId: "python-drills",
        prompt: "Nutze einen f-String um 'Stadt: Berlin, Land: Deutschland' auszugeben. WICHTIG: Achte auf alle Leerzeichen: nach 'Stadt:', nach dem Komma, und nach 'Land:'!",
        starterCode: "stadt = 'Berlin'\nland = 'Deutschland'\n# Dein Code hier",
        solutionString: "Stadt: Berlin, Land: Deutschland",
        solutionCode: ["f'", "{stadt}", "{land}", "print("],
        hint: "Schreibe: print(f'Stadt: {stadt}, Land: {land}') - Achte auf alle Leerzeichen!"
      },
      {
        id: "code-strings-13",
        step: 13,
        title: "Text mit Zahl kombinieren",
        description: "Erstelle 'Punktestand: 42' mit str() und Konkatenation.",
        blocks: [{
          type: "code",
          content: "punkte = 42\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/13",
        courseId: "python-drills",
        prompt: "Kombiniere 'Punktestand: ' mit der Zahl 42. WICHTIG: Achte auf das Leerzeichen nach dem Doppelpunkt! Nutze str() um die Zahl in Text umzuwandeln.",
        starterCode: "punkte = 42\n# Dein Code hier",
        solutionString: "Punktestand: 42",
        solutionCode: ["'Punktestand: '", "+", "str(", "punkte", "print("],
        hint: "Schreibe: print('Punktestand: ' + str(punkte)) - Beachte das Leerzeichen nach ':'!"
      },
      {
        id: "code-strings-14",
        step: 14,
        title: "Mehrfache Konkatenation",
        description: "Erstelle 'Hallo Anna, willkommen!' mit Variablen.",
        blocks: [{
          type: "code",
          content: "gruss = 'Hallo '\nnutzer = 'Anna'\nende = ', willkommen!'\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/14",
        courseId: "python-drills",
        prompt: "Verbinde alle drei Variablen zu 'Hallo Anna, willkommen!' und gib das Ergebnis in der Konsole aus. Die Variablen enthalten bereits die korrekten Leerzeichen!",
        starterCode: "gruss = 'Hallo '\nnutzer = 'Anna'\nende = ', willkommen!'\n# Dein Code hier",
        solutionString: "Hallo Anna, willkommen!",
        solutionCode: ["gruss", "+", "nutzer", "ende", "print("],
        hint: "Schreibe: print(gruss + nutzer + ende) - Die Variablen enthalten schon alle Leerzeichen!"
      },
      {
        id: "code-strings-15",
        step: 15,
        title: "f-String mit Berechnung",
        description: "Gib 'Summe von 7 und 8 ist 15' mit f-String in die Konsole aus.",
        blocks: [{
          type: "code",
          content: "a = 7\nb = 8\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/strings/15",
        courseId: "python-drills",
        prompt: "Nutze einen f-String um 'Summe von 7 und 8 ist 15' auszugeben. WICHTIG: Achte auf alle Leerzeichen! Die 15 soll berechnet werden mit {a + b}.",
        starterCode: "a = 7\nb = 8\n# Dein Code hier",
        solutionString: "Summe von 7 und 8 ist 15",
        solutionCode: ["f'", "{a}", "{b}", "{a + b}", "print("],
        hint: "Schreibe: print(f'Summe von {a} und {b} ist {a + b}') - Achte auf Leerzeichen!"
      }
    ]
  },
  {
    topic: "Listen",
    mcQuestions: [
      {
        id: "mcq-listen-2",
        type: 'multiple-choice',
        question: "Wie entfernt man das letzte Element einer Liste?",
        options: ["list.remove()", "list.pop()", "list.delete()", "list.clear()"],
        correctAnswer: "list.pop()"
      },
      {
        id: "mcq-listen-5",
        type: "multiple-choice",
        question: "Wie erstellt man eine leere Liste?",
        options: [
          "list = ()",
          "list = []",
          "list = {}",
          "list = ''"
        ],
        correctAnswer: "list = []",
        explanation: "Leere Liste mit eckigen Klammern: liste = []"
      },
      {
        id: "mcq-listen-6",
        type: "multiple-choice",
        question: "Wie fügt man ein Element ans Ende einer Liste?",
        options: [
          "liste.add(element)",
          "liste.append(element)",
          "liste.push(element)",
          "liste.insert(element)"
        ],
        correctAnswer: "liste.append(element)",
        explanation: ".append() fügt Elemente am Ende der Liste hinzu"
      },
      {
        id: "mcq-listen-7",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "zahlen = []\nzahlen.append(10)\nzahlen.append(20)\nprint(zahlen)",
        options: [
          "[10, 20]",
          "10 20",
          "[10] [20]",
          "Error"
        ],
        correctAnswer: "[10, 20]",
        explanation: "Die Liste enthält zwei Elemente: [10, 20]"
      },
      {
        id: "mcq-listen-8",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "liste = []\nliste.add(5)\nprint(liste)",
        options: [
          "Es sollte .append() statt .add() sein",
          "Liste braucht Klammern: liste()",
          "print ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "Es sollte .append() statt .add() sein",
        explanation: "Python Listen nutzen .append(), nicht .add()"
      },
      {
        id: "mcq-listen-9",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "history = []\nfor i in range(1, 4):\n    history.append(i * 10)\nprint(history)",
        options: [
          "[10, 20, 30]",
          "[1, 2, 3]",
          "[0, 10, 20, 30]",
          "10 20 30"
        ],
        correctAnswer: "[10, 20, 30]",
        explanation: "Schleife fügt 10, 20, 30 zur Liste hinzu"
      },
      {
        id: "mcq-listen-10",
        type: "multiple-choice",
        question: "Was speichert eine Liste in Python?",
        options: [
          "Nur einen einzelnen Wert",
          "Mehrere Werte in einer Sammlung",
          "Nur Textwerte",
          "Nur Zahlenwerte"
        ],
        correctAnswer: "Mehrere Werte in einer Sammlung"
      },
      {
        id: "mcq-listen-11",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "tiere = []\ntiere.append('Hund')\ntiere.append('Katze')\nprint(tiere)",
        options: [
          "['Hund', 'Katze']",
          "Hund Katze",
          "['Katze', 'Hund']",
          "Error"
        ],
        correctAnswer: "['Hund', 'Katze']",
        explanation: ".append() fügt Elemente in der Reihenfolge hinzu, in der sie aufgerufen werden."
      },
      {
        id: "mcq-listen-12",
        type: "fill-the-blank",
        question: "Vervollständige den Code, um 'Milch' zur Liste hinzuzufügen:",
        code: "einkauf = []\neinkauf.___(\"Milch\")",
        options: ["add", "append", "push", "insert"],
        correctAnswer: "append",
        explanation: ".append() ist die Python-Methode zum Hinzufügen von Elementen am Ende einer Liste."
      },
      {
        id: "mcq-listen-13",
        type: "spot-the-error",
        question: "Was ist der Fehler in diesem Code?",
        code: "farben = ()\nfarben.append('Rot')\nprint(farben)",
        options: [
          "Leere Liste muss mit [] erstellt werden, nicht ()",
          "append ist falsch geschrieben",
          "print braucht Klammern um farben",
          "Kein Fehler"
        ],
        correctAnswer: "Leere Liste muss mit [] erstellt werden, nicht ()",
        explanation: "() erzeugt ein Tuple, keine Liste. Listen brauchen eckige Klammern: []"
      },
      {
        id: "mcq-listen-14",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "nummern = []\nfor i in range(1, 4):\n    nummern.append(i * 2)\nprint(nummern)",
        options: [
          "[2, 4, 6]",
          "[0, 2, 4, 6]",
          "[1, 2, 3]",
          "2 4 6"
        ],
        correctAnswer: "[2, 4, 6]",
        explanation: "range(1, 4) = 1, 2, 3. Jeder Wert wird verdoppelt: 2, 4, 6."
      },
      {
        id: "mcq-listen-15",
        type: "multiple-choice",
        question: "Was passiert, wenn man print() auf eine Liste anwendet?",
        options: [
          "Es gibt einen Fehler",
          "Nur das erste Element wird angezeigt",
          "Die ganze Liste wird mit eckigen Klammern angezeigt",
          "Jedes Element wird in einer neuen Zeile angezeigt"
        ],
        correctAnswer: "Die ganze Liste wird mit eckigen Klammern angezeigt",
        explanation: "print(liste) zeigt: [Element1, Element2, ...]"
      },
      {
        id: "mcq-listen-16",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "werte = []\nwerte.append(5)\nwerte.append(5)\nwerte.append(5)\nprint(werte)",
        options: [
          "[5]",
          "[5, 5, 5]",
          "[15]",
          "Error - gleiche Werte nicht erlaubt"
        ],
        correctAnswer: "[5, 5, 5]",
        explanation: "Listen können denselben Wert mehrfach enthalten."
      },
      {
        id: "mcq-listen-17",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "texte = []\ntexte.append(Hallo)\nprint(texte)",
        options: [
          "'Hallo' braucht Anführungszeichen",
          "Die Liste ist leer",
          "print ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "'Hallo' braucht Anführungszeichen",
        explanation: "Text muss in Anführungszeichen: texte.append('Hallo')"
      },
      {
        id: "mcq-listen-18",
        type: "fill-the-blank",
        question: "Wie erstellt man eine leere Liste?",
        code: "meine_liste = ___",
        options: ["()", "[]", "{}", "''"],
        correctAnswer: "[]",
        explanation: "Eckige Klammern [] erzeugen eine leere Liste."
      },
      {
        id: "mcq-listen-19",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "daten = []\nprint(daten)",
        options: [
          "[]",
          "None",
          "Error",
          "(leer)"
        ],
        correctAnswer: "[]",
        explanation: "Eine leere Liste wird als [] angezeigt."
      },
      {
        id: "mcq-listen-20",
        type: "multiple-choice",
        question: "Welche Aussage über .append() ist korrekt?",
        options: [
          "Fügt ein Element am Anfang der Liste hinzu",
          "Fügt ein Element am Ende der Liste hinzu",
          "Ersetzt das letzte Element",
          "Löscht ein Element"
        ],
        correctAnswer: "Fügt ein Element am Ende der Liste hinzu",
        explanation: ".append() fügt immer am Ende der Liste hinzu."
      },
      {
        id: "mcq-listen-21",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "liste = []\nliste.append('A')\nliste.append('B')\nliste.append('C')\nprint(liste)",
        options: [
          "['A', 'B', 'C']",
          "['C', 'B', 'A']",
          "A B C",
          "ABC"
        ],
        correctAnswer: "['A', 'B', 'C']",
        explanation: "Elemente werden in der Reihenfolge des Hinzufügens gespeichert."
      },
      {
        id: "mcq-listen-22",
        type: "multiple-choice",
        question: "Kann eine Liste verschiedene Datentypen enthalten?",
        options: [
          "Nein, nur gleiche Typen",
          "Ja, Zahlen und Text gemischt",
          "Nur wenn man sie konvertiert",
          "Nur mit spezieller Syntax"
        ],
        correctAnswer: "Ja, Zahlen und Text gemischt",
        explanation: "Python-Listen können verschiedene Typen speichern: [1, 'Text', 3.14]"
      },
      {
        id: "mcq-listen-23",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "mix = []\nmix.append(1)\nmix.append('Zwei')\nmix.append(3.0)\nprint(mix)",
        options: [
          "[1, 'Zwei', 3.0]",
          "Error - verschiedene Typen",
          "[1, Zwei, 3.0]",
          "1 Zwei 3.0"
        ],
        correctAnswer: "[1, 'Zwei', 3.0]",
        explanation: "Listen können Integer, Strings und Floats gemischt speichern."
      },
      {
        id: "mcq-listen-24",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "todo = []\ntodo.append['Einkaufen']\nprint(todo)",
        options: [
          ".append() braucht runde Klammern, nicht eckige",
          "'Einkaufen' ist zu lang",
          "todo ist ein reserviertes Wort",
          "Kein Fehler"
        ],
        correctAnswer: ".append() braucht runde Klammern, nicht eckige",
        explanation: "Korrekt: todo.append('Einkaufen') mit runden Klammern ()"
      },
      {
        id: "mcq-listen-25",
        type: "fill-the-blank",
        question: "Füge 100 zur Liste hinzu:",
        code: "punkte = []\npunkte.___(___))",
        options: ["append, 100", "add, 100", "push, 100", "insert, 100"],
        correctAnswer: "append, 100",
        explanation: ".append(100) fügt die Zahl 100 zur Liste hinzu."
      },
      {
        id: "mcq-listen-26",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "buchstaben = []\nfor i in range(3):\n    buchstaben.append('X')\nprint(buchstaben)",
        options: [
          "['X', 'X', 'X']",
          "['X']",
          "XXX",
          "[0, 1, 2]"
        ],
        correctAnswer: "['X', 'X', 'X']",
        explanation: "Die Schleife läuft 3 mal und fügt jedes Mal 'X' hinzu."
      },
      {
        id: "mcq-listen-27",
        type: "multiple-choice",
        question: "Was ist der Vorteil einer Liste gegenüber einzelnen Variablen?",
        options: [
          "Listen sind schneller",
          "Man kann beliebig viele Werte speichern",
          "Listen brauchen weniger Speicher",
          "Listen haben keine Vorteile"
        ],
        correctAnswer: "Man kann beliebig viele Werte speichern",
        explanation: "Statt x1, x2, x3... kann man alle Werte in einer Liste sammeln."
      },
      {
        id: "mcq-listen-28",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "nums = []\nfor n in range(1, 3):\n    nums.append(n)\n    nums.append(n)\nprint(nums)",
        options: [
          "[1, 1, 2, 2]",
          "[1, 2, 1, 2]",
          "[1, 2]",
          "[2, 2]"
        ],
        correctAnswer: "[1, 1, 2, 2]",
        explanation: "Jeder Wert (1 und 2) wird zweimal hintereinander hinzugefügt."
      },
      {
        id: "mcq-listen-29",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "namen = []\nnamen.append('Max')\nnamen.append('Lisa')\nprint[namen]",
        options: [
          "print braucht runde Klammern: print(namen)",
          "Die Liste ist falsch definiert",
          "'Max' und 'Lisa' sind keine gültigen Namen",
          "Kein Fehler"
        ],
        correctAnswer: "print braucht runde Klammern: print(namen)",
        explanation: "Funktionsaufrufe brauchen runde Klammern: print(namen)"
      },
      {
        id: "mcq-listen-30",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "a = []\nb = []\na.append(1)\nb.append(2)\nprint(a)\nprint(b)",
        options: [
          "[1]\n[2]",
          "[1, 2]",
          "[2]\n[1]",
          "Error"
        ],
        correctAnswer: "[1]\n[2]",
        explanation: "a und b sind separate Listen. Jede hat ihr eigenes Element."
      }
    ],
    codeTasks: [
      {
        id: "code-listen-1",
        step: 0,
        title: "Einfache Liste erstellen",
        description: "Erstelle eine Liste mit den Werten 1, 2, 3 und gebe sie in die Konsole aus.",
        blocks: [
          {
            type: "code",
            content: "# Erstelle eine Liste mit den Werten 1, 2, 3"
          }
        ],
        showHints: false,
        path: "/drills/listen/0",
        courseId: "python-drills",
        prompt: "Erstelle eine Liste mit den Werten 1, 2, 3 und gib sie in der Konsole aus. Die Ausgabe soll [1, 2, 3] sein (mit eckigen Klammern).",
        starterCode: "# Erstelle eine Liste mit den Werten 1, 2, 3",
        solutionString: "[1, 2, 3]",
        solutionCode: ["[1", "2", "3]", "print("],
        hint: "Schreibe: zahlen = [1, 2, 3] und dann print(zahlen)"
      },
      {
        id: "code-listen-2",
        step: 1,
        title: "Liste erstellen",
        description: "Erstelle eine Liste mit den Zahlen 4, 5, 6 und gebe sie in die Konsole aus.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Liste mit 4, 5, 6"
        }],
        showHints: false,
        path: "/drills/listen/1",
        courseId: "python-drills",
        prompt: "Erstelle eine Liste mit den Zahlen 4, 5, 6 und gib sie in der Konsole aus. Die Ausgabe soll [4, 5, 6] sein.",
        starterCode: "# Erstelle eine Liste mit 4, 5, 6",
        solutionString: "[4, 5, 6]",
        solutionCode: ["[4", "5", "6", "print("],
        hint: "Schreibe: zahlen = [4, 5, 6] und dann print(zahlen)"
      },
      {
        id: "code-listen-3",
        step: 2,
        title: "Liste erweitern",
        description: "Füge der Liste die Zahl 4 hinzu.",
        blocks: [{
          type: "code",
          content: "zahlen = [1, 2, 3]\n# Füge die 4 hinzu"
        }],
        showHints: false,
        path: "/drills/listen/2",
        courseId: "python-drills",
        prompt: "Verwende zahlen.append(4), um die Zahl 4 zur Liste hinzuzufügen. Gib dann die Liste aus. Erwartete Ausgabe: [1, 2, 3, 4]",
        starterCode: "zahlen = [1, 2, 3]\n# Füge die 4 hinzu",
        solutionString: "[1, 2, 3, 4]",
        solutionCode: [".append(", "print("],
        hint: "Zwei Zeilen: zahlen.append(4) und dann print(zahlen)"
      },
      {
        id: "code-listen-4",
        step: 3,
        title: "Liste durchsuchen",
        description: "Überprüfe, ob die Zahl 3 in der Liste enthalten ist.",
        blocks: [{
          type: "code",
          content: "zahlen = [1, 2, 3, 4, 5]\n# Prüfe, ob 3 in der Liste ist"
        }],
        showHints: false,
        path: "/drills/listen/3",
        courseId: "python-drills",
        prompt: "Verwende den in-Operator um zu prüfen, ob 3 in der Liste ist. Gib das Ergebnis direkt aus - du brauchst keine Variable! Erwartete Ausgabe: True",
        starterCode: "zahlen = [1, 2, 3, 4, 5]\n# Prüfe, ob 3 in der Liste ist",
        solutionString: "True",
        solutionCode: [" in ", "zahlen", "print("],
        hint: "Eine Zeile reicht: print(3 in zahlen)"
      },
      {
        id: "code-listen-5",
        step: 5,
        title: "Einkaufsliste erstellen",
        description: "Erstelle eine Einkaufsliste mit 3 Artikeln.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Einkaufsliste"
        }],
        showHints: false,
        path: "/drills/listen/5",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'einkauf = []'. Füge mit .append() nacheinander 'Milch', 'Brot' und 'Eier' hinzu. Gib die Liste aus. Erwartete Ausgabe: ['Milch', 'Brot', 'Eier']",
        starterCode: "# Erstelle eine Einkaufsliste",
        solutionString: "['Milch', 'Brot', 'Eier']",
        solutionCode: ["einkauf", "= []", ".append(", "'Milch'", "'Brot'", "'Eier'", "print("],
        hint: "Fünf Zeilen: einkauf = [], dann drei append-Aufrufe, dann print(einkauf)"
      },
      {
        id: "code-listen-6",
        step: 6,
        title: "Zahlen sammeln",
        description: "Sammle die Zahlen 10, 20 und 30 in einer Liste.",
        blocks: [{
          type: "code",
          content: "# Sammle Zahlen in einer Liste"
        }],
        showHints: false,
        path: "/drills/listen/6",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'werte = []'. Füge mit .append() die Zahlen 10, 20 und 30 hinzu. Gib die Liste aus. Erwartete Ausgabe: [10, 20, 30]",
        starterCode: "# Sammle Zahlen in einer Liste",
        solutionString: "[10, 20, 30]",
        solutionCode: ["werte", "= []", ".append(", "10", "20", "30", "print("],
        hint: "Fünf Zeilen: werte = [], dann drei append-Aufrufe, dann print(werte)"
      },
      {
        id: "code-listen-7",
        step: 7,
        title: "Liste mit Schleife füllen",
        description: "Fülle eine Liste mit den Zahlen 1 bis 5 mithilfe einer Schleife.",
        blocks: [{
          type: "code",
          content: "# Fülle die Liste mit einer Schleife"
        }],
        showHints: false,
        path: "/drills/listen/7",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'nummern = []'. Nutze eine for-Schleife mit range(1, 6), um in jedem Durchlauf nummern.append(i) aufzurufen. Gib die Liste aus. Erwartete Ausgabe: [1, 2, 3, 4, 5]",
        starterCode: "# Fülle die Liste mit einer Schleife",
        solutionString: "[1, 2, 3, 4, 5]",
        solutionCode: ["nummern", "= []", "for ", "range(1, 6)", ".append(", "print("],
        hint: "Drei Schritte: 1) nummern = [], 2) for i in range(1,6): nummern.append(i), 3) print(nummern)"
      },
      {
        id: "code-listen-8",
        step: 8,
        title: "Verdoppelte Werte",
        description: "Erstelle eine Liste mit den verdoppelten Werten 2, 4, 6.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Liste mit verdoppelten Werten"
        }],
        showHints: false,
        path: "/drills/listen/8",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'doppelt = []'. Nutze eine for-Schleife mit range(1, 4) und füge in jedem Durchlauf i * 2 hinzu. Gib die Liste aus. Erwartete Ausgabe: [2, 4, 6]",
        starterCode: "# Erstelle eine Liste mit verdoppelten Werten",
        solutionString: "[2, 4, 6]",
        solutionCode: ["doppelt", "= []", "for ", "range(1, 4)", ".append(", "* 2", "print("],
        hint: "for i in range(1,4): doppelt.append(i * 2)"
      },
      {
        id: "code-listen-9",
        step: 9,
        title: "Städte-Liste",
        description: "Erstelle eine Liste mit 3 Städtenamen.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Städte-Liste"
        }],
        showHints: false,
        path: "/drills/listen/9",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'staedte = []'. Füge mit .append() 'Berlin', 'Hamburg' und 'München' hinzu. Gib die Liste aus. Erwartete Ausgabe: ['Berlin', 'Hamburg', 'München']",
        starterCode: "# Erstelle eine Städte-Liste",
        solutionString: "['Berlin', 'Hamburg', 'München']",
        solutionCode: ["staedte", "= []", ".append(", "'Berlin'", "'Hamburg'", "'München'", "print("],
        hint: "Fünf Zeilen: staedte = [], dann drei append-Aufrufe, dann print(staedte)"
      },
      {
        id: "code-listen-10",
        step: 10,
        title: "Quadratzahlen sammeln",
        description: "Sammle die Quadratzahlen 1, 4, 9 in einer Liste.",
        blocks: [{
          type: "code",
          content: "# Sammle Quadratzahlen"
        }],
        showHints: false,
        path: "/drills/listen/10",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'quadrate = []'. Nutze eine for-Schleife mit range(1, 4) und füge in jedem Durchlauf i * i hinzu. Gib die Liste aus. Erwartete Ausgabe: [1, 4, 9]",
        starterCode: "# Sammle Quadratzahlen",
        solutionString: "[1, 4, 9]",
        solutionCode: ["quadrate", "= []", "for ", "range(1, 4)", ".append(", "* ", "print("],
        hint: "for i in range(1,4): quadrate.append(i * i)"
      },
      {
        id: "code-listen-11",
        step: 11,
        title: "Farben sammeln",
        description: "Erstelle eine Farbliste mit 4 Farben.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Farbliste"
        }],
        showHints: false,
        path: "/drills/listen/11",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'farben = []'. Füge mit .append() 'Rot', 'Grün', 'Blau' und 'Gelb' hinzu. Gib die Liste aus. Erwartete Ausgabe: ['Rot', 'Grün', 'Blau', 'Gelb']",
        starterCode: "# Erstelle eine Farbliste",
        solutionString: "['Rot', 'Grün', 'Blau', 'Gelb']",
        solutionCode: ["farben", "= []", ".append(", "'Rot'", "'Grün'", "'Blau'", "'Gelb'", "print("],
        hint: "Sechs Zeilen: farben = [], dann vier append-Aufrufe, dann print(farben)"
      },
      {
        id: "code-listen-12",
        step: 12,
        title: "Gerade Zahlen",
        description: "Sammle die geraden Zahlen 2, 4, 6, 8 in einer Liste.",
        blocks: [{
          type: "code",
          content: "# Sammle gerade Zahlen"
        }],
        showHints: false,
        path: "/drills/listen/12",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'gerade = []'. Nutze eine for-Schleife mit range(1, 5) und füge in jedem Durchlauf i * 2 hinzu. Gib die Liste aus. Erwartete Ausgabe: [2, 4, 6, 8]",
        starterCode: "# Sammle gerade Zahlen",
        solutionString: "[2, 4, 6, 8]",
        solutionCode: ["gerade", "= []", "for ", "range(1, 5)", ".append(", "* 2", "print("],
        hint: "for i in range(1,5): gerade.append(i * 2)"
      },
      {
        id: "code-listen-13",
        step: 13,
        title: "Wochentage",
        description: "Erstelle eine Liste mit 3 Wochentagen.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Wochentag-Liste"
        }],
        showHints: false,
        path: "/drills/listen/13",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'tage = []'. Füge mit .append() 'Montag', 'Dienstag' und 'Mittwoch' hinzu. Gib die Liste aus. Erwartete Ausgabe: ['Montag', 'Dienstag', 'Mittwoch']",
        starterCode: "# Erstelle eine Wochentag-Liste",
        solutionString: "['Montag', 'Dienstag', 'Mittwoch']",
        solutionCode: ["tage", "= []", ".append(", "'Montag'", "'Dienstag'", "'Mittwoch'", "print("],
        hint: "Fünf Zeilen: tage = [], dann drei append-Aufrufe, dann print(tage)"
      },
      {
        id: "code-listen-14",
        step: 14,
        title: "Fünferschritte",
        description: "Erstelle eine Liste mit 5, 10, 15, 20.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine Liste mit Fünferschritten"
        }],
        showHints: false,
        path: "/drills/listen/14",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'fuenfer = []'. Nutze eine for-Schleife mit range(1, 5) und füge in jedem Durchlauf i * 5 hinzu. Gib die Liste aus. Erwartete Ausgabe: [5, 10, 15, 20]",
        starterCode: "# Erstelle eine Liste mit Fünferschritten",
        solutionString: "[5, 10, 15, 20]",
        solutionCode: ["fuenfer", "= []", "for ", "range(1, 5)", ".append(", "* 5", "print("],
        hint: "for i in range(1,5): fuenfer.append(i * 5)"
      },
      {
        id: "code-listen-15",
        step: 15,
        title: "Gemischte Liste",
        description: "Erstelle eine Liste mit Zahlen und Text gemischt.",
        blocks: [{
          type: "code",
          content: "# Erstelle eine gemischte Liste"
        }],
        showHints: false,
        path: "/drills/listen/15",
        courseId: "python-drills",
        prompt: "Erstelle eine leere Liste 'mix = []'. Füge mit .append() nacheinander: die Zahl 1 (ohne Anführungszeichen), den Text 'Zwei' (mit Anführungszeichen), und die Zahl 3. Gib die Liste aus. Erwartete Ausgabe: [1, 'Zwei', 3]",
        starterCode: "# Erstelle eine gemischte Liste",
        solutionString: "[1, 'Zwei', 3]",
        solutionCode: ["mix", "= []", ".append(", "1", "'Zwei'", "3", "print("],
        hint: "mix.append(1), mix.append('Zwei'), mix.append(3)"
      }
    ]
  },
  {
    topic: "Schleifen",
    mcQuestions: [
      {
        id: "mcq-schleifen-1",
        type: "predict-output",
        question: "Wie oft wird diese Schleife durchlaufen?",
        code: "for i in range(5):\n    print(i)",
        options: ["4 mal", "5 mal", "6 mal", "Error"],
        correctAnswer: "5 mal",
        explanation: "range(5) erzeugt die Zahlen 0, 1, 2, 3, 4 - also 5 Durchläufe."
      },
      {
        id: "mcq-schleifen-2",
        type: "multiple-choice",
        question: "Was gibt range(1, 4) zurück?",
        options: [
          "1, 2, 3, 4",
          "1, 2, 3",
          "0, 1, 2, 3",
          "2, 3, 4"
        ],
        correctAnswer: "1, 2, 3",
        explanation: "range(start, stop) - die stop-Zahl ist NICHT dabei! range(1, 4) → 1, 2, 3"
      },
      {
        id: "mcq-schleifen-3",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for i in range(3):\n    print(i)",
        options: [
          "0\n1\n2",
          "1\n2\n3",
          "0\n1\n2\n3",
          "1\n2"
        ],
        correctAnswer: "0\n1\n2",
        explanation: "range(3) = range(0, 3) → 0, 1, 2"
      },
      {
        id: "mcq-schleifen-4",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "for i in range(1, 5)\nprint(i)",
        options: [
          "Es fehlt der Doppelpunkt nach range(1, 5)",
          "print muss eingerückt sein",
          "Beides ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "Beides ist falsch",
        explanation: "for-Schleifen brauchen : am Ende UND Einrückung im Block"
      },
      {
        id: "mcq-schleifen-5",
        type: "fill-the-blank",
        question: "Vervollständige um 1 bis 5 auszugeben:",
        code: "for i in range(1, ___):\n    print(i)",
        options: ["6", "5", "4", "7"],
        correctAnswer: "6",
        explanation: "Für 1-5 brauchst du range(1, 6) - stop-Zahl ist nicht dabei!"
      },
      {
        id: "mcq-schleifen-6",
        type: "predict-output",
        question: "Wie oft läuft diese Schleife?",
        code: "for year in range(1, 4):\n    print('Jahr')",
        options: ["2 mal", "3 mal", "4 mal", "5 mal"],
        correctAnswer: "3 mal",
        explanation: "range(1, 4) → 1, 2, 3 = 3 Durchläufe"
      },
      {
        id: "mcq-schleifen-7",
        type: "multiple-choice",
        question: "Was macht 'x = x + 1'?",
        options: [
          "Setzt x auf 1",
          "Erhöht x um 1",
          "Prüft ob x gleich x + 1 ist",
          "Error"
        ],
        correctAnswer: "Erhöht x um 1",
        explanation: "x = x + 1 nimmt den alten Wert von x, addiert 1, speichert zurück in x"
      },
      {
        id: "mcq-schleifen-8",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 10\nfor i in range(3):\n    x = x + 5\nprint(x)",
        options: ["15", "20", "25", "10"],
        correctAnswer: "25",
        explanation: "Start: 10, +5 → 15, +5 → 20, +5 → 25"
      },
      {
        id: "mcq-schleifen-9",
        type: "spot-the-error",
        question: "Warum funktioniert der Zinseszins nicht?",
        code: "amount = 1000\nfor i in range(3):\n    new_amount = amount * 1.05\nprint(new_amount)",
        options: [
          "amount wird nie aktualisiert",
          "Die Formel ist falsch",
          "range(3) ist zu klein",
          "Kein Fehler"
        ],
        correctAnswer: "amount wird nie aktualisiert",
        explanation: "Muss sein: amount = amount * 1.05 (nicht new_amount)"
      },
      {
        id: "mcq-schleifen-10",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for i in range(2, 5):\n    print(i)",
        options: ["2\n3\n4", "2\n3\n4\n5", "1\n2\n3\n4", "3\n4\n5"],
        correctAnswer: "2\n3\n4",
        explanation: "range(2, 5) gibt 2, 3, 4 zurück. Die 5 ist exklusiv."
      },
      {
        id: "mcq-schleifen-11",
        type: "multiple-choice",
        question: "Was bedeutet 'exklusiv' bei range()?",
        options: [
          "Der Startwert wird übersprungen",
          "Der Endwert wird nicht erreicht",
          "Nur gerade Zahlen werden verwendet",
          "Die Schleife läuft rückwärts"
        ],
        correctAnswer: "Der Endwert wird nicht erreicht",
        explanation: "Bei range(1, 5) ist 5 exklusiv - es werden nur 1, 2, 3, 4 erzeugt."
      },
      {
        id: "mcq-schleifen-12",
        type: "fill-the-blank",
        question: "Vervollständige für 5 Durchläufe (0 bis 4):",
        code: "for i in range(___):\n    print('Hallo')",
        options: ["4", "5", "6", "0, 4"],
        correctAnswer: "5",
        explanation: "range(5) erzeugt 0, 1, 2, 3, 4 - also 5 Durchläufe."
      },
      {
        id: "mcq-schleifen-13",
        type: "spot-the-error",
        question: "Was fehlt in diesem Code?",
        code: "for i in range(1, 5)\n    print(i)",
        options: [
          "Der Doppelpunkt nach range(1, 5)",
          "Das Schlüsselwort 'do'",
          "Eine Schleifenvariable",
          "Kein Fehler"
        ],
        correctAnswer: "Der Doppelpunkt nach range(1, 5)",
        explanation: "for-Schleifen müssen mit : enden: for i in range(1, 5):"
      },
      {
        id: "mcq-schleifen-14",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "summe = 0\nfor i in range(1, 4):\n    summe = summe + i\nprint(summe)",
        options: ["3", "6", "10", "0"],
        correctAnswer: "6",
        explanation: "summe = 0 + 1 + 2 + 3 = 6"
      },
      {
        id: "mcq-schleifen-15",
        type: "multiple-choice",
        question: "Welche Zahlen gibt range(0, 3) zurück?",
        options: [
          "0, 1, 2, 3",
          "0, 1, 2",
          "1, 2, 3",
          "1, 2"
        ],
        correctAnswer: "0, 1, 2",
        explanation: "range(0, 3) startet bei 0 und endet vor 3."
      },
      {
        id: "mcq-schleifen-16",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "for i in range(3):\nprint(i)",
        options: [
          "print muss eingerückt sein",
          "range(3) ist ungültig",
          "Es fehlt die Variable i",
          "Kein Fehler"
        ],
        correctAnswer: "print muss eingerückt sein",
        explanation: "Der Schleifenkörper muss eingerückt sein (4 Leerzeichen oder Tab)."
      },
      {
        id: "mcq-schleifen-17",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for x in range(3):\n    print('*')",
        options: ["*", "***", "*\n*\n*", "Error"],
        correctAnswer: "*\n*\n*",
        explanation: "Die Schleife läuft 3 mal und gibt jedes Mal * in einer neuen Zeile aus."
      },
      {
        id: "mcq-schleifen-18",
        type: "fill-the-blank",
        question: "Wie gibt man die Zahlen 1, 2, 3, 4, 5 aus?",
        code: "for i in range(1, ___):\n    print(i)",
        options: ["5", "6", "4", "0"],
        correctAnswer: "6",
        explanation: "Für 1 bis 5 braucht man range(1, 6), da 6 exklusiv ist."
      },
      {
        id: "mcq-schleifen-19",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "produkt = 1\nfor i in range(1, 4):\n    produkt = produkt * i\nprint(produkt)",
        options: ["6", "3", "1", "24"],
        correctAnswer: "6",
        explanation: "produkt = 1 * 1 * 2 * 3 = 6"
      },
      {
        id: "mcq-schleifen-20",
        type: "multiple-choice",
        question: "Was ist der Unterschied zwischen range(5) und range(1, 6)?",
        options: [
          "Kein Unterschied",
          "range(5) startet bei 0, range(1, 6) startet bei 1",
          "range(5) hat 5 Elemente, range(1, 6) hat 6",
          "range(5) ist schneller"
        ],
        correctAnswer: "range(5) startet bei 0, range(1, 6) startet bei 1",
        explanation: "range(5) = 0,1,2,3,4 und range(1,6) = 1,2,3,4,5 - beide haben 5 Elemente, aber unterschiedliche Startwerte."
      },
      {
        id: "mcq-schleifen-21",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for i in range(4):\n    print(i * 10)",
        options: ["0\n10\n20\n30", "10\n20\n30\n40", "0\n10\n20\n30\n40", "40"],
        correctAnswer: "0\n10\n20\n30",
        explanation: "range(4) = 0,1,2,3. Jeder Wert mal 10: 0,10,20,30."
      },
      {
        id: "mcq-schleifen-22",
        type: "multiple-choice",
        question: "Was passiert mit der Schleifenvariable nach der Schleife?",
        options: [
          "Sie wird automatisch gelöscht",
          "Sie behält den letzten Wert",
          "Sie wird auf 0 gesetzt",
          "Sie existiert nicht mehr"
        ],
        correctAnswer: "Sie behält den letzten Wert",
        explanation: "Nach for i in range(3): hat i den Wert 2 (letzter Durchlauf)."
      },
      {
        id: "mcq-schleifen-23",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for i in range(3):\n    print('Zeile')\nprint('Ende')",
        options: [
          "Zeile\nZeile\nZeile\nEnde",
          "Zeile\nEnde\nZeile\nEnde\nZeile\nEnde",
          "Zeile Zeile Zeile Ende",
          "Error"
        ],
        correctAnswer: "Zeile\nZeile\nZeile\nEnde",
        explanation: "Die Schleife gibt 3x 'Zeile' aus. 'Ende' kommt einmal nach der Schleife."
      },
      {
        id: "mcq-schleifen-24",
        type: "fill-the-blank",
        question: "Wie läuft die Schleife 10 mal?",
        code: "for i in ___:\n    print('Durchlauf')",
        options: ["range(10)", "range(1, 10)", "range(0, 9)", "range(11)"],
        correctAnswer: "range(10)",
        explanation: "range(10) erzeugt 0-9, also 10 Durchläufe."
      },
      {
        id: "mcq-schleifen-25",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "for i in range(5);\n    print(i)",
        options: [
          "Semikolon statt Doppelpunkt",
          "i ist keine gültige Variable",
          "range(5) braucht zwei Werte",
          "Kein Fehler"
        ],
        correctAnswer: "Semikolon statt Doppelpunkt",
        explanation: "for-Schleifen enden mit : (Doppelpunkt), nicht ; (Semikolon)."
      },
      {
        id: "mcq-schleifen-26",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "total = 10\nfor i in range(3):\n    total = total - 1\nprint(total)",
        options: ["7", "10", "0", "3"],
        correctAnswer: "7",
        explanation: "Start: 10, dann 3x -1: 10-1-1-1 = 7"
      },
      {
        id: "mcq-schleifen-27",
        type: "multiple-choice",
        question: "Was gibt range(2, 2) zurück?",
        options: [
          "2",
          "Nichts (leere Sequenz)",
          "2, 2",
          "Error"
        ],
        correctAnswer: "Nichts (leere Sequenz)",
        explanation: "Wenn Start = Stop, ist die Sequenz leer. Die Schleife läuft 0 mal."
      },
      {
        id: "mcq-schleifen-28",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "for i in range(1, 1):\n    print('Hallo')\nprint('Fertig')",
        options: ["Hallo\nFertig", "Fertig", "Hallo", "Error"],
        correctAnswer: "Fertig",
        explanation: "range(1, 1) ist leer, die Schleife wird übersprungen. Nur 'Fertig' wird ausgegeben."
      },
      {
        id: "mcq-schleifen-29",
        type: "fill-the-blank",
        question: "Gib die Zahlen 5, 6, 7 aus:",
        code: "for i in range(___, ___):\n    print(i)",
        options: ["5, 8", "5, 7", "4, 7", "5, 9"],
        correctAnswer: "5, 8",
        explanation: "range(5, 8) gibt 5, 6, 7 zurück. 8 ist exklusiv."
      },
      {
        id: "mcq-schleifen-30",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "text = ''\nfor i in range(4):\n    text = text + 'a'\nprint(text)",
        options: ["aaaa", "a", "4", "Error"],
        correctAnswer: "aaaa",
        explanation: "Startet mit leerem String, fügt 4x 'a' hinzu: aaaa"
      }
    ],
    codeTasks: [
      {
        id: "code-schleifen-1",
        step: 1,
        title: "Einfache for-Schleife",
        description: "Gib die Zahlen von 0 bis 4 mit einer for-Schleife aus.",
        blocks: [{
          type: "code",
          content: "# Gebe Zahlen von 0 bis 4 in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/1",
        courseId: "python-drills",
        prompt: "Verwende eine for-Schleife mit range(5), um die Zahlen 0 bis 4 auszugeben. Jede Zahl in einer eigenen Zeile.",
        starterCode: "# Gebe Zahlen von 0 bis 4 in die Konsole aus",
        solutionString: "0\n1\n2\n3\n4",
        solutionCode: ["for ", "range(5)", "print"],
        hint: "for i in range(5): und dann print(i) eingerückt darunter"
      },
      {
        id: "code-schleifen-2",
        step: 3,
        title: "Liste durchlaufen",
        description: "Durchlaufe eine Liste von Namen und gib jeden Namen aus.",
        blocks: [{
          type: "code",
          content: "namen = ['Anna', 'Bob', 'Charlie']\n# Gebe jeden Namen in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/3",
        courseId: "python-drills",
        prompt: "Verwende eine for-Schleife, um durch die Liste zu iterieren und jeden Namen in der Konsole auszugeben. Jeder Name in einer eigenen Zeile.",
        starterCode: "namen = ['Anna', 'Bob', 'Charlie']\n# Gebe jeden Namen in die Konsole aus",
        solutionString: "Anna\nBob\nCharlie",
        solutionCode: ["for ", " in ", "print"],
        hint: "for name in namen: und dann print(name) eingerückt darunter"
      },
      {
        id: "code-schleifen-3",
        step: 5,
        title: "for-Schleife mit range() und f-String",
        description: "Gib 'Jahr 1', 'Jahr 2', 'Jahr 3' mit einer for-Schleife in der Konsole aus.",
        blocks: [{
          type: "code",
          content: "# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/schleifen/5",
        courseId: "python-drills",
        prompt: "Gib 'Jahr 1', 'Jahr 2', 'Jahr 3' mit einer for-Schleife aus. Nutze range(1, 4) und f-Strings. WICHTIG: Achte auf das Leerzeichen zwischen 'Jahr' und der Zahl! Erwartete Ausgabe: Jahr 1 (mit Leerzeichen)",
        starterCode: "# Dein Code hier",
        solutionString: "Jahr 1\nJahr 2\nJahr 3",
        solutionCode: ["for ", "range(1, 4)", ":", "print(", "f'", "{"],
        hint: "for i in range(1, 4): und dann print(f'Jahr {i}') - Beachte: 'Jahr ' (mit Leerzeichen vor dem {)"
      },
      {
        id: "code-schleifen-4",
        step: 6,
        title: "Variable in Schleife erhöhen",
        description: "x = 0. Erhöhe x in einer Schleife 5 mal um 1. Gib x am Ende in der Konsole aus.",
        blocks: [{
          type: "code",
          content: "x = 0\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/schleifen/6",
        courseId: "python-drills",
        prompt: "Variable x startet bei 0. Erhöhe x in einer for-Schleife 5 mal um 1 (x = x + 1). Gib x am Ende (nach der Schleife) in der Konsole aus.",
        starterCode: "x = 0\n# Dein Code hier",
        solutionString: "5",
        solutionCode: ["for ", "range(5)", "x", "=", "+", "1", "print("],
        hint: "for i in range(5): dann eingerückt x = x + 1. Danach (ohne Einrückung!) print(x)"
      },
      {
        id: "code-schleifen-5",
        step: 5,
        title: "Zahlen 1 bis 5 ausgeben",
        description: "Gib die Zahlen 1 bis 5 mit einer Schleife aus.",
        blocks: [{
          type: "code",
          content: "# Gebe die Zahlen 1 bis 5 in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/5",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(1, 6), um die Zahlen 1 bis 5 auszugeben. Jede Zahl in einer eigenen Zeile.",
        starterCode: "# Gebe die Zahlen 1 bis 5 in die Konsole aus",
        solutionString: "1\n2\n3\n4\n5",
        solutionCode: ["for ", "range(1, 6)", ":", "print("],
        hint: "for i in range(1, 6): und dann print(i) eingerückt darunter"
      },
      {
        id: "code-schleifen-6",
        step: 6,
        title: "Summe berechnen",
        description: "Berechne die Summe der Zahlen 1 bis 5.",
        blocks: [{
          type: "code",
          content: "summe = 0\n# Addiere die Zahlen 1 bis 5"
        }],
        showHints: false,
        path: "/drills/schleifen/6",
        courseId: "python-drills",
        prompt: "Variable summe startet bei 0. Nutze eine for-Schleife mit range(1, 6), um jede Zahl zu summe zu addieren (summe = summe + i). Gib summe am Ende (nach der Schleife) aus.",
        starterCode: "summe = 0\n# Addiere die Zahlen 1 bis 5",
        solutionString: "15",
        solutionCode: ["for ", "range(1, 6)", "summe", "=", "+", "print("],
        hint: "for i in range(1, 6): dann eingerückt summe = summe + i. Danach (ohne Einrückung!) print(summe)"
      },
      {
        id: "code-schleifen-7",
        step: 7,
        title: "Sterne ausgeben",
        description: "Gib 4 Sterne (*) untereinander aus.",
        blocks: [{
          type: "code",
          content: "# Gebe 4 Sterne in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/7",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(4), um 4 mal '*' auszugeben. Jeder Stern in einer eigenen Zeile.",
        starterCode: "# Gebe 4 Sterne in die Konsole aus",
        solutionString: "*\n*\n*\n*",
        solutionCode: ["for ", "range(4)", ":", "print(", "'*'"],
        hint: "for i in range(4): und dann print('*') eingerückt darunter"
      },
      {
        id: "code-schleifen-8",
        step: 8,
        title: "Zähler hochzählen",
        description: "Zähle von 10 bis 12.",
        blocks: [{
          type: "code",
          content: "# Zähle von 10 bis 12"
        }],
        showHints: false,
        path: "/drills/schleifen/8",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(10, 13), um die Zahlen 10, 11, 12 auszugeben. Jede Zahl in einer eigenen Zeile.",
        starterCode: "# Zähle von 10 bis 12",
        solutionString: "10\n11\n12",
        solutionCode: ["for ", "range(10, 13)", ":", "print("],
        hint: "for i in range(10, 13): und dann print(i) eingerückt darunter"
      },
      {
        id: "code-schleifen-9",
        step: 9,
        title: "Multiplikation in Schleife",
        description: "Verdopple einen Wert 3 mal.",
        blocks: [{
          type: "code",
          content: "wert = 2\n# Verdopple wert 3 mal"
        }],
        showHints: false,
        path: "/drills/schleifen/9",
        courseId: "python-drills",
        prompt: "Variable wert startet bei 2. Nutze eine for-Schleife mit range(3), um wert 3 mal zu verdoppeln (wert = wert * 2). Gib wert am Ende (nach der Schleife) aus.",
        starterCode: "wert = 2\n# Verdopple wert 3 mal",
        solutionString: "16",
        solutionCode: ["for ", "range(3)", "wert", "=", "* 2", "print("],
        hint: "for i in range(3): dann eingerückt wert = wert * 2. Danach (ohne Einrückung!) print(wert)"
      },
      {
        id: "code-schleifen-10",
        step: 10,
        title: "Zeilen mit Nummer",
        description: "Gib 'Zeile 1', 'Zeile 2', 'Zeile 3' aus.",
        blocks: [{
          type: "code",
          content: "# Gebe nummerierte Zeilen in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/10",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(1, 4) und f-Strings, um 'Zeile 1', 'Zeile 2', 'Zeile 3' auszugeben. WICHTIG: Achte auf das Leerzeichen zwischen 'Zeile' und der Zahl! Erwartete Ausgabe: Zeile 1 (mit Leerzeichen)",
        starterCode: "# Gebe nummerierte Zeilen in die Konsole aus",
        solutionString: "Zeile 1\nZeile 2\nZeile 3",
        solutionCode: ["for ", "range(1, 4)", ":", "print(", "f'", "{"],
        hint: "for i in range(1, 4): und dann print(f'Zeile {i}') - Beachte: 'Zeile ' (mit Leerzeichen vor dem {)"
      },
      {
        id: "code-schleifen-11",
        step: 11,
        title: "Countdown von 5",
        description: "Gib die Zahlen 5, 4, 3, 2, 1 aus.",
        blocks: [{
          type: "code",
          content: "# Countdown von 5 bis 1"
        }],
        showHints: false,
        path: "/drills/schleifen/11",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(1, 6). In jedem Durchlauf gib (6 - i) aus, um von 5 runterzuzählen. Jede Zahl in einer eigenen Zeile.",
        starterCode: "# Countdown von 5 bis 1",
        solutionString: "5\n4\n3\n2\n1",
        solutionCode: ["for ", "range(1, 6)", ":", "print(", "6 - "],
        hint: "for i in range(1, 6): und dann print(6 - i) eingerückt darunter"
      },
      {
        id: "code-schleifen-12",
        step: 12,
        title: "Zehnerschritte",
        description: "Gib 10, 20, 30, 40 aus.",
        blocks: [{
          type: "code",
          content: "# Gebe Zehnerschritte in die Konsole aus"
        }],
        showHints: false,
        path: "/drills/schleifen/12",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(1, 5) und gib i * 10 aus. Jede Zahl in einer eigenen Zeile.",
        starterCode: "# Gebe Zehnerschritte in die Konsole aus",
        solutionString: "10\n20\n30\n40",
        solutionCode: ["for ", "range(1, 5)", ":", "print(", "* 10"],
        hint: "for i in range(1, 5): und dann print(i * 10) eingerückt darunter"
      },
      {
        id: "code-schleifen-13",
        step: 13,
        title: "Text wiederholen",
        description: "Gib 'Hallo' 3 mal aus.",
        blocks: [{
          type: "code",
          content: "# Gib Hallo 3 mal aus"
        }],
        showHints: false,
        path: "/drills/schleifen/13",
        courseId: "python-drills",
        prompt: "Nutze eine for-Schleife mit range(3), um 'Hallo' 3 mal auszugeben. Jedes Hallo in einer eigenen Zeile.",
        starterCode: "# Gib Hallo 3 mal aus",
        solutionString: "Hallo\nHallo\nHallo",
        solutionCode: ["for ", "range(3)", ":", "print(", "'Hallo'"],
        hint: "for i in range(3): und dann print('Hallo') eingerückt darunter"
      },
      {
        id: "code-schleifen-14",
        step: 14,
        title: "Produkt berechnen",
        description: "Berechne 1 * 2 * 3 * 4 mit einer Schleife.",
        blocks: [{
          type: "code",
          content: "ergebnis = 1\n# Multipliziere mit 1, 2, 3, 4"
        }],
        showHints: false,
        path: "/drills/schleifen/14",
        courseId: "python-drills",
        prompt: "Variable ergebnis startet bei 1. Nutze eine for-Schleife mit range(1, 5), um ergebnis mit jeder Zahl zu multiplizieren (ergebnis = ergebnis * i). Gib ergebnis am Ende (nach der Schleife) aus.",
        starterCode: "ergebnis = 1\n# Multipliziere mit 1, 2, 3, 4",
        solutionString: "24",
        solutionCode: ["for ", "range(1, 5)", "ergebnis", "=", "* ", "print("],
        hint: "for i in range(1, 5): dann eingerückt ergebnis = ergebnis * i. Danach (ohne Einrückung!) print(ergebnis)"
      },
      {
        id: "code-schleifen-15",
        step: 15,
        title: "String aufbauen",
        description: "Baue den String 'XXX' mit einer Schleife.",
        blocks: [{
          type: "code",
          content: "text = ''\n# Füge 3 mal 'X' hinzu"
        }],
        showHints: false,
        path: "/drills/schleifen/15",
        courseId: "python-drills",
        prompt: "Variable text startet als leerer String ''. Nutze eine for-Schleife mit range(3), um 3 mal 'X' anzuhängen (text = text + 'X'). Gib text am Ende (nach der Schleife) aus.",
        starterCode: "text = ''\n# Füge 3 mal 'X' hinzu",
        solutionString: "XXX",
        solutionCode: ["for ", "range(3)", "text", "=", "+ 'X'", "print("],
        hint: "for i in range(3): dann eingerückt text = text + 'X'. Danach (ohne Einrückung!) print(text)"
      }
    ]
  },
  {
    topic: "Bedingungen",
    mcQuestions: [
      {
        id: "mcq-bedingungen-1",
        type: 'multiple-choice',
        question: "Welches Schlüsselwort wird für Bedingungen verwendet?",
        options: ["when", "if", "case", "check"],
        correctAnswer: "if"
      },
      {
        id: "mcq-bedingungen-2",
        type: 'multiple-choice',
        question: "Welcher Vergleichsoperator prüft auf Gleichheit?",
        options: ["=", "==", "===", "equals"],
        correctAnswer: "=="
      },
      {
        id: "mcq-bedingungen-3",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 100\nif x < 50:\n    print('A')\nelif x < 75:\n    print('B')\nelse:\n    print('C')",
        options: ["A", "B", "C", "Nichts"],
        correctAnswer: "C",
        explanation: "100 ist nicht < 50 und nicht < 75, also wird else ausgeführt: 'C'"
      },
      {
        id: "mcq-bedingungen-4",
        type: "multiple-choice",
        question: "Welcher Vergleichsoperator prüft auf 'kleiner als'?",
        options: ["<", ">", "<=", "=="],
        correctAnswer: "<",
        explanation: "< bedeutet 'kleiner als', z.B. 5 < 10 ist True"
      },
      {
        id: "mcq-bedingungen-5",
        type: "spot-the-error",
        question: "Was fehlt in diesem Code?",
        code: "if age > 18\n    print('Erwachsen')",
        options: [
          "Der Doppelpunkt nach der Bedingung",
          "Das Schlüsselwort 'then'",
          "Klammern um die Bedingung",
          "Ein Semikolon"
        ],
        correctAnswer: "Der Doppelpunkt nach der Bedingung",
        explanation: "if-Statements enden mit : → if age > 18:"
      },
      {
        id: "mcq-bedingungen-6",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 15\nif x < 10:\n    print('Klein')",
        options: [
          "Klein",
          "15",
          "Nichts",
          "Error"
        ],
        correctAnswer: "Nichts",
        explanation: "Die Bedingung x < 10 ist False (15 ist nicht < 10), also wird print() nicht ausgeführt."
      },
      {
        id: "mcq-bedingungen-7",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "if bmi < 25:\nprint('Normal')",
        options: [
          "Es fehlt die Einrückung bei print",
          "Es fehlt der Doppelpunkt",
          "bmi muss in Klammern",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt die Einrückung bei print",
        explanation: "Der Code im if-Block muss eingerückt sein (4 Leerzeichen oder Tab)"
      },
      {
        id: "mcq-bedingungen-8",
        type: "fill-the-blank",
        question: "Vervollständige:",
        code: "if score ___ 50:\n    print('Bestanden')",
        options: [">=", "<=", "=", "=>"],
        correctAnswer: ">=",
        explanation: ">= bedeutet 'größer oder gleich'"
      },
      {
        id: "mcq-bedingungen-9",
        type: "multiple-choice",
        question: "Was bedeutet elif?",
        options: [
          "else if (sonst wenn)",
          "end if",
          "error if",
          "exit if"
        ],
        correctAnswer: "else if (sonst wenn)",
        explanation: "elif ist die Kurzform von 'else if' - eine Alternative zur ersten Bedingung"
      },
      {
        id: "mcq-bedingungen-10",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "score = 75\nif score < 50:\n    print('F')\nelif score < 80:\n    print('C')\nelif score < 90:\n    print('B')",
        options: ["F", "C", "B", "Nichts"],
        correctAnswer: "C",
        explanation: "75 ist nicht < 50, aber < 80, also wird 'C' ausgegeben. Danach stoppt Python."
      },
      {
        id: "mcq-bedingungen-11",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "if x < 10:\n    print('Klein')\nelif:\n    print('Groß')",
        options: [
          "elif braucht eine Bedingung",
          "Es fehlt else",
          "Die Einrückung ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "elif braucht eine Bedingung",
        explanation: "elif braucht eine Bedingung wie elif x >= 10: - Ohne Bedingung nutzt man else"
      },
      {
        id: "mcq-bedingungen-12",
        type: "multiple-choice",
        question: "Wie viele elif kann man haben?",
        options: [
          "Maximal 1",
          "Maximal 2",
          "Beliebig viele",
          "Genau 3"
        ],
        correctAnswer: "Beliebig viele",
        explanation: "Man kann so viele elif-Blöcke schreiben wie nötig"
      },
      {
        id: "mcq-bedingungen-13",
        type: "multiple-choice",
        question: "Wann wird der else-Block ausgeführt?",
        options: [
          "Immer",
          "Nie",
          "Wenn keine der vorherigen Bedingungen True war",
          "Nur bei Fehlern"
        ],
        correctAnswer: "Wenn keine der vorherigen Bedingungen True war",
        explanation: "else fängt alle Fälle ab, die von if und elif nicht erfasst wurden"
      },
      {
        id: "mcq-bedingungen-14",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "if x < 10:\n    print('Klein')\nelse x >= 10:\n    print('Groß')",
        options: [
          "else braucht keine Bedingung",
          "Es fehlt ein elif",
          "Die Einrückung ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "else braucht keine Bedingung",
        explanation: "else steht alleine, ohne Bedingung: else: (nicht else x >= 10:)"
      },
      {
        id: "mcq-bedingungen-15",
        type: "multiple-choice",
        question: "Kann man mehrere else-Blöcke haben?",
        options: [
          "Ja, beliebig viele",
          "Ja, maximal 2",
          "Nein, nur einen else-Block pro if",
          "Ja, aber nur mit elif"
        ],
        correctAnswer: "Nein, nur einen else-Block pro if",
        explanation: "else ist der letzte Block, nur einmal pro if-Statement erlaubt"
      },
      {
        id: "mcq-bedingungen-16",
        type: "spot-the-error",
        question: "Was ist falsch an diesem Code?",
        code: "if x > 10\n    print('Groß')",
        options: [
          "Es fehlt der Doppelpunkt nach der Bedingung",
          "x muss in Klammern",
          "print muss großgeschrieben sein",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt der Doppelpunkt nach der Bedingung",
        explanation: "if-Statements enden immer mit : (Doppelpunkt)"
      },
      {
        id: "mcq-bedingungen-17",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "temp = 5\nif temp < 0:\n    print('Eisig')\nelif temp < 15:\n    print('Kühl')\nelse:\n    print('Warm')",
        options: ["Eisig", "Kühl", "Warm", "Nichts"],
        correctAnswer: "Kühl",
        explanation: "5 ist nicht < 0, aber < 15, also wird 'Kühl' ausgegeben."
      },
      {
        id: "mcq-bedingungen-18",
        type: "fill-the-blank",
        question: "Vervollständige für 'gleich':",
        code: "if a ___ b:\n    print('Gleich')",
        options: ["=", "==", "===", "equals"],
        correctAnswer: "==",
        explanation: "== prüft auf Gleichheit. = ist nur für Zuweisung."
      },
      {
        id: "mcq-bedingungen-19",
        type: "multiple-choice",
        question: "Was prüft der Operator <= ?",
        options: [
          "Kleiner als",
          "Größer als",
          "Kleiner oder gleich",
          "Zuweisung"
        ],
        correctAnswer: "Kleiner oder gleich",
        explanation: "<= bedeutet 'kleiner oder gleich', z.B. 5 <= 5 ist True."
      },
      {
        id: "mcq-bedingungen-20",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "zahl = 7\nif zahl == 5:\n    print('Fünf')\nelif zahl == 7:\n    print('Sieben')\nelif zahl == 7:\n    print('Auch Sieben')",
        options: ["Fünf", "Sieben", "Auch Sieben", "Sieben\nAuch Sieben"],
        correctAnswer: "Sieben",
        explanation: "Nur die ERSTE zutreffende Bedingung wird ausgeführt. Python stoppt nach 'Sieben'."
      },
      {
        id: "mcq-bedingungen-21",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "wert = 50\nif wert > 100:\n    print('Hoch')\nprint('Fertig')",
        options: ["Hoch\nFertig", "Fertig", "Hoch", "Nichts"],
        correctAnswer: "Fertig",
        explanation: "50 > 100 ist False, also wird 'Hoch' übersprungen. 'Fertig' ist außerhalb des if-Blocks."
      },
      {
        id: "mcq-bedingungen-22",
        type: "multiple-choice",
        question: "Wann braucht man elif statt else?",
        options: [
          "Immer",
          "Wenn man eine weitere Bedingung prüfen will",
          "Wenn der erste if-Block leer ist",
          "elif und else sind gleich"
        ],
        correctAnswer: "Wenn man eine weitere Bedingung prüfen will",
        explanation: "elif prüft eine neue Bedingung, else fängt alles andere ab."
      },
      {
        id: "mcq-bedingungen-23",
        type: "spot-the-error",
        question: "Was ist der Fehler?",
        code: "if x = 10:\n    print('Zehn')",
        options: [
          "= sollte == sein (Vergleich statt Zuweisung)",
          "x ist nicht definiert",
          "print ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "= sollte == sein (Vergleich statt Zuweisung)",
        explanation: "Für Vergleich braucht man ==, nicht = (das ist Zuweisung)."
      },
      {
        id: "mcq-bedingungen-24",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "x = 10\ny = 10\nif x == y:\n    print('Gleich')\nelse:\n    print('Ungleich')",
        options: ["Gleich", "Ungleich", "True", "10 10"],
        correctAnswer: "Gleich",
        explanation: "x == y ist True (beide sind 10), also wird 'Gleich' ausgegeben."
      },
      {
        id: "mcq-bedingungen-25",
        type: "fill-the-blank",
        question: "Prüfe ob x größer als 0 ist:",
        code: "if x ___ 0:\n    print('Positiv')",
        options: [">", "<", "==", ">="],
        correctAnswer: ">",
        explanation: "> bedeutet 'größer als'. x > 0 prüft ob x positiv ist."
      },
      {
        id: "mcq-bedingungen-26",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "n = 0\nif n > 0:\n    print('Plus')\nelif n < 0:\n    print('Minus')\nelse:\n    print('Null')",
        options: ["Plus", "Minus", "Null", "Nichts"],
        correctAnswer: "Null",
        explanation: "0 ist weder > 0 noch < 0, also wird else ausgeführt: 'Null'"
      },
      {
        id: "mcq-bedingungen-27",
        type: "multiple-choice",
        question: "Was ist der Unterschied zwischen > und >= ?",
        options: [
          "Kein Unterschied",
          ">= schließt den Grenzwert ein, > nicht",
          "> ist für Zahlen, >= für Text",
          ">= ist schneller"
        ],
        correctAnswer: ">= schließt den Grenzwert ein, > nicht",
        explanation: "5 > 5 ist False, aber 5 >= 5 ist True."
      },
      {
        id: "mcq-bedingungen-28",
        type: "spot-the-error",
        question: "Was ist falsch?",
        code: "if x > 5\n    print('Groß')\nelse:\n    print('Klein')",
        options: [
          "Es fehlt : nach x > 5",
          "else braucht eine Bedingung",
          "Die Einrückung ist falsch",
          "Kein Fehler"
        ],
        correctAnswer: "Es fehlt : nach x > 5",
        explanation: "Jedes if, elif und else endet mit Doppelpunkt: if x > 5:"
      },
      {
        id: "mcq-bedingungen-29",
        type: "predict-output",
        question: "Was gibt dieser Code aus?",
        code: "preis = 100\nif preis >= 100:\n    print('Teuer')\nif preis >= 50:\n    print('Mittel')",
        options: ["Teuer", "Mittel", "Teuer\nMittel", "Nichts"],
        correctAnswer: "Teuer\nMittel",
        explanation: "Das sind ZWEI separate if-Statements. Beide Bedingungen sind True für 100."
      },
      {
        id: "mcq-bedingungen-30",
        type: "fill-the-blank",
        question: "Vervollständige den else-Block:",
        code: "if x > 10:\n    print('Groß')\n___:\n    print('Klein')",
        options: ["else", "elif", "otherwise", "default"],
        correctAnswer: "else",
        explanation: "else fängt alle Fälle ab, die nicht von if erfasst wurden."
      }
    ],
    codeTasks: [
      {
        id: "code-bedingungen-1",
        step: 1,
        title: "Einfache if-Bedingung",
        description: "Überprüfe, ob eine Zahl größer als 10 ist.",
        blocks: [{
          type: "code",
          content: "zahl = 15\n# Prüfe, ob zahl größer als 10 ist"
        }],
        showHints: false,
        path: "/drills/bedingungen/1",
        courseId: "python-drills",
        prompt: "Verwende eine if-Bedingung, um zu prüfen, ob die Zahl größer als 10 ist. Gib 'Größer als 10' (mit Leerzeichen!) in der Konsole aus, falls die Bedingung erfüllt ist.",
        starterCode: "zahl = 15\n# Prüfe, ob zahl größer als 10 ist",
        solutionString: "Größer als 10",
        solutionCode: ["if ", "> 10", "print("],
        hint: "if zahl > 10: dann eingerückt print('Größer als 10') - Achte auf Leerzeichen im Text!"
      },
      {
        id: "code-bedingungen-2",
        step: 3,
        title: "Mehrfache Bedingungen",
        description: "Bewerte eine Schulnote (1-6).",
        blocks: [{
          type: "code",
          content: "note = 2\n# Bewerte die Note"
        }],
        showHints: false,
        path: "/drills/bedingungen/3",
        courseId: "python-drills",
        prompt: "Verwende if/elif für Notenbewertung: Bei note==1 gib 'Sehr Gut' aus (mit Leerzeichen!), bei note==2 gib 'Gut' aus, bei note==3 gib 'Befriedigend' aus.",
        starterCode: "note = 2\n# Bewerte die Note",
        solutionString: "Gut",
        solutionCode: ["if ", "elif ", "print("],
        hint: "if note == 1: print('Sehr Gut'), elif note == 2: print('Gut'), elif note == 3: print('Befriedigend')"
      },
      {
        id: "code-bedingungen-3",
        step: 4,
        title: "if-Statement mit Vergleich",
        description: "Prüfe ob x > 10. Wenn ja, gib 'Groß' in der Konsole aus. x = 15",
        blocks: [{
          type: "code",
          content: "x = 15\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/bedingungen/4",
        courseId: "python-drills",
        prompt: "Prüfe ob x > 10. Wenn ja, gib 'Groß' in der Konsole aus. Vergiss nicht den Doppelpunkt und die Einrückung!",
        starterCode: "x = 15\n# Dein Code hier",
        solutionString: "Groß",
        solutionCode: ["if ", "x ", "> 10", ":", "print(", "'Groß'"]
      },
      {
        id: "code-bedingungen-4",
        step: 5,
        title: "if-Statement mit >= Operator",
        description: "Prüfe ob age >= 18. Wenn ja, gib 'Erwachsen' in der Konsole aus. age = 20",
        blocks: [{
          type: "code",
          content: "age = 20\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/bedingungen/5",
        courseId: "python-drills",
        prompt: "Prüfe ob age >= 18. Wenn ja, gib 'Erwachsen' in der Konsole aus. Vergiss nicht den Doppelpunkt und die Einrückung!",
        starterCode: "age = 20\n# Dein Code hier",
        solutionString: "Erwachsen",
        solutionCode: ["if ", "age ", ">=", "18", ":", "print(", "'Erwachsen'"]
      },
      {
        id: "code-bedingungen-5",
        step: 6,
        title: "if-elif für Temperatur-Klassifikation",
        description: "Klassifiziere die Temperatur als Kalt, Mild oder Warm.",
        blocks: [{
          type: "code",
          content: "temp = 25\n# Dein Code hier"
        }],
        showHints: false,
        path: "/drills/bedingungen/6",
        courseId: "python-drills",
        prompt: "Variable temp hat Wert 25. Nutze if/elif/else: Wenn temp < 10 gib 'Kalt' aus. Wenn temp <= 25 gib 'Mild' aus. Sonst gib 'Warm' aus. Gib das Ergebnis in der Konsole aus.",
        starterCode: "temp = 25\n# Dein Code hier",
        solutionString: "Mild",
        solutionCode: ["if ", "10", "elif ", "<=", ":", "print(", "'Mild'"]
      },
      {
        id: "code-bedingungen-6",
        step: 7,
        title: "Positiv oder Negativ",
        description: "Prüfe ob eine Zahl positiv oder negativ ist.",
        blocks: [{
          type: "code",
          content: "zahl = -5\n# Prüfe ob positiv oder negativ"
        }],
        showHints: false,
        path: "/drills/bedingungen/7",
        courseId: "python-drills",
        prompt: "Variable zahl ist -5. Wenn zahl >= 0, gib 'Positiv' aus. Sonst gib 'Negativ' aus.",
        starterCode: "zahl = -5\n# Prüfe ob positiv oder negativ",
        solutionString: "Negativ",
        solutionCode: ["if ", "zahl", ">=", "0", ":", "else", "print(", "'Negativ'"]
      },
      {
        id: "code-bedingungen-7",
        step: 8,
        title: "Geschwindigkeitskontrolle",
        description: "Bewerte die Geschwindigkeit.",
        blocks: [{
          type: "code",
          content: "speed = 65\n# Bewerte die Geschwindigkeit"
        }],
        showHints: false,
        path: "/drills/bedingungen/8",
        courseId: "python-drills",
        prompt: "Variable speed ist 65. Wenn speed < 50 gib 'Langsam' aus. Wenn speed <= 80 gib 'Normal' aus. Sonst gib 'Schnell' aus.",
        starterCode: "speed = 65\n# Bewerte die Geschwindigkeit",
        solutionString: "Normal",
        solutionCode: ["if ", "speed", "<", "50", "elif", "<=", "80", "else", "print(", "'Normal'"]
      },
      {
        id: "code-bedingungen-8",
        step: 9,
        title: "Altersgruppe bestimmen",
        description: "Bestimme die Altersgruppe.",
        blocks: [{
          type: "code",
          content: "lebensjahre = 15\n# Bestimme die Altersgruppe"
        }],
        showHints: false,
        path: "/drills/bedingungen/9",
        courseId: "python-drills",
        prompt: "Variable lebensjahre ist 15. Wenn lebensjahre < 13 gib 'Kind' aus. Wenn lebensjahre < 18 gib 'Jugendlich' aus. Sonst gib 'Erwachsen' aus.",
        starterCode: "lebensjahre = 15\n# Bestimme die Altersgruppe",
        solutionString: "Jugendlich",
        solutionCode: ["if ", "lebensjahre", "<", "13", "elif", "<", "18", "else", "print(", "'Jugendlich'"]
      },
      {
        id: "code-bedingungen-9",
        step: 10,
        title: "Rabattstufe ermitteln",
        description: "Ermittle die Rabattstufe basierend auf der Menge.",
        blocks: [{
          type: "code",
          content: "menge = 25\n# Ermittle die Rabattstufe"
        }],
        showHints: false,
        path: "/drills/bedingungen/10",
        courseId: "python-drills",
        prompt: "Variable menge ist 25. Wenn menge < 10 gib 'Kein Rabatt' aus. Wenn menge < 50 gib '5% Rabatt' aus. Sonst gib '10% Rabatt' aus. WICHTIG: Achte auf Leerzeichen in den Texten!",
        starterCode: "menge = 25\n# Ermittle die Rabattstufe",
        solutionString: "5% Rabatt",
        solutionCode: ["if ", "menge", "<", "10", "elif", "<", "50", "else", "print(", "'5% Rabatt'"],
        hint: "Beachte Leerzeichen: 'Kein Rabatt', '5% Rabatt', '10% Rabatt'"
      },
      {
        id: "code-bedingungen-10",
        step: 11,
        title: "Gleichheit prüfen",
        description: "Prüfe ob zwei Zahlen gleich sind.",
        blocks: [{
          type: "code",
          content: "a = 10\nb = 10\n# Prüfe ob a und b gleich sind"
        }],
        showHints: false,
        path: "/drills/bedingungen/11",
        courseId: "python-drills",
        prompt: "Variablen a und b sind beide 10. Wenn a == b gib 'Gleich' aus. Sonst gib 'Unterschiedlich' aus.",
        starterCode: "a = 10\nb = 10\n# Prüfe ob a und b gleich sind",
        solutionString: "Gleich",
        solutionCode: ["if ", "a", "==", "b", ":", "else", "print(", "'Gleich'"]
      },
      {
        id: "code-bedingungen-11",
        step: 12,
        title: "Wassertemperatur",
        description: "Bewerte die Wassertemperatur.",
        blocks: [{
          type: "code",
          content: "wasser = 85\n# Bewerte die Wassertemperatur"
        }],
        showHints: false,
        path: "/drills/bedingungen/12",
        courseId: "python-drills",
        prompt: "Variable wasser ist 85. Wenn wasser < 50 gib 'Kalt' aus. Wenn wasser < 80 gib 'Warm' aus. Sonst gib 'Heiß' aus.",
        starterCode: "wasser = 85\n# Bewerte die Wassertemperatur",
        solutionString: "Heiß",
        solutionCode: ["if ", "wasser", "<", "50", "elif", "<", "80", "else", "print(", "'Heiß'"]
      },
      {
        id: "code-bedingungen-12",
        step: 13,
        title: "Prüfungsergebnis",
        description: "Bewerte das Prüfungsergebnis.",
        blocks: [{
          type: "code",
          content: "prozent = 72\n# Bewerte das Ergebnis"
        }],
        showHints: false,
        path: "/drills/bedingungen/13",
        courseId: "python-drills",
        prompt: "Variable prozent ist 72. Wenn prozent < 50 gib 'Nicht bestanden' aus. Wenn prozent < 70 gib 'Bestanden' aus. Sonst gib 'Gut bestanden' aus. WICHTIG: Achte auf Leerzeichen!",
        starterCode: "prozent = 72\n# Bewerte das Ergebnis",
        solutionString: "Gut bestanden",
        solutionCode: ["if ", "prozent", "<", "50", "elif", "<", "70", "else", "print(", "'Gut bestanden'"],
        hint: "Beachte Leerzeichen: 'Nicht bestanden', 'Bestanden', 'Gut bestanden'"
      },
      {
        id: "code-bedingungen-13",
        step: 14,
        title: "Tageszeitengruß",
        description: "Gib einen passenden Gruß basierend auf der Stunde aus.",
        blocks: [{
          type: "code",
          content: "stunde = 14\n# Gib einen Gruß aus"
        }],
        showHints: false,
        path: "/drills/bedingungen/14",
        courseId: "python-drills",
        prompt: "Variable stunde ist 14. Wenn stunde < 12 gib 'Guten Morgen' aus. Wenn stunde < 18 gib 'Guten Tag' aus. Sonst gib 'Guten Abend' aus. WICHTIG: Achte auf Leerzeichen!",
        starterCode: "stunde = 14\n# Gib einen Gruß aus",
        solutionString: "Guten Tag",
        solutionCode: ["if ", "stunde", "<", "12", "elif", "<", "18", "else", "print(", "'Guten Tag'"],
        hint: "Beachte Leerzeichen: 'Guten Morgen', 'Guten Tag', 'Guten Abend'"
      },
      {
        id: "code-bedingungen-14",
        step: 15,
        title: "Größenvergleich",
        description: "Vergleiche zwei Zahlen.",
        blocks: [{
          type: "code",
          content: "x = 20\ny = 15\n# Vergleiche x und y"
        }],
        showHints: false,
        path: "/drills/bedingungen/15",
        courseId: "python-drills",
        prompt: "Variablen x ist 20 und y ist 15. Wenn x > y gib 'x ist größer' aus. Wenn x < y gib 'y ist größer' aus. Sonst gib 'Gleich groß' aus. WICHTIG: Achte auf Leerzeichen!",
        starterCode: "x = 20\ny = 15\n# Vergleiche x und y",
        solutionString: "x ist größer",
        solutionCode: ["if ", "x", ">", "y", "elif", "<", "else", "print(", "'x ist größer'"],
        hint: "Beachte Leerzeichen: 'x ist größer', 'y ist größer', 'Gleich groß'"
      },
      {
        id: "code-bedingungen-15",
        step: 16,
        title: "Mindestens 18",
        description: "Prüfe ob das Alter mindestens 18 ist.",
        blocks: [{
          type: "code",
          content: "jahre = 21\n# Prüfe das Alter"
        }],
        showHints: false,
        path: "/drills/bedingungen/16",
        courseId: "python-drills",
        prompt: "Variable jahre ist 21. Wenn jahre >= 18 gib 'Volljährig' aus. Sonst gib 'Minderjährig' aus.",
        starterCode: "jahre = 21\n# Prüfe das Alter",
        solutionString: "Volljährig",
        solutionCode: ["if ", "jahre", ">=", "18", ":", "else", "print(", "'Volljährig'"]
      }
    ]
  }
];