// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyA7W3xmnKjnnBJ7LBFiiHEM-jItJZIPDWk',
    authDomain: 'testeuser@gmail.com',
    projectId: 'guilhermem-29d59',
    storageBucket: 'Teste.projetoTCC',
    messagingSenderId: '1033451552965',
    appId: '1:1033451552965:android:db6ae67c3953668507b0ac',
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportando para ser usado em outros arquivos
export { auth, db };
