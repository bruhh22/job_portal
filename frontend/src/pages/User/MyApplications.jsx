import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { Link } from 'react-router-dom';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axiosInstance.get('/applications/my');
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching applications:', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading applications...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Applications</h1>

            {applications.length === 0 ? (
                <div className="bg-white p-8 rounded shadow text-center text-gray-500 border border-gray-200">
                    <p className="mb-4">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.application_id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 font-bold">{app.title}</p>
                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{app.job_type}</span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900">{app.location}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900">
                                                {new Date(app.applied_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <Link to={`/jobs/${app.job_id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                View Job
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;