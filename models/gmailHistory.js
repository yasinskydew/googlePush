import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import errors from '../helpers/errors';

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
},
{ timestamps: true },
);

GmailHistorySchema.plugin(mongoosePaginate);

GmailHistorySchema.methods.toJSON = function() {
  return {
    id: this._id,
    currentHistoryId: this.currentHistoryId,
    userEmail: this.userEmail,
  };
};

mongoose.model('GmailHistory', GmailHistorySchema);
