const { Thought, User } = require('../models');

const thoughtController = {
    ///api/thoughts
  // get all thoughts
  getAllThought(req, res) {
    Thought.find({})
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
  },
// get a single thought by id
    getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
       .populate({
        path: 'reactions',
        select: '-__v'
      })
       .select('-__v')
       .sort({ _id: -1 })
       .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought was found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //create a new thought
    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thought: _id } },
            { new: true }
            );
            })
            .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },


    //update a thought by its _id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },


    //remove a thought by its _id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                res.status(404).json({ message: 'No thoughts found with that id!' });
                return;
              }
              return User.findOneAndUpdate(
                { _id: parmas.userId },
                { $pull: { thoughts: params.Id } },
                { new: true }
              )
            })
            .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
              }
              res.json(dbUserData);
            })
            .catch(err => res.json(err));
        },


      ///api/thoughts/:thoughtId/reactions
    //create a reaction stored in a single thought's reactions array
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $push: {reactions: body} }, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id!"});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

     //pull and remove a reaction by the reaction's reactionId
     removeReaction({ params }, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: {reactionId: params.reactionId} }, {new: true })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'Nope!'});
            return;
          }
         res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
  
  
  };
  
  module.exports = thoughtController