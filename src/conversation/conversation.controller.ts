import { ConversationModel } from './conversation.model';
export class ConversationController {
  public async loadConversations(req: any, res: any) {
    const id = req.user.id;
    console.log(id)
    const result = await ConversationModel.find({ $or: [{ "person1.id": id }, { "person2.id": id }] });
    console.log(result);
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
}
