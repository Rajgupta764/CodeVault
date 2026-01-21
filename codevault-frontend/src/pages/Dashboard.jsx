import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProblems, getStats, deleteProblem } from '../utils/api'

export default function Dashboard() {
    const [problems, setProblems] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [difficultyFilter, setDifficultyFilter] = useState('')
    const [platformFilter, setPlatformFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [tagFilter, setTagFilter] = useState('')

    // Get unique tags from all problems
    const allTags = useMemo(() => {
        const tags = new Set()
        if (Array.isArray(problems)) {
            problems.forEach(problem => {
                if (problem.tags && Array.isArray(problem.tags)) {
                    problem.tags.forEach(tag => tags.add(tag))
                }
            })
        }
        return Array.from(tags).sort()
    }, [problems])

    // Filter problems based on all criteria
    const filteredProblems = useMemo(() => {
        return problems.filter(problem => {
            // Search filter
            if (searchTerm && !problem.problem_name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            // Difficulty filter
            if (difficultyFilter && problem.difficulty !== difficultyFilter) {
                return false
            }

            // Platform filter
            if (platformFilter && problem.platform !== platformFilter) {
                return false
            }

            // Status filter
            if (statusFilter && problem.status !== statusFilter) {
                return false
            }

            // Tag filter
            if (tagFilter && (!problem.tags || !problem.tags.includes(tagFilter))) {
                return false
            }

            return true
        })
    }, [problems, searchTerm, difficultyFilter, platformFilter, statusFilter, tagFilter])

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('')
        setDifficultyFilter('')
        setPlatformFilter('')
        setStatusFilter('')
        setTagFilter('')
    }

    // Check if any filter is active
    const hasActiveFilters = searchTerm || difficultyFilter || platformFilter || statusFilter || tagFilter

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError('')
        try {
            const [problemsRes, statsRes] = await Promise.all([
                getProblems(),
                getStats(),
            ])
            // Handle paginated API response - extract results array
            const problemsData = Array.isArray(problemsRes.data) ? problemsRes.data : problemsRes.data?.results || []
            const statsData = Array.isArray(statsRes.data) ? statsRes.data : statsRes.data?.results || statsRes.data
            setProblems(problemsData)
            setStats(statsData)
        } catch (err) {
            setError('Failed to load dashboard data')
            if (err?.response?.status === 401) {
                handleLogout()
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this problem?')) return
        try {
            await deleteProblem(id)
            setProblems((prev) => prev.filter((p) => p.id !== id))
            fetchData() // refresh stats
        } catch (err) {
            alert('Failed to delete problem')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-400">CodeVault</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/collections')}
                            className="rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 font-medium text-slate-300 transition"
                        >
                            Collections
                        </button>
                        <button
                            onClick={() => navigate('/revisions')}
                            className="rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 font-medium text-slate-300 transition"
                        >
                            Revisions
                        </button>
                        <button
                            onClick={() => navigate('/add-problem')}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 font-medium text-white transition"
                        >
                            + New Problem
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 text-slate-300 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                            <div className="text-3xl font-bold text-slate-100">
                                {stats.total_count}
                            </div>
                            <div className="text-sm text-slate-400 mt-1">Total Problems</div>
                        </div>
                        <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-6">
                            <div className="text-3xl font-bold text-emerald-300">
                                {stats.difficulty?.easy || 0}
                            </div>
                            <div className="text-sm text-emerald-400 mt-1">Easy</div>
                        </div>
                        <div className="rounded-lg border border-yellow-700 bg-yellow-900/20 p-6">
                            <div className="text-3xl font-bold text-yellow-300">
                                {stats.difficulty?.medium || 0}
                            </div>
                            <div className="text-sm text-yellow-400 mt-1">Medium</div>
                        </div>
                        <div className="rounded-lg border border-red-700 bg-red-900/20 p-6">
                            <div className="text-3xl font-bold text-red-300">
                                {stats.difficulty?.hard || 0}
                            </div>
                            <div className="text-sm text-red-400 mt-1">Hard</div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search problems by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Filter Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Difficulties</option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>

                            <select
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value)}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Platforms</option>
                                <option value="LEETCODE">LeetCode</option>
                                <option value="GFG">GeeksforGeeks</option>
                                <option value="CODEFORCES">CodeForces</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="SOLVED">Solved</option>
                                <option value="ATTEMPTED">Attempted</option>
                                <option value="TO_REVISE">To Revise</option>
                            </select>

                            <select
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters Button and Results Count */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">
                                Showing {filteredProblems.length} of {problems.length} problems
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-lg border border-slate-600 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Problem List */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="border-b border-slate-700 px-6 py-4">
                        <h2 className="text-xl font-semibold">Your Problems</h2>
                    </div>

                    {filteredProblems.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-400">
                            {problems.length === 0 ? (
                                <>
                                    <p className="mb-4">No problems added yet</p>
                                    <button
                                        onClick={() => navigate('/add-problem')}
                                        className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2 text-white transition"
                                    >
                                        Add Your First Problem
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="mb-4">No problems match your filters</p>
                                    <button
                                        onClick={clearFilters}
                                        className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2 text-white transition"
                                    >
                                        Clear Filters
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-700">
                            {filteredProblems.map((problem) => (
                                <div
                                    key={problem.id}
                                    className="px-6 py-4 hover:bg-slate-700/30 transition"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-slate-100 mb-2">
                                                {problem.problem_name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                                <span
                                                    className={`inline-block rounded-full border px-3 py-0.5 font-medium ${getDifficultyClass(
                                                        problem.difficulty
                                                    )}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                <span className="text-slate-400">
                                                    {problem.platform}
                                                </span>
                                                <span className="text-slate-400">
                                                    {problem.solution_count || 0} solution(s)
                                                </span>
                                                <span className="text-slate-500">
                                                    Solved {problem.solved_count || 0} time(s)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => navigate(`/problem/${problem.id}`)}
                                                className="rounded-lg border border-slate-600 hover:bg-slate-700 px-3 py-1.5 text-sm text-slate-300 transition"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(problem.id)}
                                                className="rounded-lg border border-red-600 hover:bg-red-900/30 px-3 py-1.5 text-sm text-red-300 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
