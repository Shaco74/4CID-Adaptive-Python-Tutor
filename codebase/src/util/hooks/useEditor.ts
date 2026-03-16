import { useRef, useState } from "react";
import { registerStaticPythonAutocomplete } from "@/util/staticPythonAutocomplete";

// Define types for Monaco editor (since we might not have direct type access)
type Monaco = any;
interface IStandaloneCodeEditor {
  getModel(): any;
  getValue(): string;
  getAction(id: string): { run(): void } | undefined;
  updateOptions(options: any): void;
}

// Types for Monaco editor markers (for errors/warnings)
interface MarkerData {
  message: string;
  severity: number;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export default function useEditor() {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const [monaco, setMonaco] = useState<any>(null);

  const handleEditorMount = (editor: IStandaloneCodeEditor, monacoInstance: Monaco) => {
    // // console.log('Editor and Monaco instance mounted');
    editorRef.current = editor;
    setMonaco(monacoInstance);

    // Configure Python language features if needed
    if (monacoInstance) {
      // // console.log('Configuring Monaco for Python');

      // Configure editor options to show suggestions and documentation
      editor.updateOptions({
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: "on",
        wordBasedSuggestions: "off", // Disable word-based to prioritize our custom completions
        'hover.enabled': true,
        'hover.delay': 300,
      });

      // Configure Python language features
      monacoInstance.languages.setLanguageConfiguration('python', {
        indentationRules: {
          decreaseIndentPattern: /^(.*\*\/)?(\s*)(\}|\])|\b(elif|else)\b/,
          increaseIndentPattern: /^.*(\{|\[|\b(if|elif|else|for|while|def|class)\b.*:)$/
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ]
      });

      // Register static Python autocomplete
      registerStaticPythonAutocomplete(monacoInstance);
    }
  };

  const getFormattedCode = () => {
    const editorInstance = editorRef.current;
    if (editorInstance) {
      // Try to format the code (this might not work for Python)
      try {
        const formatAction = editorInstance.getAction('editor.action.formatDocument');
        if (formatAction) formatAction.run();
      } catch (e) {
        // // console.warn("Formatting not available", e);
      }
      return editorInstance.getValue();
    }
    return "";
  };

  const setModelMarkers = (markers: MarkerData[]) => {
    if (!monaco || !editorRef.current) {
      // // console.warn('Cannot set markers: monaco or editor not initialized');
      return;
    }
    
    const model = editorRef.current.getModel();
    if (!model) {
      // // console.warn('Cannot set markers: editor model not available');
      return;
    }

    // // console.log('Setting markers on model:', markers);
    
    // Clear any existing markers first
    try {
      monaco.editor.setModelMarkers(model, 'python-linter', []);
      
      // Only set new markers if we have any
      if (markers.length > 0) {
        // Ensure all markers have the severity property set
        const fixedMarkers = markers.map(marker => ({
          ...marker,
          severity: 8 // Explicit Error severity
        }));
        
        // Apply the markers
        monaco.editor.setModelMarkers(model, 'python-linter', fixedMarkers);
        // // console.log('Set', markers.length, 'markers in editor');
      } else {
        // // console.log('No errors found, editor markers cleared');
      }
    } catch (error) {
      console.error('Error setting markers:', error);
    }
  };

  return { 
    editorRef, 
    handleEditorMount, 
    getFormattedCode,
    setModelMarkers 
  };
}
