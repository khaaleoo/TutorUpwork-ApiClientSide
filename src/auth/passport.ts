import passport from "passport";
import passportLocal from "passport-local";
import { UserModel } from "../user/user.model";
import passportJwt, { ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../utils/secrets";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
import { compare } from "bcrypt";

const local = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      console.log(email, password);
      const userList = await UserModel.find({ email: email, type: 1 });
      if (userList.length === 0)
        return done(null, false, { message: "Invalid username." });
      console.log(userList);
      const user = userList[0];
      if (!user.valid) {
        console.log("sdfg");
        throw "Tài khoản chưa kích hoạt. Kiểm tra email của bạn.";
      }
      let ret = await compare(password, user.password);
      if (ret) done(null, user);
      else done(null, false, { message: "Invalid password." });
    } catch (err) {
      console.log(err);
      done(err);
    }
  }
);

const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromHeader("secret_token"),
    secretOrKey: JWT_SECRET
  },
  async (jwtToken, done) => {
    const userList = await UserModel.find({ id: jwtToken.id });
    if (userList.length === 0) return done(undefined, false);
    return done(undefined, userList[0], jwtToken);
  }
);
passport.use(jwt);
passport.use(local);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
