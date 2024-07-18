const router = require('express').Router();
const roleController = require('../controllers/role_controller');
const { authenticate } = require('../middleware/auth');

router.post('/role', authenticate, roleController.create);
router.get('/role', authenticate, roleController.getAllRoles);
router.get('/role/:id', authenticate, roleController.getRoleById);
router.put('/role/:id', authenticate, roleController.updateRole);
router.delete('/role/:id', authenticate, roleController.deleteRole);

module.exports = router;