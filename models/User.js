const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Username Is Required.',
            trim: true
          },
        email: {
            type: String,
            unique: true,
            required: [true,'Email Is Required.'],
            match: /.+\@.+\..+/   
          },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
            }
        ],
        friends: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
      },
      // prevents virtuals from creating duplicate of _id as `id`
      id: false
    }
  );
  
  // get total count of friends on retrieval
  UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce(
      (total, friend) => total + friend.replies.length + 1,
      0
    );
  });
  


   


const User = model('User', UserSchema);

module.exports = User;