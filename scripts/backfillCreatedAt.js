import { createRequire } from "module";
const require = createRequire(import.meta.url);

import admin from "firebase-admin";

// Initialize old Firebase (source)
const oldServiceAccount = require("../heloin-21882-firebase-adminsdk-fbsvc-4f4c52f43d.json");
const oldApp = admin.initializeApp(
  {
    credential: admin.credential.cert(oldServiceAccount),
  },
  "oldApp"
);

// Initialize new Firebase (target)
const newServiceAccount = require("../helio-89b78-firebase-adminsdk-fbsvc-38cf413644.json");
const newApp = admin.initializeApp(
  {
    credential: admin.credential.cert(newServiceAccount),
  },
  "newApp"
);

const oldAuth = oldApp.auth();
const newDb = newApp.firestore();

async function migrateUsers() {
  console.log("Fetching users from old project...");
  let nextPageToken;

  do {
    const listUsersResult = await oldAuth.listUsers(1000, nextPageToken);
    for (const user of listUsersResult.users) {
      const createdAt = new Date(user.metadata.creationTime);

      // Update Firestore in the new project
      await newDb
        .collection("users")
        .doc(user.uid)
        .set(
          {
            email: user.email || null,
            createdAt,
            displayName: user.displayName || null,
          },
          { merge: true }
        );

      console.log(`✅ Synced user ${user.email || user.uid}`);
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  console.log("🎉 Migration complete!");
}

migrateUsers().catch(console.error);
