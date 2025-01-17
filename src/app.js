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
const fs = require('fs'); 
//security imports
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean')

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

dotenv.config();

const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadsUsersDir = path.join(__dirname, 'public/uploads/users');
if (!fs.existsSync(uploadsUsersDir)){
    fs.mkdirSync(uploadsUsersDir, { recursive: true });
}

const mainRouter = require('./routes/mainRouter');
const userRoutes = require('./routes/userRoutes');
const publicRouter = require('./routes/publicRouter');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const statisticsRoute = require('./routes/statisticsRoutes'); 

// error handler + auth middleware
const authMiddleware = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  skip: (req) => {
    const ip = req.ip;
    // Skip rate limiting for localhost (IPv4 and IPv6)
    return ip === '127.0.0.1' || ip === '::1';
  },
});
app.use(limiter);

// apply security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));
app.use(cookieParser());
app.use(xss());

// middleware
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));   
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads/users', express.static(path.join(__dirname, 'uploads/users')));
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
app.use('/api/v1', mainRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/public-events', publicRouter);
app.use('/api/v1/events', authMiddleware, eventRoutes);
app.use('/api/v1/registrations', authMiddleware, registrationRoutes);
app.use('/api/v1', statisticsRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;