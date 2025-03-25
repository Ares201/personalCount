import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";

export default ({ app }, inject) => {
  const updateOperationField = async () => {
    try {
      const db = app.$db; // 🔹 Obtenemos `db` desde `app.$db`
      if (!db) throw new Error("Firestore no está inicializado.");

      const collectionRef = collection(db, "documents");
      const q = query(collectionRef, where("operacion", "==", "Ecoserm C.L"));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { operacion: "Ecoserm" });
      });

      await batch.commit();
      console.log("Actualización masiva completada.");
    } catch (error) {
      console.error("Error en la actualización masiva:", error);
    }
  };

  inject("updateOperationField", updateOperationField);
};
