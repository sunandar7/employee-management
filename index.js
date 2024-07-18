const express = require('express');
const http = require('http');
const cors = require('cors');
const db = require('./models');
const path = require('path');
const fs = require('fs');
const userRoute = require('./routes/user_routes');
const roleRoute = require('./routes/role_routes');
const departmentRoute = require('./routes/department_routes');
const positionRoute = require('./routes/position_routes');
const employeeRoute = require('./routes/employee_routes');

const app = express();
const server = http.createServer(app);

// port
const port = 3500;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Check if the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Static image folder
app.use('/uploads', express.static('./uploads'));

// testing route
app.get('/', (req,res) => {
    res.json({ message: 'Hello from API' })
});

// routes
app.use('/api', [userRoute, roleRoute, departmentRoute, positionRoute, employeeRoute]);

db.sequelize
  .sync()
  .then(() => {
    console.log("Successfully Synced with mySQL DB.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

server.listen(port, () => {
    console.log(`App running on port ${port}`);
})