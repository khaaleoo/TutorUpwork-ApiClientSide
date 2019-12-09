import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

class Address {
  city: Number = 0;
  district: Number = 0;
}

class Comment {
  author: String = "";
  content: String = "";
  datetime: Date = new Date();
}

class Contract {
  name: String = "";
  beginTime: Date = new Date();
  endTime: Date = new Date();
  totalPrice: Number = -1;
  status: String = "";
}

export class Tutor {
  constructor(body: any, id:Number) {
    this.email = body.email;
    this.id=id;
  }
  id: Number = Date.now();
  email: String = "";
  name: String = "";
  intro: String = "";
  price: Number = -1;
  age: Number = -1;
  gender: String = "Nam";
  address: Address = new Address();
  avatar: String = "";
  comments: Array<Comment> = [];
  contract: Array<Contract> = [];
  star: Number = 0;
  skills: Array<String> = [];
}

export interface ITutor extends Document {
  id: Number;
  email: String;
  name: String;
  intro: String;
  price: Number;
  age: Number;
  gender: String;
  address: Address;
  avatar: String;
  comments: Array<Comment>;
  contract: Array<Contract>;
  star: Number;
  skills: Array<String>;
}

export const tutorSchema: Schema = new Schema({
  id: {
    type: Number,
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
  comments: [{ author: String, content: String, datetime: Date }],
  contract: [
    {
      name: String,
      beginTime: Date,
      endTime: Date,
      totalPrice: Number,
      status: String
    }
  ],
  star: { type: Number },
  skills: [String]
});

export const TutorModel: Model<ITutor> = model<ITutor>("Tutor", tutorSchema);
