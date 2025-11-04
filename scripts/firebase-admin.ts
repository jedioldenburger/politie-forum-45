// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  // Try to read credentials from an environment variable
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
    });
  } else {
    // Local fallback: still allow loading secretkey.json during dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require("../../secretkey.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
    });
  }
}

export const db = admin.database();
export const auth = admin.auth();
export default admin;
