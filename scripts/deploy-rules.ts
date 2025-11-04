#!/usr/bin/env tsx

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Load service account
const serviceAccount = require("../secretkey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
});

async function deployDatabaseRules() {
  console.log("📋 Deploying Firebase Realtime Database Rules...\n");

  // Read the rules file
  const rulesPath = path.join(__dirname, "..", "database.rules.json");
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  console.log("✅ Rules file loaded successfully");
  console.log("📄 Rules structure:");
  console.log(JSON.stringify(rules, null, 2));

  console.log("\n⚠️  Note: Firebase Admin SDK cannot directly deploy rules.");
  console.log("Please deploy rules manually via:");
  console.log("1. Firebase Console: https://console.firebase.google.com/");
  console.log("2. Select project: blockchainkix-com-fy");
  console.log("3. Go to: Realtime Database → Rules");
  console.log("4. Copy the rules from database.rules.json");
  console.log("5. Click 'Publish'\n");

  console.log("Or use Firebase CLI:");
  console.log("  firebase login --reauth");
  console.log("  firebase deploy --only database\n");
}

deployDatabaseRules().catch(console.error);
