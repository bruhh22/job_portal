import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded flex items-center">
                    📍 {job.location}
                </span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center">
                    💼 {job.job_type}
                </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{job.description}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                </span>
                <Link
                    to={`/jobs/${job.job_id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;