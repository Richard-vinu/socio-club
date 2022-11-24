import jwt from 'jsonwebtoken';

const auth = async(req, res, next) => {
    try {
        let token = req.headers["x-access-token"]

        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }

        jwt.verify(token, 'test', (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            req.user = decoded;
            // console.log(req.user, "---", decoded);
            next();
        });
    } catch (error) {
        console.log(error);
    }
}

export default auth;