import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';

type CodeEditorProps = {
  starterCode: string;
  onReset: () => void;
};

export default function CodeEditor({ starterCode, onReset }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  useEffect(() => {
    const loadPyodide = async () => {
      if (!pyodideRef.current) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          const pyodide = await (window as any).loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
          });
          pyodideRef.current = pyodide;
        };
      }
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) {
      setOutput('Error: Python runtime is still loading. Please wait...');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');

    try {
      const pyodide = pyodideRef.current;

      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      pyodide.runPython(code);

      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');

      if (stderr) {
        setOutput(`Error:\n${stderr}`);
      } else if (stdout) {
        setOutput(`Output:\n${stdout}`);
      } else {
        setOutput('Code executed successfully (no output)');
      }
    } catch (error: any) {
      setOutput(`Error:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    setOutput('');
    onReset();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-300">Python Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-950">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>

      <div className="h-48 bg-gray-900 border-t border-gray-800 overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-800">
          <h4 className="text-sm font-semibold text-gray-300">Console Output</h4>
        </div>
        <div className="px-4 py-3">
          <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
            {output || 'No output yet. Click "Run" to execute your code.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
