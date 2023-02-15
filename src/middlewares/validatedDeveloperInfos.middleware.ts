import { NextFunction, Request, Response } from "express";
import {
  RequiredKeysDeveloperInfos,
  RequiredTypesPreferredOS,
} from "../interfaces/developers.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { preferredOS } = req.body;
  const bodyKeys: string[] = Object.keys(req.body);
  const requiredBodyKeys: RequiredKeysDeveloperInfos[] = [
    "developerSince",
    "preferredOS",
  ];

  let verifyBodyKeys = requiredBodyKeys.every((key: string) =>
    bodyKeys.join().includes(key)
  );

  if (req.method === "PATCH") {
    verifyBodyKeys = requiredBodyKeys.some((key: string) =>
      bodyKeys.join().includes(key)
    );

    if (!verifyBodyKeys) {
      const joinedKeys: string = requiredBodyKeys.join(", ");
      return resp.status(400).json({
        message: "At least one of those keys must be send.",
        keys: `${joinedKeys}.`,
      });
    }
  }

  if (!verifyBodyKeys) {
    const joinedKeys: string = requiredBodyKeys.join(", ");
    return resp
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}.` });
  }

  if (req.body.developerSince) {
    if (typeof req.body.developerSince !== "string") {
      return resp.status(400).json({ message: "The name need to be a string" });
    }
  }

  if (req.body.preferredOS) {
    if (typeof req.body.preferredOS !== "string") {
      return resp
        .status(400)
        .json({ message: "The list name need to be a string" });
    }
    const preferredOSValue: string[] = Object.values(preferredOS);
    const requiredPreferredOSKeys: RequiredTypesPreferredOS[] = [
      "Windows",
      "Linux",
      "MacOS",
    ];

    const verifyPreferredOSKey = requiredPreferredOSKeys.some((key: string) =>
      preferredOSValue.join().split(",").join("").includes(key)
    );

    if (!verifyPreferredOSKey) {
      const joinedKeys: string = requiredPreferredOSKeys.join(", ");
      return resp
        .status(400)
        .json({ message: `Required types are: ${joinedKeys}.` });
    }
  }

  return next();
};

export default { verify };
