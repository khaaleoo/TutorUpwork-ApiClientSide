import { Document, Schema, Model, model, Error } from "mongoose";
import { hashSync, compareSync } from "bcrypt";
import { Expose, Exclude, } from "class-transformer";
@Exclude()
export class User {
    @Expose()
    username: string = "";

    @Expose()
    role: String = "";

    password: string = "";

}
export interface IUser extends Document {
    [x: string]: any;
    user: String;
    password: string;
    role: String;
}

export const userSchema: Schema = new Schema({
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'password must has more than 6 characters.']
    },
    username: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

userSchema.pre<IUser>("save", function save(next) {
    const user = this;
    user.password = hashSync(user.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    callback(null, compareSync(candidatePassword, this.password));
};

export const UserModel: Model<IUser> = model<IUser>("User", userSchema);