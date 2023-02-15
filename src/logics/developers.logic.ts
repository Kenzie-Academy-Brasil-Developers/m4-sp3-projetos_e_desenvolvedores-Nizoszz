import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  DeveloperCreate,
  DeveloperResult,
} from "../interfaces/developers.interfaces";

const create = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const { name, email } = req.body;

    const body: DeveloperCreate = { name, email };
    const tbCol: string[] = Object.keys(body);
    const tbValues: string[] = Object.values(body);

    const queryTemplate: string = `
    INSERT INTO 
        "developers" (%I)
    VALUES
        (%L)
    RETURNING *;
  `;

    const queryFormat: string = format(queryTemplate, tbCol, tbValues);
    const queryResult: DeveloperResult = await client.query(queryFormat);

    const developer = queryResult.rows[0];

    return resp.status(201).json(developer);
  } catch (error: any) {
    if (error.constraint === "developers_email_key") {
      return resp.status(409).json({ message: "Email already exists." });
    }
    return resp.status(500).json({ message: "Internal server error." });
  }
};

const read = async (req: Request, resp: Response): Promise<Response> => {
  const queryTemplate: string = `
    SELECT 
      d.*,
      di."developerSince",
      di."preferredOS"
    FROM 
      developers d
    LEFT JOIN
      developer_infos di ON d."developerInfoID" = di.id
    ORDER BY
      id ASC;
  `;

  const queryFormat: string = format(queryTemplate);
  const queryResult: DeveloperResult = await client.query(queryFormat);

  const developers = queryResult.rows;

  return resp.status(200).json(developers);
};

const readId = async (req: Request, resp: Response): Promise<Response> => {
  const paramId: number = Number(req.params.id);
  const queryTemplate: string = `
    SELECT 
      d.*,
      di."developerSince",
      di."preferredOS"
    FROM 
      developers d
    LEFT JOIN
      developer_infos di ON d."developerInfoID" = di.id
    WHERE 
      d."id" = (%L)
    ORDER BY
      id ASC;
  `;

  const queryFormat: string = format(queryTemplate, [paramId]);
  const queryResult: DeveloperResult = await client.query(queryFormat);

  const developers = queryResult.rows[0];

  return resp.status(200).json(developers);
};

const update = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const body: string[] = req.body;
    const tbCol: string[] = Object.keys(body);
    const tbValues: string[] = Object.values(body);
    const params = req.params.id;

    const queryTemplate = `
      UPDATE 
        "developers"
      SET(%I) = ROW(%L)
      WHERE 
        id = $1
      RETURNING *;    
    `;
    const queryFormat: string = format(queryTemplate, tbCol, tbValues);
    const queryConfig: QueryConfig = {
      text: queryFormat,
      values: [params],
    };

    const queryResult: DeveloperResult = await client.query(queryConfig);
    const developerUpdate = queryResult.rows[0];

    return resp.status(200).json(developerUpdate);
  } catch (error: any) {
    if (error.constraint === "developers_email_key") {
      return resp.status(409).json({ message: "Email already exists." });
    }
    return resp.status(500).json({ message: "Interal server error." });
  }
};
const del = async (request: Request, response: Response): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryString: string = `
    DELETE FROM
      developers
    WHERE id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: DeveloperResult = await client.query(queryConfig);

  return response.status(204).send();
};

export default { create, read, readId, update, del };
