const router = require('express').Router();
const employeeController = require('../controllers/employee_controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/employee', authenticate, employeeController.upload, employeeController.create);
router.get('/employee', authenticate, employeeController.getAllEmployees);
router.get('/employee/:id', authenticate, employeeController.getEmployeeById);
router.put('/employee/:id', authenticate, employeeController.upload, employeeController.updateEmployee);
router.delete('/employee/:id', authenticate, employeeController.deleteEmployee);

module.exports = router;
