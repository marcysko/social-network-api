const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction

} = require('../../controllers/thought-controller');

// /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

  // /api reactions
  router
  .route('/:thoughtId/reactions')
  .post(addReaction)

  // /api delete reactions 
  router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction)

module.exports = router;