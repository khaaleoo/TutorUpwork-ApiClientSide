import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

export class Contract {
  id: String = "";
  studentId: String = "";
  tutorId: String = "";
  beginTime: Date = new Date();
  endTime: Date = new Date();
  pricePerHour: Number = 0;
  totalHour: Number = 0;
  totalPrice: Number = 0;
  status: String = "";
  skills: String[] = [];
  reportInfo: String = "";
}

export interface IContract extends Document {
  id: String;
  studentId: String;
  tutorId: String;
  beginTime: Date;
  endTime: Date;
  pricePerHour: Number;
  totalHour: Number;
  totalPrice: Number;
  status: String;
  skills: String[];
  reportInfo: String;
}
export const contractSchema: Schema = new Schema({
  id: String,
  studentId: String,
  tutorId: String,
  beginTime: Date,
  endTime: Date,
  pricePerHour: Number,
  totalHour: Number,
  totalPrice: Number,
  status: String,
  skills: [String],
  reportInfo: String
});

export const ContractModel: Model<IContract> = model<IContract>(
  "Contract",
  contractSchema
);
