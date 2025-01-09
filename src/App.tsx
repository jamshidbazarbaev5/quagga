import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scanner } from './Components/Scanner';
import { Bonuses } from './Components/Bonuses';

export const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="text-black-600 hover:text-gray-900">Scanner</Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/bonuses" className="text-gray-600 hover:text-gray-900">Mening Bonsularim</Link>
                            </div>
                        </div>
                    </div>
                </nav>
                
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