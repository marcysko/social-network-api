const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction

} = require('../../controllers/thought-controller');

// /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// /api/thoughts/:id
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

  // /api reactions
  router
  .route('/:thoughtId/reactions')
  .post(addReaction)

  // /api delete reactions 
  router
  .route('/:thoughtId/reactions/:reactionsId')
  .delete(deleteReaction)

module.exports = router;