const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const checkAuth = require('../middleware/authMiddleware');
const { checkCandidate, checkAdmin } = require('../middleware/roleMiddleware');

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Candidate)
router.post('/:jobId', [checkAuth, checkCandidate], applicationController.applyForJob);

// @route   GET /api/applications/my
// @desc    Get jobs applied by logged-in user
// @access  Private (Candidate)
router.get('/my', [checkAuth, checkCandidate], applicationController.getMyApplications);

// @route   GET /api/applications/job/:jobId
// @desc    Get all applicants for a specific job
// @access  Private (Admin)
// Note: This corresponds to the requirement "GET /jobs/:jobId/applications" for Admin
// We route it here to keep application logic grouped together
router.get('/job/:jobId', [checkAuth, checkAdmin], applicationController.getJobApplicants);

module.exports = router;