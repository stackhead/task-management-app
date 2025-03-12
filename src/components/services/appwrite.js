import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
export const DATABASE_ID = "kanban_db";
export const COLUMNS_COLLECTION_ID = "columns";
export const TASKS_COLLECTION_ID = "tasks";
  

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
