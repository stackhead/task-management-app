import { Client, Account, Databases, ID, Query } from "appwrite"

// Initialize the Appwrite client
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("67c93439003c80ddc565")

// Initialize Appwrite services
const account = new Account(client)
const databases = new Databases(client)

// Database and collection IDs
const DATABASE_ID = "67d121220014a612d627"
const USERS_COLLECTION_ID = "6849918b0027495e8f09"
const PREFERENCES_COLLECTION_ID = "684992fe0019dea6ac1b"
const COLUMNS_COLLECTION_ID = "67d12172003260976743"
const TASKS_COLLECTION_ID = "67d1253a0012d54c26f1"

console.log("Appwrite Config Loaded:", {
  projectId: "67c93439003c80ddc565",
  databaseId: DATABASE_ID,
  usersCollectionId: USERS_COLLECTION_ID,
  preferencesCollectionId: PREFERENCES_COLLECTION_ID,
  columnsCollectionId: COLUMNS_COLLECTION_ID,
  tasksCollectionId: TASKS_COLLECTION_ID,
})

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
