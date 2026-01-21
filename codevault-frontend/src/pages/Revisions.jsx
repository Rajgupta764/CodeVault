import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRevisionsDue, markRevised } from '../utils/api'

export default function Revisions() {
    const navigate = useNavigate()
    const [revisions, setRevisions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [markingId, setMarkingId] = useState(null)

    useEffect(() => {
        fetchRevisions()
    }, [])

    const fetchRevisions = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getRevisionsDue()
            // Handle paginated API response
            const revisionsData = Array.isArray(response.data)
                ? response.data
                : (response.data?.problems || response.data?.results || [])
            setRevisions(revisionsData)
        } catch (err) {
            console.error('Error fetching revisions:', err)
            setError('Failed to load revisions due today')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkRevised = async (problemId) => {
        setMarkingId(problemId)
        setError('')

        try {
            await markRevised(problemId)
            // Refresh the list after marking as revised
            await fetchRevisions()
        } catch (err) {
            console.error('Error marking as revised:', err)
            setError(err.response?.data?.error || 'Failed to mark problem as revised')
        } finally {
            setMarkingId(null)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return 'bg-green-500/20 text-green-400 border-green-500'
            case 'MEDIUM':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
            case 'HARD':
                return 'bg-red-500/20 text-red-400 border-red-500'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500'
        }
    }

    const getPlatformBadge = (platform) => {
        const badges = {
            LEETCODE: { text: 'LeetCode', color: 'bg-orange-500/20 text-orange-400' },
            GFG: { text: 'GFG', color: 'bg-green-500/20 text-green-400' },
            CODEFORCES: { text: 'CodeForces', color: 'bg-blue-500/20 text-blue-400' }
        }
        return badges[platform] || { text: platform, color: 'bg-gray-500/20 text-gray-400' }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-400">Revisions Due</h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Problems scheduled for revision today
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="rounded-lg border border-slate-600 hover:bg-slate-700 px-4 py-2 font-medium text-slate-300 transition"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token')
                                    navigate('/')
                                }}
                                className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 font-medium text-white transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
                            <p className="text-slate-400">Loading revisions...</p>
                        </div>
                    </div>
                ) : revisions.length === 0 ? (
                    /* No Revisions */
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="rounded-full bg-slate-800 p-6 mb-4">
                            <svg
                                className="h-16 w-16 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">
                            No Revisions Due Today
                        </h2>
                        <p className="text-slate-400 mb-6 text-center max-w-md">
                            Great job! You're all caught up. Check back tomorrow or add new problems to your collection.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white transition"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    /* Revisions Grid */
                    <>
                        <div className="mb-6">
                            <p className="text-slate-300">
                                <span className="text-2xl font-bold text-blue-400">{revisions.length}</span>{' '}
                                {revisions.length === 1 ? 'problem' : 'problems'} due for revision
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {revisions.map((problem) => {
                                const platformBadge = getPlatformBadge(problem.platform)
                                return (
                                    <div
                                        key={problem.id}
                                        className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 hover:border-slate-600 transition"
                                    >
                                        {/* Problem Header */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">
                                                {problem.problem_name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyClass(
                                                        problem.difficulty
                                                    )}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${platformBadge.color}`}
                                                >
                                                    {platformBadge.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Revision Info */}
                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex justify-between text-slate-400">
                                                <span>Last Solved:</span>
                                                <span className="text-slate-300 font-medium">
                                                    {formatDate(problem.last_solved)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-slate-400">
                                                <span>Revision Due:</span>
                                                <span className="text-yellow-400 font-medium">
                                                    {formatDate(problem.next_revision_date)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-slate-400">
                                                <span>Solved Count:</span>
                                                <span className="text-blue-400 font-medium">
                                                    {problem.solved_count} times
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {problem.tags && problem.tags.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {problem.tags.length > 3 && (
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-xs">
                                                            +{problem.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/problem/${problem.id}`)}
                                                className="flex-1 rounded-lg border border-slate-600 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleMarkRevised(problem.id)}
                                                disabled={markingId === problem.id}
                                                className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition"
                                            >
                                                {markingId === problem.id ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg
                                                            className="animate-spin h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                        >
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
                                                        Marking...
                                                    </span>
                                                ) : (
                                                    'Mark Revised'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
