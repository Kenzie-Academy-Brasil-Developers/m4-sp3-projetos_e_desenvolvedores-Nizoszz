import { QueryResult } from "pg";

interface iProjectRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
}

interface iProject extends iProjectRequest {
  id: number;
}

type RequiredKeysProject =
  | "name"
  | "description"
  | "estimatedTime"
  | "repository"
  | "startDate"
  | "developerID";
type ProjectResult = QueryResult<iProject>;
type ProjectCreate = Omit<iProject, "id">;

export { iProject, RequiredKeysProject, ProjectResult, ProjectCreate };
