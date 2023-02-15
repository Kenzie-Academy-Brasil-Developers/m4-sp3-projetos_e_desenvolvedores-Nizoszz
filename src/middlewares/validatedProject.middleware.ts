import { NextFunction, Request, Response } from "express";
import { RequiredKeysProject } from "../interfaces/projects.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bodyKeys: string[] = Object.keys(req.body);
  const bodyValues: string[] = Object.values(req.body);
  let requiredKeys: RequiredKeysProject[] = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerID",
  ];

  let verifyKeys = requiredKeys.every((key: string) =>
    bodyKeys.join().includes(key)
  );

  if (req.method === "PATCH") {
    verifyKeys = requiredKeys.some((key: string) =>
      bodyKeys.join().includes(key)
    );

    if (!verifyKeys && !"endDate") {
      const joinedKeys: string[] = requiredKeys;
      return resp.status(400).json({
        message: "At least one of those keys must be send.",
        keys: `${joinedKeys}.`,
      });
    }
  }

  if (!verifyKeys && !"endDate") {
    const joinedKeys: string = requiredKeys.join(", ");
    return resp
      .status(400)
      .json({ message: `Missing required keys: ${joinedKeys}.` });
  }

  if (typeof bodyValues.join() !== "string") {
    return resp.status(400).json({ message: "The name need to be a string" });
  }

  return next();
};

export default { verify };
