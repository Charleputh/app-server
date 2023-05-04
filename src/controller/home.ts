import { Inject, Controller, Get } from "@midwayjs/core";
import { headerMiddleware } from "../middleware/header.middleware";
import { UserService } from '../service/user';
@Controller("/")
export class HomeController {
  @Inject()
  userService: UserService;

  @Get("/")
  async home() {
    return "Hello Midwayjs!";
  }

  @Get("/users", { middleware: [headerMiddleware] })
  async users(req) {
    const code = req.request.header.code;
    await this.userService.getMettings(code);
    return { success: true, msg: "success" };
  }
}
