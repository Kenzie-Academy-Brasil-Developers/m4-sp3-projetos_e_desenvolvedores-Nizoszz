import { QueryResult } from "pg";

interface iDeveloperRequest {
  name: string;
  email: string;
}

interface iDeveloper extends iDeveloperRequest {
  id: number;
}

interface iDeveloperUpdate {
  name?: string;
  email?: string;
}

interface iDeveloperInfosRequest {
  developerSince: Date;
  preferredOS: string;
}

interface iDeveloperInfosUpdate {
  developerSince?: Date;
  preferredOS?: string;
}

interface iDeveloperInfos extends iDeveloperInfosRequest {
  id: number;
}

type RequiredKeysDeveloper = "name" | "email";
type RequiredKeysDeveloperInfos = "developerSince" | "preferredOS";
type RequiredTypesPreferredOS = "Windows" | "Linux" | "MacOS";

type DeveloperResult = QueryResult<iDeveloper>;
type DeveloperCreate = Omit<iDeveloper, "id">;
type DeveloperInfosCreate = Omit<iDeveloperInfos, "id">;
type DeveloperInfoResult = QueryResult<iDeveloperInfos>;

export {
  iDeveloper,
  iDeveloperRequest,
  RequiredKeysDeveloper,
  DeveloperResult,
  iDeveloperInfos,
  iDeveloperInfosRequest,
  DeveloperInfoResult,
  RequiredKeysDeveloperInfos,
  RequiredTypesPreferredOS,
  DeveloperCreate,
  DeveloperInfosCreate,
  iDeveloperUpdate,
  iDeveloperInfosUpdate,
};
