import { NextFunction, Request, Response } from "express";
import { RequiredKeysProject } from "../interfaces/projects.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  const bodyKeys: string[] = Object.keys(body);
  const requiredKeys: RequiredKeysProject[] = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "endDate",
    "developerID",
  ];

  const verifyKeys = bodyKeys.every((key: string) =>
    requiredKeys.join().includes(key)
  );

  if (req.method === "PATCH") {
    const verifyKeysUpdate = bodyKeys.every((key: string) =>
      requiredKeys.join().includes(key)
    );

    if (!verifyKeysUpdate) {
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

  if (typeof req.body.name !== "string") {
    return resp.status(400).json({ message: "The name need to be a string" });
  }

  return next();
};

export default { verify };
