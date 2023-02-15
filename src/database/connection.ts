import client from "./config";

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database is running :)");
};
