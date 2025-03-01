<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Salidas</span>
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
            @click="changeType(item)"> {{ item.tipo === "Salida" ? 'Ingresar a ahorros' : 'Pagado' }}
          </v-chip>
          <v-icon small color="blue" @click="editSalida(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteSalida(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addSalida -->
    <addSalida
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveSalida="fetchSalidas"
      :boxs="selectedSalida"
    />
  </v-card>
</template>
<script>
import Swal from "sweetalert2";
import { getBoxs, deleteBox, updateBox } from '../../services/boxServices';
import addSalida from '../../components/finanzas/addSalida.vue';
export default {
  name: 'Salidas',
  components :{
    addSalida
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Tipo', value: 'tipo', sortable: false },
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false },
        { text: 'Categoria', value: 'categoria', sortable: false },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      boxs: [],
      selectedSalida: null,
    }
  },
  async beforeMount(){
    await this.fetchSalidas()
  },
  methods: {
    async changeType(item) {
      const confirm = await Swal.fire({
        title: "¿Estás seguro que deseas ingresar Ahorros?",
        text: "Excelente estas Pagando una deuda de tus ahorros.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, ingresar",
        cancelButtonText: "Cancelar"
      });
      if (confirm.isConfirmed) {
        try {
          await updateBox(item.id, {
            tipo: 'Ingreso'
          });
          item.tipo = 'Ingreso'
          await this.fetchSalidas()
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
        color = 'success'
      }
      return color
    },
    async fetchSalidas(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs.filter(box => box.tipo === 'Salida')
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    editSalida(salida){
      this.selectedSalida = {...salida}
      this.dialogComponent = true
    },
    async deleteSalida(id) {
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
          await this.fetchSalidas()
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