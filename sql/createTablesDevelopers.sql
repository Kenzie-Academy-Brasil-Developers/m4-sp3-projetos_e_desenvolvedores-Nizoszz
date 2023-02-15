CREATE TYPE "preferredOS" AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS "developer_infos"(
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" "preferredOS" NOT Null 
);

CREATE TABLE IF NOT EXISTS "developers"(
    "id" SERIAL PRIMARY KEY,
   "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL UNIQUE,
    "developerInfoId" INTEGER UNIQUE,
    FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "projects"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedTime" VARCHAR(20) NOT NULL,
    "repository" VARCHAR(120) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "developerID" INTEGER NOT NULL,
    FOREIGN KEY ("developerID") REFERENCES developers("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "technologies"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL
);

INSERT INTO
    technologies ("name")
VALUES
    ('JavaScript'), ('Python'), ('React'), ('Express.js'), ('HTML'), ('CSS'), ('Django'), ('PostgreSQL'), ('MongoDB');

CREATE TABLE IF NOT EXISTS "projects_technologies"(
    "id" SERIAL PRIMARY KEY,
    "addedIn" DATE NOT NULL,
    "projectID" INTEGER NOT NULL,
    FOREIGN KEY ("projectID") REFERENCES projects("id") ON DELETE CASCADE,
    "technologyID" INTEGER NOT NULL,
    FOREIGN KEY ("technologyID") REFERENCES technologies("id") ON DELETE RESTRICT
);