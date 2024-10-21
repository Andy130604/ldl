import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Standings from "./pages/Standings";
import Matches from "./pages/Matches";
import Rules from "./pages/Rules";

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark", !isDarkMode);
    };

    return (
        <Router>
            <div
                className={`min-h-screen ${
                    isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
            >
                <nav className={`bg-blue-500 p-4 ${isDarkMode ? "dark:bg-gray-800" : ""}`}>
                    <div className="container mx-auto flex justify-between items-center">
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/" className="hover:text-gray-200">
                                    Classement
                                </Link>
                            </li>
                            <li>
                                <Link to="/matches" className="hover:text-gray-200">
                                    Matchs
                                </Link>
                            </li>
                            <li>
                                <Link to="/rules" className="hover:text-gray-200">
                                    Règles
                                </Link>
                            </li>
                        </ul>
                        <button
                            onClick={toggleDarkMode}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                            {isDarkMode ? "Mode Clair" : "Mode Sombre"}
                        </button>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Standings />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/rules" element={<Rules />} />
                </Routes>
            </div>
        </Router>
    );
}
