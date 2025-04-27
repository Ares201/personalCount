import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const vehicleCollection = collection(db, 'vehiculos');

// Crear un vehiculo
export const createVehicle = async (vehicle) => {
  return await addDoc(vehicleCollection, vehicle);
};

// Obtener todos los vehiculos
export const getVehicles = async () => {
  const snapshot = await getDocs(vehicleCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar un vehiculo
export const updateVehicle = async (id, updatedFields) => {
  const vehicleDoc = doc(db, 'vehiculos', id);
  return await updateDoc(vehicleDoc, updatedFields);
};

// Eliminar un vehiculo
export const deleteVehicle = async (id) => {
  const vehicleDoc = doc(db, 'vehiculos', id);
  return await deleteDoc(vehicleDoc);
};
