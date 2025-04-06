import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { UserModel } from "../models/UserModel.js";
import { generateToken } from "../helpers/jwt.js";

dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // მოძებნეთ მომხმარებელი ბაზაში
        const email = profile.emails?.[0]?.value || "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let user = (await UserModel.findUserByEmail(email)) as any;

        if (!user) {
          // თუ მომხმარებელი არ არსებობს, შექმენით ახალი
          user = await UserModel.createUser({
            first_name: profile.name?.givenName || "",
            last_name: profile.name?.familyName || "",
            email,
            username: profile.id, // Facebook ID-ს ვიყენებთ username-ისთვის
            password: "", // პაროლი არ არის საჭირო Facebook-ისთვის
          });
        }

        // JWT ტოკენის გენერირება
        const token = generateToken({ id: user.id });
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// სერიალიზაცია და დესერიალიზაცია
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
