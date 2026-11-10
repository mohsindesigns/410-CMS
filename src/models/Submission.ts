import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: string;
  source: string;
  attachmentUrl?: string;
  extraData?: Record<string, any>;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    // maxlength only applies when a document is validated on create/save, so existing documents are unaffected.
    name: { type: String, required: true, maxlength: 200 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, maxlength: 50 },
    subject: { type: String, maxlength: 300 },
    message: { type: String, required: false, default: "", maxlength: 5000 },
    type: { type: String, default: "Contact Form", maxlength: 100 },
    source: { type: String, default: "Website", maxlength: 100 },
    attachmentUrl: { type: String, maxlength: 2000 },
    extraData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Delete the model if it exists to ensure schema updates are applied in development
if (mongoose.models.Submission) {
  delete mongoose.models.Submission;
}

const Submission: Model<ISubmission> = mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
