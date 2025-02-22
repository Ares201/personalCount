import {db} from '~/plugins/firebase'
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'

const documentsCollection = collection(db, 'documents')

// Crear un document
export const createDocument = async (document) => {
  return await addDoc(documentsCollection, document)
}


// Obtener todos los documents
export const getDocuments = async () => {
  const snapshot = await getDocs(documentsCollection)
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

// Actualizar un document
// export const updateDocument = async (id, updatedFields) => {
//   const documentDoc = doc(db, 'documents', id)
//   return await updateDoc(documentDoc, updatedFields)
// }
// Actualizar un documento en Firebase evitando valores undefined
export const updateDocument = async (id, updatedFields) => {
  const documentDoc = doc(db, 'documents', id);

  // Limpiar undefined y reemplazar por null
  const cleanFields = Object.fromEntries(
    Object.entries(updatedFields).map(([key, value]) => [key, value ?? null])
  );

  return await updateDoc(documentDoc, cleanFields);
};

// Eliminar un document
export const deleteDocument = async (id) => {
  const documentDoc = doc(db, 'documents', id)
  return await deleteDoc(documentDoc)
}
