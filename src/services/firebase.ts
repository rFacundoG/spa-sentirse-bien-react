import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { Service } from "../types/service";

// Vite expone `import.meta.env.DEV` que es `true` cuando corres `npm run dev`.
// En desarrollo, inicializamos Firebase manualmente con las variables de entorno.
// En producción, Firebase se inicializa a través de los scripts en `index.html`.
if (import.meta.env.DEV) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  initializeApp(firebaseConfig);
}

// getAuth() y getFirestore() usarán la app inicializada por defecto,
// ya sea la que inicializamos manualmente en desarrollo o la que
// inicializa Firebase Hosting en producción.
export const auth = getAuth();
export const db = getFirestore();

// Operaciones para servicios
export const servicesCollection = collection(db, "services");

export const getServices = async () => {
  const snapshot = await getDocs(servicesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addService = async (service: Omit<Service, "id">) => {
  const newDocRef = doc(servicesCollection);
  await setDoc(newDocRef, service);
  return newDocRef.id;
};

export const updateService = async (id: string, service: Partial<Service>) => {
  await setDoc(doc(servicesCollection, id), service, { merge: true });
};

export const deleteService = async (id: string) => {
  await deleteDoc(doc(servicesCollection, id));
};

// Funciones de autenticación
export const registerUser = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};