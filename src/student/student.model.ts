import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

class Address {
  city: Number = 0;
  district: Number = 0;
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
