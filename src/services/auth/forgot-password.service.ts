import { prisma } from "../../lib/prisma";
import { sign } from "jsonwebtoken";
import { BASE_URL_FE, JWT_SECRET_FORGOT_PASSWORD } from "../../config";
import { User } from "@prisma/client";
import { transporter } from "../../lib/nodemailer";

export const forgotPasswordService = async (body: Pick<User, "email">) => {
  try {
    const { email } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email");
    }

    const token = sign({ id: user.id }, JWT_SECRET_FORGOT_PASSWORD!, {
      expiresIn: "15m",
    });
    const link = `${BASE_URL_FE}/${token}`;

    transporter.sendMail({
      to: email,
      subject: "Link Reset Password",
      html: `<a href="${link}"target="_blank">Reset Password/a>`,
    });
    return { message: "send email success" };
  } catch (error) {
    throw error;
  }
};
