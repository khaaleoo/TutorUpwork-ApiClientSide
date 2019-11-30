import UserModel, { User } from "./user.model";

export class UserService {
    // public sta
    public static find(query: {}) {
        return new Promise((resovle, rej) => {
            UserModel.find(query, (err, res) => {
                if (err) rej(err);
                resovle(res);
            })
        })
    }
    public static create(user: User) {
        return new Promise((resovle, rej) =>
            UserModel.create(user, (err: any, res: User) => {
                if (err) rej(err);
                resovle(res);
            })
        )
    }
}