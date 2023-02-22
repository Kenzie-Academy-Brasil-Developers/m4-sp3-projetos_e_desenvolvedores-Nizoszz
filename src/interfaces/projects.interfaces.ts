import { QueryResult } from "pg";

interface iProjectRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  developerId: number;
}

interface iProjectUpdate {
  name?: string;
  description?: string;
  estimatedTime?: string;
  repository?: string;
  startDate?: Date;
  endDate?: Date;
  developerId?: number;
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
  | "developerId";
type ProjectResult = QueryResult<iProject>;
type ProjectCreate = Omit<iProject, "id">;

export {
  iProject,
  RequiredKeysProject,
  ProjectResult,
  ProjectCreate,
  iProjectUpdate,
  iProjectRequest
};
