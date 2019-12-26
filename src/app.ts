import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { join } from "path";
import passport from "passport";
import bodyParser from "body-parser";
import { MONGODB_URI } from "./utils/secrets";
import {} from "./user/user.controller";
import Routes from "./routes";
import session from "express-session";
import socket from "socket.io";
import { ConversationService } from "./conversation/conversation.service";
import http from "http";
class Server {
  public app: express.Application;
  public server!: http.Server;
  public socketIO: any;

  public sockets: any = {};
  public requests: any = {};
  public rooms: any = {};

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
      //--------------------------------------------------------------------
      socket.on("disconnect", () => {
        this.sockets[socket.myId] = null;
        const leave = socket.r || [];
        console.log("client disconnected");
        leave.forEach((val: any) => {
          socket.leave(val);
        });
      });
      //--------------------------------------------------------------------
      socket.on("hello", (id: string) => {
        socket.myId = id;
        console.log("tutor online", id);
        this.sockets[id] = socket;
        socket.r = [];
        if (this.requests[id]) {
          for (let i = 0; i < this.requests[id].length; i += 1) {
            socket.join(this.requests[id][i]);
            socket.r.push(this.requests[id][i]);
            socket.rooms.push(this.requests[id][i]);
          }
        }
      });
      //--------------------------------------------------------------------
      socket.on("start", async (id: string, idClient: string, mess: string) => {
        const room = await ConversationService.creatrOrUpdate(
          id,
          idClient,
          mess
        );
        socket.join(room);
        socket.r.push(room);
        this.rooms[room] = socket.emit("join", room);
        console.log("SDf");
        if (this.sockets[idClient]) {
          // nếu có đối phương thì add vô room
          console.log("có thể chat");
          this.sockets[idClient].join(room);
          this.sockets[idClient].r.push(room);
          this.sockets[idClient].emit("notify");
          socket.in(room).emit("haveMessage", room, mess);
        } else {
          // còn không để request
          console.log("off r");
          if (!this.requests[idClient]) {
            this.requests[idClient] = [];
          } else {
            this.requests[idClient].push(idClient);
          }
        }
      });
      //--------------------------------------------------------------------
      socket.on("chat", (room: string, content: string, recv: string) => {
        console.log("haveMessage", room, content);
        if (this.sockets[recv] && !this.sockets[recv].r.includes(room)) {
          this.sockets[recv].join(room);
          this.sockets[recv].r.push(room);
          socket.in(room).emit("notify");
        }
        socket.in(room).emit("haveMessage", room, content);
        ConversationService.addMessage(room, socket.myId, content);
      });
    });
  }
  public routes(): void {
    this.app.use(Routes);
  }

  public config(): void {
    let allowCrossDomain = function(_req: any, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "*, Origin, X-Requested-With, Content-Type, Accept, secret_token"
      );
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
