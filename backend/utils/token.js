import jwt from 'jsonwebtoken';

const generateToken = (id, duration) => {
    const token = jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: duration });
    return token;
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };