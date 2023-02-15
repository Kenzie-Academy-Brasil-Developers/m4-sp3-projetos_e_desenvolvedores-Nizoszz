import "dotenv/config";
import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  developersLogic,
  developersInfosLogic,
  projects,
  projectsTechnologies,
} from "./logics";
import {
  ensureExistsDeveloper,
  validatedDeveloper,
  validatedDeveloperInfos,
  validatedProject,
  ensureExistsProject,
  validatedProjectTechnologies,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

const port: number = Number(process.env.PORT) || 3000;

app.post("/developers", validatedDeveloper.verify, developersLogic.create);
app.post(
  "/developers/:id/infos",
  ensureExistsDeveloper.verify,
  validatedDeveloperInfos.verify,
  developersInfosLogic.create
);
app.get("/developers", developersLogic.read);
app.get(
  "/developers/:id",
  ensureExistsDeveloper.verify,
  developersLogic.readId
);

app.patch(
  "/developers/:id",
  ensureExistsDeveloper.verify,
  validatedDeveloper.verify,
  developersLogic.update
);
app.patch(
  "/developers/:id/infos",
  ensureExistsDeveloper.verify,
  validatedDeveloperInfos.verify,
  developersInfosLogic.update
);
app.delete(
  "/developers/:id",
  ensureExistsDeveloper.verify,
  developersLogic.del
);
app.post("/projects", validatedProject.verify, projects.create);
app.get("/projects", projects.read);
app.get("/projects/:id", ensureExistsProject.verify, projects.readId);
app.get(
  "/developers/:id/projects",
  ensureExistsDeveloper.verify,
  projects.readProject
);
app.patch(
  "/projects/:id",
  ensureExistsProject.verify,
  validatedProject.verify,
  projects.update
);
app.delete("/projects/:id", ensureExistsProject.verify, projects.del);
app.post(
  "/projects/:id/technologies",
  ensureExistsProject.verify,
  validatedProjectTechnologies.verify,
  projectsTechnologies.create
);
app.delete(
  "/projects/:id/technologies/:name",
  ensureExistsProject.verify,
  projectsTechnologies.del
);

app.listen(port, async (): Promise<void> => {
  await startDatabase();
  console.log("Server is running :)");
});
