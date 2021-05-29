const { User } = require('../models');

const userController = {
  // get all Users,  /api/users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET a single user by its _id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .populate({
    path: 'friends',
    select: '-__v'
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Post a new user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // PUT to update a user by its _id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // DELETE to remove user by its _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

    ///api/users/:userId/friends/:friendId
    //POST to add a new friend to a user's friend list
    addFriend({ params }, res){
    User.findOneAndUpdate({ _id: params.userId}, { $pull: {friends: params.friendId} }, {new: true})
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: "No User found with this id!"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},
    //DELETE to remove a friend from a user's friend list
    deleteFriend({ params, body }, res){
    User.findOneAndDelete({ _id: params.thoughtId })
    .then(deletedFriend => {
        if (!deletedFriend) {
        return res.status(404).json({ message: 'No friend with this id!' });
        }
        return User.findOneAndUpdate(
        { friends: params.friendId },
        { $pull: { friends: params.friendId } },
        { new: true }
        );
  })
    .then(dbUserData => {
        if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));

},


};

module.exports = userController;