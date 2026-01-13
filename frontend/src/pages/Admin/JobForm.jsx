import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const JobForm = () => {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        job_type: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const res = await axiosInstance.get(`/jobs/${id}`);
            setFormData({
                title: res.data.title,
                description: res.data.description,
                location: res.data.location,
                job_type: res.data.job_type,
            });
        } catch (err) {
            setError('Failed to fetch job details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await axiosInstance.put(`/jobs/${id}`, formData);
            } else {
                await axiosInstance.post('/jobs', formData);
            }
            navigate('/admin/jobs');
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || 'Failed to save job');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">
                    {isEditMode ? 'Edit Job' : 'Post New Job'}
                </h2>

                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Remote, New York"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Job Type</label>
                            <select
                                name="job_type"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.job_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/jobs')}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;