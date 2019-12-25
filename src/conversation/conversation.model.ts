import { Document, Schema, Model, model, Error } from "mongoose";

export class Message {
  id: String = "";
  content: String = "";
  date: Number = 0;
}

interface IConversation extends Document {
  room: string;
  person1: String;
  person2: String;
  messages: [Message];
}

export const conversationSchema: Schema = new Schema({
  room: String,
  person1: { id: String, name: String, avatar: String },
  person2: { id: String, name: String, avatar: String },
  messages: [{ ...Message }]
});

export const ConversationModel: Model<IConversation> = model<IConversation>(
  "Conversation",
  conversationSchema
);
