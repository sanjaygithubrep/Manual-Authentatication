const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
 const User = require('../models/user');
 passport.use(new LocalStrategy({
    usernameField: 'email' 
 },
 function(email,password,done){
     //find a user establish the identity
     User.findOne({email:email},function(err,user){
         if(err){
             console.log('Error in finding user-->Passport');
             return done(err);
         }
         if(! user||user.password != password){
             console.log('Invalid Username/Password');
             return done(null,false);
         }
         return done(null,user);


         });
     }

    ))
    //serialize the user to decide which key is to be kept in the cookie
 passport.serializeUser(function(user,done){
     done(null,user.id);
 });
 //deserialize the user to decide from the key in the cookie
 passport.deserializeUser(function(id,done){
     User.findById(id,function(err,user){
         if(err){
             console.log('Error in finding user-->Passport');
             return done(err);
         }
         return done(null,user);
     });
 });
 passport.checkAuthentication = function(req,res,next){
     console.log('check in');
     if(req.isAuthenticated()){
         return next();
     }
     //if user is not signed
     return res.redirect('/users/sign-in');
 }
 passport.setAuthenticatedUser = function(req,res,next){
     if(req.isAuthenticated()){
         //req.user contains the current signed in
         res.locals.user = req.user;

     }
     next();
 }
 module.exports = passport;