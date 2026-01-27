import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode, runTestCases } from '../utils/api';
import './CodeEditor.css';

const CodeEditor = ({ initialCode = '', language = 'PYTHON', onCodeChange, problemId = null, testCases = [], showLanguageSelector = true }) => {
    const [code, setCode] = useState(initialCode);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [executionStats, setExecutionStats] = useState(null);

    // Test case related states
    const [testResults, setTestResults] = useState(null);
    const [runningTests, setRunningTests] = useState(false);
    const [activeTab, setActiveTab] = useState(testCases.length > 0 ? 'testcases' : 'custom');
    const [hasTestCases, setHasTestCases] = useState(testCases.length > 0);

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

    // Update test cases availability
    useEffect(() => {
        const hasTests = testCases && testCases.length > 0;
        setHasTestCases(hasTests);
        if (hasTests) {
            setActiveTab('testcases');
        }
    }, [testCases]);

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

    // Handle running test cases (LeetCode-style)
    const handleRunTests = async () => {
        if (!code.trim()) {
            setError('Please write some code first');
            return;
        }

        if (!problemId || !hasTestCases) {
            setError('No test cases available for this problem');
            return;
        }

        setRunningTests(true);
        setTestResults(null);
        setError('');
        setOutput('');

        try {
            const response = await runTestCases(problemId, {
                language: selectedLanguage,
                code: code
            });

            setTestResults(response.data);
        } catch (err) {
            console.error('Test execution error:', err);
            setError(err.response?.data?.error || 'Failed to run tests. Please try again.');
        } finally {
            setRunningTests(false);
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
        setTestResults(null);

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
        <div className="code-editor">
            <div className="code-editor-header">
                <h3 className="code-editor-title">Code Editor</h3>
                {showLanguageSelector && (
                    <div className="code-editor-lang">
                        <label className="code-editor-label">Language:</label>
                        <select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="code-editor-select"
                            disabled={loading || runningTests}
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="code-editor-monaco">
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

            {hasTestCases && (
                <div className="code-editor-tabs">
                    <button
                        onClick={() => setActiveTab('testcases')}
                        className={`code-editor-tab ${activeTab === 'testcases' ? 'active' : ''}`}
                    >
                        Test Cases ({testCases.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`code-editor-tab ${activeTab === 'custom' ? 'active' : ''}`}
                    >
                        Custom Input
                    </button>
                </div>
            )}

            {hasTestCases && activeTab === 'testcases' && (
                <div>
                    <div className="code-editor-block">
                        <label className="code-editor-label-block">Available Test Cases:</label>
                        <div className="code-editor-testcases">
                            {testCases.map((tc, idx) => (
                                <div key={idx} className="code-editor-testcase">
                                    <div className="code-editor-testcase-inner">
                                        <div className="code-editor-testcase-title">Test Case {idx + 1}:</div>
                                        <div className="code-editor-testcase-row">
                                            <span className="code-editor-testcase-key">Input:</span>{' '}
                                            <code className="code-editor-code">{tc.input || '(empty)'}</code>
                                        </div>
                                        <div className="code-editor-testcase-row">
                                            <span className="code-editor-testcase-key">Expected:</span>{' '}
                                            <code className="code-editor-code">{tc.output}</code>
                                        </div>
                                        {tc.explanation && (
                                            <div className="code-editor-testcase-note">{tc.explanation}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleRunTests}
                        disabled={runningTests}
                        className={`code-editor-run-tests ${runningTests ? 'disabled' : ''}`}
                    >
                        {runningTests ? (
                            <span className="code-editor-run-label">
                                <svg className="code-editor-spinner" viewBox="0 0 24 24">
                                    <circle className="code-editor-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="code-editor-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Running Tests...
                            </span>
                        ) : (
                            'Run All Tests'
                        )}
                    </button>

                    {testResults && (
                        <div className="code-editor-results">
                            <div className={`code-editor-results-card ${testResults.all_passed ? 'pass' : 'fail'}`}>
                                <div className="code-editor-results-head">
                                    {testResults.all_passed ? (
                                        <>
                                            <svg className="code-editor-results-icon pass" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="code-editor-results-title pass">All Tests Passed!</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="code-editor-results-icon fail" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="code-editor-results-title fail">Tests Failed</span>
                                        </>
                                    )}
                                </div>
                                <div className="code-editor-results-summary">
                                    Passed: {testResults.passed_count}/{testResults.total_count}
                                </div>

                                <div className="code-editor-result-list">
                                    {testResults.results.map((result, idx) => (
                                        <div key={idx} className={`code-editor-result ${result.passed ? 'pass' : 'fail'}`}>
                                            <div className="code-editor-result-head">
                                                {result.passed ? (
                                                    <svg className="code-editor-result-icon pass" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="code-editor-result-icon fail" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span className={`code-editor-result-title ${result.passed ? 'pass' : 'fail'}`}>
                                                    Test Case {result.test_case}
                                                </span>
                                            </div>
                                            <div className="code-editor-result-body">
                                                <div className="code-editor-result-row">
                                                    <span className="code-editor-result-key">Input:</span>{' '}
                                                    <code className="code-editor-code">{result.input || '(empty)'}</code>
                                                </div>
                                                <div className="code-editor-result-row">
                                                    <span className="code-editor-result-key">Expected:</span>{' '}
                                                    <code className="code-editor-code">{result.expected}</code>
                                                </div>
                                                <div className={`code-editor-result-row ${result.passed ? 'pass' : 'fail'}`}>
                                                    <span className="code-editor-result-key">Actual:</span>{' '}
                                                    <code className="code-editor-code">{result.actual || '(no output)'}</code>
                                                </div>
                                                {result.error && (
                                                    <div className="code-editor-result-error">
                                                        <span className="code-editor-result-key">Error:</span> {result.error}
                                                    </div>
                                                )}
                                                {result.explanation && (
                                                    <div className="code-editor-result-note">{result.explanation}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {(!hasTestCases || activeTab === 'custom') && (
                <div>
                    <div className="code-editor-block">
                        <label className="code-editor-label-block">Input (stdin):</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter test input here..."
                            className="code-editor-textarea"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleRunCode}
                        disabled={loading}
                        className={`code-editor-run ${loading ? 'disabled' : ''}`}
                    >
                        {loading ? (
                            <span className="code-editor-run-label">
                                <svg className="code-editor-spinner" viewBox="0 0 24 24">
                                    <circle className="code-editor-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="code-editor-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Executing...
                            </span>
                        ) : (
                            'Run Code'
                        )}
                    </button>

                    {executionStats && (
                        <div className="code-editor-stats">
                            <div className="code-editor-stats-row">
                                {executionStats.time && (
                                    <div className="code-editor-stat">
                                        <span className="code-editor-stat-key">Execution Time:</span>{' '}
                                        <span className="code-editor-stat-value time">{executionStats.time}s</span>
                                    </div>
                                )}
                                {executionStats.memory && (
                                    <div className="code-editor-stat">
                                        <span className="code-editor-stat-key">Memory Used:</span>{' '}
                                        <span className="code-editor-stat-value memory">{executionStats.memory} KB</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {output && (
                        <div className="code-editor-output-block">
                            <label className="code-editor-label-block">Output:</label>
                            <div className="code-editor-output">{output}</div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="code-editor-error-block">
                    <label className="code-editor-error-label">Error:</label>
                    <div className="code-editor-error">{error}</div>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;
