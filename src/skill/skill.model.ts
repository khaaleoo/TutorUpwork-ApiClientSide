import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

export class Skill {
  id: String = "";
  name: String = "";
}

export interface ISkill extends Document {
  id: String;
  name: String;
}

export const skillSchema: Schema = new Schema({
  id: String,
  name: String
});

export const SkillModel: Model<ISkill> = model<ISkill>("Skill", skillSchema);
