import { QueryResult } from "pg";

interface iProjectsTechonologiesRequest {
  name: string;
}

interface iProjectsTechonologies {
  id: number;
  addedIn: Date;
  projectID: number;
  technologyID: number;
}

type ProjectsTechonologiesResult = QueryResult<iProjectsTechonologies>;

type RequiredKeysTechnologies = "name";
type RequiredTechnologies =
  | "JavaScript"
  | "Python"
  | "React"
  | "Express.js"
  | "HTML"
  | "CSS"
  | "Django"
  | "PostgreSQL"
  | "MongoDB";

export {
  iProjectsTechonologiesRequest,
  ProjectsTechonologiesResult,
  RequiredTechnologies,
  RequiredKeysTechnologies
};
