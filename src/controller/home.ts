import { Controller, Get } from "@midwayjs/core";
import { headerMiddleware } from "../middleware/header.middleware";

@Controller("/")
export class HomeController {
  @Get("/")
  async home() {
    return "Hello Midwayjs!";
  }

  @Get("/users", { middleware: [headerMiddleware] })
  async users(req) {
    console.log(req);
    return { success: true, msg: "success" };
  }
}
