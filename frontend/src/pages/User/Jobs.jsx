import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import JobCard from '../../components/JobCard.jsx';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ location: '', job_type: '' });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchTerm, jobs, filters]);

    const fetchJobs = async () => {
        try {
            const res = await axiosInstance.get('/jobs');
            setJobs(res.data);
            setFilteredJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let result = jobs;

        // Filter by Search Title
        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Location
        if (filters.location) {
            result = result.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by Job Type
        if (filters.job_type) {
            result = result.filter(job => job.job_type === filters.job_type);
        }

        setFilteredJobs(result);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading jobs...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded shadow-sm mb-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Browse Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by Job Title..."
                        className="p-3 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Filter by Location..."
                        className="p-3 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                    <select
                        name="job_type"
                        className="p-3 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        value={filters.job_type}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobCard key={job.job_id} job={job} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10 bg-white rounded shadow-sm">
                        <p className="text-lg">No jobs found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilters({ location: '', job_type: '' }) }}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;