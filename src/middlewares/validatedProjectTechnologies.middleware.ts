import { NextFunction, Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import {
  iProjectsTechonologiesRequest,
  RequiredKeysTechnologies,
  RequiredTechnologies,
} from "../interfaces/projectsTechnologies.interfaces";

const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body: iProjectsTechonologiesRequest = req.body;
  let bodyKeys: string[] = Object.keys(body);
  let bodyValues: string[] = Object.values(body);
  const requiredKeys: RequiredKeysTechnologies[] = ["name"];
  const typesTechnologies: RequiredTechnologies[] = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];

  const verifyKeys = bodyKeys.some((key: string) =>
    requiredKeys.join().includes(key)
  );

  if (!verifyKeys) {
    const joinedKeys: string[] = requiredKeys;
    return resp
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}.` });
  }

  if (typeof req.body.name !== "string") {
    return resp.status(400).json({ message: "The name need to be a string" });
  }

  const { name } = req.body;

  bodyValues = name;
  const queryTechnologyTemplate = `
    SELECT
        *
    FROM
        "technologies"
    WHERE
        name = (%L)
  `;
  const queryTechnologyFormat: string = format(
    queryTechnologyTemplate,
    bodyValues
  );

  const queryTechnologyResult = await client.query(queryTechnologyFormat);

  if (queryTechnologyResult.rowCount === 0) {
    return resp.status(400).json({
      message: "Technology not supported.",
      options: typesTechnologies,
    });
  }

  return next();
};

export default { verify };
