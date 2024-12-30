import { db } from '~/plugins/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const userCollection = collection(db, 'usuarios')

// Crear un usuario
export const createUser = async (user) => {
  return await addDoc(userCollection, user)
}

// Obtener todos los usuarios
export const getUsers = async () => {
  const snapshot = await getDocs(userCollection)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Actualizar un usuario
export const updateUser = async (id, updatedFields) => {
  const userDoc = doc(db, 'usuarios', id)
  return await updateDoc(userDoc, updatedFields)
}

// Eliminar un usuario
export const deleteUser = async (id) => {
  const userDoc = doc(db, 'usuarios', id)
  return await deleteDoc(userDoc)
}
