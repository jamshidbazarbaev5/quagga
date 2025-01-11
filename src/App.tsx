import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scanner } from './Components/Scanner';
import { Bonuses } from './Components/Bonuses';
import { Coins, Menu } from 'lucide-react';
import  MobileMenu  from './Components/MobileMenu'

export const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Coins className="w-5 h-5" />
                                <Link to="/" className="text-black-600 hover:text-gray-900">Scanner</Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/bonuses" className="text-gray-600 hover:text-gray-900"></Link>
                                <button 
                                    onClick={() => setIsMenuOpen(true)}
                                    className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
                
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Scanner />} />
                        <Route path="/bonuses" element={<Bonuses />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}