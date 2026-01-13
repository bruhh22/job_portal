const pool = require('../config/db');

// Add Job to Favourites (Candidate Only)
exports.addFavourite = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.user_id;

    try {
        // 1. Check if job exists
        const jobCheck = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);
        if (jobCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 2. Check if already favourited
        const existingFav = await pool.query(
            'SELECT * FROM favourites WHERE user_id = $1 AND job_id = $2',
            [userId, jobId]
        );

        if (existingFav.rows.length > 0) {
            return res.status(400).json({ message: 'Job already in favourites' });
        }

        // 3. Add to favourites
        const newFav = await pool.query(
            'INSERT INTO favourites (user_id, job_id) VALUES ($1, $2) RETURNING *',
            [userId, jobId]
        );

        res.status(201).json(newFav.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Remove Job from Favourites (Candidate Only)
exports.removeFavourite = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.user_id;

    try {
        const result = await pool.query(
            'DELETE FROM favourites WHERE user_id = $1 AND job_id = $2 RETURNING *',
            [userId, jobId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Favourite not found' });
        }

        res.json({ message: 'Removed from favourites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get My Favourites (Candidate Only - JOIN jobs)
exports.getMyFavourites = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const favourites = await pool.query(
            `SELECT f.favourite_id, f.saved_at, j.job_id, j.title, j.location, j.job_type 
       FROM favourites f 
       JOIN jobs j ON f.job_id = j.job_id 
       WHERE f.user_id = $1
       ORDER BY f.saved_at DESC`,
            [userId]
        );

        res.json(favourites.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};