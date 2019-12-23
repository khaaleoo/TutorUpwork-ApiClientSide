import { ConversationModel } from './conversation.model';
export class ConversationController {
  public async loadConversations(req: any, res: any) {
    const id = req.user.id;
    const result = await ConversationModel.find({ $or: [{ "person1.id": id }, { "person2.id": id }] });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getOne(req: any, res: any) {
    const { per1, per2 } = req.body;
    const per1Id = per1 > per2 ? per2 : per1;
    const per2Id = per1 < per2 ? per2 : per1;
    const result = await ConversationModel.find({ "person1.id": per1Id, "person2.id": per2Id });
    if (result.length > 0) {
      res.status(200).send({
        status: "OK",
        data: result[0]
      });
    }
    else {
      res.status(200).send({
        status: "OK",
        data: false
      });
    }

  }
}
