import { Client, Account, Databases, ID ,Query } from "appwrite";


const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query }; // ✅ Export correctly
const DATABASE_ID = "67d121220014a612d627";  // Your database ID
const COLUMNS_COLLECTION_ID = "67d12172003260976743";  // Your columns collection ID
const TASKS_COLLECTION_ID = "67d1253a0012d54c26f1";  // Your tasks collection ID

export { DATABASE_ID, COLUMNS_COLLECTION_ID, TASKS_COLLECTION_ID };