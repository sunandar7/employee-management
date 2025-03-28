const router = require('express').Router();
const departmentController = require('../controllers/department_controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/department', authenticate, departmentController.create);
router.get('/department', authenticate, departmentController.getAllDepartments);
router.get('/department/:id', authenticate, departmentController.getDepartmentById);
router.put('/department/:id', authenticate, departmentController.updateDepartment);
router.delete('/department/:id', authenticate, departmentController.deleteDepartment);

module.exports = router;