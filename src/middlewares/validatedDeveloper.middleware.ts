import { NextFunction, Request, Response } from "express";
import { RequiredKeysDeveloper } from "../interfaces/developers.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bodyKeys: string[] = Object.keys(req.body);
  const requiredKeys: RequiredKeysDeveloper[] = ["name", "email"];

  const verifyKeys = bodyKeys.every((key: string) =>
    requiredKeys.join().includes(key)
  );

  if (req.method === "PATCH") {
    if (!verifyKeys) {
      const joinedKeys: string[] = requiredKeys;
      return resp.status(400).json({
        message: "At least one of those keys must be send.",
        keys: `${joinedKeys}.`,
      });
    }
  }

  if (!verifyKeys) {
    const joinedKeys: string = requiredKeys.join(", ");
    return resp
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}.` });
  }

  if (typeof req.body.name !== "string") {
    return resp.status(400).json({ message: "The name need to be a string" });
  }

  return next();
};

export default { verify };
