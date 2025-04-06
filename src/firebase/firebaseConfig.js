// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyA7W3xmnKjnnBJ7LBFiiHEM-jItJZIPDWk',
    authDomain: 'testeuser@gmail.com',
    projectId: 'guilhermem-29d59',
    storageBucket: 'Teste.projetoTCC',
    messagingSenderId: '1033451552965',
    appId: '1:1033451552965:android:db6ae67c3953668507b0ac',  
};

const app = initializeApp(firebaseConfig);

// Obter referência ao Firestore
const db = getFirestore(app);

export { db, collection, addDoc };