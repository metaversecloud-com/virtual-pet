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

const SERVER_START_DATE = new Date();

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
      test: "v1",
      DEPLOYMENT_DATE: SERVER_START_DATE,
      NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : "NOT SET",
      COMMIT_HASH: process.env.COMMIT_HASH
        ? process.env.COMMIT_HASH
        : "NOT SET",
      SHOWCASE_WORLDS_URLS: ["https://topia.io/virtual-pet-prod"],
      INSTANCE_DOMAIN: process.env.INSTANCE_DOMAIN
        ? process.env.INSTANCE_DOMAIN
        : "NOT SET",
      INTERACTIVE_KEY: process.env.INTERACTIVE_KEY
        ? process.env.INTERACTIVE_KEY
        : "NOT SET",
      INTERACTIVE_SECRET: process.env.INTERACTIVE_SECRET ? "SET" : "NOT SET",
      S3_BUCKET: process.env.S3_BUCKET ? process.env.S3_BUCKET : "NOT SET",
      IS_LOCALHOST: process.env.IS_LOCALHOST
        ? process.env.IS_LOCALHOST
        : "NOT SET",
      REACT_APP_LOCALHOST: process.env.REACT_APP_LOCALHOST
        ? process.env.REACT_APP_LOCALHOST
        : "NOT SET",
      GOOGLESHEETS_CLIENT_EMAIL: process.env.GOOGLESHEETS_CLIENT_EMAIL
        ? "SET"
        : "NOT SET",
      GOOGLESHEETS_SHEET_ID: process.env.GOOGLESHEETS_SHEET_ID
        ? "SET"
        : "NOT SET",
      GOOGLESHEETS_PRIVATE_KEY: process.env.GOOGLESHEETS_PRIVATE_KEY
        ? "SET"
        : "NOT SET",
    },
  });
});

const assetsPath = path.join(__dirname, "api/assets");
app.use("/assets", express.static(assetsPath));

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}, version ${appVersion}`);
});
