const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./lib/swagger/docApi.json');
const { PORT_LISTEN } = require('./config/env');
const adminRoutes = require('./routes/admin.route');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//Admim routes
app.use('/admin', adminRoutes);

app.listen(PORT_LISTEN, () => {
  console.log(`running express in localhost:${PORT_LISTEN}`);
});
