import jwt from "jsonwebtoken";
export const AuthenticatedUser = (req, res, next) => {
    const getCookie = req.cookies.jwt;

    jwt.verify(getCookie, "secretKey", (err, data) => {
        if (err) return res.status(401).json("user not authenticated");
        req.user = data.id;
        next();
    })


}