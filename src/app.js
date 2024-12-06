const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

dotenv.config();
//const mainRouter = require('./routes/mainRouter.js');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json()); 

// home page
app.get('/', (req, res) => {
    res.send(`
      <h1>Welcome to Event Management API</h1>
      <p>Visit <a href="/docs">/docs</a> for API documentation</p>
    `);
  });
  
  // swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
//app.use('/api/v1', mainRouter);
app.use('/api/v1', userRoutes);
app.use('/api/v1', eventRoutes);
app.use('/api/v1', registrationRoutes);

module.exports = app;