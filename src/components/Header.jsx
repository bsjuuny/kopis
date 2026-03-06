import React from 'react';
import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="glass-panel sticky top-0 z-50 mb-8">
            <div className="container h-14 xs:h-16 flex-between">
                <Link to="/" className="flex-center gap-1.5 xs:gap-2 group">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 xs:p-2 rounded-md xs:rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Ticket className="text-white w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h1 className="text-base xs:text-lg sm:text-xl font-bold tracking-tight">
                        <span className="text-gradient">KOPIS</span> Arts
                    </h1>
                </Link>
            </div>
        </header>
    );
};

export default Header;
