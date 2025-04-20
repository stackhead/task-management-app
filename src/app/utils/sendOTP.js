// utils/sendOTP.js
import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export async function sendOTP(email) {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

  try {
    // Store OTP in database (create a collection named 'otps')
    await databases.createDocument(
      'main', // your database ID
      'otps', // your collection ID
      ID.unique(),
      {
        email,
        otp,
        expiresAt
      }
    );

    // Send email with OTP (using Appwrite's email service or third-party)
    await account.createEmailSession(email, otp); // This is just for demo - use real email service
    
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error };
  }
}