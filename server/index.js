import path from "path";
import express from "express";
import requestID from "express-request-id";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes.js";
import cors from "cors";
import { checkEnvVariables, getVersion } from "./utils.js";
dotenv.config();

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

checkEnvVariables();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(requestID());

const appVersion = getVersion();

app.use("/backend", router);

app.get("/api/system/health", (req, res) => {
  return res.json({
    appVersion,
    status: "OK",
    envs: {
      NODE_ENV: process.env.NODE_ENV,
      INSTANCE_DOMAIN: process.env.INSTANCE_DOMAIN,
      INTERACTIVE_KEY: process.env.INTERACTIVE_KEY,
      S3_BUCKET: process.env.S3_BUCKET,
      IS_LOCALHOST: process.env.IS_LOCALHOST,
    },
  });
});

const assetsPath = path.join(__dirname, "api/assets");
app.use("/assets", express.static(assetsPath));

if (process.env.NODE_ENV === "production") {
  // Node serves the files for the React app
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  // All other GET requests not handled before will return our React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}, version ${appVersion}`);
});
