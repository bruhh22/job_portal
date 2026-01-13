import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobApplicants, setSelectedJobApplicants] = useState(null); // For modal
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axiosInstance.get('/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axiosInstance.delete(`/jobs/${id}`);
                setJobs(jobs.filter(job => job.job_id !== id));
            } catch (err) {
                alert('Failed to delete job');
            }
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            // Assuming backend route GET /api/applications/job/:jobId
            const res = await axiosInstance.get(`/applications/job/${jobId}`);
            setSelectedJobApplicants(res.data);
            setShowModal(true);
        } catch (err) {
            alert('Failed to fetch applicants');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading jobs...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Jobs</h1>
                <Link
                    to="/admin/jobs/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Post New Job
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.job_id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-medium">{job.title}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{job.location}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">{job.job_type}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                    <button
                                        onClick={() => fetchApplicants(job.job_id)}
                                        className="text-blue-600 hover:text-blue-900 mx-2"
                                    >
                                        View Applicants
                                    </button>
                                    <Link
                                        to={`/admin/jobs/edit/${job.job_id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job.job_id)}
                                        className="text-red-600 hover:text-red-900 mx-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No jobs found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Applicants Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Applicants</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mt-2">
                            {selectedJobApplicants && selectedJobApplicants.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {selectedJobApplicants.map((app) => (
                                        <li key={app.application_id} className="py-3">
                                            <p className="text-sm font-medium text-gray-900">{app.name}</p>
                                            <p className="text-sm text-gray-500">{app.email}</p>
                                            <p className="text-xs text-gray-400">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No applicants for this job yet.</p>
                            )}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminJobs;