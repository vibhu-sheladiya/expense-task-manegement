require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { verifyToken } = require('./middleware/authMiddleware');
const expenseController = require('./controllers/expenseController');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

connectDB();

app.use(express.json());


// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post('/api/expenses/bulk-upload', verifyToken, upload.single('file'), expenseController.bulkUpload);

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
