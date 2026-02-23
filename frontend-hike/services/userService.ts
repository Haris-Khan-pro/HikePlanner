// frontend-hike/services/userService.ts

const API_URL = "http://YOUR_PC_IP:8000"; 
// ⚠️ Replace YOUR_PC_IP with your actual IP
// To find it: open cmd and type "ipconfig" → look for IPv4 Address
// Example: "http://192.168.1.5:8000"

interface SyncUserParams {
  clerkId: string;
  email: string;
  name?: string;
  profileImage?: string;
  authProvider: "email" | "google" | "apple";
}

// This function saves a user to our MongoDB
export async function syncUserToMongoDB(params: SyncUserParams) {
  try {
    const response = await fetch(`${API_URL}/api/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerk_id: params.clerkId,
        email: params.email,
        name: params.name || "",
        profile_image: params.profileImage || "",
        auth_provider: params.authProvider,
      }),
    });

    const data = await response.json();

    if (data.is_new_user) {
      console.log("✅ New user saved to MongoDB:", data.email);
    } else {
      console.log("✅ Existing user found in MongoDB:", data.email);
    }

    return data;
  } catch (error) {
    // Don't crash the app if DB save fails, just log it
    console.error("❌ Failed to sync user to MongoDB:", error);
  }
}