import { useState } from 'react'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import StatsSection from '../components/landing/StatsSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import AuthModal from '../components/landing/AuthModal'
import './Landing.css'

export default function Landing() {
    const [authModalOpen, setAuthModalOpen] = useState(false)

    return (
        <div className="landing-page">
            {/* Background Effects */}
            <div className="landing-background">
                <div className="landing-background__gradient"></div>
                <div className="landing-background__orbs">
                    <div className="landing-background__orb--top"></div>
                    <div className="landing-background__orb--bottom"></div>
                </div>
            </div>

            {/* Content */}
            <Navbar onAuthClick={() => setAuthModalOpen(true)} />
            <HeroSection onGetStarted={() => setAuthModalOpen(true)} />
            <StatsSection />
            <FeaturesSection />
            <HowItWorks />

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer__container">
                    <div className="landing-footer__logo">
                        <div className="landing-footer__logo-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                            </svg>
                        </div>
                        <span className="landing-footer__logo-text">CodeVault</span>
                    </div>
                    <p className="landing-footer__tagline">Your personal vault for coding interviews</p>
                    <div className="landing-footer__links">
                        <button className="landing-footer__link">Privacy</button>
                        <button className="landing-footer__link">Terms</button>
                        <button className="landing-footer__link">Contact</button>
                    </div>
                    <p className="landing-footer__copyright">© 2026 CodeVault. All rights reserved.</p>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
    )
}
