#!/usr/bin/env tsx

import admin from "./firebase-admin";

const db = admin.database();

async function testConnection() {
  console.log("🔥 Firebase Admin SDK - Connection Test\n");

  try {
    // Test database connection
    console.log("Testing database connection...");
    const ref = db.ref("categories");
    const snapshot = await ref.limitToFirst(1).once("value");

    if (snapshot.exists()) {
      console.log("✅ Database connection successful!");
      console.log("📊 Sample data retrieved:");
      console.log(JSON.stringify(snapshot.val(), null, 2));
    } else {
      console.log("⚠️  Database is empty");
    }

    // Show database info
    console.log("\n📝 Database Info:");
    console.log(
      "  URL:",
      "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
    );
    console.log("  Project:", "blockchainkix-com-fy");
    console.log("  Region:", "europe-west1");

    // Test auth
    console.log("\n👤 Testing Firebase Auth...");
    const users = await admin.auth().listUsers(1);
    console.log(
      `✅ Auth connection successful! Found ${users.users.length} user(s)`
    );

    console.log("\n✨ All Firebase services are operational!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Verify secretkey.json is in the root directory");
    console.error("2. Check Firebase project permissions");
    console.error("3. Ensure database rules allow admin access");
  }
}

testConnection().then(() => process.exit(0));
