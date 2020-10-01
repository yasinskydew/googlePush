import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
/**
 * @swagger
 *
 * definitions:
 *   GmailHistory:
 *     type: object
 *     required:
 *       - company
 *     properties:
 *       currentHistoryId:
 *         type: string
 *         description: gmail historyId from gmail api
 *       userEmail:
 *         type: string
 *         description: user email from gmail api
 */

const GmailHistorySchema = new mongoose.Schema(
{
  currentHistoryId: String,
  userEmail: String,
  user: mongoose.Schema.Types.ObjectId,
  company: mongoose.Schema.Types.ObjectId,
},
{ timestamps: true },
);

GmailHistorySchema.plugin(mongoosePaginate);

GmailHistorySchema.methods.toJSON = function() {
  return {
    id: this._id,
    currentHistoryId: this.currentHistoryId,
    userEmail: this.userEmail,
    user: this.user,
    company: this.company,
  };
};

mongoose.model('GmailHistory', GmailHistorySchema);
