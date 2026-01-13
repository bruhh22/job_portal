import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
import { AuthContext } from '../../context/AuthContext.js';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const res = await axiosInstance.get(`/jobs/${id}`);
            setJob(res.data);
            setLoading(false);
        } catch (err) {
            setError('Job not found');
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await axiosInstance.post(`/applications/${id}`);
            setActionMsg({ type: 'success', text: 'Application submitted successfully!' });
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err.response?.data?.message || 'Failed to apply'
            });
        }
    };

    const handleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await axiosInstance.post(`/favourites/${id}`);
            setActionMsg({ type: 'success', text: 'Job saved to favourites!' });
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err.response?.data?.message || 'Failed to save job'
            });
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded shadow-lg max-w-4xl mx-auto border border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline mb-6 flex items-center"
                >
                    &larr; Back to Jobs
                </button>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            {job.job_type}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                            📍 {job.location}
                        </span>
                        <span className="text-gray-500 flex items-center px-2">
                            📅 Posted on {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {actionMsg.text && (
                    <div className={`p-4 mb-6 rounded border ${actionMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {actionMsg.text}
                    </div>
                )}

                <div className="border-t border-b border-gray-100 py-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {job.description}
                    </p>
                </div>

                {user && user.role === 'candidate' && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm"
                        >
                            Save Job
                        </button>
                    </div>
                )}

                {(!user) && (
                    <div className="bg-gray-50 p-4 rounded text-center">
                        <p className="text-gray-600 mb-2">Login to Apply or Save this job.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;