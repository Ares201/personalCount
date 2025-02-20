import {db} from '~/plugins/firebase'
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'

const documentsCollection = collection(db, 'documents')

// Crear un document
export const createDocument = async (document) => {
  const docRef = await addDoc(documentsCollection, document);
  return { id: docRef.id, ...document }; // Retorna el documento con su nuevo ID
};

// Obtener todos los documents
export const getDocuments = async () => {
  const snapshot = await getDocs(documentsCollection)
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

// Actualizar un document
export const updateDocument = async (id, updatedFields) => {
  const documentDoc = doc(db, 'documents', id)
  return await updateDoc(documentDoc, updatedFields)
}

// Eliminar un document
export const deleteDocument = async (id) => {
  const documentDoc = doc(db, 'documents', id)
  return await deleteDoc(documentDoc)
}
