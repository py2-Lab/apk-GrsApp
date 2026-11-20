
const jwt = require("jsonwebtoken");

function createToken(admin) {
    return jwt.sign(
        {
            sub: admin._id.toString(),
            role: admin.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );
}

module.exports = createToken;
