const router = require('express').Router();
const userController = require('../controllers/user_controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/user/signup', userController.singup);
router.post('/user/login', userController.login);
router.get('/user', authenticate, userController.getAllUsers);
router.get('/user/:id', authenticate, userController.getUserById);
router.put('/user/:id', authenticate, userController.updateUser);
router.delete('/user/:id', authenticate, userController.deleteUser);

module.exports = router;