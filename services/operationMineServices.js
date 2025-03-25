import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const operationMineCollection = collection(db, 'operationMines');

// Crear un operationMine
export const createOperationMine = async (operationMine) => {
  return await addDoc(operationMineCollection, operationMine);
};

// Obtener todos los operationMines
export const getOperationMines = async () => {
  const snapshot = await getDocs(operationMineCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar un operationMine
export const updateOperationMine = async (id, updatedFields) => {
  const operationMineDoc = doc(db, 'operationMines', id);
  return await updateDoc(operationMineDoc, updatedFields);
};

// Eliminar un operationMine
export const deleteOperationMine = async (id) => {
  const operationMineDoc = doc(db, 'operationMines', id);
  return await deleteDoc(operationMineDoc);
};
