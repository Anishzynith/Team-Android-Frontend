const { expo } = require("./app.json");
require("dotenv").config();

module.exports = () => {
  return {
    ...expo,
    extra: {
      ...expo.extra,

      // Web OAuth Client
      googleClientId:
        process.env.GOOGLE_OAUTH_WEB_CLIENT_ID ||
        expo.extra.googleClientId,

      googleWebClientId:
        process.env.GOOGLE_OAUTH_WEB_CLIENT_ID ||
        expo.extra.googleWebClientId,

      // Android OAuth Client
      googleAndroidClientId:
        process.env.GOOGLE_OAUTH_ANDROID_CLIENT_ID ||
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
        expo.extra.googleAndroidClientId,

      googleClientSecret:
        process.env.GOOGLE_OAUTH_SECRET ||
        expo.extra.googleClientSecret,

      apiUrl:
        process.env.API_URL ||
        expo.extra.apiUrl,
    },
  };
};