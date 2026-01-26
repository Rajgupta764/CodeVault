import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getProblemById, getSolutions, getCollections, addProblemToCollection } from '../utils/api'
import './ProblemDetail.css'

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
            <div className="problem-detail-loading">
                <div className="problem-detail-loading__content">
                    <div className="spinner problem-detail-loading__spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
                    <p className="problem-detail-loading__text">Loading problem details...</p>
                </div>
            </div>
        )
    }

    if (error || !problem) {
        return (
            <div className="min-h-screen">
                <header className="navbar">
                    <div className="container mx-auto px-4 py-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-8">
                    <div className="rounded-xl border border-red-400/50 bg-red-500/10 backdrop-blur-sm px-6 py-4 text-red-200 max-w-2xl mx-auto">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="problem-detail-page">
            {/* Navigation Bar */}
            <header className="problem-detail-navbar">
                <div className="problem-detail-navbar__container">
                    <div className="problem-detail-navbar__content">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="problem-detail-navbar__back"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="problem-detail-navbar__actions">
                            <select
                                onChange={(e) => handleAddToCollection(e.target.value)}
                                disabled={addingToCollection || collections.length === 0}
                                className="problem-detail-navbar__collection-select"
                                value=""
                            >
                                <option value="" disabled>
                                    {addingToCollection ? 'Adding...' : collections.length === 0 ? 'No Collections' : '📁 Add to Collection'}
                                </option>
                                {collections.map((collection) => (
                                    <option key={collection.id} value={collection.id}>
                                        {collection.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => navigate(`/add-solution/${id}`)}
                                className="problem-detail-navbar__add-solution-btn"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Solution</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="problem-detail-main">
                {/* Success Message */}
                {success && (
                    <div className="problem-detail-message problem-detail-message--success">
                        <div className="problem-detail-message__content">
                            <div className="problem-detail-message__icon">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="problem-detail-message problem-detail-message--error">
                        <div className="problem-detail-message__content">
                            <div className="problem-detail-message__icon">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>{error}</span>
                        </div>
                    </div>
                )}
                {/* Problem Info Card */}
                <div className="problem-info-card">
                    <div className="problem-info-card__header">
                        <div className="problem-info-card__title-section">
                            <h1 className="problem-info-card__title">
                                {problem.problem_name}
                            </h1>
                            <div className="problem-info-card__badges">
                                <span className={`problem-info-card__badge problem-info-card__badge--${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>
                                <span className="problem-info-card__badge problem-info-card__badge--platform">
                                    {problem.platform}
                                </span>
                                <span className="problem-info-card__solved-count">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Solved {problem.solved_count || 0}x
                                </span>
                            </div>
                        </div>
                    </div>

                    {problem.problem_link && (
                        <div className="problem-info-card__link">
                            <a
                                href={problem.problem_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>Open Problem on {problem.platform}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}

                    {problem.tags && problem.tags.length > 0 && (
                        <div className="problem-info-card__tags">
                            {problem.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="problem-info-card__tag"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Solutions Section */}
                <div className="solutions-header">
                    <h2 className="solutions-header__title">
                        <span className="solutions-header__icon">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </span>
                        <span>Solutions ({solutions.length})</span>
                    </h2>
                </div>

                {solutions.length === 0 ? (
                    <div className="solutions-empty">
                        <div className="solutions-empty__icon">💡</div>
                        <h3 className="solutions-empty__title">No solutions yet</h3>
                        <p className="solutions-empty__description">Add your first solution to this problem</p>
                        <button
                            onClick={() => navigate(`/add-solution/${id}`)}
                            className="solutions-empty__button"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add First Solution</span>
                        </button>
                    </div>
                ) : (
                    <div className="solutions-list">
                        {solutions.map((solution, index) => (
                            <div
                                key={solution.id}
                                className="solution-card"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="solution-card__header">
                                    <div className="solution-card__header-badges">
                                        <span className={`solution-card__badge solution-card__badge--${solution.approach.toLowerCase().replace('_', '-')}`}>
                                            {solution.approach.replace('_', ' ')}
                                        </span>
                                        <span className="solution-card__badge solution-card__badge--language">
                                            {solution.language}
                                        </span>
                                        {solution.time_complexity && (
                                            <span className="solution-card__complexity">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{solution.time_complexity}</span>
                                            </span>
                                        )}
                                        {solution.space_complexity && (
                                            <span className="solution-card__complexity">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                                </svg>
                                                <span>{solution.space_complexity}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="solution-card__code">
                                    <Editor
                                        height="350px"
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
                                            padding: { top: 16, bottom: 16 },
                                        }}
                                    />
                                </div>

                                {solution.notes && (
                                    <div className="solution-card__notes">
                                        <div className="solution-card__notes-content">
                                            <div className="solution-card__notes-icon">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <div className="solution-card__notes-body">
                                                <h4 className="solution-card__notes-title">
                                                    Notes
                                                </h4>
                                                <p className="solution-card__notes-text">
                                                    {solution.notes}
                                                </p>
                                            </div>
                                        </div>
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
