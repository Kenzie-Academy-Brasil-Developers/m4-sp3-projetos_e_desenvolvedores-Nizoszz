import {
  ProjectResult,
  RequiredKeysProject,
} from "../interfaces/projects.interfaces";
import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";

const create = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const userId: number = req.body.developerId;
    const queryUserTemplate: string = `
        SELECT
            COUNT(*)
        FROM
            "developers"
        WHERE
            id = $1
    `;
    const queryUserResult: QueryResult = await client.query(queryUserTemplate, [
      userId,
    ]);

    const user = queryUserResult.rows[0].count;

    if (Number(user) < 1) {
      return resp.status(404).json({ message: "Developer not found!" });
    }

    let requiredKeys: RequiredKeysProject[] = [
      "name",
      "description",
      "estimatedTime",
      "repository",
      "startDate",
      "developerId",
    ];

    let tbCol: string[] = Object.keys(req.body);

    const filteredCol: string[] = tbCol.filter((key: any) =>
      requiredKeys.includes(key)
    );

    const newBody: any = {};

    filteredCol.map((key: string) => {
      newBody[key] = req.body[key];
    });

    tbCol = Object.keys(newBody);
    const tbValues: (string | number | Date)[] = Object.values(newBody);

    const queryTemplate: string = `
      INSERT INTO 
          "projects" (%I)
      VALUES
          (%L)
      RETURNING *;
    `;

    const queryFormat: string = format(queryTemplate, tbCol, tbValues);
    const queryResult: ProjectResult = await client.query(queryFormat);
    const project = queryResult.rows[0];

    return resp.status(201).json(project);
  } catch (error: any) {
    if (error.routine === "DateTimeParseError") {
      return resp.status(409).json({ message: "Incorrect date value." });
    }
    return resp.status(500).json({ message: "Internal server error." });
  }
};

const read = async (req: Request, resp: Response): Promise<Response> => {
  const queryTemplate: string = `
        SELECT 
            p."id" ,
            p."name",
            p."description",
            p."estimatedTime",
            p."repository",
            p."startDate",
            p."endDate",
            p."developerId" "projectDeveloperId",
            pt."technologyId",
            t."name" "technologyName"
        FROM 
            projects p
        LEFT JOIN 
            projects_technologies pt ON p."id" = pt."projectId"
        LEFT JOIN 
            technologies t ON pt."technologyId" = t.id
        ORDER BY
            p."id" ASC;
    `;

  const queryFormat: string = format(queryTemplate);
  const queryResult: ProjectResult = await client.query(queryFormat);

  const projects = queryResult.rows;

  return resp.status(200).json(projects);
};

const readId = async (req: Request, resp: Response): Promise<Response> => {
  const projectId: number = Number(req.params.id);
  const queryTemplate: string = `
        SELECT 
            p."id" ,
            p."name",
            p."description",
            p."estimatedTime",
            p."repository",
            p."startDate",
            p."endDate",
            p."developerId" "projectDeveloperId",
            pt."technologyId",
            t."name" "technologyName"
        FROM 
            projects p
        LEFT JOIN 
            projects_technologies pt ON p."id" = pt."projectId"
        LEFT JOIN 
            technologies t ON pt."technologyId" = t.id
        WHERE
          p."id" = (%L)
        ORDER BY
            p."id" ASC;
        `;

  const queryFormat: string = format(queryTemplate, [projectId]);
  const queryResult: ProjectResult = await client.query(queryFormat);

  const projects = queryResult.rows[0];

  return resp.status(200).json(projects);
};

const readProject = async (req: Request, resp: Response): Promise<Response> => {
  const projectId: number = Number(req.params.id);
  const queryTemplate: string = `
        SELECT
            d."id" "developerId",
            d."name" "developerName",
            d."email" "developerEmail",
            d."developerInfoId" ,
            di."developerSince" "developerInfoSice",
            di."preferredOS" "developerInfoPreferredOS",
            p."id" "projectId",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            pt."technologyId",
            t."name" "technologyName"
        FROM
            developers d
        LEFT JOIN
            developer_infos di ON d."developerInfoId" = di.id
        JOIN
            projects p ON d."id"  = p."developerId"
        LEFT JOIN
            projects_technologies pt ON p."id" = pt."projectId"
        LEFT JOIN
            technologies t ON pt."technologyId" = t."id"
        WHERE
            d."id" = (%L)
        ORDER BY
            pt."projectId" ASC;
          `;

  const queryFormat: string = format(queryTemplate, [projectId]);
  const queryResult: ProjectResult = await client.query(queryFormat);

  const projects = queryResult.rows;
  return resp.status(200).json(projects);
};

const update = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const userId: number = req.body.developerId;
    const queryUserTemplate: string = `
        SELECT
            COUNT(*)
        FROM
            "developers"
        WHERE
            id = $1
    `;
    const queryUserResult: QueryResult = await client.query(queryUserTemplate, [
      userId,
    ]);

    const user = queryUserResult.rows[0].count;

    if (Number(user) < 1) {
      return resp.status(404).json({ message: "Developer not found!" });
    }

    let requiredKeys: string[] = [
      "name",
      "description",
      "estimatedTime",
      "repository",
      "startDate",
      "endDate",
      "developerId",
    ];

    let tbCol: string[] = Object.keys(req.body);
    const filteredCol: string[] = tbCol.filter((key: any) =>
      requiredKeys.includes(key)
    );

    const newBody: any = {};

    filteredCol.map((key: string) => {
      newBody[key] = req.body[key];
    });

    tbCol = Object.keys(newBody);
    const tbValues = Object.values(newBody);

    const params = req.params.id;
    const queryTemplate = `
        UPDATE 
            "projects" p  
        SET
            (%I) = ROW (%L)
        WHERE 
            p."id" = $1
        RETURNING *;    
      `;
    const queryFormat: string = format(queryTemplate, tbCol, tbValues);
    const queryConfig: QueryConfig = {
      text: queryFormat,
      values: [params],
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    const developerUpdate = queryResult.rows[0];

    return resp.status(200).json(developerUpdate);
  } catch (error: any) {
    if (error.routine === "DateTimeParseError") {
      return resp.status(409).json({ message: "Incorrect date value." });
    }
    return resp.status(500).json({ message: "Interal server error." });
  }
};

const del = async (request: Request, response: Response): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryString: string = `
      DELETE FROM
        projects
      WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: ProjectResult = await client.query(queryConfig);

  return response.status(204).send();
};

export default { create, read, readId, readProject, update, del };
