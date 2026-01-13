const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const checkAuth = require('../middleware/authMiddleware');
const { checkCandidate } = require('../middleware/roleMiddleware');

// @route   POST /api/favourites/:jobId
// @desc    Add job to favourites
// @access  Private (Candidate)
router.post('/:jobId', [checkAuth, checkCandidate], favouriteController.addFavourite);

// @route   DELETE /api/favourites/:jobId
// @desc    Remove job from favourites
// @access  Private (Candidate)
router.delete('/:jobId', [checkAuth, checkCandidate], favouriteController.removeFavourite);

// @route   GET /api/favourites/my
// @desc    Get all favourite jobs
// @access  Private (Candidate)
router.get('/my', [checkAuth, checkCandidate], favouriteController.getMyFavourites);

module.exports = router;