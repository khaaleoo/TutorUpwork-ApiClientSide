import { ConversationModel } from "./conversation.model";
import { UserService } from "../user/user.service";
export class ConversationService {
  public static async createConversation(
    person1: string,
    person2: string,
    message: any
  ) {
    const room = Date.now().toString();
    const mess = { content: message, date: Date.now(), id: person1 };
    try {
      const result = await ConversationModel.create({
        room,
        person1: await UserService.getInfo(person1),
        person2: await UserService.getInfo(person2),
        messages: [mess]
      });
      console.log("add conversation", result);
    } catch (e) {
      console.log(e);
    }
    return room;
  }
  public static async addMessage(
    room: String,
    sender: string,
    content: string
  ) {
    try {
      const messages = { content, date: Date.now(), id: sender };
      await ConversationModel.update(
        { room },
        {
          $push: {
            messages
          }
        }
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  public static async creatrOrUpdate(
    person1: string,
    person2: string,
    message: any
  ): Promise<string> {
    const per1 = person1 > person2 ? person2 : person1;
    const per2 = person1 < person2 ? person2 : person1;
    const res = await ConversationModel.find({
      "person1.id": per1,
      "person2.id": per2
    });
    console.log("find conv", {
      person1: { id: per1 },
      person2: { id: per2 }
    });
    if (res.length > 0) {
      this.addMessage(res[0].room, person1, message);
      return res[0].room;
    } else return await this.createConversation(per1, per2, message);
  }
}
