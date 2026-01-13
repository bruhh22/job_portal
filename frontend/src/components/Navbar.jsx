import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Brand */}
                <Link to={user?.role === 'admin' ? '/admin/jobs' : '/jobs'} className="text-xl font-bold">
                    JobPortal
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                // Admin Links
                                <>
                                    <Link to="/admin/jobs" className="hover:text-blue-200">Manage Jobs</Link>
                                    <Link to="/admin/jobs/create" className="hover:text-blue-200">Post Job</Link>
                                </>
                            ) : (
                                // Candidate Links
                                <>
                                    <Link to="/jobs" className="hover:text-blue-200">Browse Jobs</Link>
                                    <Link to="/my-applications" className="hover:text-blue-200">My Applications</Link>
                                    <Link to="/my-favourites" className="hover:text-blue-200">Saved Jobs</Link>
                                </>
                            )}

                            <div className="flex items-center space-x-4 ml-4 border-l border-blue-400 pl-4">
                                <span className="text-sm font-medium">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        // Guest Links
                        <>
                            <Link to="/login" className="hover:text-blue-200">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;