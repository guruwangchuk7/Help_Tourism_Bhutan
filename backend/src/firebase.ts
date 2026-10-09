import admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountJson) {
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
  }
} else {
  console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT is not defined. Firestore is unavailable.');
}

export const db: admin.firestore.Firestore | null = firebaseApp ? admin.firestore(firebaseApp) : null;
