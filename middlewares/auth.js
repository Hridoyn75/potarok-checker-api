import jwt from "jsonwebtoken";
export const AuthenticatedUser = (req, res, next) => {
    const getCookie = req.cookies.jwt;

    jwt.verify(getCookie, process.env.SECRET_KEY, (err, data) => {
        if (err) return res.status(401).json("User is not authenticated");
        req.user = data.id;
        next();
    })


}