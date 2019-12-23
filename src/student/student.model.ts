import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

class Address {
  city: Number = 0;
  district: Number = 0;
}
export class Student {
  constructor(body: any) {
    this.email = body.email;
    this.id = body.id;
    this.name = body.name || "Chưa cập nhật";
    this.avatar = body.avatar || "";
  }
  id: String = "";
  email: String = "";
  name: String = "";
  gender: String = "Nam";
  birthday: Date = new Date();
  address: Address = new Address();
  avatar: String = "";
  contracts: String[] = [];
}

export interface IStudent extends Document {
  id: String;
  email: String;
  name: String;
  gender: String;
  birthday: Date;
  address: Address;
  avatar: String;
  contracts: [String];
}

export const studentSchema: Schema = new Schema({
  id: String,
  email: String,
  name: String,
  gender: String,
  birthday: Date,
  address: { city: Number, district: Number },
  avatar: String,
  contracts: [String]
});

export const StudentModel: Model<IStudent> = model<IStudent>(
  "Student",
  studentSchema
);
