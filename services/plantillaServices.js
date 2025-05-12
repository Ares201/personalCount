import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const plantillaCollection = collection(db, 'Plantillas');

// Crear un Plantilla
export const createPlantilla = async (plantilla) => {
  return await addDoc(plantillaCollection, plantilla);
};

// Obtener todos los Plantillas
export const getPlantillas = async () => {
  const snapshot = await getDocs(plantillaCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar un Plantilla
export const updatePlantilla = async (id, updatedFields) => {
  const plantillaDoc = doc(db, 'Plantillas', id);
  return await updateDoc(plantillaDoc, updatedFields);
};

// Eliminar un Plantilla
export const deletePlantilla = async (id) => {
  const plantillaDoc = doc(db, 'Plantillas', id);
  return await deleteDoc(plantillaDoc);
};
