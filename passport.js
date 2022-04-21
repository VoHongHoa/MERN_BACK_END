const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/User");
const token = require("./token/token");
const GOOGLE_CLIENT_ID =
  "1000261381053-acnpjvmhm485p7aal87iicf70bvdm04a.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      let user = await User.find({ email: profile.emails[0].value });
      //   console.log(user);
      if (user.length === 0) {
        const newUser = new User({
          email: profile.emails[0].value,
          fullname: profile.displayName,
          username: profile.emails[0].value,
          password: "123",
          img: profile.photos[0].value,
          role: "Customer",
        });
        newUser.save();
      }
      console.log(profile.emails[0].value);
      done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
