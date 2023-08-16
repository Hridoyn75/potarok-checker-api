import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateFromEmail } from "unique-username-generator";
import db from '../db.js';
import jwt from "jsonwebtoken";


export const ConfigureGoogleStrategy = ()=>{

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: '363821221602-6709nalugj3tceeg37l092sofmdfn4g8.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {

    const email = profile.emails[0].value;
    const username = generateFromEmail(email,3);
    const name = profile.displayName;
    const photo = profile.photos[0].value;
    // CHECK IF USER OR EMAIL ALREADY EXISTS
    const q = "SELECT * FROM users where email= ? or username= ?";

    db.query(q, [email, username], (UserErr, UserData)=>{
        if(UserErr) {
            console.log(UserErr);
            return done(UserErr, null);
        }

        if(UserData.length > 0) {
             return done(null, UserData[0]);
        }else{
        const q2 = `INSERT INTO users (name, username, email, photo, bio )
                VALUES(?)`

        const inputs = [name, username, email ,photo, 'New User'];
        db.query(q2, [inputs], (CreateUserErr, CreateUserData)=>{
            if(CreateUserErr) {
                console.log(CreateUserErr);
                return done(CreateUserErr, null);
            }
            if(CreateUserData.affectedRows === 1){
                db.query("SELECT * FROM users WHERE email = ?", [email],(GetNewUserErr, GetNewUserData)=>{
                    if(GetNewUserErr) {
                        console.log(GetNewUserErr);
                        return done(GetNewUserErr, null);
                    }
                    return done(null, GetNewUserData[0]);
                })
            }else{
                return done(null, { "error": "something went wrong with bro-code: 42424 " });
            }
            
        });    
        }
    })

    }));

}


export const FinalCallGoogle =   (req, res) => {
    const {password, ...others} = req.user;

    const token = jwt.sign({"id": others.id}, "secretKey", { expiresIn: '30d' });
    res.cookie("jwt",token, {
        httpOnly: true,
        maxAge: 2592000000,
        sameSite: 'none', 
        secure: true,
    })

    const userString = JSON.stringify(others);

    res.redirect(`http://localhost:3000/auth/login-success?code=${userString}`);
  }