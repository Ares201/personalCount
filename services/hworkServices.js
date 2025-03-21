import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const hworksCollection = collection(db, 'hworks');

// Crear un hwork
export const createHwork = async (hwork) => {
  return await addDoc(hworksCollection, hwork);
};

// Obtener todos los hworks (versión estática)
export const getHworks = async () => {
  const snapshot = await getDocs(hworksCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Escuchar cambios en tiempo real
export const listenToHworks = (callback) => {
  return onSnapshot(hworksCollection, (snapshot) => {
    const hworks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(hworks);
  });
};

// Actualizar un hwork
export const updateHwork = async (id, updatedFields) => {
  const hworkDoc = doc(db, 'hworks', id);
  // Limpiar undefined y reemplazar por null
  const cleanFields = Object.fromEntries(
    Object.entries(updatedFields).map(([key, value]) => [key, value ?? null])
  );
  return await updateDoc(hworkDoc, cleanFields);
};

// Eliminar un hwork
export const deleteHwork = async (id) => {
  const hworkDoc = doc(db, 'hworks', id);
  return await deleteDoc(hworkDoc);
};