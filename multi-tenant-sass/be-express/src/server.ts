import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./loaders/sequelize";

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    // Do not force sync in production; this is convenient for development.
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
})();
