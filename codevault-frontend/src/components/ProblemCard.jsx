import { Eye, Trash2, FileCode, Code2, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react'
import './ProblemCard.css'

export default function ProblemCard({ problem, onView, onDelete, onAddSolution, getDifficultyClass }) {
    // Get platform icon based on platform name
    const getPlatformIcon = () => {
        switch (problem.platform) {
            case 'LEETCODE':
                return '🔗'
            case 'GFG':
                return '📚'
            case 'CODEFORCES':
                return '⚔️'
            case 'CODECHEF':
                return '👨‍🍳'
            case 'HACKERRANK':
                return '🏆'
            default:
                return '💻'
        }
    }

    const handleViewClick = (e) => {
        e.stopPropagation()
        onView()
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        onDelete()
    }

    const handleAddSolutionClick = (e) => {
        e.stopPropagation()
        onAddSolution()
    }

    const difficultyClass = problem.difficulty === 'EASY'
        ? 'easy'
        : problem.difficulty === 'MEDIUM'
            ? 'medium'
            : problem.difficulty === 'HARD'
                ? 'hard'
                : 'default'

    return (
        <div className={`problem-card difficulty-${difficultyClass}`}>
            {/* Difficulty indicator accent */}
            <div className="problem-card-accent"></div>

            <div className="problem-card-content">
                {/* Header: Title and Primary Info */}
                <div className="problem-card-header-section">
                    <div className="problem-card-title-wrapper">
                        <span className="problem-card-platform-icon">{getPlatformIcon()}</span>
                        <div className="problem-card-title-container">
                            <h3 className="problem-card-title">{problem.problem_name}</h3>
                            <div className="problem-card-meta">
                                <span className={`problem-card-difficulty-badge difficulty-${difficultyClass}`}>
                                    {problem.difficulty}
                                </span>
                                <span className="problem-card-platform-name">{problem.platform}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons - Desktop */}
                    <div className="problem-card-actions">
                        <button
                            onClick={handleViewClick}
                            className="problem-card-action-btn view-btn"
                            title="View problem details"
                        >
                            <Eye size={18} strokeWidth={2} />
                        </button>
                        {onAddSolution && (
                            <button
                                onClick={handleAddSolutionClick}
                                className="problem-card-action-btn solution-btn"
                                title="Add solution"
                            >
                                <FileCode size={18} strokeWidth={2} />
                            </button>
                        )}
                        <button
                            onClick={handleDeleteClick}
                            className="problem-card-action-btn delete-btn"
                            title="Delete problem"
                        >
                            <Trash2 size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                    <div className="problem-card-tags-section">
                        {problem.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="problem-card-tag">{tag}</span>
                        ))}
                        {problem.tags.length > 3 && (
                            <span className="problem-card-tag-more">+{problem.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="problem-card-stats-section">
                    <div className="problem-card-stat-item">
                        <FileCode size={16} className="stat-icon" />
                        <div className="stat-content">
                            <span className="stat-value">{problem.solution_count || 0}</span>
                            <span className="stat-label">Solution{(problem.solution_count || 0) !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="problem-card-stat-item">
                        <CheckCircle2 size={16} className="stat-icon solved" />
                        <div className="stat-content">
                            <span className="stat-value">{problem.solved_count || 0}</span>
                            <span className="stat-label">Times</span>
                        </div>
                    </div>

                    {problem.last_solved_date && (
                        <div className="problem-card-stat-item">
                            <Calendar size={16} className="stat-icon date" />
                            <div className="stat-content">
                                <span className="stat-label">Last</span>
                                <span className="stat-date">{new Date(problem.last_solved_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Action Bar */}
                <div className="problem-card-mobile-actions">
                    <button
                        onClick={handleViewClick}
                        className="problem-card-mobile-btn view-btn"
                    >
                        <Eye size={16} strokeWidth={2} />
                        <span>View</span>
                    </button>
                    {onAddSolution && (
                        <button
                            onClick={handleAddSolutionClick}
                            className="problem-card-mobile-btn solution-btn"
                        >
                            <FileCode size={16} strokeWidth={2} />
                            <span>Solution</span>
                        </button>
                    )}
                    <button
                        onClick={handleDeleteClick}
                        className="problem-card-mobile-btn delete-btn"
                    >
                        <Trash2 size={16} strokeWidth={2} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
