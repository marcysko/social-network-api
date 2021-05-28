const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReactionSchema = new Schema(
    {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
    reactionBody: {
        type: String,
        required: 'Spill it!',
        maxLength: 280
      },
      username: {
        type: String,
        required: 'Why no username?'
      },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      }
    }
  );


const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: 'Share your thought.',
            minlength: 1,
            maxLength: 280
          },
          createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
            }, 
            username: {
                type: String,
                Required: 'Why no username?'
            },
            reactions: [ReactionSchema],
        },
    {
        toJSON: {
            virtuals: true,
            getters: true
      },
      id: false
    }
  );
  

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;