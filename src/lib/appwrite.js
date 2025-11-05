import { Client, Account, Databases, ID, Query } from "appwrite"

// Use environment variables when available (use NEXT_PUBLIC_* for client-side access)
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "67c93439003c80ddc565"

// Initialize the Appwrite client
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT)

// Initialize Appwrite services
const account = new Account(client)
const databases = new Databases(client)

// Database and collection IDs (fall back to existing IDs if env vars not provided)
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "67d121220014a612d627"
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "6849918b0027495e8f09"
const PREFERENCES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PREFERENCES_COLLECTION_ID || "684992fe0019dea6ac1b"
const COLUMNS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLUMNS_COLLECTION_ID || "67d12172003260976743"
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID || "67d1253a0012d54c26f1"

// Only log config when debugging is explicitly enabled
if (process.env.NEXT_PUBLIC_APPWRITE_DEBUG === "true") {
  try {
    // Use a safe log that won't run on build-time inlined code paths
    // This will appear in the browser console for client requests and in the server terminal
    // if the code runs server-side. It's disabled by default.
    // Note: leave this guarded to avoid leaking sensitive IDs in CI or public logs.
    // eslint-disable-next-line no-console
    console.log("Appwrite Config Loaded:", {
      projectId: APPWRITE_PROJECT,
      databaseId: DATABASE_ID,
      usersCollectionId: USERS_COLLECTION_ID,
      preferencesCollectionId: PREFERENCES_COLLECTION_ID,
      columnsCollectionId: COLUMNS_COLLECTION_ID,
      tasksCollectionId: TASKS_COLLECTION_ID,
    })
  } catch (e) {
    // ignore logging errors
  }
}

export {
  client,
  account,
  databases,
  ID,
  Query,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PREFERENCES_COLLECTION_ID,
  COLUMNS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
}
