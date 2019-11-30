import mongoose from "mongoose";

export class User {
    username: String = ""
    password: String = ""
}
const UserModel = mongoose.model("user", new mongoose.Schema({
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
export default UserModel;