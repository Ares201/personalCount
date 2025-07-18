import { db } from '~/plugins/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, or, and  } from 'firebase/firestore';

const assignmentCollection = collection(db, 'asignaciones');

// Función para verificar placas existentes y nombre de empleado
export const checkExistingPlates = async (tractoPlate, carretaPlate, employeeName, currentAssignmentId = null) => {
  try {
    // Construir condiciones base
    const conditions = [
      where('isActive', '==', true),
      or(
        where('tractoId.plate', '==', tractoPlate),
        where('carretaId.plate', '==', carretaPlate),
        where('employeeId.name', '==', employeeName)
      )
    ];

    // Crear consulta dependiendo si estamos editando o creando
    const q = currentAssignmentId
      ? query(assignmentCollection, and(...conditions, where('__name__', '!=', currentAssignmentId)))
      : query(assignmentCollection, and(...conditions));

    const querySnapshot = await getDocs(q);

    const results = {
      tractoExists: false,
      carretaExists: false,
      nameExists: false,
      existingAssignments: []
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tractoId?.plate === tractoPlate) results.tractoExists = true;
      if (data.carretaId?.plate === carretaPlate) results.carretaExists = true;
      if (data.employeeId?.name === employeeName) results.nameExists = true;
      results.existingAssignments.push({ id: doc.id, ...data });
    });

    return results;
  } catch (error) {
    console.error("Error al verificar placas y nombre:", error);
    throw error;
  }
};

// Función para desasignar
export const unassignAssignment = async (assignmentId) => {
  const assignmentDoc = doc(db, 'asignaciones', assignmentId);
  await updateDoc(assignmentDoc, {
    status: "Desasignado",
    unassigned: new Date(),
    isActive: false
  });
};

// Crear nueva asignación
export const createAssignment = async (assignmentData) => {
  const docRef = await addDoc(assignmentCollection, assignmentData);
  return { id: docRef.id, ...assignmentData };
};

// Obtener todas las asignaciones
export const getAssignments = async () => {
  const snapshot = await getDocs(assignmentCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar asignación
export const updateAssignment = async (id, updatedFields) => {
  const assignmentDoc = doc(db, 'asignaciones', id);
  await updateDoc(assignmentDoc, updatedFields);
  return { id, ...updatedFields };
};

// Eliminar asignación (no recomendado, mejor usar desasignar)
export const deleteAssignment = async (id) => {
  const assignmentDoc = doc(db, 'asignaciones', id);
  await deleteDoc(assignmentDoc);
};