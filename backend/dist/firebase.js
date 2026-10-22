"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let firebaseApp = null;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccountJson) {
    try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        firebaseApp = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
        });
    }
    catch (err) {
        console.error('Failed to initialize Firebase Admin SDK:', err.message);
    }
}
else {
    console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT is not defined. Firestore is unavailable.');
}
exports.db = firebaseApp ? firebase_admin_1.default.firestore(firebaseApp) : null;
