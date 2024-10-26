import { useState } from "react";
import { Link, Route, HashRouter as Router, Routes } from "react-router-dom";
import Matches from "./pages/Matches";
import Rules from "./pages/Rules";
import Standings from "./pages/Standings";

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark", !isDarkMode);
    };

    return (
        <Router>
            <div
                className={`min-h-screen transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
            >
                <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo or Branding */}
                            <div className="flex items-center">
                                <img
                                    src="equipe_logo.png"
                                    alt="Logo"
                                    className="h-8 w-8 mr-2" // Adjust the size as needed
                                />
                                <Link
                                    to="/"
                                    className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                >
                                    La Ligue des Légendes
                                </Link>
                            </div>

                            {/* Centered Menu items */}
                            <ul className="flex-grow flex justify-center space-x-8">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Classement
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/matches"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Matchs
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/rules"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Règles
                                    </Link>
                                </li>
                            </ul>

                            {/* Dark Mode Toggle */}
                            <div className="flex items-center">
                                <button
                                    onClick={toggleDarkMode}
                                    className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-700 dark:text-gray-300 focus:outline-none transition-colors duration-300"
                                >
                                    {isDarkMode ? (
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M20.354 15.354A9 9 0 118.646 3.646a7 7 0 0011.708 11.708z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 3v1m0 16v1m8.66-9.66h-1M4.34 12h-1m15.36 4.66l-.71-.71M6.34 6.34l-.71-.71m12.02 0l-.71.71M6.34 17.66l-.71.71M12 8a4 4 0 100 8 4 4 0 000-8z"
                                            ></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="p-6 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Standings />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/rules" element={<Rules />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
