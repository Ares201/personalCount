<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Ingresos</span>
      <v-spacer />
      <v-btn color="primary" small fab dark @click="dialogComponent = true">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="boxs"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.monto`]="{ item }">
          S/.{{ item.monto }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-chip
            v-if="item.categoria === 'Prestamo'"
            :color="returnEstado(item)"
            @click="changeType(item)"> {{ item.tipo === "Salida" ? 'Ingresar a ahorros' : 'Regresar a Salida' }}
          </v-chip>
          <v-icon small color="blue" @click="editIngreso(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteIngreso(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addIngreso -->
    <addIngreso
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveIngreso="fetchIngresos"
      :boxs="selectedIngreso"
    />
  </v-card>
</template>
<script>
import Swal from "sweetalert2";
import { getBoxs, deleteBox, updateBox } from '../../services/boxServices';
import addIngreso from '../../components/finanzas/addIngreso.vue';
export default {
  name: 'Ingresos',
  components :{
    addIngreso
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Tipo', value: 'tipo', sortable: false },
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      boxs: [],
      selectedIngreso: null,
    }
  },
  async beforeMount(){
    await this.fetchIngresos()
  },
  methods: {
    async changeType(item) {
      const confirm = await Swal.fire({
        title: "¿Estás seguro que deseas devolver a Salida?",
        // text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, devolver",
        cancelButtonText: "Cancelar"
      });
      if (confirm.isConfirmed) {
        try {
          await updateBox(item.id, {
            tipo: 'Salida'
          });
          item.tipo = 'Salida'
          await this.fetchIngresos()
          Swal.fire("Movido", "El registro ha sido Movido.", "success");
        } catch (error) {
          console.error("Error al eliminar registro:", error);
          Swal.fire("Error", "No se pudo Mover el registro.", "error");
        }
      }
    },
    returnEstado(item) {
      let color = 'default' // Valor por defecto
      if (item.tipo === "Salida") {
        color = 'orange'
      } else if (item.tipo === "Ingreso") {
        color = 'purple'
      }
      return color
    },
    async fetchIngresos(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs.filter(box => box.tipo === 'Ingreso')
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    editIngreso(ingreso){
      this.selectedIngreso = {...ingreso}
      this.dialogComponent = true
    },
    async deleteIngreso(id) {
      const confirm = await Swal.fire({
        title: "¿Estás seguro que deseas eliminar?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (confirm.isConfirmed) {
        try {
          await deleteBox(id)
          await this.fetchIngresos()
          Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar registro:", error);
          Swal.fire("Error", "No se pudo eliminar el registro.", "error");
        }
      }
    },
    openDialog(){
      this.dialogComponent = true
    },
    closedialog(){
      this.dialogComponent = false
    }
  }
}
</script>
<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>