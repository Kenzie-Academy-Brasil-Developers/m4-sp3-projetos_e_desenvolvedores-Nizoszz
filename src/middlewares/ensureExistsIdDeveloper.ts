import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

export const verify = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = Number(req.params.id);

  const queryUserTemplate: string = `
    SELECT
        COUNT(*)
    FROM
        "developers"
    WHERE
        id = $1
  `;

  const queryResult: QueryResult = await client.query(queryUserTemplate, [
    userId,
  ]);

  const userExist = queryResult.rows[0].count;

  if (Number(userExist) < 1) {
    return resp.status(404).json({ message: "Developer not found!" });
  }

  return next();
};

export default { verify };
