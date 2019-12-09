import { Document, Schema, Model, model, Error } from "mongoose";
import { hashSync, compareSync } from "bcrypt";
import { Expose, Exclude } from "class-transformer";

@Exclude()
export class User {
  @Expose()
  email: string = "";

  @Expose()
  role: String = "";

  password: string = "";
}
export interface IUser extends Document {
  [x: string]: any;
  email: String;
  password: string;
  role: String;
}

export const userSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, "password must has more than 6 characters."]
  },
  email: {
    type: String,
    required: true,

    trim: true,

    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  role: {
    type: String,
    required: true
  },

  type: {
    type: Number,
    required: true
  }
});

userSchema.pre<IUser>("save", function save(next) {
  const user = this;
  user.password = hashSync(user.password, 10);
  next();
});
userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: any
) {
  callback(null, compareSync(candidatePassword, this.password));
};
userSchema.statics.upsertFbUser = function (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user?: any, info?: any) => any
) {
  try {
    var that = this;
    const user = this.findOne({
      "facebookProvider.id": profile.id
    });
    if (!user) {
      var newUser = new that({
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        },
        role: "student"
      });
      newUser.save();
    } else {
      return done(null, user);
    }
  } catch (err) {
    done(err);
  }
};
userSchema.statics.upsertGgUser = function (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user?: any, info?: any) => any
) {
  try {
    var that = this;
    const user = this.findOne({
      "facebookProvider.id": profile.id
    });
    if (!user) {
      var newUser = new that({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        googleProvider: {
          id: profile.id,
          token: accessToken
        },
        role: "student"
      });
      newUser.save();
      done(null, newUser);
    } else done(null, user);
  } catch (err) {
    done(err);
  }
};
userSchema.statics.upsertFbUser = function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => any) {
  try {
    var that = this;
    const user = this.findOne({
      'facebookProvider.id': profile.id
    });
    if (!user) {
      var newUser = new that({
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        },
        role: "student"
      });
      newUser.save();
    } else {
      return done(null, user);
    }
  } catch (err) {
    done(err);
  }
};
userSchema.statics.upsertGgUser = function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => any) {
  try {
    var that = this;
    const user = this.findOne({
      'facebookProvider.id': profile.id
    });
    if (!user) {
      var newUser = new that({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        googleProvider: {
          id: profile.id,
          token: accessToken
        },
        role: "student"
      });
      newUser.save();
      done(null, newUser)
    } else done(null, user);
  } catch (err) {
    done(err)
  }
};



export const UserModel: Model<IUser> = model<IUser>("User", userSchema);
