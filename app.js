
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , OpenidConnectStrategy = require('passport-openidconnect').Strategy;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/google', passport.authenticate('openidconnect'));
app.get('/oauth2callback', passport.authenticate('openidconnect', {
    failureRedirect: '/login'
}), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

passport.use(new OpenidConnectStrategy({
    authorizationURL: "https://accounts.google.com/o/oauth2/auth",
    tokenURL: "https://accounts.google.com/o/oauth2/token",
    userInfoURL: "https://www.googleapis.com/oauth2/v1/userinfo",
    clientID: "99177253883-ns2fuh86pim1u9fgpqvtr3bfo2s254lu.apps.googleusercontent.com",
    clientSecret: "bEOKU8p_ZpDdfZfBBFZ01KyW",
    callbackURL: "http://localhost:3000/oauth2callback",
    scope: ["openid", "email", "profile" ]
}, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log('profile: ', profile);
    return done(null, profile);
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
