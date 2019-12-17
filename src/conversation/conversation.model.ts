import { Document, Schema, Model, model, Error } from "mongoose";

class Message {
  content: String = "";
  date: Number = 0;
}

export interface IConversation extends Document {
  id: String,
  person1: {
    id: String,
    name: String,
    avatar: String
  },
  person2: {
    id: String,
    name: String,
    avatar: String
  },
  messages: Message
}

export const conversationSchema: Schema = new Schema({
  id: {
    type: String
  },
  person1: {
    id: String,
    name: String,
    avatar: String
  },
  person2: {
    id: String,
    name: String,
    avatar: String
  },
  messages: { type: Message }
});

export const ConversationModel: Model<IConversation> = model<IConversation>("Conversation", conversationSchema);
