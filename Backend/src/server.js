import "dotenv/config";

import app from "./app.js";

const PORT =
  process.env.PORT || 5000;

const server = app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );
});

server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
