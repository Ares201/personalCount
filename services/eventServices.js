import {db} from '~/plugins/firebase'
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'

const eventsCollection = collection(db, 'events')

// Crear un event
export const createEvent = async (event) => {
  return await addDoc(eventsCollection, event)
}

// Obtener todos los events
export const getEvents = async () => {
  const snapshot = await getDocs(eventsCollection)
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

// Actualizar un event
// export const updateEvent = async (id, updatedFields) => {
//   const eventDoc = doc(db, 'events', id)
//   return await updateDoc(eventDoc, updatedFields)
// }
// Actualizar un evento en Firebase evitando valores undefined
export const updateEvent = async (id, updatedFields) => {
  const eventDoc = doc(db, 'events', id);
  // Limpiar undefined y reemplazar por null
  const cleanFields = Object.fromEntries(
    Object.entries(updatedFields).map(([key, value]) => [key, value ?? null])
  );
  return await updateDoc(eventDoc, cleanFields);
};

// Eliminar un event
export const deleteEvent = async (id) => {
  const eventDoc = doc(db, 'events', id)
  return await deleteDoc(eventDoc)
}
