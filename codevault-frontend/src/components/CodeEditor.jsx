import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode } from '../utils/api';

const CodeEditor = ({ initialCode = '', language = 'PYTHON', onCodeChange }) => {
    const [code, setCode] = useState(initialCode);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [executionStats, setExecutionStats] = useState(null);

    // Language options matching backend
    const languageOptions = [
        { value: 'PYTHON', label: 'Python', monacoLang: 'python' },
        { value: 'JAVA', label: 'Java', monacoLang: 'java' },
        { value: 'CPP', label: 'C++', monacoLang: 'cpp' },
        { value: 'JAVASCRIPT', label: 'JavaScript', monacoLang: 'javascript' }
    ];

    // Default code templates for each language
    const codeTemplates = {
        PYTHON: '# Write your Python code here\nprint("Hello, World!")',
        JAVA: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        CPP: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
        JAVASCRIPT: '// Write your JavaScript code here\nconsole.log("Hello, World!");'
    };

    // Update code when initialCode prop changes
    useEffect(() => {
        if (initialCode) {
            setCode(initialCode);
        }
    }, [initialCode]);

    // Update language when prop changes
    useEffect(() => {
        if (language) {
            setSelectedLanguage(language);
        }
    }, [language]);

    // Get Monaco language from backend language
    const getMonacoLanguage = () => {
        const lang = languageOptions.find(l => l.value === selectedLanguage);
        return lang ? lang.monacoLang : 'python';
    };

    // Handle code change in editor
    const handleCodeChange = (value) => {
        setCode(value || '');
        if (onCodeChange) {
            onCodeChange(value || '');
        }
    };

    // Handle language change
    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);

        // If code is empty or matches old template, load new template
        const currentTemplate = codeTemplates[selectedLanguage];
        if (!code || code === currentTemplate) {
            const newTemplate = codeTemplates[newLanguage];
            setCode(newTemplate);
            if (onCodeChange) {
                onCodeChange(newTemplate);
            }
        }
    };

    // Handle code execution
    const handleRunCode = async () => {
        if (!code.trim()) {
            setError('Please write some code first');
            return;
        }

        setLoading(true);
        setOutput('');
        setError('');
        setExecutionStats(null);

        try {
            const response = await executeCode({
                language: selectedLanguage,
                code: code,
                input: input
            });

            // Backend returns status as execution status (Accepted, Time Limit Exceeded, etc.)
            // Check if there's compile output or error
            if (response.data.compile_output) {
                setError(`Compilation Error:\n${response.data.compile_output}`);
            } else if (response.data.error && response.data.error.trim()) {
                setError(response.data.error);
            } else {
                // Successful execution
                setOutput(response.data.output || 'No output');

                // Store execution statistics
                if (response.data.time || response.data.memory) {
                    setExecutionStats({
                        time: response.data.time,
                        memory: response.data.memory
                    });
                }
            }
        } catch (err) {
            console.error('Execution error:', err);
            setError(err.response?.data?.error || 'Failed to execute code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Header with Language Selector */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Code Editor</h3>
                <div className="flex items-center gap-4">
                    <label className="text-gray-300 font-medium">Language:</label>
                    <select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {languageOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Monaco Code Editor */}
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-700">
                <Editor
                    height="400px"
                    language={getMonacoLanguage()}
                    value={code}
                    onChange={handleCodeChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on'
                    }}
                />
            </div>

            {/* Input Section */}
            <div className="mb-4">
                <label className="block text-gray-300 font-medium mb-2">
                    Input (stdin):
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter test input here..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="4"
                    disabled={loading}
                />
            </div>

            {/* Run Button */}
            <div className="mb-4">
                <button
                    onClick={handleRunCode}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 active:scale-95'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Executing...
                        </span>
                    ) : (
                        'Run Code'
                    )}
                </button>
            </div>

            {/* Execution Statistics */}
            {executionStats && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex gap-6 text-sm text-gray-300">
                        {executionStats.time && (
                            <div>
                                <span className="font-medium">Execution Time:</span>{' '}
                                <span className="text-green-400">{executionStats.time}s</span>
                            </div>
                        )}
                        {executionStats.memory && (
                            <div>
                                <span className="font-medium">Memory Used:</span>{' '}
                                <span className="text-blue-400">{executionStats.memory} KB</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Output Section */}
            {output && (
                <div className="mb-4">
                    <label className="block text-gray-300 font-medium mb-2">
                        Output:
                    </label>
                    <div className="bg-gray-900 text-green-400 px-4 py-3 rounded-lg border border-gray-700 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {output}
                    </div>
                </div>
            )}

            {/* Error Section */}
            {error && (
                <div className="mb-4">
                    <label className="block text-red-400 font-medium mb-2">
                        Error:
                    </label>
                    <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-lg border border-red-700 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;
