const pool = require('../config/db');
const { validationResult } = require('express-validator');

// Create a Job (Admin Only)
exports.createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, job_type } = req.body;
    const created_by = req.user.user_id;

    try {
        const newJob = await pool.query(
            'INSERT INTO jobs (title, description, location, job_type, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, location, job_type, created_by]
        );

        res.status(201).json(newJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Jobs (Public - with Search & Filters)
exports.getAllJobs = async (req, res) => {
    const { search, location, job_type } = req.query;

    try {
        let query = 'SELECT * FROM jobs WHERE 1=1';
        const values = [];
        let paramIndex = 1;

        if (search) {
            query += ` AND title ILIKE $${paramIndex}`;
            values.push(`%${search}%`);
            paramIndex++;
        }

        if (location) {
            query += ` AND location ILIKE $${paramIndex}`;
            values.push(`%${location}%`);
            paramIndex++;
        }

        if (job_type) {
            query += ` AND job_type = $${paramIndex}`;
            values.push(job_type);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';

        const jobs = await pool.query(query, values);
        res.json(jobs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Job by ID (Public)
exports.getJobById = async (req, res) => {
    try {
        const job = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [req.params.id]);

        if (job.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Job (Admin Only)
exports.updateJob = async (req, res) => {
    const { title, description, location, job_type } = req.body;
    const { id } = req.params;

    try {
        // Check if job exists
        const checkJob = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
        if (checkJob.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const updatedJob = await pool.query(
            'UPDATE jobs SET title = $1, description = $2, location = $3, job_type = $4 WHERE job_id = $5 RETURNING *',
            [title, description, location, job_type, id]
        );

        res.json(updatedJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Job (Admin Only)
exports.deleteJob = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM jobs WHERE job_id = $1 RETURNING *', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};