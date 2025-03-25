<template>
  <div>
    <v-btn small color="primaryColor" @click="update">Actualizar Operaciones</v-btn>

    <!-- Lista de documentos actualizados -->
    <v-list>
      <v-subheader>Documentos...</v-subheader>
      <v-list-item v-for="(doc, index) in updatedDocs" :key="index">
        <v-list-item-content>
          <v-list-item-title>
            {{ doc.numero }} - {{ doc.operacion }} (Actualizado)
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updatedDocs: [], // 🔹 Almacenará los documentos actualizados
    };
  },
  methods: {
    async update() {
      try {
        this.updatedDocs = []; // Limpiar la lista antes de actualizar
        const updatedDocs = await this.$updateOperationField(); // 🔹 Espera la actualización
        this.updatedDocs = updatedDocs; // 🔹 Guarda los documentos actualizados en el estado
        alert("Actualización completada");
      } catch (error) {
        console.error("Error al actualizar:", error);
      }
    },
  },
};
</script>
