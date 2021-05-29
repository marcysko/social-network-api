const { Thought, User } = require('../models');

const thoughtController = {
    ///api/thoughts
  // get all thoughts
  getAllThought(req, res) {
    Thought.find({})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
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
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: params.userId },
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
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      },


      ///api/thoughts/:thoughtId/reactions
    //create a reaction stored in a single thought's reactions array
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: {reactions: body} }, {new: true, runValidators: true})
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
        Thought.findOneAndDelete({ _id: params.thoughtId}, { $pull: {reactions: params.reactionId} }, {new: true, runValidators: true})
        .then(thought => {
            if(!thought) {
                res.status(404).json({ message: "No thought found with this id!"});
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(400).json(err));
    },

};


module.exports = thoughtController;