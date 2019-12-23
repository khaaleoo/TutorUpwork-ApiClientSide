import { Schema, model, Model, Document } from "mongoose";
import { hashSync } from "bcrypt";
import { Expose, Exclude } from "class-transformer";

@Exclude()
export class User {
  @Expose()
  id: string = "";
  @Expose()
  email: string = "";
  @Expose()
  role: String = "";
  password: string = "";
  valid: boolean = false;
}
export interface IUser extends Document {
  email: String;
  password: string;
  role: String;
  type: Number;
  code: String;
  valid: boolean;
}

export const userSchema: Schema = new Schema({
  id: {
    type: String,
    required: true
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
  },
  valid: Boolean,
  code: String
});

userSchema.pre<IUser>("save", function save(this: any, next: () => void) {
  const user = this;
  user.password = hashSync(user.password, 10);
  next();
});

export const UserModel: Model<IUser> = model<IUser>("User", userSchema);
