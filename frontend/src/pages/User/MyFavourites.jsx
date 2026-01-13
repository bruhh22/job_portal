import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import JobCard from '../../components/JobCard.jsx';

const MyFavourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        try {
            const res = await axiosInstance.get('/favourites/my');
            setFavourites(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching favourites:', err);
            setLoading(false);
        }
    };

    const removeFavourite = async (jobId) => {
        if (!window.confirm("Remove this job from favourites?")) return;
        try {
            await axiosInstance.delete(`/favourites/${jobId}`);
            // Optimistic update
            setFavourites(favourites.filter(fav => fav.job_id !== jobId));
        } catch (err) {
            alert('Failed to remove favourite');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading saved jobs...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Saved Jobs</h1>

            {favourites.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded shadow-sm border border-gray-200">
                    <p>No saved jobs found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favourites.map((fav) => (
                        <div key={fav.favourite_id} className="relative group">
                            <JobCard job={fav} />
                            <button
                                onClick={() => removeFavourite(fav.job_id)}
                                className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 shadow-sm opacity-90 hover:opacity-100 transition"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavourites;