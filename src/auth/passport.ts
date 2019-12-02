import passport from "passport";
import passportLocal from "passport-local";
import { UserModel } from "../user/user.model";
import { compare } from "bcrypt"
import passportJwt, { ExtractJwt } from "passport-jwt";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

const local = new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        const userList = await UserModel.find({ username: email });
        if (userList.length === 0) return done(null, false, { message: "Invalid username." });
        const user = userList[0];
        let ret = await user.comparePassword(password, user.password);
        if (ret) done(null, user);
        else done(null, false, { message: "Invalid password." });
    }
)

const jwt = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "123456"
    },
    async (jwtToken, done) => {
        const userList = await UserModel.find({ username: jwtToken.username });
        if (userList.length === 0) return done(undefined, false);
        return done(undefined, userList[0], jwtToken);
    }
)

passport.use(jwt);
passport.use(local)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));