import { Client } from "pg";

export const client: Client = new Client({
  user: "Nizosz",
  password: "180494",
  host: "localhost",
  database: "developers_projects",
  port: 5432,
});
