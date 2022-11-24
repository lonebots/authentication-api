// creating it for test purpose - fake smtp server is used
import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import logger from "../utils/logger";

// creating a test credential
// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }
//createTestCreds();
const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smptp");

//inorder to sent an email we need a transporter
// it takes an object as propery, auth , pass
// don't create the transporter inside the sendEmail function because it repeats the process but we just need one single transporter
const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      logger.error(err, "Error sending email");
      return;
    }

    logger.info(`Preview URL : ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
