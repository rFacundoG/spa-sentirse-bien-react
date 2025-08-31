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

// La configuración de Firebase se toma de las variables de entorno de Vite.
// Vite inyectará los valores de los secrets de GitHub en el build de producción,
// y los valores de tu archivo .env.local en desarrollo.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa la aplicación Firebase de forma incondicional.
const app = initializeApp(firebaseConfig);

// Exporta los servicios de Firebase, asegurándote de que usen la 'app' inicializada.
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

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

