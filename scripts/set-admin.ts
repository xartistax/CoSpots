import { adminAuth, adminDb } from "@/lib/firebase/admin";

async function main() {
  const uid = process.argv[2];

  if (!uid) {
    throw new Error("Bitte UID angeben: npm run set:admin -- <uid>");
  }

  await adminAuth.setCustomUserClaims(uid, { admin: true });

  await adminDb.collection("users").doc(uid).set(
    {
      accessRole: "admin",
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  console.log(`Admin gesetzt für UID: ${uid}`);
}

main().catch((error) => {
  console.error("Failed to set admin:", error);
  process.exit(1);
});
