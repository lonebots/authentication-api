export default {
  port: 3000,
  dbUri:
    "mongodb+srv://<user_name>:<user_password>@<cluster_name>.hdp4pop.mongodb.net/<database_collection_name>?retryWrites=true&w=majority",
  logLevel: "debug",
  smptp: {
    user: "user_email",
    pass: "user_password",
    host: "smtp host",
    port: 587,
    secure: false,
  },
};
