import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { comparePassword } from "../../lib/argon";
import { JWT_SECRET } from "../../config";
import { sign } from "jsonwebtoken";

// interface Body {
//     email : string
//     password : string
//   } 

interface Body extends Pick<User, "email" | "password"> {}

export const loginService = async (body: User) => {
  try {
    const { email, password } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid Email");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("incorrect password");
    }

    const { password: pass, ...userWhithoutPassword } = user;

    const token = sign ({id : user.id}, JWT_SECRET!,{expiresIn: "2h"})

    return {...userWhithoutPassword, token};
  } catch (error) {
    throw error;
  }
};
