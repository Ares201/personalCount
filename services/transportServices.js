import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const transportCollection = collection(db, 'transports');

// Crear un transport
export const createTransport = async (transport) => {
  return await addDoc(transportCollection, transport);
};

// Obtener todos los transports
export const getTransports = async () => {
  const snapshot = await getDocs(transportCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar un transport
export const updateTransport = async (id, updatedFields) => {
  const transportDoc = doc(db, 'transports', id);
  return await updateDoc(transportDoc, updatedFields);
};

// Eliminar un transport
export const deleteTransport = async (id) => {
  const transportDoc = doc(db, 'transports', id);
  return await deleteDoc(transportDoc);
};
