import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Sua configuração do Firebase
const ConfiguracaoFirebase = {
    apiKey: "AIzaSyCPTPhEY56QZ4A2hWKqa9EyMM_QAVuwaVM",
    authDomain: "projetotcc8-5c2f9.firebaseapp.com",
    projectId: "projetotcc8-5c2f9",
    storageBucket: "projetotcc8-5c2f9.firebasestorage.app",
    messagingSenderId: "984709933815",
    appId: "1:984709933815:web:f4b0755f41e7c5022601f2"
};

const app = initializeApp(ConfiguracaoFirebase);

// Obter referência ao Firestore
const db = getFirestore(app);

export { db, collection, addDoc };