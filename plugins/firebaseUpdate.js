// import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";

// export default ({ app }, inject) => {
//   const updateOperationField = async () => {
//     try {
//       const db = app.$db; // 🔹 Obtenemos `db` desde `app.$db`
//       if (!db) throw new Error("Firestore no está inicializado.");

//       const collectionRef = collection(db, "boxs");
//       const q = query(collectionRef, where("concepto", "==", "Ecoserm C.L"));
//       const querySnapshot = await getDocs(q);
//       const batch = writeBatch(db);

//       querySnapshot.forEach((doc) => {
//         batch.update(doc.ref, { concepto: "Ecoserm" });
//       });

//       await batch.commit();
//       console.log("Actualización masiva completada.");
//     } catch (error) {
//       console.error("Error en la actualización masiva:", error);
//     }
//   };

//   inject("updateOperationField", updateOperationField);
// };


// Renombra el campo
import { collection, getDocs, query, where, writeBatch, deleteField } from "firebase/firestore";

export default ({ app }, inject) => {
  const renameOperationField = async () => {
    try {
      const db = app.$db;
      if (!db) throw new Error("Firestore no está inicializado.");

      const collectionRef = collection(db, "boxs");
      const q = query(collectionRef, where("concepto", "!=", null)); // solo documentos con 'concepto'
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const oldValue = data.concepto;

        batch.update(doc.ref, {
          categoria: oldValue,
          concepto: deleteField(), // ✅ eliminar el campo viejo
        });
      });

      await batch.commit();
      console.log("Campo 'concepto' renombrado a 'categoria' exitosamente.");
    } catch (error) {
      console.error("Error al renombrar campo:", error);
    }
  };

  inject("renameOperationField", renameOperationField);
};
