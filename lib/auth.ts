import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "./mailer";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "بازنشانی رمز عبور",
        html: `  <h2>سلام ${user.name}</h2>
          <p>برای بازنشانی رمز عبور خود روی لینک زیر کلیک کنید:</p>
          <a href="${url}">تأیید ایمیل</a>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "تایید ایمیل",
        html: `  <h2>سلام ${user.name}</h2>
          <p>برای تأیید ایمیل روی لینک زیر کلیک کنید:</p>
          <a href="${url}">تأیید ایمیل</a>`,
      });
    },
  },
  user: {
    additionalFields: {
      uniqueId: {
        type: "string",
        required: false,
      },
      licenseNumber: {
        type: "string",
        required: true,
      },
      province: {
        type: "string",
        required: true,
      },
      account_type: {
        type: "string",
        required: true,
      },
    },
  },
});
