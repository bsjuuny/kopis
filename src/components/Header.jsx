import React from 'react';
import { Ticket, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="glass-panel sticky top-0 z-50 mb-8">
            <div className="container h-14 xs:h-16 flex-between">
                <Link to="/" className="flex-center gap-2 xs:gap-3 group transition-transform active:scale-95">
                    <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-2 xs:p-2.5 rounded-xl group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-[var(--accent-glow)]">
                        <Ticket className="text-white w-5 h-5 xs:w-6 xs:h-6" />
                    </div>
                    <h1 className="text-lg xs:text-xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">KOPIS</span> Arts
                    </h1>
                </Link>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    className="ml-auto flex-center w-9 h-9 xs:w-10 xs:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-focus)] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-4 h-4 xs:w-5 xs:h-5 text-amber-400" />
                    ) : (
                        <Moon className="w-4 h-4 xs:w-5 xs:h-5 text-violet-500" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
