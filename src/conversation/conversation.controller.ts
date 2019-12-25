import { ConversationModel } from "./conversation.model";
import { UserService } from "../user/user.service";

const updateToDateConversation = async (conv: any) => {
  const info1 = await UserService.getInfo(conv.person1.id);
  const info2 = await UserService.getInfo(conv.person2.id);
  const newCon = conv;
  newCon.person1 = info1;
  newCon.person2 = info2;
  return newCon;
};
export class ConversationController {
  public async loadConversations(req: any, res: any) {
    const id = req.user.id;
    const result = await ConversationModel.find({
      $or: [{ "person1.id": id }, { "person2.id": id }]
    });
    console.log("truoc", result);
    const updated = [];
    for (let i = 0; i < result.length; i += 1) {
      updated.push(await updateToDateConversation(result[i]));
    }
    console.log("sau", updated);
    res.status(200).send({
      status: "OK",
      data: updated
    });
  }

  public async getOne(req: any, res: any) {
    const { per1, per2 } = req.body;
    const per1Id = per1 > per2 ? per2 : per1;
    const per2Id = per1 < per2 ? per2 : per1;
    const result = await ConversationModel.find({
      "person1.id": per1Id,
      "person2.id": per2Id
    });
    if (result.length > 0) {
      res.status(200).send({
        status: "OK",
        data: result[0]
      });
    } else {
      res.status(200).send({
        status: "OK",
        data: false
      });
    }
  }
}
