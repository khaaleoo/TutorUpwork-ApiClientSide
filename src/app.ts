import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { join } from "path";
import passport from "passport";
import bodyParser from "body-parser";
import { MONGODB_URI } from "./utils/secrets";
import {} from "./user/user.controller";
import Routes from "./routes";
import session from "express-session";
class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.mongo();
  }

  public routes(): void {
    this.app.use(Routes);
  }

  public config(): void {
    let allowCrossDomain = function(_req: any, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT,    PATCH, DELETE"
      );
      next();
    };
    this.app.use(allowCrossDomain);
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(bodyParser.text({ limit: "20MB" }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(cookieParser());
    this.app.use(express.static(join(__dirname, "..", "public")));
    this.app.use(
      session({
        secret: "sfd",
        resave: true,
        saveUninitialized: true
      })
    );
    this.app.use((req, res, next) => {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
      next();
    });
  }

  private mongo() {
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongo Connection Established");
    });
    connection.on("reconnected", () => {
      console.log("Mongo Connection Reestablished");
    });
    connection.on("disconnected", () => {
      console.log("Mongo Connection Disconnected");
      console.log("Trying to reconnect to Mongo ...");
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }, 3000);
    });
    connection.on("close", () => {
      console.log("Mongo Connection Closed");
    });
    connection.on("error", (error: Error) => {
      console.log("Mongo Connection ERROR: " + error);
    });

    const run = async () => {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    };
    run().catch(error => console.error(error));
  }

  public start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "  API is running at http://localhost:%d",
        this.app.get("port")
      );
    });
    console.log(this.app.arg);
  }
}

const server = new Server();

server.start();
