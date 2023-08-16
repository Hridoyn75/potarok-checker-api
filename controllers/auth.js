import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const Login = (req, res)=>{
    // CHECK IF USER REGISTERED OR NOT
    const { email } = req.body;
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials

    const q = "SELECT * FROM users WHERE ? = email";

    db.query(q, [email], (err, result)=>{
        if (err) return res.status(500).json({ error: err });

        if(result.length === 0) return res.status(404).json({ error:"User not found"})
        
        // IF PASSWORD IS NULL THEN SHOW THIS ERROR
        if(!result[0].password) return res.status(400).json({ error:"You have a Account. But you need to use 'Login with Google' to access your account."})
        
        // CHECK PASSWORD
        const correctPassword = bcrypt.compareSync(req.body.password, result[0].password)
        if(!correctPassword) return res.status(401).json({ error: "Invalid Password!" });
        
        const { password, ...others} = result[0];

        const token = jwt.sign({"id": others.id}, process.env.SECRET_KEY, { expiresIn: '30d' });

        res.cookie("jwt",token, {
            httpOnly: true,
            maxAge: 2592000000,
            sameSite: 'none', 
            secure: true,
        })
        return res.json({message: "Logged in successfully", data: others });
    });

   
}

export const Signup = (req, res)=>{
    const { name,username, email, password, bio="New User"} = req.body;
    // CHECK IF USER OR EMAIL ALREADY EXISTS
    const q = "SELECT * FROM users where email= ? or username= ?";
    db.query(q, [email, username], (err, data) => {
        if(err) return res.json(err);

         if(data.length > 0) return res.status(400).json({error: "user already exists"});
        // HASH THE PASSWORD
        try {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            // REGISTER THE USER ON DATABASE
            const q = 'INSERT INTO users (name,username, email, password, bio) VALUES(?)';
            const values = [name,username, email, hash, bio];

            db.query(q, [values], (err, result) => {
                if(err) return res.json(err);
                return res.status(201).json("User created");
            });
            
        } catch (err) {
            return console.log(err);
        }
        
    });
}

// UPDATE USER DETAILS EXCEPT PASSWORD
export const UpdateUserDetails = (req, res) => {
    const currentUser = req.user;
    const { name, username, email=null, photo=null, bio, facebookID=null, websiteURL=null } = req.body;
    
    // CHECK IF USER NAME ALREADY TAKEN OR NOT
    const q = "SELECT * FROM users WHERE username = ? AND id != ?";
    db.query(q, [username, currentUser],(err, data) => {
        if (err) return res.status(400).json(err);
        if(data.length > 0) return res.status(400).json({error: "username already taken"});


        // UPDATE USER DETAILS
        const q2 = `UPDATE users
        SET 
        name = ?, 
        username = ?, 
        photo = ?, 
        bio = ?, 
        facebookID = ?,
        websiteURL = ?
        WHERE id = ?`

    db.query(q2,
            [name, username, photo, bio, facebookID, websiteURL, currentUser],
            (err, data) =>{
            if (err) return res.status(400).json(err);
            res.json({"message": "Profile updated successfully",
             "data": {id: currentUser,name, username, email, photo, bio, facebookID, websiteURL }});
            })
        });
}



// LOG OUT USER
export const Logout = (req, res) => {
    res.cookie("jwt",null, {
        httpOnly: true
    })
    res.json("logged out successfully")
};