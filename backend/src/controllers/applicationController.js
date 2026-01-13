const pool = require('../config/db');

// Apply for a Job (Candidate Only)
exports.applyForJob = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.user_id;

    try {
        // 1. Check if job exists
        const jobCheck = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);
        if (jobCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 2. Check if already applied
        const existingApplication = await pool.query(
            'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
            [userId, jobId]
        );

        if (existingApplication.rows.length > 0) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // 3. Create Application
        const newApplication = await pool.query(
            'INSERT INTO applications (user_id, job_id) VALUES ($1, $2) RETURNING *',
            [userId, jobId]
        );

        res.status(201).json(newApplication.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get My Applications (Candidate Only - JOIN jobs)
exports.getMyApplications = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const applications = await pool.query(
            `SELECT a.application_id, a.applied_at, j.job_id, j.title, j.company, j.location, j.job_type 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.job_id 
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
            [userId]
        );

        res.json(applications.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Applicants for a specific Job (Admin Only)
exports.getJobApplicants = async (req, res) => {
    const { jobId } = req.params;

    try {
        const applicants = await pool.query(
            `SELECT a.application_id, a.applied_at, u.user_id, u.name, u.email 
       FROM applications a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
            [jobId]
        );

        res.json(applicants.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};