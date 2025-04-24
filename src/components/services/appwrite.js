import { Client, Account, Databases, ID, Query } from "appwrite"

// Initialize variables
let client
let account
let databases

// Only initialize on the client side
if (typeof window !== "undefined") {
  try {
    client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

    account = new Account(client)
    databases = new Databases(client)
  } catch (error) {
    console.error("Error initializing Appwrite client:", error)
  }
}

// Database and collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "67d121220014a612d627"
const COLUMNS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLUMNS_COLLECTION_ID || "67d12172003260976743"
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID || "67d1253a0012d54c26f1"

export { client, account, databases, ID, Query, DATABASE_ID, COLUMNS_COLLECTION_ID, TASKS_COLLECTION_ID }
