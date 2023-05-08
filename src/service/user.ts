import axios from "axios";
import { Provide } from "@midwayjs/core";
import { IUserOptions } from "../interface";
import * as crypto from "crypto";

// 客户端ID和客户端密钥
const clientId = "2DITwmiQSXKbCr_hnuIYfg";
const clientSecret = "V99WwTv7JFqfGCmPWgnyeE6qA1I690Wp";

// 服务端key和密钥
const API_KEY = "62OK_WCRQlGrIzak3Tenkw";
const API_SECRET = "ChlCG6qq4tZHejf5jneQxVqMi4IoFWUz";

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

  generateSignature(meetingNumber, role) {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(
      API_KEY + meetingNumber + timestamp + role
    ).toString("base64");
    const hash = crypto
      .createHmac("sha256", API_SECRET)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString("base64");

    return signature;
  }

  async getMettings(authCode) {
    const token = await this.getUsertoken(authCode);
    console.log(token);
    const res = await axios.get(
      "https://zoom.us/v2/users/me/meetings?type=live",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );
    const signature = this.generateSignature(res.data.meetings[0].host_id, 0);
    // const live = res.data && res.data.mettings;
    // const mettingId = live.id;
    return {
      status: 200,
      data: {
        meeting: res.data,
        token,
        signature
      }
    };
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
