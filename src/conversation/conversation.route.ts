import { Router } from "express";
import { ConversationController } from "./conversation.controller";
import passport = require("passport");

export class TutorRoutes {
  public router: Router;
  public conversationController: ConversationController = new ConversationController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {

  }
}
