// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 👈 Agrega esto

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDf9VYZUCeKbo8e-VDOAhKDnt5VyJphNCg",
    authDomain: "vetopolis-d5b82.firebaseapp.com",
    projectId: "vetopolis-d5b82",
    storageBucket: "vetopolis-d5b82.firebasestorage.app",
    messagingSenderId: "721475522906",
    appId: "1:721475522906:web:314a20777e1c4b65712363",
};

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Exporta el auth y el storage
export const auth = getAuth(app);
export const storage = getStorage(app); // 👈 Esta línea permite subir imágenes
