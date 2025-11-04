#!/usr/bin/env tsx

import * as fs from "fs";
import { google } from "googleapis";
import * as path from "path";

async function deployDatabaseRules() {
  console.log(
    "📋 Deploying Firebase Realtime Database Rules via REST API...\n"
  );

  try {
    // Load service account
    const serviceAccountPath = path.join(__dirname, "..", "secretkey.json");
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf-8")
    );

    // Load rules
    const rulesPath = path.join(__dirname, "..", "database.rules.json");
    const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

    console.log("✅ Service account and rules loaded");

    // Create JWT client
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: [
        "https://www.googleapis.com/auth/firebase",
        "https://www.googleapis.com/auth/cloud-platform",
      ],
    });

    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to get access token");
    }

    console.log("✅ Access token obtained");

    // Deploy rules using Firebase REST API
    const projectId = serviceAccount.project_id;
    const databaseName = "blockchainkix-com-fy-default-rtdb";

    const url = `https://firebasedatabase.googleapis.com/v1beta/projects/${projectId}/locations/europe-west1/instances/${databaseName}/ruleSets`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: {
          files: [
            {
              name: "database.rules.json",
              content: JSON.stringify(rules),
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to deploy rules: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ Rules deployed successfully!");
    console.log("📄 Response:", JSON.stringify(result, null, 2));

    // Now set the ruleset as active
    const rulesetName = result.name;
    const releaseUrl = `https://firebasedatabase.googleapis.com/v1beta/projects/${projectId}/locations/europe-west1/instances/${databaseName}/releases`;

    const releaseResponse = await fetch(releaseUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${releaseUrl}/prod`,
        rulesetName: rulesetName,
      }),
    });

    if (!releaseResponse.ok) {
      const errorText = await releaseResponse.text();
      console.warn(
        `⚠️  Warning: Rules created but activation may have failed: ${errorText}`
      );
    } else {
      console.log("✅ Rules activated successfully!");
    }
  } catch (error) {
    console.error("❌ Error deploying rules:", error);
    throw error;
  }
}

deployDatabaseRules().catch((error) => {
  console.error("Failed to deploy rules:", error);
  process.exit(1);
});
