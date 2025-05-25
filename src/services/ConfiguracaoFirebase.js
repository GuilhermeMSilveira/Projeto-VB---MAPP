import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Sua configuração do Firebase
const ConfiguracaoFirebase = {
<<<<<<< HEAD
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
=======
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
>>>>>>> 824ed8b5228c1fd544777ae6d2347899af376232
};

const app = initializeApp(ConfiguracaoFirebase);

// Obter referência ao Firestore
const db = getFirestore(app);

export { db, collection, addDoc };
