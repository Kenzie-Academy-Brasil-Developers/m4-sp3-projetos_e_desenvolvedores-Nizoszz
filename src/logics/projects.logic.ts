import {
  ProjectCreate,
  ProjectResult,
} from "../interfaces/projects.interfaces";
import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";

const create = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const userId: number = req.body.developerID;
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

    const body: ProjectCreate = req.body;
    const tbCol: string[] = Object.keys(body);
    const tbValues: (string | Date)[] = Object.values(body);

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
            p."developerID" "projectDeveloperID",
            pt."technologyID",
            t."name" "technologyName"
        FROM 
            projects p
        LEFT JOIN 
            projects_technologies pt ON p."id" = pt."projectID"
        LEFT JOIN 
            technologies t ON pt."technologyID" = t.id
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
            p."developerID" "projectDeveloperID",
            pt."technologyID",
            t."name" "technologyName"
        FROM 
            projects p
        LEFT JOIN 
            projects_technologies pt ON p."id" = pt."projectID"
        LEFT JOIN 
            technologies t ON pt."technologyID" = t.id
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
            d."id" "developerID",
            d."name" "developerName",
            d."email" "developerEmail",
            d."developerInfoID" ,
            di."developerSince" "developerInfoSice",
            di."preferredOS" "developerInfoPreferredOS",
            p."id" "projectID",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            pt."technologyID",
            t."name" "technologyName"
        FROM
            developers d
        JOIN
            developer_infos di ON d."developerInfoID" = di.id
        JOIN
            projects p ON d."id"  = p."developerID"
        JOIN
            projects_technologies pt ON p."id" = pt."projectID"
        JOIN
            technologies t ON pt."technologyID" = t."id"
        WHERE
            d."id" = (%L)
        ORDER BY
            pt."projectID" ASC;
          `;

  const queryFormat: string = format(queryTemplate, [projectId]);
  const queryResult: ProjectResult = await client.query(queryFormat);

  const projects = queryResult.rows;
  console.log(projects);
  return resp.status(200).json(projects);
};

const update = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const body: string[] = req.body;
    const tbCol: string[] = Object.keys(body);
    const tbValues: string[] = Object.values(body);
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
