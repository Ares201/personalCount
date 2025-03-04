import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const employeeCollection = collection(db, 'empleados');

// Crear un empleado
export const createEmployee = async (employee) => {
  return await addDoc(employeeCollection, employee);
};

// Obtener todos los empleados
export const getEmployees = async () => {
  const snapshot = await getDocs(employeeCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar un empleado
export const updateEmployee = async (id, updatedFields) => {
  const employeeDoc = doc(db, 'empleados', id);
  return await updateDoc(employeeDoc, updatedFields);
};

// Eliminar un empleado
export const deleteEmployee = async (id) => {
  const employeeDoc = doc(db, 'empleados', id);
  return await deleteDoc(employeeDoc);
};
