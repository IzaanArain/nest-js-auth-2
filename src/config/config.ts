export default () => ({
  port: process.env.PORT,
  database: {
    connectionString: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // secrets: {
  //   jwtSecret: process.env.JWT_SECRET,
  // },
});
