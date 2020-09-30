import mongoose from "mongoose";

const JobBullSchema = new mongoose.Schema(
  {
    jobId: String,
  },
  { timestamps: true },
);

JobBullSchema.methods.toJSON = function() {
  return {
    id: this._id,
    jobId: this.jobId,
  };
};

mongoose.model('JobBull', JobBullSchema);
