/**
 * Static Python Autocomplete
 * Provides basic autocomplete for Python built-in types without requiring a language server
 */

type Monaco = any;

// Python built-in type methods with descriptions
const PYTHON_COMPLETIONS = {
  list: [
    { name: 'append', detail: 'list.append(item)', doc: 'Fügt ein Element am Ende der Liste hinzu' },
    { name: 'extend', detail: 'list.extend(iterable)', doc: 'Erweitert die Liste durch Anhängen von Elementen aus einem Iterable' },
    { name: 'insert', detail: 'list.insert(i, item)', doc: 'Fügt ein Element an Position i ein' },
    { name: 'remove', detail: 'list.remove(item)', doc: 'Entfernt das erste Vorkommen des Elements' },
    { name: 'pop', detail: 'list.pop([i])', doc: 'Entfernt und gibt das Element an Index i zurück (Standard: letztes Element)' },
    { name: 'clear', detail: 'list.clear()', doc: 'Entfernt alle Elemente aus der Liste' },
    { name: 'index', detail: 'list.index(item)', doc: 'Gibt den Index des ersten Vorkommens zurück' },
    { name: 'count', detail: 'list.count(item)', doc: 'Gibt die Anzahl der Vorkommen des Elements zurück' },
    { name: 'sort', detail: 'list.sort()', doc: 'Sortiert die Liste an Ort und Stelle' },
    { name: 'reverse', detail: 'list.reverse()', doc: 'Kehrt die Reihenfolge der Liste um' },
    { name: 'copy', detail: 'list.copy()', doc: 'Gibt eine flache Kopie der Liste zurück' },
  ],
  dict: [
    { name: 'keys', detail: 'dict.keys()', doc: 'Gibt eine Ansicht aller Schlüssel zurück' },
    { name: 'values', detail: 'dict.values()', doc: 'Gibt eine Ansicht aller Werte zurück' },
    { name: 'items', detail: 'dict.items()', doc: 'Gibt eine Ansicht aller Schlüssel-Wert-Paare zurück' },
    { name: 'get', detail: 'dict.get(key, default)', doc: 'Gibt den Wert für den Schlüssel zurück, oder default falls nicht gefunden' },
    { name: 'pop', detail: 'dict.pop(key, default)', doc: 'Entfernt den Schlüssel und gibt den Wert zurück, oder default' },
    { name: 'popitem', detail: 'dict.popitem()', doc: 'Entfernt und gibt ein (Schlüssel, Wert)-Paar zurück' },
    { name: 'clear', detail: 'dict.clear()', doc: 'Entfernt alle Einträge aus dem Dictionary' },
    { name: 'update', detail: 'dict.update(other)', doc: 'Aktualisiert das Dictionary mit Schlüssel-Wert-Paaren von other' },
    { name: 'setdefault', detail: 'dict.setdefault(key, default)', doc: 'Gibt den Wert für den Schlüssel zurück, setzt ihn auf default falls nicht gefunden' },
    { name: 'copy', detail: 'dict.copy()', doc: 'Gibt eine flache Kopie des Dictionarys zurück' },
  ],
  str: [
    { name: 'upper', detail: 'str.upper()', doc: 'Gibt den String in Großbuchstaben zurück' },
    { name: 'lower', detail: 'str.lower()', doc: 'Gibt den String in Kleinbuchstaben zurück' },
    { name: 'capitalize', detail: 'str.capitalize()', doc: 'Gibt den String mit großem Anfangsbuchstaben zurück' },
    { name: 'title', detail: 'str.title()', doc: 'Gibt den String als Titel formatiert zurück' },
    { name: 'strip', detail: 'str.strip([chars])', doc: 'Entfernt Leerzeichen am Anfang und Ende des Strings' },
    { name: 'lstrip', detail: 'str.lstrip([chars])', doc: 'Entfernt Leerzeichen am Anfang des Strings' },
    { name: 'rstrip', detail: 'str.rstrip([chars])', doc: 'Entfernt Leerzeichen am Ende des Strings' },
    { name: 'split', detail: 'str.split([sep])', doc: 'Teilt den String in eine Liste von Wörtern auf' },
    { name: 'join', detail: 'str.join(iterable)', doc: 'Verbindet Elemente eines Iterables mit dem String als Trennzeichen' },
    { name: 'replace', detail: 'str.replace(old, new)', doc: 'Ersetzt alle Vorkommen von old durch new' },
    { name: 'find', detail: 'str.find(sub)', doc: 'Gibt den niedrigsten Index zurück, an dem der Substring gefunden wurde' },
    { name: 'index', detail: 'str.index(sub)', doc: 'Gibt den niedrigsten Index zurück, an dem der Substring gefunden wurde (Fehler falls nicht gefunden)' },
    { name: 'startswith', detail: 'str.startswith(prefix)', doc: 'Gibt True zurück, wenn der String mit dem Präfix beginnt' },
    { name: 'endswith', detail: 'str.endswith(suffix)', doc: 'Gibt True zurück, wenn der String mit dem Suffix endet' },
    { name: 'isdigit', detail: 'str.isdigit()', doc: 'Gibt True zurück, wenn alle Zeichen Ziffern sind' },
    { name: 'isalpha', detail: 'str.isalpha()', doc: 'Gibt True zurück, wenn alle Zeichen Buchstaben sind' },
    { name: 'isalnum', detail: 'str.isalnum()', doc: 'Gibt True zurück, wenn alle Zeichen alphanumerisch sind' },
    { name: 'format', detail: 'str.format(*args, **kwargs)', doc: 'Formatiert den String mit den angegebenen Argumenten' },
  ],
  set: [
    { name: 'add', detail: 'set.add(item)', doc: 'Fügt ein Element zum Set hinzu' },
    { name: 'remove', detail: 'set.remove(item)', doc: 'Entfernt ein Element aus dem Set (Fehler falls nicht gefunden)' },
    { name: 'discard', detail: 'set.discard(item)', doc: 'Entfernt ein Element aus dem Set, falls vorhanden' },
    { name: 'pop', detail: 'set.pop()', doc: 'Entfernt und gibt ein beliebiges Element zurück' },
    { name: 'clear', detail: 'set.clear()', doc: 'Entfernt alle Elemente aus dem Set' },
    { name: 'union', detail: 'set.union(other)', doc: 'Gibt die Vereinigung der Sets zurück' },
    { name: 'intersection', detail: 'set.intersection(other)', doc: 'Gibt den Durchschnitt der Sets zurück' },
    { name: 'difference', detail: 'set.difference(other)', doc: 'Gibt die Differenz der Sets zurück' },
    { name: 'update', detail: 'set.update(other)', doc: 'Aktualisiert das Set mit der Vereinigung von sich selbst und other' },
    { name: 'copy', detail: 'set.copy()', doc: 'Gibt eine flache Kopie des Sets zurück' },
  ],
};

// Python keywords
const PYTHON_KEYWORDS = [
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield'
];

// Python built-in functions
const PYTHON_BUILTINS = [
  { name: 'print', detail: 'print(*args)', doc: 'Gibt Werte in der Konsole aus' },
  { name: 'len', detail: 'len(obj)', doc: 'Gibt die Länge einer Liste oder eines Strings zurück' },
  { name: 'range', detail: 'range(start, stop, step)', doc: 'Gibt eine Zahlensequenz zurück. Starte bei start, ende vor stop, mit Schrittweite step' },
  { name: 'input', detail: 'input(prompt)', doc: 'Liest einen String von der Eingabe' },
  { name: 'int', detail: 'int(x)', doc: 'Konvertiert in eine Ganzzahl' },
  { name: 'float', detail: 'float(x)', doc: 'Konvertiert in eine Fließkommazahl' },
  { name: 'str', detail: 'str(x)', doc: 'Konvertiert eine Zahl in einen String. Das ist wichtig für die Ausgabe von Zahlen mit print()' },
  { name: 'bool', detail: 'bool(x)', doc: 'Konvertiert in einen Wahrheitswert' },
  { name: 'list', detail: 'list(iterable)', doc: 'Erstellt eine Liste aus einem Iterable' },
  { name: 'dict', detail: 'dict(**kwargs)', doc: 'Erstellt ein Dictionary' },
  { name: 'set', detail: 'set(iterable)', doc: 'Erstellt ein Set aus einem Iterable' },
  { name: 'tuple', detail: 'tuple(iterable)', doc: 'Erstellt ein Tupel aus einem Iterable' },
  { name: 'sum', detail: 'sum(iterable)', doc: 'Gibt die Summe eines Iterables zurück' },
  { name: 'min', detail: 'min(iterable)', doc: 'Gibt den kleinsten Wert zurück' },
  { name: 'max', detail: 'max(iterable)', doc: 'Gibt den größten Wert zurück' },
  { name: 'sorted', detail: 'sorted(iterable)', doc: 'Gibt eine sortierte Liste zurück' },
  { name: 'enumerate', detail: 'enumerate(iterable)', doc: 'Gibt ein Enumerate-Objekt zurück' },
  { name: 'zip', detail: 'zip(*iterables)', doc: 'Gibt ein Zip-Objekt zurück' },
  { name: 'map', detail: 'map(function, iterable)', doc: 'Wendet eine Funktion auf jedes Element an' },
  { name: 'filter', detail: 'filter(function, iterable)', doc: 'Filtert Elemente nach einer Funktion' },
  { name: 'abs', detail: 'abs(x)', doc: 'Gibt den Absolutwert zurück' },
  { name: 'round', detail: 'round(x, n)', doc: 'Rundet auf n Dezimalstellen' },
  { name: 'type', detail: 'type(obj)', doc: 'Gibt den Typ eines Objekts zurück' },
  { name: 'isinstance', detail: 'isinstance(obj, type)', doc: 'Prüft, ob ein Objekt eine Instanz eines Typs ist' },
  { name: 'open', detail: 'open(file, mode)', doc: 'Öffnet eine Datei' },
];

/**
 * Extract user-defined variables from code
 * Returns array of {name, type} objects
 */
function extractVariables(code: string): Array<{name: string, type: string | null}> {
  const variables: Map<string, string | null> = new Map();
  const lines = code.split('\n');

  for (const line of lines) {
    // Match variable assignments: var = value
    // Supports: x = 5, name = "hello", items = [], data = {}
    const assignmentMatch = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (assignmentMatch) {
      const varName = assignmentMatch[1];
      // Skip if it's a keyword or builtin
      if (PYTHON_KEYWORDS.includes(varName) || PYTHON_BUILTINS.some(b => b.name === varName)) {
        continue;
      }
      const type = inferTypeFromLine(line, varName);
      variables.set(varName, type);
    }

    // Match for loop variables: for var in ...
    const forMatch = line.match(/^\s*for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in/);
    if (forMatch) {
      variables.set(forMatch[1], null);
    }

    // Match multiple assignment in for: for i, item in enumerate(...)
    const forTupleMatch = line.match(/^\s*for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+in/);
    if (forTupleMatch) {
      variables.set(forTupleMatch[1], null);
      variables.set(forTupleMatch[2], null);
    }
  }

  return Array.from(variables.entries()).map(([name, type]) => ({ name, type }));
}

/**
 * Infer type from a single line for a specific variable
 */
function inferTypeFromLine(line: string, varName: string): string | null {
  // Check for list literal: var = [...]
  if (line.match(new RegExp(`${varName}\\s*=\\s*\\[`))) {
    return 'list';
  }
  // Check for dict literal: var = {...} (with colon inside)
  if (line.match(new RegExp(`${varName}\\s*=\\s*\\{.*:.*\\}`))) {
    return 'dict';
  }
  // Check for empty dict: var = {}
  if (line.match(new RegExp(`${varName}\\s*=\\s*\\{\\s*\\}`))) {
    return 'dict';
  }
  // Check for string literal: var = "..." or var = '...'
  if (line.match(new RegExp(`${varName}\\s*=\\s*["']`))) {
    return 'str';
  }
  // Check for f-string: var = f"..."
  if (line.match(new RegExp(`${varName}\\s*=\\s*f["']`))) {
    return 'str';
  }
  // Check for set(): var = set(...)
  if (line.match(new RegExp(`${varName}\\s*=\\s*set\\(`))) {
    return 'set';
  }
  // Check for list/dict/str constructors
  const constructorMatch = line.match(new RegExp(`${varName}\\s*=\\s*(list|dict|set|str)\\(`));
  if (constructorMatch) {
    return constructorMatch[1];
  }
  // Check for number (int or float)
  if (line.match(new RegExp(`${varName}\\s*=\\s*-?\\d+\\.\\d+`))) {
    return 'float';
  }
  if (line.match(new RegExp(`${varName}\\s*=\\s*-?\\d+\\s*$`)) ||
      line.match(new RegExp(`${varName}\\s*=\\s*-?\\d+\\s*#`))) {
    return 'int';
  }
  return null;
}

/**
 * Simple type inference based on patterns
 */
function inferType(line: string, varName: string): string | null {
  // Remove whitespace
  line = line.trim();

  // Check for list literal: var = [...]
  if (line.match(new RegExp(`${varName}\\s*=\\s*\\[`))) {
    return 'list';
  }

  // Check for dict literal: var = {...}
  if (line.match(new RegExp(`${varName}\\s*=\\s*\\{`))) {
    return 'dict';
  }

  // Check for string literal: var = "..." or var = '...'
  if (line.match(new RegExp(`${varName}\\s*=\\s*["']`))) {
    return 'str';
  }

  // Check for set literal: var = {...} with set() or {1, 2}
  if (line.match(new RegExp(`${varName}\\s*=\\s*set\\(`))) {
    return 'set';
  }

  // Check for list(), dict(), set() constructors
  const constructorMatch = line.match(new RegExp(`${varName}\\s*=\\s*(list|dict|set|str)\\(`));
  if (constructorMatch) {
    return constructorMatch[1];
  }

  return null;
}

/**
 * Register hover provider to show documentation when hovering over methods
 */
function registerHoverProvider(monaco: Monaco): void {
  monaco.languages.registerHoverProvider('python', {
    provideHover: (model: any, position: any) => {
      // Get the word at the current position
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoveredWord = word.word;

      // Check if it's a method from our completions
      for (const methods of Object.values(PYTHON_COMPLETIONS)) {
        const method = methods.find((m) => m.name === hoveredWord);
        if (method) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${method.detail}**` },
              { value: method.doc }
            ]
          };
        }
      }

      // Check if it's a built-in function
      const builtin = PYTHON_BUILTINS.find((b) => b.name === hoveredWord);
      if (builtin) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${builtin.detail}**` },
            { value: builtin.doc }
          ]
        };
      }

      return null;
    }
  });
}

// Track if already registered to prevent duplicate providers
let isRegistered = false;

/**
 * Register static Python autocomplete provider
 */
export function registerStaticPythonAutocomplete(monaco: Monaco): void {
  // Prevent duplicate registration (causes triple suggestions)
  if (isRegistered) {
    return;
  }
  isRegistered = true;

  // // console.log('📝 Registering static Python autocomplete');

  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.'],

    provideCompletionItems: (model: any, position: any) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const suggestions: any[] = [];

      // Extract user-defined variables from the entire code
      const fullText = model.getValue();
      const userVariables = extractVariables(fullText);

      // Check if we're after a dot (method completion)
      const dotMatch = textUntilPosition.match(/(\w+)\.$/);
      if (dotMatch) {
        const varName = dotMatch[1];

        // Try to infer type from current line or previous lines
        let inferredType: string | null = null;

        // Check current line first
        const currentLine = model.getLineContent(position.lineNumber);
        inferredType = inferType(currentLine, varName);

        // If not found, check previous lines
        if (!inferredType) {
          for (let i = position.lineNumber - 1; i >= Math.max(1, position.lineNumber - 20); i--) {
            const line = model.getLineContent(i);
            inferredType = inferType(line, varName);
            if (inferredType) break;
          }
        }

        // Provide completions based on inferred type
        if (inferredType && PYTHON_COMPLETIONS[inferredType as keyof typeof PYTHON_COMPLETIONS]) {
          const methods = PYTHON_COMPLETIONS[inferredType as keyof typeof PYTHON_COMPLETIONS];
          methods.forEach((method) => {
            suggestions.push({
              label: method.name,
              kind: monaco.languages.CompletionItemKind.Method,
              detail: method.detail,
              documentation: {
                value: method.doc,
                isTrusted: true
              },
              insertText: method.name,
            });
          });
        } else {
          // If type unknown, show all common methods
          Object.values(PYTHON_COMPLETIONS).forEach((methods) => {
            methods.forEach((method) => {
              // Avoid duplicates
              if (!suggestions.find(s => s.label === method.name)) {
                suggestions.push({
                  label: method.name,
                  kind: monaco.languages.CompletionItemKind.Method,
                  detail: method.detail,
                  documentation: {
                    value: method.doc,
                    isTrusted: true
                  },
                  insertText: method.name,
                });
              }
            });
          });
        }
      } else {
        // Not after dot - show keywords, built-in functions, and user variables
        // Only show if we're starting to type something
        const wordMatch = textUntilPosition.match(/\w+$/);
        if (wordMatch) {
          const currentWord = wordMatch[0].toLowerCase();

          // Add user-defined variables (highest priority - show first)
          userVariables.forEach((variable) => {
            // Filter by what user is typing
            if (variable.name.toLowerCase().startsWith(currentWord)) {
              const typeLabel = variable.type ? ` (${variable.type})` : '';
              suggestions.push({
                label: variable.name,
                kind: monaco.languages.CompletionItemKind.Variable,
                detail: `Variable${typeLabel}`,
                documentation: {
                  value: `Benutzerdefinierte Variable${typeLabel}`,
                  isTrusted: true
                },
                insertText: variable.name,
                sortText: '0' + variable.name, // Sort before keywords/builtins
              });
            }
          });

          // Add keywords
          PYTHON_KEYWORDS.forEach((keyword) => {
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              sortText: '1' + keyword,
            });
          });

          // Add built-in functions
          PYTHON_BUILTINS.forEach((builtin) => {
            suggestions.push({
              label: builtin.name,
              kind: monaco.languages.CompletionItemKind.Function,
              detail: builtin.detail,
              documentation: {
                value: builtin.doc,
                isTrusted: true
              },
              insertText: builtin.name,
              sortText: '1' + builtin.name,
            });
          });
        }
      }

      return { suggestions };
    },
  });

  // Register hover provider for documentation on hover
  registerHoverProvider(monaco);

  // // console.log('✅ Static Python autocomplete and hover provider registered');
}
