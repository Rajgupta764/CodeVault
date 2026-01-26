import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock } from 'lucide-react'
import './SearchBar.css'

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search problems by name...',
    onClear,
    showRecentSearches = true,
    debounceMs = 300
}) {
    const [isFocused, setIsFocused] = useState(false)
    const [recentSearches, setRecentSearches] = useState([])
    const [showRecent, setShowRecent] = useState(false)
    const inputRef = useRef(null)
    const debounceTimerRef = useRef(null)

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('recentSearches')
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse recent searches:', e)
            }
        }
    }, [])

    // Handle keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
            }
            // Escape key to close recent searches
            if (e.key === 'Escape' && showRecent) {
                setShowRecent(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showRecent])

    // Debounced onChange handler
    const handleInputChange = useCallback((e) => {
        const newValue = e.target.value

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            onChange(newValue)
        }, debounceMs)
    }, [onChange, debounceMs])

    // Handle search submission
    const handleSearch = () => {
        if (value.trim() && showRecentSearches) {
            // Add to recent searches (max 5)
            const updated = [value, ...recentSearches.filter(s => s !== value)].slice(0, 5)
            setRecentSearches(updated)
            localStorage.setItem('recentSearches', JSON.stringify(updated))
        }
        setShowRecent(false)
    }

    // Handle recent search selection
    const handleRecentSearch = (searchTerm) => {
        inputRef.current.value = searchTerm
        onChange(searchTerm)
        setShowRecent(false)
    }

    // Handle clear button
    const handleClear = () => {
        inputRef.current.value = ''
        onChange('')
        onClear?.()
        inputRef.current?.focus()
    }

    return (
        <div className="search-bar">
            {/* Search Input Container */}
            <div className={`search-bar-input-container ${isFocused ? 'focused' : 'unfocused'}`}>
                {/* Background glow effect on focus */}
                <div className={`search-bar-glow ${isFocused ? 'focused' : ''}`} />

                {/* Main input wrapper */}
                <div className={`search-bar-wrapper ${isFocused ? 'focused' : 'unfocused'}`}>

                    {/* Search Icon */}
                    <div className={`search-bar-icon ${isFocused ? 'focused' : ''}`}>
                        <Search strokeWidth={2} />
                    </div>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        defaultValue={value}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setIsFocused(true)
                            if (showRecentSearches && recentSearches.length > 0) {
                                setShowRecent(true)
                            }
                        }}
                        onBlur={() => {
                            setIsFocused(false)
                            // Delay hiding to allow clicking on recent searches
                            setTimeout(() => setShowRecent(false), 200)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                        className="search-bar-input"
                    />

                    {/* Clear Button (X icon) */}
                    {value && (
                        <button
                            onClick={handleClear}
                            className="search-bar-clear"
                            title="Clear search"
                            type="button"
                        >
                            <div className="search-bar-clear-inner">
                                <X strokeWidth={2.5} />
                            </div>
                        </button>
                    )}

                    {/* Keyboard shortcut hint */}
                    {!value && !isFocused && (
                        <div className="search-bar-shortcut">
                            <kbd>Ctrl+K</kbd>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Searches Dropdown */}
            {showRecent && recentSearches.length > 0 && (
                <div className="search-bar-dropdown">
                    <div className="search-bar-dropdown-menu">
                        <div className="search-bar-dropdown-content">
                            {/* Header */}
                            <div className="search-bar-dropdown-header">
                                <Clock strokeWidth={2} />
                                <span>Recent Searches</span>
                            </div>

                            {/* Recent search items */}
                            <div className="search-bar-recent-list">
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={`${search}-${index}`}
                                        onClick={() => handleRecentSearch(search)}
                                        className="search-bar-recent-item"
                                    >
                                        <Clock className="search-bar-recent-item-icon" strokeWidth={2} />
                                        <span className="search-bar-recent-item-text">{search}</span>
                                        <X className="search-bar-recent-item-clear" strokeWidth={2} />
                                    </button>
                                ))}
                            </div>

                            {/* Clear all recent searches */}
                            <button
                                onClick={() => {
                                    setRecentSearches([])
                                    localStorage.removeItem('recentSearches')
                                    setShowRecent(false)
                                }}
                                className="search-bar-clear-history"
                            >
                                Clear history
                            </button>
                        </div>
                    </div>

                    {/* Dropdown arrow indicator */}
                    <div className="search-bar-dropdown-arrow" />
                </div>
            )}

            {/* Search tips / Help text */}
            {isFocused && !value && (
                <div className="search-bar-help">
                    <p className="search-bar-help-text">
                        <span>Type to search • Press <kbd className="search-bar-help-kbd">Enter</kbd> to search</span>
                    </p>
                </div>
            )}
        </div>
    )
}
