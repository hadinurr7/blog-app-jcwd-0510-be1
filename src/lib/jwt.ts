import { NextFunction, Request, response, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

export const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    response.status(401).send({
      message: "Authentication failed, token is missing",
    });
    return;
  }

  verify(token, JWT_SECRET_KEY!, (error, payload) => {
    if (error) {
      if (error instanceof TokenExpiredError) {
        response.status(401).send({ message: "Token expired" });
      } else {
        response.status(401).send({ message: "Invalid token" });
        return;
      }
    }
    response.locals.user = payload;

    next();
  });
};
