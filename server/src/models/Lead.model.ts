import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILead extends Document {
  name: string;
  email?: string;
  status: string;
  source: string;
  createdBy: Types.ObjectId;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String },
    status: { type: String, enum: ["New", "Contacted", "Qualified", "Lost"], default: "New" },
    source: { type: String, enum: ["Website", "Instagram", "Referral"], default: "Website" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
