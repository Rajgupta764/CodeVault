import { useState } from 'react'
import './Navbar.css'

export default function Navbar({ onAuthClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-row">
                    <div className="navbar-logo">
                        <div className="navbar-logo-mark">
                            <svg className="navbar-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <span className="navbar-logo-text">CodeVault</span>
                    </div>

                    <div className="navbar-links">
                        <a href="#features" className="navbar-link">
                            Features
                        </a>
                        <a href="#how-it-works" className="navbar-link">
                            How it works
                        </a>
                        <button onClick={onAuthClick} className="navbar-cta">
                            Get started
                        </button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="navbar-menu-toggle"
                        aria-label="Toggle menu"
                    >
                        <svg className="navbar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="navbar-mobile">
                        <div className="navbar-mobile-links">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="navbar-mobile-link"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setMobileMenuOpen(false)}
                                className="navbar-mobile-link"
                            >
                                How it works
                            </a>
                            <button
                                onClick={() => {
                                    onAuthClick()
                                    setMobileMenuOpen(false)
                                }}
                                className="navbar-mobile-cta"
                            >
                                Get started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
