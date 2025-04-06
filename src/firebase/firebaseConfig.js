// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',  
};

const app = initializeApp(firebaseConfig);

// Obter referência ao Firestore
const db = getFirestore(app);

export { db, collection, addDoc };
