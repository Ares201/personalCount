import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCcrAbyn_rlS3tEcH44FdrEQr1CK2OExkA',
  authDomain: 'personalcount-85a4a.firebaseapp.com',
  projectId: 'personalcount-85a4a',
  storageBucket: 'personalcount-85a4a.firebasestorage.app',
  messagingSenderId: '657287358825',
  appId: '1:657287358825:web:5afb0ce6c9b7caeaa235f8',
  measurementId: 'G-M32FPJLN0E',
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

export default (context, inject) => {
  inject("db", db); // 🔹 Inyectamos Firestore en el contexto
};

export { auth, db };
