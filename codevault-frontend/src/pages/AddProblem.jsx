import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProblem } from '../utils/api'
import './AddProblem.css'

export default function AddProblem() {
    const [form, setForm] = useState({
        problem_name: '',
        problem_link: '',
        platform: 'LEETCODE',
        difficulty: 'MEDIUM',
        tags: '',
    })
    const [testCases, setTestCases] = useState([{ input: '', output: '', explanation: '' }])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases]
        newTestCases[index][field] = value
        setTestCases(newTestCases)
    }

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', output: '', explanation: '' }])
    }

    const removeTestCase = (index) => {
        if (testCases.length > 1) {
            setTestCases(testCases.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Convert comma-separated tags to array
            const tagsArray = form.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)

            // Filter out empty test cases
            const validTestCases = testCases.filter(
                tc => tc.input.trim() || tc.output.trim()
            )

            const problemData = {
                problem_name: form.problem_name.trim(),
                problem_link: form.problem_link.trim(),
                platform: form.platform,
                difficulty: form.difficulty,
                tags: tagsArray,
                test_cases: validTestCases,
                status: 'ATTEMPTED',
                solved_count: 0,
            }

            await createProblem(problemData)
            navigate('/dashboard')
        } catch (err) {
            const apiError = err?.response?.data
            const message =
                apiError?.error ||
                apiError?.detail ||
                JSON.stringify(apiError) ||
                'Failed to create problem'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-problem">
            {/* Navigation Bar */}
            <header className="add-problem-header">
                <div className="add-problem-header-container">
                    <div className="add-problem-header-content">
                        <div className="add-problem-header-left">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="add-problem-back-btn"
                                title="Back to Dashboard"
                            >
                                <svg className="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <div className="add-problem-header-title-section">
                                <h1 className="add-problem-title">Add New Problem</h1>
                                <p className="add-problem-subtitle">Create a new coding problem entry</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="add-problem-main">
                {error && (
                    <div className="add-problem-error">
                        <div className="add-problem-error-content">
                            <svg className="add-problem-error-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="add-problem-form"
                >
                    <div className="add-problem-form-section">
                        <label htmlFor="problem_name" className="add-problem-label">
                            Problem Name <span className="add-problem-label-required">*</span>
                        </label>
                        <input
                            id="problem_name"
                            name="problem_name"
                            type="text"
                            required
                            value={form.problem_name}
                            onChange={handleChange}
                            className="add-problem-input"
                            placeholder="e.g., Two Sum"
                        />
                    </div>

                    <div className="add-problem-form-section">
                        <label htmlFor="problem_link" className="add-problem-label">
                            Problem Link
                        </label>
                        <div className="add-problem-input-icon-wrapper">
                            <div className="add-problem-input-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <input
                                id="problem_link"
                                name="problem_link"
                                type="url"
                                value={form.problem_link}
                                onChange={handleChange}
                                className="add-problem-input add-problem-input-with-icon"
                                placeholder="https://leetcode.com/problems/..."
                            />
                        </div>
                    </div>

                    <div className="add-problem-grid">
                        <div className="add-problem-form-section">
                            <label htmlFor="platform" className="add-problem-label">
                                Platform <span className="add-problem-label-required">*</span>
                            </label>
                            <select
                                id="platform"
                                name="platform"
                                required
                                value={form.platform}
                                onChange={handleChange}
                                className="add-problem-input"
                            >
                                <option value="LEETCODE">LeetCode</option>
                                <option value="GFG">GeeksforGeeks</option>
                                <option value="CODEFORCES">CodeForces</option>
                                <option value="CODECHEF">CodeChef</option>
                                <option value="HACKERRANK">HackerRank</option>
                            </select>
                        </div>

                        <div className="add-problem-form-section">
                            <label htmlFor="difficulty" className="add-problem-label">
                                Difficulty <span className="add-problem-label-required">*</span>
                            </label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                required
                                value={form.difficulty}
                                onChange={handleChange}
                                className="add-problem-input"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="add-problem-form-section">
                        <label htmlFor="tags" className="add-problem-label">
                            Tags
                        </label>
                        <div className="add-problem-input-icon-wrapper">
                            <div className="add-problem-input-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={form.tags}
                                onChange={handleChange}
                                className="add-problem-input add-problem-input-with-icon"
                                placeholder="array, hashmap, two-pointer"
                            />
                        </div>
                        <p className="add-problem-helper-text">
                            <svg className="add-problem-helper-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>Separate multiple tags with commas</span>
                        </p>
                    </div>

                    {/* Test Cases Section */}
                    <div className="add-problem-test-cases-header">
                        <div className="add-problem-test-cases-title-row">
                            <div className="add-problem-test-cases-title-section">
                                <label className="add-problem-test-cases-label">
                                    Test Cases (Optional)
                                </label>
                                <p className="add-problem-test-cases-sublabel">LeetCode-style test cases for validation</p>
                            </div>
                            <button
                                type="button"
                                onClick={addTestCase}
                                className="add-problem-add-btn"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Test Case</span>
                            </button>
                        </div>
                        <div className="add-problem-test-cases-list">
                            {testCases.map((testCase, index) => (
                                <div key={index} className="add-problem-test-case-card">
                                    <div className="add-problem-test-case-header">
                                        <span className="add-problem-test-case-title">
                                            <span className="add-problem-test-case-number">
                                                {index + 1}
                                            </span>
                                            Test Case {index + 1}
                                        </span>
                                        {testCases.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTestCase(index)}
                                                className="add-problem-remove-btn"
                                            >
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Remove</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="add-problem-test-case-fields">
                                        <div className="add-problem-test-case-field">
                                            <label className="add-problem-field-label">Input:</label>
                                            <textarea
                                                value={testCase.input}
                                                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                                className="add-problem-textarea"
                                                rows="2"
                                                placeholder="e.g., [2,7,11,15]\n9"
                                            />
                                        </div>
                                        <div className="add-problem-test-case-field">
                                            <label className="add-problem-field-label">Expected Output:</label>
                                            <input
                                                type="text"
                                                value={testCase.output}
                                                onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                                className="add-problem-input"
                                                placeholder="e.g., [0,1]"
                                            />
                                        </div>
                                        <div className="add-problem-test-case-field">
                                            <label className="add-problem-field-label">Explanation (Optional):</label>
                                            <input
                                                type="text"
                                                value={testCase.explanation}
                                                onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                                                className="add-problem-input"
                                                placeholder="e.g., Because nums[0] + nums[1] == 9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="add-problem-test-cases-desc">
                            Add test cases to automatically validate solutions. Input and output should match expected format.
                        </p>
                    </div>

                    <div className="add-problem-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="add-problem-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="add-problem-spinner"></div>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Create Problem</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="add-problem-cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
