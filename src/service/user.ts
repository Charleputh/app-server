import axios from "axios";
import { stringify } from "querystring";
import { Provide } from "@midwayjs/core";
import { IUserOptions } from "../interface";

// 客户端ID和客户端密钥
const clientId = "IKeOLt9rTziAhNXv_TCrJg";
const clientSecret = "S6OydVt0sqDJTuSuK9aYyNu76k7OriW4";

// Zoom API的请求头，包含客户端ID和客户端密钥
const zoomApiHeaders = {
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`,
  "Content-Type": "application/x-www-form-urlencoded"
};

@Provide()
export class UserService {
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: "mockedName",
      phone: "12345678901",
      email: "xxx.xxx@xxx.com"
    };
  }

  async getMettings(authCode) {
    const token = await this.getUsertoken(authCode);
    console.log(token);
    const mettings = await axios.get("https://zoom.us/v2/users//meetings", {
      headers: {
        Authorization: "Bearer " + token,
      }
    });
    console.log(mettings);
  }

  async getUsertoken(authCode) {
    const res = await axios.post(
      "https://zoom.us/oauth/token" +
        "?" +
        stringify({
          code: authCode,
          grant_type: "authorization_code",
          redirect_uri: "https://cat.computecoin.me/#/redirect"
        }),
      {
        headers: zoomApiHeaders
      }
    );
    return res.data.access_token;
  }
}
