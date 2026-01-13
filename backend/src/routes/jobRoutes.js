const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jobController = require('../controllers/jobController');
const checkAuth = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roleMiddleware');

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private (Admin)
router.post(
    '/',
    [
        checkAuth,
        checkAdmin,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('location', 'Location is required').not().isEmpty(),
            check('job_type', 'Job Type is required').not().isEmpty()
        ]
    ],
    jobController.createJob
);

// @route   GET /api/jobs
// @desc    Get all jobs (with optional filters)
// @access  Public
router.get('/', jobController.getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', jobController.getJobById);

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Admin)
router.put('/:id', [checkAuth, checkAdmin], jobController.updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Admin)
router.delete('/:id', [checkAuth, checkAdmin], jobController.deleteJob);

module.exports = router;