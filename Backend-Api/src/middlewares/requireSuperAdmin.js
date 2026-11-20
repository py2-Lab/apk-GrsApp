
function requireSuperAdmin(req, res, next) {
    if (!req.auth || req.auth.role !== "superadmin") {
        return res.status(403).json({
            message: "Akses hanya untuk Super Admin.",
        });
    }

    return next();
}

module.exports = requireSuperAdmin;
