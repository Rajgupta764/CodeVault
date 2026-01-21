import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import { createSolution } from '../utils/api'

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
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-blue-400">Add Solution</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 space-y-6"
                >
                    {/* Approach and Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="approach" className="block text-sm font-medium mb-2">
                                Approach <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="approach"
                                name="approach"
                                required
                                value={form.approach}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="BRUTE_FORCE">Brute Force</option>
                                <option value="BETTER">Better</option>
                                <option value="OPTIMAL">Optimal</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium mb-2">
                                Language <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="language"
                                name="language"
                                required
                                value={form.language}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="PYTHON">Python</option>
                                <option value="JAVA">Java</option>
                                <option value="CPP">C++</option>
                                <option value="JAVASCRIPT">JavaScript</option>
                            </select>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Code <span className="text-red-400">*</span>
                        </label>
                        <CodeEditor
                            initialCode={form.code}
                            language={form.language}
                            onCodeChange={handleCodeChange}
                        />
                        <p className="mt-1.5 text-xs text-slate-400">
                            Use the editor to write your code and test it before submitting
                        </p>
                    </div>

                    {/* Complexity Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="time_complexity" className="block text-sm font-medium mb-2">
                                Time Complexity
                            </label>
                            <input
                                id="time_complexity"
                                name="time_complexity"
                                type="text"
                                value={form.time_complexity}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., O(n log n)"
                            />
                        </div>

                        <div>
                            <label htmlFor="space_complexity" className="block text-sm font-medium mb-2">
                                Space Complexity
                            </label>
                            <input
                                id="space_complexity"
                                name="space_complexity"
                                type="text"
                                value={form.space_complexity}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., O(n)"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-2">
                            Notes / Explanation
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={5}
                            value={form.notes}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                            placeholder="Add any notes, explanations, or key insights about this solution..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition"
                        >
                            {loading ? 'Adding Solution...' : 'Add Solution'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/problem/${id}`)}
                            className="rounded-lg border border-slate-600 hover:bg-slate-700 px-6 py-2.5 font-medium text-slate-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
