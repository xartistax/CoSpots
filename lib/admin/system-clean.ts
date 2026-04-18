import { adminAuth, adminDb } from "@/lib/firebase/admin";

const USERS_COLLECTION = "users";
const BOOKINGS_COLLECTION = "bookings";
const BATCH_SIZE = 400;

type SystemCleanPreview = {
  adminUids: string[];
  bookingCount: number;
  userDocCountToDelete: number;
  authUserCountToDelete: number;
};

type SystemCleanResult = {
  keptAdminUids: string[];
  deletedBookingCount: number;
  deletedUserDocCount: number;
  deletedAuthUserCount: number;
};

async function getAdminUids(): Promise<Set<string>> {
  const adminUids = new Set<string>();

  const adminDocsSnapshot = await adminDb.collection(USERS_COLLECTION).where("accessRole", "==", "admin").get();

  for (const doc of adminDocsSnapshot.docs) {
    adminUids.add(doc.id);
  }

  let pageToken: string | undefined;

  do {
    const page = await adminAuth.listUsers(1000, pageToken);

    for (const user of page.users) {
      if (user.customClaims?.admin === true) {
        adminUids.add(user.uid);
      }
    }

    pageToken = page.pageToken;
  } while (pageToken);

  return adminUids;
}

async function deleteCollectionDocsExcept(collectionName: string, keepDocIds: Set<string>): Promise<number> {
  let deletedCount = 0;

  while (true) {
    const snapshot = await adminDb.collection(collectionName).limit(BATCH_SIZE).get();

    if (snapshot.empty) {
      break;
    }

    const docsToDelete = snapshot.docs.filter((doc) => !keepDocIds.has(doc.id));

    if (docsToDelete.length === 0) {
      break;
    }

    const batch = adminDb.batch();

    for (const doc of docsToDelete) {
      batch.delete(doc.ref);
    }

    await batch.commit();
    deletedCount += docsToDelete.length;
  }

  return deletedCount;
}

async function deleteAuthUsersExcept(keepUids: Set<string>): Promise<number> {
  let deletedCount = 0;
  let pageToken: string | undefined;

  do {
    const page = await adminAuth.listUsers(1000, pageToken);

    for (const user of page.users) {
      if (keepUids.has(user.uid)) {
        continue;
      }

      await adminAuth.deleteUser(user.uid);
      deletedCount += 1;
    }

    pageToken = page.pageToken;
  } while (pageToken);

  return deletedCount;
}

export async function previewSystemClean(): Promise<SystemCleanPreview> {
  const adminUids = await getAdminUids();

  const [bookingsSnapshot, usersSnapshot] = await Promise.all([adminDb.collection(BOOKINGS_COLLECTION).get(), adminDb.collection(USERS_COLLECTION).get()]);

  let authUserCountToDelete = 0;
  let pageToken: string | undefined;

  do {
    const page = await adminAuth.listUsers(1000, pageToken);

    for (const user of page.users) {
      if (!adminUids.has(user.uid)) {
        authUserCountToDelete += 1;
      }
    }

    pageToken = page.pageToken;
  } while (pageToken);

  const userDocCountToDelete = usersSnapshot.docs.filter((doc) => !adminUids.has(doc.id)).length;

  return {
    adminUids: [...adminUids],
    bookingCount: bookingsSnapshot.size,
    userDocCountToDelete,
    authUserCountToDelete,
  };
}

export async function runSystemClean(): Promise<SystemCleanResult> {
  const adminUids = await getAdminUids();

  const deletedBookingCount = await deleteCollectionDocsExcept(BOOKINGS_COLLECTION, new Set());
  const deletedUserDocCount = await deleteCollectionDocsExcept(USERS_COLLECTION, adminUids);
  const deletedAuthUserCount = await deleteAuthUsersExcept(adminUids);

  return {
    keptAdminUids: [...adminUids],
    deletedBookingCount,
    deletedUserDocCount,
    deletedAuthUserCount,
  };
}
