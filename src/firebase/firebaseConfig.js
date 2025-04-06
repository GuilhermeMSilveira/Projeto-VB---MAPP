// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportando para ser usado em outros arquivos
export { auth, db };
