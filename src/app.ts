import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { join } from "path";
import passport from "passport";
import bodyParser from "body-parser";
import { MONGODB_URI } from "./utils/secrets";
import { } from "./user/user.controller";
import Routes from "./routes";
import session from "express-session";
import socket from "socket.io";

import http from "http"
class Server {
  public app: express.Application;
  public server: http.Server;
  public socketIO: any;

  public sockets: any = {};
  public requests: any = {};



  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.mongo();
    this.ServeSocket();
  }
  public ServeSocket() {
    this.socketIO = socket(this.server);
    this.socketIO.on("connection", (socket: any) => {
      console.log("New client connected");
      socket.on("disconnect", () => console.log("Client disconnected"));
      socket.on("hello", (id: string) => {
        this.sockets[id] = socket;
        console.log(this.sockets);
      })
    });
  }
  public routes(): void {
    this.app.use(Routes);
  }

  public config(): void {
    let allowCrossDomain = function (_req: any, res: any, next: any) {
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
      } catch (e) {
        //console.log(e);
      }
      next();
    });
    this.server = http.createServer(this.app);
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
    this.server.listen(this.app.get("port"), () => {
      console.log(
        "  API is running at http://localhost:%d",
        this.app.get("port")
      );
    });
  }
}

const server = new Server();

server.start();
