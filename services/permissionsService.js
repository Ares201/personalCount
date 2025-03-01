import { db } from '~/plugins/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Obtener permisos de un usuario
export const fetchUserPermissions = async (userId) => {
  const userDoc = doc(db, 'usuarios', userId);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    return userSnapshot.data().permissions || [];
  }
  return [];
};

// Actualizar permisos de un usuario

export const updateUserPermissions = async (id, updatedFields) => {
  const userDoc = doc(db, "usuarios", id);
  await updateDoc(userDoc,  updatedFields );
};
