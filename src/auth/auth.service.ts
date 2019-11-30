import MyAccount, { AccountDTO } from "./auth.model";
import { UserService } from "../user/user.service"
export class AuthService {
    public static find(query: {}): Promise<AccountDTO[]> {
        return new Promise<any[]>((resovle, rej) =>
            MyAccount.find(query, (err, res: AccountDTO[]) => {
                if (err) rej(err);
                resovle(res.map(value => AccountDTO.parse(value)));
            })
        )
    }
    public static create(auth: AccountDTO) {

        return new Promise((resovle, rej) =>

            MyAccount.create(auth, (err: any, res: AccountDTO) => {
                if (err) rej(err);
                resovle(AccountDTO.parse(res));
            })
        )
    }
}
