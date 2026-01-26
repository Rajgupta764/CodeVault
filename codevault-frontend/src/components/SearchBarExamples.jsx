import { useState, useMemo } from 'react'
import SearchBar from '../components/SearchBar'
import ProblemCard from '../components/ProblemCard'
import './SearchBarExamples.css'

/**
 * Advanced SearchBar Usage Examples
 * These patterns demonstrate how to use the SearchBar component in various scenarios
 */

// ============================================
// EXAMPLE 1: Simple Filter with SearchBar
// ============================================
export function BasicSearchExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = useMemo(() => {
        if (!searchTerm) return problems

        return problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [problems, searchTerm])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by problem name..."
                />
            </div>

            <div className="search-example-grid">
                {filtered.length > 0 ? (
                    filtered.map(problem => (
                        <ProblemCard key={problem.id} problem={problem} />
                    ))
                ) : (
                    <div className="search-example-empty">
                        <p className="search-example-empty-title">No problems found for "{searchTerm}"</p>
                        <p className="search-example-empty-subtitle">Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 2: Multi-field Search
// ============================================
export function MultiFieldSearchExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = useMemo(() => {
        if (!searchTerm) return problems

        const term = searchTerm.toLowerCase()

        return problems.filter(p =>
            // Search in multiple fields
            p.name?.toLowerCase().includes(term) ||
            p.platform?.toLowerCase().includes(term) ||
            p.tags?.some(tag => tag.toLowerCase().includes(term)) ||
            p.difficulty?.toLowerCase().includes(term)
        )
    }, [problems, searchTerm])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by name, platform, difficulty, or tags..."
                />
            </div>

            <div className="search-example-list">
                {filtered.length > 0 ? (
                    filtered.map(problem => (
                        <div key={problem.id} className="search-example-list-item">
                            <div>
                                <h3 className="search-example-list-item-title">{problem.name}</h3>
                                <p className="search-example-list-item-platform">{problem.platform}</p>
                                {problem.tags && problem.tags.length > 0 && (
                                    <div className="search-example-list-item-tags">
                                        {problem.tags.map(tag => (
                                            <span key={tag} className="search-example-list-item-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="search-example-list-item-difficulty">{problem.difficulty}</span>
                        </div>
                    ))
                ) : (
                    <div className="search-example-empty">
                        <p className="search-example-empty-title">No results found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 3: Search with Stats
// ============================================
export function SearchWithStatsExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = useMemo(() => {
        if (!searchTerm) return problems
        return problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [problems, searchTerm])

    const stats = useMemo(() => {
        return {
            total: filtered.length,
            easy: filtered.filter(p => p.difficulty === 'EASY').length,
            medium: filtered.filter(p => p.difficulty === 'MEDIUM').length,
            hard: filtered.filter(p => p.difficulty === 'HARD').length,
            solved: filtered.filter(p => p.solved).length,
        }
    }, [filtered])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
            </div>

            {/* Results Stats */}
            <div className="search-example-stats">
                <div className="search-example-stat-card total">
                    <p className="search-example-stat-label">Total</p>
                    <p className="search-example-stat-value">{stats.total}</p>
                </div>
                <div className="search-example-stat-card easy">
                    <p className="search-example-stat-label easy">Easy</p>
                    <p className="search-example-stat-value easy">{stats.easy}</p>
                </div>
                <div className="search-example-stat-card medium">
                    <p className="search-example-stat-label medium">Medium</p>
                    <p className="search-example-stat-value medium">{stats.medium}</p>
                </div>
                <div className="search-example-stat-card hard">
                    <p className="search-example-stat-label hard">Hard</p>
                    <p className="search-example-stat-value hard">{stats.hard}</p>
                </div>
                <div className="search-example-stat-card solved">
                    <p className="search-example-stat-label solved">Solved</p>
                    <p className="search-example-stat-value solved">{stats.solved}</p>
                </div>
            </div>

            {/* Results List */}
            <div className="search-example-grid">
                {filtered.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 4: Real-time Search with Highlighting
// ============================================
export function HighlightingSearchExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = useMemo(() => {
        if (!searchTerm) return problems
        return problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [problems, searchTerm])

    const highlightText = (text, highlight) => {
        if (!highlight) return text

        const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={i} className="search-example-highlight">
                    {part}
                </span>
            ) : (
                part
            )
        )
    }

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
            </div>

            <div className="search-example-list">
                {filtered.map(problem => (
                    <div
                        key={problem.id}
                        className="search-example-list-item"
                    >
                        <h3 className="search-example-list-item-title">
                            {highlightText(problem.name, searchTerm)}
                        </h3>
                        <p className="search-example-list-item-platform">{problem.platform}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 5: Debounce Configuration
// ============================================
export function CustomDebounceExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCount, setSearchCount] = useState(0)

    const handleSearch = (term) => {
        setSearchTerm(term)
        setSearchCount(prev => prev + 1)
        console.log(`Search triggered. Total searches: ${searchCount}`)
    }

    const filtered = useMemo(() => {
        if (!searchTerm) return problems
        return problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [problems, searchTerm])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    debounceMs={500}  // 500ms debounce for heavy operations
                />
            </div>

            <div className="search-example-info">
                <p>Search count: {searchCount}</p>
                <p className="text-sm">Notice how it debounces your input!</p>
            </div>

            <div className="search-example-grid">
                {filtered.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 6: Search with Clear Callback
// ============================================
export function SearchWithClearExample({ problems, onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchChange = (term) => {
        setSearchTerm(term)
        onFilterChange?.({ search: term })
    }

    const handleClear = () => {
        setSearchTerm('')
        onFilterChange?.({ search: '' })
    }

    const filtered = useMemo(() => {
        if (!searchTerm) return problems
        return problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [problems, searchTerm])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClear={handleClear}
                />
            </div>

            {searchTerm && (
                <div className="search-example-info">
                    <p>Filtering: <span className="search-example-info-text">"{searchTerm}"</span></p>
                </div>
            )}

            <div className="search-example-grid">
                {filtered.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    )
}

// ============================================
// EXAMPLE 7: Advanced Syntax Search
// ============================================
export function AdvancedSyntaxSearchExample({ problems }) {
    const [searchTerm, setSearchTerm] = useState('')

    const parseSearchTerm = (term) => {
        const result = {
            name: '',
            platform: '',
            difficulty: '',
        }

        // Parse: name:problem_name platform:leetcode difficulty:hard
        const matches = term.match(/(\w+):(\w+)/g)
        if (matches) {
            matches.forEach(match => {
                const [key, value] = match.split(':')
                if (key in result) {
                    result[key] = value.toLowerCase()
                }
            })
            return result
        }

        // If no special syntax, search in name
        result.name = term.toLowerCase()
        return result
    }

    const filtered = useMemo(() => {
        if (!searchTerm) return problems

        const criteria = parseSearchTerm(searchTerm)

        return problems.filter(p => {
            if (criteria.name && !p.name.toLowerCase().includes(criteria.name)) return false
            if (criteria.platform && !p.platform.toLowerCase().includes(criteria.platform)) return false
            if (criteria.difficulty && !p.difficulty.toLowerCase().includes(criteria.difficulty)) return false
            return true
        })
    }, [problems, searchTerm])

    return (
        <div className="search-example">
            <div className="search-example-search-wrapper">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder='Search: "two sum" or "platform:leetcode difficulty:easy"'
                />
            </div>

            <div className="search-example-tip">
                <p className="search-example-tip-text">
                    💡 Tip: Use syntax like <code className="search-example-tip-code">name:problem_name</code> or <code className="search-example-tip-code">platform:leetcode</code>
                </p>
            </div>

            <div className="search-example-grid">
                {filtered.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    )
}

/**
 * Usage in your component:
 * 
 * import { BasicSearchExample } from './SearchBarExamples'
 * 
 * export default function App() {
 *     return <BasicSearchExample problems={myProblems} />
 * }
 */
