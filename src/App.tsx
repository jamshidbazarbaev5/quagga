// import React from 'react';
import { Scanner } from './Components/Scanner';
import { Bonuses } from './Components/Bonuses';

export const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Scanner APP</h1>
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="container mx-auto px-4 py-8">
                <Scanner />
                <Bonuses />
            </main>
        </div>
    );
}