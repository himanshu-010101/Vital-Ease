const app = require('./src/app');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("App is started on " + PORT);
  });
}

module.exports = app;