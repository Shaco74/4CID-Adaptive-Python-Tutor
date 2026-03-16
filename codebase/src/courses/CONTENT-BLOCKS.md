# Content Blocks - Formatierungsguide

Dokumentation für die Erstellung von Kursinhalten mit den verfügbaren Block-Typen.

## Block-Typen Übersicht

| Typ | Verwendung |
|-----|------------|
| `text` | Fließtext, Erklärungen, Überschriften |
| `code` | Python-Codebeispiele (Monaco Editor) |
| `hint` | Admonitions/Hinweise (info, warning, error, success) |
| `task` | Die Aufgabenstellung für den User |

---

## 1. Text-Block

Für Fließtext und strukturierte Erklärungen. Unterstützt Markdown.

```typescript
{
  type: "text",
  content: "Dein **Markdown** Text hier"
}
```

### Markdown-Unterstützung

| Element | Syntax | Ergebnis |
|---------|--------|----------|
| Überschrift H1 | `# Titel` | fontSize: 2xl, bold |
| Überschrift H2 | `## Titel` | fontSize: xl, semibold |
| Überschrift H3 | `### Titel` | fontSize: lg, semibold |
| Fett | `**text**` | **text** |
| Inline-Code | `` `code` `` | grauer Hintergrund |
| Liste | `- Item` | Bullet-Point Liste |

### Best Practice: Strukturierte Erklärungen

```typescript
// Überschrift + Bullet-Points in einem Text-Block
{
  type: "text",
  content:
    "## Strings vs. Zahlen\n\n" +
    "In Python gibt es zwei grundlegende Datentypen:\n\n" +
    "- **Strings (Text)** → Immer MIT Anführungszeichen\n" +
    "- **Zahlen (Numbers)** → Immer OHNE Anführungszeichen"
}
```

---

## 2. Code-Block

Zeigt Python-Code im Monaco Editor (read-only, Syntax-Highlighting).

```typescript
{
  type: "code",
  title: "So funktioniert print()",  // Optional: Titel über dem Editor
  language: "python",
  content: `# Kommentar
print("Hello World")

# Mehrere Zeilen möglich
x = 42`
}
```

### Best Practice

- **Kommentare nutzen** um Code zu erklären
- **Kurz halten** - nur relevanten Code zeigen
- **Titel vergeben** wenn der Zweck nicht offensichtlich ist

---

## 3. Hint-Block (Admonitions)

Farbige Hinweisboxen für wichtige Informationen.

```typescript
{
  type: "hint",
  severity: "info",     // info | warning | error | success
  content: "**Titel hier**\n\nErklärungstext..."
}
```

### Severity-Typen

| Severity | Farbe | Verwendung |
|----------|-------|------------|
| `info` | Blau | Zusätzliche Informationen, Tipps |
| `warning` | Orange | Häufige Fehler, Achtung |
| `error` | Rot | Kritische Fehler, Don'ts |
| `success` | Grün | Best Practices, Erfolgsmeldungen |

### Best Practice

- **Sparsam einsetzen** - max. 2 Hints pro Step
- **Titel in Bold** am Anfang des Contents
- Für wichtige Warnungen und Tipps, nicht für normale Erklärungen

```typescript
// Gut: Eine wichtige Warnung
{
  type: "hint",
  severity: "warning",
  content: "**Ohne Anführungszeichen = Fehler!**\n\nPython sucht sonst nach einem Befehl."
}

// Schlecht: Zu viele Hints hintereinander
// → Besser: Text-Block mit ## Überschriften nutzen
```

---

## 4. Task-Block

Die Aufgabenstellung. Sollte pro Step genau einmal vorkommen.

```typescript
{
  type: "task",
  content: "Gib den Text `Hello World` in der Konsole aus."
}
```

### Best Practice

- **Klar und präzise** formulieren
- **Inline-Code** für erwartete Werte: `` `Hello World` ``
- **Eine Aufgabe** pro Task-Block

---

## Empfohlene Step-Struktur

Ein gut strukturierter Step folgt diesem Muster:

```typescript
blocks: [
  // 1. Einleitung (kurz)
  {
    type: "text",
    content: "Willkommen! In diesem Schritt lernst du..."
  },

  // 2. Theorie mit Überschriften (statt vieler Hints!)
  {
    type: "text",
    content: "## Konzept A\n\nErklärung...\n\n## Konzept B\n\nErklärung..."
  },

  // 3. Code-Beispiel
  {
    type: "code",
    title: "Beispiel",
    language: "python",
    content: `# Kommentierter Code...`
  },

  // 4. Optional: EIN wichtiger Hint
  {
    type: "hint",
    severity: "warning",
    content: "**Häufiger Fehler!**\n\nErklärung..."
  },

  // 5. Die Aufgabe
  {
    type: "task",
    content: "Deine Aufgabe: ..."
  },

  // 6. Optional: Hilfe-Hint
  {
    type: "hint",
    severity: "info",
    content: "**Tipp:** So gehst du vor..."
  }
]
```

---

## Anti-Patterns

### ❌ Zu viele Hints

```typescript
// SCHLECHT: 4 Hints hintereinander
{ type: "hint", severity: "info", content: "Was ist X?" },
{ type: "hint", severity: "success", content: "Warum X?" },
{ type: "hint", severity: "warning", content: "Achtung bei X!" },
{ type: "hint", severity: "info", content: "Mehr über X..." },
```

### ✅ Besser: Text-Block mit Struktur

```typescript
// GUT: Ein strukturierter Text-Block
{
  type: "text",
  content:
    "## Was ist X?\n\nErklärung...\n\n" +
    "## Warum X?\n\nErklärung...\n\n" +
    "- Punkt 1\n- Punkt 2"
},
// Nur EINE wichtige Warnung als Hint
{
  type: "hint",
  severity: "warning",
  content: "**Achtung bei X!**\n\nDer wichtigste Hinweis..."
}
```

---

## Beispiel: Vollständiger Step

```typescript
{
  id: "bmi-calculator-step-1",
  step: 1,
  title: "Deine erste Ausgabe - Hello World",
  description: "Lerne die print() Funktion kennen.",
  blocks: [
    {
      type: "text",
      content: "Willkommen! Du lernst die **print()** Funktion kennen."
    },
    {
      type: "text",
      content:
        "## Strings vs. Zahlen\n\n" +
        "- **Strings** → MIT Anführungszeichen: `\"Hello\"`\n" +
        "- **Zahlen** → OHNE Anführungszeichen: `42`"
    },
    {
      type: "code",
      title: "So funktioniert print()",
      language: "python",
      content: `# Text ausgeben
print("Hello World")

# Zahlen ausgeben
print(42)`
    },
    {
      type: "hint",
      severity: "warning",
      content: "**Ohne Anführungszeichen = Fehler!**\n\nPython erkennt Text nur mit `\"...\"`"
    },
    {
      type: "task",
      content: "Gib den Text `Hello World` in der Konsole aus."
    }
  ],
  // ... rest of step config
}
```
