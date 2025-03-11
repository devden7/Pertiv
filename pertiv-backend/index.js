const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./lib/swagger/docApi.json');

const app = express();

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (req, res) => {
  res.json({
    hi: 'Hello World',
  });
});

app.listen(PORT_LISTEN, () => {
  console.log(`running express in localhost:${PORT_LISTEN}`);
});
