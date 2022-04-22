const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const argon2 = require("argon2");
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
      const user = await User.findOne({ email: profile.emails[0].value });
      //console.log(user);
      if (!user) {
        const hashedPassword = await argon2.hash("123");
        user = new User({
          email: profile.emails[0].value,
          fullname: profile.displayName,
          username: profile.emails[0].value,
          password: hashedPassword,
          img: profile.photos[0].value,
          role: "customer",
        });
        await user.save();
        done(null, user);
      } else {
        done(null, user);
      }
      // console.log(profile.emails[0].value);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
