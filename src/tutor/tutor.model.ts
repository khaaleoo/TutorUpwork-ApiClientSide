import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

class Address {
  city: Number = 0;
  district: Number = 0;
}

class Comment {
  id: String = "";
  author: String = "";
  content: String = "";
  datetime: Date = new Date();
}

export class Tutor {
  constructor(body: any) {
    this.email = body.email;
    this.id = body.id;
    this.name = body.name || "";
    this.avatar = body.avatar || "";
  }
  id: String = Date.now().toString();
  email: String = "";
  name: String = "";
  intro: String = "";
  price: Number = -1;
  age: Number = -1;
  gender: String = "Nam";
  address: Address = new Address();
  avatar: String = "";
  comments: Array<Comment> = [];
  contract: Array<String> = [];
  star: Number = 0;
  skills: Array<String> = [];
  successRate: Number = 0;
}

export interface ITutor extends Document {
  id: String;
  email: String;
  name: String;
  intro: String;
  price: Number;
  age: Number;
  gender: String;
  address: Address;
  avatar: String;
  comments: Array<Comment>;
  contracts: Array<String>;
  star: Number;
  skills: Array<String>;
  successRate: Number;
}

export const tutorSchema: Schema = new Schema({
  id: {
    type: String
  },
  email: {
    type: String,
    trim: true
  },
  name: { type: String },
  intro: { type: String },
  price: { type: Number },
  age: { type: Number },
  gender: { type: String },
  address: { city: Number, district: Number },
  avatar: { type: String },
  comments: [{ id: String, author: String, content: String, datetime: Date }],
  contracts: [String],
  star: { type: Number },
  skills: [String],
  successRate: Number
});

export const TutorModel: Model<ITutor> = model<ITutor>("Tutor", tutorSchema);
