import { Request, Response } from "express";
import { QueryArrayResult, QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iProjectsTechonologiesRequest,
  ProjectsTechonologiesResult,
} from "../interfaces/projectsTechnologies.interfaces";

const create = async (req: Request, resp: Response): Promise<Response> => {
  try {
    const projectId: number = Number(req.params.id);
    const body: iProjectsTechonologiesRequest = req.body;
    const tbValues: string[] = Object.values(body);
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
      tbValues
    );

    const queryTechnologyResult = await client.query(queryTechnologyFormat);
    const addIn: Date = new Date();

    const queryTemplate: string = `
        INSERT INTO
            "projects_technologies" ("addedIn", "projectID", "technologyID")
        VALUES
            (%L)
        RETURNING *;
      `;

    const queryFormat: string = format(queryTemplate, [
      addIn,
      projectId,
      queryTechnologyResult.rows[0].id,
    ]);

    const queryResult: ProjectsTechonologiesResult = await client.query(
      queryFormat
    );

    const queryReturnTemplate = `
        SELECT 
            pt."technologyID",
            t."name" "technologyName",
            pt."projectID",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            p."developerID" "projectDeveloperID"
        FROM 
            projects p
        JOIN 
            projects_technologies pt ON p."id" = pt."projectID"
        JOIN 
            technologies t ON pt."technologyID" = t."id";
        `;

    const queryReturnFormat: string = format(queryReturnTemplate);

    const queryReturnResult: QueryArrayResult = await client.query(
      queryReturnFormat
    );

    const project = queryReturnResult.rows[0];

    return resp.status(201).json(project);
  } catch (error: any) {
    return resp.status(500).json({ message: "Internal server error." });
  }
};

const del = async (request: Request, response: Response): Promise<Response> => {
  const projectId: number = Number(request.params.id);
  const technologyName: string = request.params.name;

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
    technologyName
  );
  const queryTechnologyResult = await client.query(queryTechnologyFormat);

  const technology = queryTechnologyResult.rows[0].id;

  const queryString: string = `
    DELETE FROM 
        projects_technologies
    WHERE 
        "projectID" = $1
    AND 
        "technologyID" = $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId, technology],
  };

  const queryResult: ProjectsTechonologiesResult = await client.query(
    queryConfig
  );

  return response.status(204).send();
};

export default { create, del };
