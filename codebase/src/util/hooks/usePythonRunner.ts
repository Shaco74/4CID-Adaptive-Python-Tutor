import { useState, useEffect, useRef } from "react";
import { useScript } from "usehooks-ts"; // Hilft beim dynamischen Laden von Scripts

const PYODIDE_VERSION = "0.27.0";

/**
 * Custom hook to load and manage a Pyodide instance.
 *
 * This hook loads the Pyodide JavaScript library from a CDN and initializes
 * a Pyodide instance when the script is ready. It returns the Pyodide instance
 * for use in other parts of the application.
 *
 * @returns {Object} An object containing the Pyodide instance and loading state.
 * @returns {any} pyodide - The Pyodide instance.
 * @returns {boolean} isLoading - Whether Pyodide is currently loading.
 * @returns {string|null} error - Error message if loading failed.
 *
 * @example
 * const { pyodide, isLoading, error } = usePythonRunner();
 * if (pyodide) {
 *   // Use the pyodide instance
 * }
 */
export default function usePythonRunner() {
  const [pyodide, setPyodide] = useState<any>(null); // Speichert die Pyodide-Instanz
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false); // Prevent double loading

  const pyodideScriptStatus = useScript(
    `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
  );

  useEffect(() => {
    // Log script status for debugging
    console.log(`[usePythonRunner] Script status: ${pyodideScriptStatus}`);

    if (pyodideScriptStatus === "error") {
      console.error("[usePythonRunner] Failed to load Pyodide script from CDN");
      setError("Failed to load Python interpreter script");
      setIsLoading(false);
      return;
    }
  }, [pyodideScriptStatus]);

  useEffect(() => {
    // Pyodide laden, sobald das Script bereit ist
    if (pyodideScriptStatus === "ready" && !pyodide && !isLoadingRef.current) {
      isLoadingRef.current = true;
      console.log("[usePythonRunner] Script ready, initializing Pyodide...");

      (async () => {
        try {
          // Check if loadPyodide is available
          if (typeof (globalThis as any).loadPyodide !== "function") {
            throw new Error("loadPyodide function not found on globalThis");
          }

          console.log("[usePythonRunner] Calling loadPyodide...");
          const loadedPyodide = await (globalThis as any).loadPyodide({
            indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
          });

          console.log("[usePythonRunner] Pyodide loaded successfully");
          setPyodide(loadedPyodide);
          setIsLoading(false);
          setError(null);
        } catch (err) {
          console.error("[usePythonRunner] Error loading Pyodide:", err);
          setError(err instanceof Error ? err.message : "Unknown error loading Pyodide");
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      })();
    }
  }, [pyodideScriptStatus, pyodide]);

  return { pyodide, isLoading, error };
}
