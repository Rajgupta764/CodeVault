import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProblem } from '../utils/api'

export default function AddProblem() {
    const [form, setForm] = useState({
        problem_name: '',
        problem_link: '',
        platform: 'LEETCODE',
        difficulty: 'MEDIUM',
        tags: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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

            const problemData = {
                problem_name: form.problem_name.trim(),
                problem_link: form.problem_link.trim(),
                platform: form.platform,
                difficulty: form.difficulty,
                tags: tagsArray,
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
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-blue-400">Add New Problem</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 space-y-5"
                >
                    <div>
                        <label htmlFor="problem_name" className="block text-sm font-medium mb-2">
                            Problem Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="problem_name"
                            name="problem_name"
                            type="text"
                            required
                            value={form.problem_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Two Sum"
                        />
                    </div>

                    <div>
                        <label htmlFor="problem_link" className="block text-sm font-medium mb-2">
                            Problem Link
                        </label>
                        <input
                            id="problem_link"
                            name="problem_link"
                            type="url"
                            value={form.problem_link}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://leetcode.com/problems/..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium mb-2">
                                Platform <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="platform"
                                name="platform"
                                required
                                value={form.platform}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="LEETCODE">LeetCode</option>
                                <option value="GFG">GeeksforGeeks</option>
                                <option value="CODEFORCES">CodeForces</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
                                Difficulty <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                required
                                value={form.difficulty}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium mb-2">
                            Tags
                        </label>
                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            value={form.tags}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="array, hashmap, two-pointer"
                        />
                        <p className="mt-1.5 text-xs text-slate-400">
                            Separate multiple tags with commas
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition"
                        >
                            {loading ? 'Creating...' : 'Create Problem'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
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
