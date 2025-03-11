const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    hi: 'Hello World',
  });
});

app.listen(PORT_LISTEN, () => {
  console.log(`running express in localhost:${PORT_LISTEN}`);
});
