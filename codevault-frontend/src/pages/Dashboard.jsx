import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProblems, getStats, deleteProblem } from '../utils/api'
import { LayoutGrid, CheckCircle, TrendingUp, Zap } from 'lucide-react'
import ProblemCard from '../components/ProblemCard'
import SearchBar from '../components/SearchBar'
import './Dashboard.css'

export default function Dashboard() {
    const [problems, setProblems] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(null)
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
                return 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            case 'HARD':
                return 'bg-red-500/20 text-red-300 border-red-500/50'
            default:
                return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
        }
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return '#10B981'
            case 'MEDIUM':
                return '#F59E0B'
            case 'HARD':
                return '#EF4444'
            default:
                return '#6B7280'
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                {/* Background elements */}
                <div className="loading-background">
                    <div className="loading-orb-1" />
                    <div className="loading-orb-2" />
                </div>
                <div className="loading-content">
                    <div className="loading-spinner-container">
                        <div className="loading-spinner-outer" />
                        <div className="loading-spinner-inner" />
                    </div>
                    <p className="loading-text">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {/* Animated Background Gradient Orbs */}
            <div className="background-orbs">
                <div className="background-orb-blue" />
                <div className="background-orb-purple" />
                <div className="background-orb-cyan" />
            </div>

            {/* Header */}
            <header className="dashboard-header">
                <div className="dashboard-header__container">
                    <div className="dashboard-header__content">
                        {/* Logo */}
                        <div className="dashboard-header__logo">
                            <div className="dashboard-header__logo-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h1 className="dashboard-header__logo-text">CodeVault</h1>
                        </div>

                        {/* Navigation */}
                        <div className="dashboard-header__nav">
                            <button
                                onClick={() => navigate('/collections')}
                                className="dashboard-header__nav-btn"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Collections</span>
                            </button>
                            <button
                                onClick={() => navigate('/revisions')}
                                className="dashboard-header__nav-btn dashboard-header__revisions-btn"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Revisions</span>
                            </button>
                            <button
                                onClick={() => navigate('/add-problem')}
                                className="dashboard-header__add-btn"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>New Problem</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="dashboard-header__logout-btn"
                                title="Logout"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-main__container">
                    {/* Error Alert */}
                    {error && (
                        <div className="error-alert">
                            <div className="error-alert__content">
                                <div className="error-alert__icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="error-alert__title">Error loading dashboard</h3>
                                    <p className="error-alert__message">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="page-header">
                        <h2 className="page-header__title">Dashboard</h2>
                        <p className="page-header__subtitle">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                            Track and master your coding challenges
                        </p>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="stats-grid">
                            {/* Total Problems Card */}
                            <div className="stat-card stat-card--blue">
                                <div className="stat-card__border">
                                    <div className="stat-card__border-inner" />
                                </div>
                                <div className="stat-card__background" />
                                <div className="stat-card__glow" />
                                <div className="stat-card__content">
                                    <div className="stat-card__header">
                                        <div className="stat-card__info">
                                            <p className="stat-card__label">Total Problems</p>
                                            <div className="stat-card__value-container">
                                                <p className="stat-card__value">
                                                    {stats.total_count}
                                                </p>
                                            </div>
                                            <div className="stat-card__growth">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span>+12%</span>
                                            </div>
                                        </div>
                                        <div className="stat-card__icon">
                                            <LayoutGrid strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="stat-card__progress">
                                        <div className="stat-card__progress-bar" style={{ width: '80%' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Easy Solved Card */}
                            <div className="stat-card stat-card--green">
                                <div className="stat-card__border">
                                    <div className="stat-card__border-inner" />
                                </div>
                                <div className="stat-card__background" />
                                <div className="stat-card__glow" />
                                <div className="stat-card__content">
                                    <div className="stat-card__header">
                                        <div className="stat-card__info">
                                            <p className="stat-card__label">Easy Solved</p>
                                            <div className="stat-card__value-container">
                                                <p className="stat-card__value">
                                                    {stats.difficulty?.easy || 0}
                                                </p>
                                            </div>
                                            <div className="stat-card__growth">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span>+8%</span>
                                            </div>
                                        </div>
                                        <div className="stat-card__icon">
                                            <CheckCircle strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="stat-card__progress">
                                        <div className="stat-card__progress-bar" style={{ width: '60%' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Medium Solved Card */}
                            <div className="stat-card stat-card--yellow">
                                <div className="stat-card__border">
                                    <div className="stat-card__border-inner" />
                                </div>
                                <div className="stat-card__background" />
                                <div className="stat-card__glow" />
                                <div className="stat-card__content">
                                    <div className="stat-card__header">
                                        <div className="stat-card__info">
                                            <p className="stat-card__label">Medium Solved</p>
                                            <div className="stat-card__value-container">
                                                <p className="stat-card__value">
                                                    {stats.difficulty?.medium || 0}
                                                </p>
                                            </div>
                                            <div className="stat-card__growth">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span>+5%</span>
                                            </div>
                                        </div>
                                        <div className="stat-card__icon">
                                            <TrendingUp strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="stat-card__progress">
                                        <div className="stat-card__progress-bar" style={{ width: '40%' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Hard Solved Card */}
                            <div className="stat-card stat-card--red">
                                <div className="stat-card__border">
                                    <div className="stat-card__border-inner" />
                                </div>
                                <div className="stat-card__background" />
                                <div className="stat-card__glow" />
                                <div className="stat-card__content">
                                    <div className="stat-card__header">
                                        <div className="stat-card__info">
                                            <p className="stat-card__label">Hard Solved</p>
                                            <div className="stat-card__value-container">
                                                <p className="stat-card__value">
                                                    {stats.difficulty?.hard || 0}
                                                </p>
                                            </div>
                                            <div className="stat-card__growth">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span>+3%</span>
                                            </div>
                                        </div>
                                        <div className="stat-card__icon">
                                            <Zap strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="stat-card__progress">
                                        <div className="stat-card__progress-bar" style={{ width: '25%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search & Filters Section */}
                    <div className="filters-section">
                        {/* Search Bar */}
                        <div className="search-container">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search problems by name, platform, tags..."
                                debounceMs={300}
                                showRecentSearches={true}
                            />
                        </div>

                        {/* Filter Dropdowns */}
                        <div className="filters-container">
                            <div className="filters-grid">
                                <div className="filter-group">
                                    <label className="filter-label">Difficulty</label>
                                    <select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>All Difficulties</option>
                                        <option value="EASY" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>Easy</option>
                                        <option value="MEDIUM" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>Medium</option>
                                        <option value="HARD" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>Hard</option>
                                    </select>
                                    <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">Platform</label>
                                    <select
                                        value={platformFilter}
                                        onChange={(e) => setPlatformFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>All Platforms</option>
                                        <option value="LEETCODE" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>LeetCode</option>
                                        <option value="GFG" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>GeeksforGeeks</option>
                                        <option value="CODEFORCES" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>CodeForces</option>
                                        <option value="CODECHEF" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>CodeChef</option>
                                        <option value="HACKERRANK" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>HackerRank</option>
                                    </select>
                                    <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>All Status</option>
                                        <option value="SOLVED" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>Solved</option>
                                        <option value="ATTEMPTED" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>Attempted</option>
                                        <option value="TO_REVISE" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>To Revise</option>
                                    </select>
                                    <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">Tags</label>
                                    <select
                                        value={tagFilter}
                                        onChange={(e) => setTagFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>All Tags</option>
                                        {allTags.map((tag) => (
                                            <option key={tag} value={tag} style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Results Count & Clear Button */}
                            <div className="filters-footer">
                                <div className="results-count">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Showing <span className="results-count__number">{filteredProblems.length}</span> of <span className="results-count__number">{problems.length}</span> problems</span>
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="clear-filters-btn"
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Problem Cards List */}
                    <div>
                        {filteredProblems.length === 0 ? (
                            <div className="problems-empty">
                                <div className="problems-empty__icon">{problems.length === 0 ? '📝' : '🔍'}</div>
                                <h3 className="problems-empty__title">
                                    {problems.length === 0 ? 'No problems yet' : 'No matching problems'}
                                </h3>
                                <p className="problems-empty__description">
                                    {problems.length === 0
                                        ? 'Start building your problem collection to track your coding progress'
                                        : 'Try adjusting your filters to find what you are looking for'}
                                </p>
                                <button
                                    onClick={() => problems.length === 0 ? navigate('/add-problem') : clearFilters()}
                                    className="problems-empty__button"
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={problems.length === 0 ? "M12 4v16m8-8H4" : "M6 18L18 6M6 6l12 12"} />
                                    </svg>
                                    {problems.length === 0 ? 'Add Your First Problem' : 'Clear Filters'}
                                </button>
                            </div>
                        ) : (
                            <div className="problems-list">
                                {filteredProblems.map((problem) => (
                                    <ProblemCard
                                        key={problem.id}
                                        problem={problem}
                                        onView={() => navigate(`/problem/${problem.id}`)}
                                        onDelete={() => handleDelete(problem.id)}
                                        onAddSolution={() => navigate(`/add-solution/${problem.id}`)}
                                        getDifficultyClass={getDifficultyClass}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
