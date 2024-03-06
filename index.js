// import required modules
const app = require("./app");
const config = require("./src/config/config");

// start the server
const port = config.server.port;
console.log(port);
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🔥`);
});
