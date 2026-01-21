import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getProblemById, getSolutions, getCollections, addProblemToCollection } from '../utils/api'

export default function ProblemDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [problem, setProblem] = useState(null)
    const [solutions, setSolutions] = useState([])
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [addingToCollection, setAddingToCollection] = useState(false)

    useEffect(() => {
        fetchData()
        fetchCollections()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        setError('')
        try {
            const [problemRes, solutionsRes] = await Promise.all([
                getProblemById(id),
                getSolutions(id),
            ])
            setProblem(problemRes.data)
            // Handle paginated API response
            const solutionsData = Array.isArray(solutionsRes.data) ? solutionsRes.data : solutionsRes.data?.results || []
            setSolutions(solutionsData)
        } catch (err) {
            setError('Failed to load problem details')
            if (err?.response?.status === 404) {
                setError('Problem not found')
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchCollections = async () => {
        try {
            const response = await getCollections()
            // Handle paginated API response
            const collectionsData = Array.isArray(response.data) ? response.data : response.data?.results || []
            setCollections(collectionsData)
        } catch (err) {
            console.error('Error fetching collections:', err)
        }
    }

    const handleAddToCollection = async (collectionId) => {
        if (!collectionId) return

        setAddingToCollection(true)
        setError('')
        setSuccess('')

        try {
            const response = await addProblemToCollection(collectionId, id)
            setSuccess(response.data.message || 'Problem added to collection successfully')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error adding to collection:', err)
            setError(err.response?.data?.error || 'Failed to add problem to collection')
            setTimeout(() => setError(''), 3000)
        } finally {
            setAddingToCollection(false)
        }
    }

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            case 'MEDIUM':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
            case 'HARD':
                return 'bg-red-500/20 text-red-300 border-red-500/50'
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
        }
    }

    const getApproachBadge = (approach) => {
        switch (approach) {
            case 'BRUTE_FORCE':
                return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
            case 'BETTER':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
            case 'OPTIMAL':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400">Loading problem...</p>
                </div>
            </div>
        )
    }

    if (error || !problem) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100">
                <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-8">
                    <div className="rounded-lg border border-red-500 bg-red-500/10 px-6 py-4 text-red-200">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <select
                            onChange={(e) => handleAddToCollection(e.target.value)}
                            disabled={addingToCollection || collections.length === 0}
                            className="rounded-lg border border-slate-600 bg-slate-800 text-slate-300 px-4 py-2 hover:border-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            value=""
                        >
                            <option value="" disabled>
                                {addingToCollection ? 'Adding...' : collections.length === 0 ? 'No Collections' : 'Add to Collection'}
                            </option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => navigate(`/add-solution/${id}`)}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 font-medium text-white transition"
                        >
                            + Add Solution
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 rounded-lg border border-green-500 bg-green-500/10 px-4 py-3 text-green-200">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}
                {/* Problem Info Card */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-100 mb-3">
                                {problem.problem_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${getDifficultyClass(
                                        problem.difficulty
                                    )}`}
                                >
                                    {problem.difficulty}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    {problem.platform}
                                </span>
                                <span className="text-slate-500 text-sm">
                                    Solved {problem.solved_count || 0} time(s)
                                </span>
                            </div>
                        </div>
                    </div>

                    {problem.problem_link && (
                        <div className="mb-3">
                            <a
                                href={problem.problem_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
                            >
                                🔗 Open Problem Link →
                            </a>
                        </div>
                    )}

                    {problem.tags && problem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="rounded-md bg-slate-700/50 px-2.5 py-1 text-xs text-slate-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Solutions Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Solutions ({solutions.length})
                    </h2>
                </div>

                {solutions.length === 0 ? (
                    <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
                        <p className="text-slate-400 mb-4">No solutions added yet</p>
                        <button
                            onClick={() => navigate(`/add-solution/${id}`)}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2 text-white transition"
                        >
                            Add First Solution
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {solutions.map((solution) => (
                            <div
                                key={solution.id}
                                className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden"
                            >
                                <div className="border-b border-slate-700 px-6 py-4 bg-slate-800/80">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${getApproachBadge(
                                                solution.approach
                                            )}`}
                                        >
                                            {solution.approach.replace('_', ' ')}
                                        </span>
                                        <span className="text-slate-300 font-medium text-sm">
                                            {solution.language}
                                        </span>
                                        {solution.time_complexity && (
                                            <span className="text-slate-400 text-sm">
                                                Time: {solution.time_complexity}
                                            </span>
                                        )}
                                        {solution.space_complexity && (
                                            <span className="text-slate-400 text-sm">
                                                Space: {solution.space_complexity}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-b border-slate-700">
                                    <Editor
                                        height="300px"
                                        language={solution.language.toLowerCase()}
                                        value={solution.code}
                                        theme="vs-dark"
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>

                                {solution.notes && (
                                    <div className="px-6 py-4 bg-slate-900/50">
                                        <h4 className="text-sm font-medium text-slate-300 mb-2">
                                            Notes:
                                        </h4>
                                        <p className="text-sm text-slate-400 whitespace-pre-wrap">
                                            {solution.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
