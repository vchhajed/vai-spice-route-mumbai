import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBmdU8j544PlSnyopO4RIdv42vB4_t5G1g",
  authDomain: "vai-firebase-id.firebaseapp.com",
  projectId: "vai-firebase-id",
  storageBucket: "vai-firebase-id.firebasestorage.app",
  messagingSenderId: "964867522015",
  appId: "1:964867522015:web:4472d7f4d7a37760b5986a",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
