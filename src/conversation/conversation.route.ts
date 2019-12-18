import { Router } from "express";
import { ConversationController } from './conversation.controller';
import passport = require("passport");

export class ConversationRoutes {
  public router: Router;
  public converController: ConversationController = new ConversationController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get(
      "/",
      passport.authenticate("jwt", { session: false }),
      this.converController.loadConversations
    );
  }
}
