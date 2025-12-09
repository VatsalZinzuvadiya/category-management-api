declare const config: {
  production: boolean;
  server: {
    port: string;
  };
  mongoDb: {
    uri: string | undefined;
  };
  mongodb: {
    users: string | undefined;
    categories: string | undefined;
  };
  appVersion: string;
  jwtSecret: string;
};
export default config;
