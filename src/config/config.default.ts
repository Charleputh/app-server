import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1682652458827_9582',
    egg: {
      port: 4099,
    },
    cors: {
      origin: "cat.computecoin.me",
      credentials: true,
      allowHeaders: ["code", "Authorization"]
    }
    // security: {
    //   csrf: false,
    // },
  } as MidwayConfig;
};
