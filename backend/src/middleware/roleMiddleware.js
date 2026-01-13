// Middleware to check if the user is an Admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

// Middleware to check if the user is a Candidate
const checkCandidate = (req, res, next) => {
    if (req.user && req.user.role === 'candidate') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Candidates only' });
    }
};

module.exports = { checkAdmin, checkCandidate };