import { NextFunction, Request, Response } from "express";
import {
  iDeveloperRequest,
  RequiredKeysDeveloper,
} from "../interfaces/developers.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body: iDeveloperRequest = req.body;
  const bodyKeys: string[] = Object.keys(body);
  const requiredKeys: RequiredKeysDeveloper[] = ["name", "email"];

  let verifyKeys: boolean = requiredKeys.every((key: string) =>
    bodyKeys.join().includes(key)
  );
  if (req.method === "PATCH") {
    verifyKeys = requiredKeys.some((key: string) =>
      bodyKeys.join().includes(key)
    );

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
      .json({ message: `Missing required keys: ${joinedKeys}.` });
  }
  if (req.body.name) {
    if (typeof req.body.name !== "string") {
      return resp.status(400).json({ message: "The name need to be a string" });
    }
  }

  if (req.body.email) {
    if (typeof req.body.email !== "string") {
      return resp.status(400).json({ message: "The name need to be a string" });
    }
  }

  return next();
};

export default { verify };
