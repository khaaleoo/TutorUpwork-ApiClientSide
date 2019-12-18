

import { ConversationModel } from './conversation.model';
import { UserService } from '../user/user.service';
export class ConversationService {
  public static async createConversation(person1: string, person2: string, message: any) {
    const id = Date.now().toString();
    console.log("person2", person2)
    const mess = { content: message, date: Date.now(), id: person1 };
    try {
      const result = await ConversationModel.create({
        id,
        person1: await UserService.getInfo(person1),
        person2: await UserService.getInfo(person2),
        messages: [mess],
        lastMess: mess
      })
      console.log("add conversation", result)
    } catch (e) { console.log(e) }
    return id;
  }
  public static async addMessage(idConver: String, sender: string, content: string) {
    try {
      const messages = { content, date: Date.now(), id: sender }
      const res = await ConversationModel.update({ id: idConver },
        {
          $push: {
            messages
          },
          $set: {
            lastMess: messages
          }
        })
      console.log("result add new mess", res);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  public static async creatrOrUpdate(person1: string, person2: string, message: any): Promise<String> {
    const per1 = person1 > person2 ? person2 : person1;
    const per2 = person1 < person2 ? person2 : person1;
    const res = await ConversationModel.find({
      person1: { id: per1 },
      person2: { id: per2 }
    })
    if (res.length > 0) {
      this.addMessage(res[0].id, person1, message);
      return res[0].id;
    }
    else return await this.createConversation(per1, per2, message)
  }
}
