import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import { createSolution, getProblemById } from '../utils/api'
import './AddSolution.css'

export default function AddSolution() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        approach: 'OPTIMAL',
        language: 'PYTHON',
        code: '',
        time_complexity: '',
        space_complexity: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [problem, setProblem] = useState(null)

    useEffect(() => {
        fetchProblem()
    }, [id])

    const fetchProblem = async () => {
        try {
            const response = await getProblemById(id)
            setProblem(response.data)
        } catch (err) {
            console.error('Error fetching problem:', err)
        }
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleCodeChange = (value) => {
        setForm((prev) => ({ ...prev, code: value || '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.code.trim()) {
            setError('Code is required')
            return
        }

        setLoading(true)

        try {
            const solutionData = {
                problem: parseInt(id),
                approach: form.approach,
                language: form.language,
                code: form.code,
                time_complexity: form.time_complexity.trim(),
                space_complexity: form.space_complexity.trim(),
                notes: form.notes.trim(),
            }

            await createSolution(solutionData)
            navigate(`/problem/${id}`)
        } catch (err) {
            const apiError = err?.response?.data
            const message =
                apiError?.error ||
                apiError?.detail ||
                JSON.stringify(apiError) ||
                'Failed to add solution'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-solution">
            <header className="add-solution-header">
                <div className="add-solution-header-container">
                    <h1 className="add-solution-header-title">Add Solution</h1>
                </div>
            </header>

            <main className="add-solution-main">
                {error && (
                    <div className="add-solution-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="add-solution-form"
                >
                    {/* Approach and Language */}
                    <div className="add-solution-grid">
                        <div className="add-solution-form-section">
                            <label htmlFor="approach" className="add-solution-label">
                                Approach <span className="add-solution-label-required">*</span>
                            </label>
                            <select
                                id="approach"
                                name="approach"
                                required
                                value={form.approach}
                                onChange={handleChange}
                                className="add-solution-select"
                            >
                                <option value="BRUTE_FORCE">Brute Force</option>
                                <option value="BETTER">Better</option>
                                <option value="OPTIMAL">Optimal</option>
                            </select>
                        </div>

                        <div className="add-solution-form-section">
                            <label htmlFor="language" className="add-solution-label">
                                Language <span className="add-solution-label-required">*</span>
                            </label>
                            <select
                                id="language"
                                name="language"
                                required
                                value={form.language}
                                onChange={handleChange}
                                className="add-solution-select"
                            >
                                <option value="PYTHON">Python</option>
                                <option value="JAVA">Java</option>
                                <option value="CPP">C++</option>
                                <option value="JAVASCRIPT">JavaScript</option>
                            </select>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="add-solution-code-section">
                        <label className="add-solution-code-label">
                            Code <span className="add-solution-label-required">*</span>
                        </label>
                        <CodeEditor
                            initialCode={form.code}
                            language={form.language}
                            onCodeChange={handleCodeChange}
                            problemId={id}
                            testCases={problem?.test_cases || []}
                            showLanguageSelector={false}
                        />
                        <p className="add-solution-code-helper">
                            Use the editor to write your code and test it before submitting
                        </p>
                    </div>

                    {/* Complexity Inputs */}
                    <div className="add-solution-grid">
                        <div className="add-solution-form-section">
                            <label htmlFor="time_complexity" className="add-solution-label">
                                Time Complexity
                            </label>
                            <input
                                id="time_complexity"
                                name="time_complexity"
                                type="text"
                                value={form.time_complexity}
                                onChange={handleChange}
                                className="add-solution-input"
                                placeholder="e.g., O(n log n)"
                            />
                        </div>

                        <div className="add-solution-form-section">
                            <label htmlFor="space_complexity" className="add-solution-label">
                                Space Complexity
                            </label>
                            <input
                                id="space_complexity"
                                name="space_complexity"
                                type="text"
                                value={form.space_complexity}
                                onChange={handleChange}
                                className="add-solution-input"
                                placeholder="e.g., O(n)"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="add-solution-form-section">
                        <label htmlFor="notes" className="add-solution-label">
                            Notes / Explanation
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={5}
                            value={form.notes}
                            onChange={handleChange}
                            className="add-solution-textarea"
                            placeholder="Add any notes, explanations, or key insights about this solution..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="add-solution-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="add-solution-submit-btn"
                        >
                            {loading ? 'Adding Solution...' : 'Add Solution'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/problem/${id}`)}
                            className="add-solution-cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
