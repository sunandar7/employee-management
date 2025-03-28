const router = require('express').Router();
const positionController = require('../controllers/position_controller');
const { authenticate } = require('../middleware/authenticate'); 

router.post('/position', authenticate, positionController.create);
router.get('/position', authenticate, positionController.getAllPositions);
router.get('/position/:id', authenticate, positionController.getPositionById);
router.put('/position/:id', authenticate, positionController.updatePosition);
router.delete('/position/:id', authenticate, positionController.deletePosition);

module.exports = router;