import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  DeveloperInfoResult,
  DeveloperInfosCreate,
  iDeveloperInfosUpdate,
} from "../interfaces/developers.interfaces";

const create = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const userId: number = Number(req.params.id);

    const queryUserTemplate: string = `
    SELECT 
      d.*,
      di."developerSince",
      di."preferredOS"
    FROM 
      developers d
    LEFT JOIN
      developer_infos di ON d."developerInfoId" = di.id
    WHERE
      d.id = $1
  `;

    const queryUserString: QueryConfig = {
      text: queryUserTemplate,
      values: [userId],
    };
    const queryUserResult: QueryResult = await client.query(queryUserString);

    const developer = queryUserResult.rows[0];

    if (developer.developerInfoId !== null) {
      return resp.status(409).json({ message: "Infos already exists." });
    }

    const { developerSince, preferredOS }: DeveloperInfosCreate = req.body;
    const body = { developerSince, preferredOS };

    const tbCol: string[] = Object.keys(body);
    const tbValues: (string | Date)[] = Object.values(body);

    const queryTemplate: string = `
      INSERT INTO 
          "developer_infos" (%I)
      VALUES
          (%L)
      RETURNING *;
    `;

    const queryAddFormat: string = format(queryTemplate, tbCol, tbValues);

    const queryAddResult: DeveloperInfoResult = await client.query(
      queryAddFormat
    );

    const developerInfos = queryAddResult.rows[0];

    const queryStringUpdated: string = `
      UPDATE
        "developers"
      SET
        "developerInfoId" = $1
      WHERE
        id = $2
      RETURNING *;
    `;

    const queryConfig: QueryConfig = {
      text: queryStringUpdated,
      values: [developerInfos.id, userId],
    };

    const queryResult: DeveloperInfoResult = await client.query(queryConfig);

    return resp.status(201).json(developerInfos);
  } catch (error: any) {
    if (error.message) {
      return resp.status(409).json({ message: "Insert correct values." });
    }
    return resp.status(500).json({ message: "Internal server error." });
  }
};

const update = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const userId: number = Number(req.params.id);

    const queryUserTemplate: string = `
      SELECT 
        *
      FROM 
        developers d
      LEFT JOIN
        developer_infos di ON d."developerInfoId" = di.id
      WHERE
        d.id = $1
    `;

    const queryUserString: QueryConfig = {
      text: queryUserTemplate,
      values: [userId],
    };

    const queryUserResult: QueryResult = await client.query(queryUserString);

    const developer = queryUserResult.rows[0];

    const { developerSince, preferredOS } = req.body;
    let body: iDeveloperInfosUpdate = { developerSince, preferredOS };

    if (body.developerSince === undefined) {
      body = { preferredOS };
    }

    if (body.preferredOS === undefined) {
      body = { developerSince };
    }

    const tbCol: string[] = Object.keys(body);
    const tbValues: (string | Date)[] = Object.values(body);

    const queryTemplate = `
      UPDATE 
        "developer_infos" 
      SET
        (%I) = ROW (%L)
      WHERE 
        id = $1
      RETURNING *;  
    `;
    const queryFormat: string = format(queryTemplate, tbCol, tbValues);
    const queryConfig: QueryConfig = {
      text: queryFormat,
      values: [developer.developerInfoId],
    };

    const queryResult: DeveloperInfoResult = await client.query(queryConfig);
    const developerUpdate = queryResult.rows[0];
    if (developerUpdate === undefined) {
      return resp
        .status(404)
        .json({ message: "Infos not registered in developer." });
    }

    return resp.status(200).json(developerUpdate);
  } catch (error: any) {
    return resp.status(500).json({ message: "Interal server error." });
  }
};

export default { create, update };
