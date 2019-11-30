import mongoose from "mongoose";

export class AccountDTO extends Object {
    username: String = ""
    password: String = ""

    constructor({ username = "", password = "" }) {
        super();
        this.username = username;
        this.password = password;
    }

    public static parse(any: any): AccountDTO {
        const newObj = new AccountDTO({});
        newObj.password = any.password;
        newObj.username = any.username;
        return newObj;
    }
}
const Account = mongoose.model("account", new mongoose.Schema({
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
})
)
export default Account;