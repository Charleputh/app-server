import axios from "axios";
import { Provide } from "@midwayjs/core";
import { IUserOptions } from "../interface";

// 客户端ID和客户端密钥
// const clientId = "62OK_WCRQlGrIzak3Tenkw";
// const clientSecret = "ChlCG6qq4tZHejf5jneQxVqMi4IoFWUz";
const clientId = "2DITwmiQSXKbCr_hnuIYfg";
const clientSecret = "V99WwTv7JFqfGCmPWgnyeE6qA1I690Wp";

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

  async getCode() {}

  async getMettings(authCode) {
    const token = await this.getUsertoken(authCode);
    console.log(token);
    const res = await axios.get("https://zoom.us/v2/users/me/meetings?type=live", {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    console.log(res);
    const live = res.data && res.data.mettings;
    // const mettingId = live.id;
    return {
      status: 200,
      data: {
        metting: live,
        token
      }
    }
  }

  async getUsertoken(authCode) {
    const res = await axios.post(
      "https://zoom.us/oauth/token",
      {
        code: authCode,
        grant_type: "authorization_code",
        redirect_uri: "https://cat.computecoin.me/#/redirect"
      },
      {
        headers: zoomApiHeaders
      }
    );
    return res.data.access_token;
  }
}
