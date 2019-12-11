import { Document, Schema, Model, model, Error } from "mongoose";
import { Expose, Exclude } from "class-transformer";

export class Skill {
  name: String = "";
}

export interface ISkill extends Document {
  name: String;
}

export const skillSchema: Schema = new Schema({
  name: String
});

export const SkillModel: Model<ISkill> = model<ISkill>("Skill", skillSchema);
