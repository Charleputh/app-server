import axios from "axios";
import { Provide } from "@midwayjs/core";
import { IUserOptions } from "../interface";

const KJUR = require('jsrsasign')

// 客户端ID和客户端密钥
const clientId = "2DITwmiQSXKbCr_hnuIYfg";
const clientSecret = "V99WwTv7JFqfGCmPWgnyeE6qA1I690Wp";

// 服务端key和密钥
// const API_KEY = "62OK_WCRQlGrIzak3Tenkw";
// const API_SECRET = "ChlCG6qq4tZHejf5jneQxVqMi4IoFWUz";

// meeting sdk
const API_KEY = "2DITwmiQSXKbCr_hnuIYfg";
const API_SECRET = "V99WwTv7JFqfGCmPWgnyeE6qA1I690Wp";

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
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };

    const oPayload = {
      sdkKey: API_KEY,
      appKey: API_KEY,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      tokenExp: exp
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, API_SECRET);
    return sdkJWT;
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
