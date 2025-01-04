import {db} from '~/plugins/firebase'
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'

const boxsCollection = collection(db, 'boxs')

// Crear un box
export const createBox = async (box) => {
  return await addDoc(boxsCollection, box)
}

// Obtener todos los boxs
export const getBoxs = async () => {
  const snapshot = await getDocs(boxsCollection)
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

// Actualizar un box
export const updateBox = async (id, updatedFields) => {
  const boxDoc = doc(db, 'boxs', id)
  return await updateDoc(boxDoc, updatedFields)
}

// Eliminar un box
export const deleteBox = async (id) => {
  const boxDoc = doc(db, 'boxs', id)
  return await deleteDoc(boxDoc)
}
