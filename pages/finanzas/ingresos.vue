<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-cash-plus</v-icon>
            INGRESOS
          </span>
          <v-btn color="primaryColor" small fab dark @click="openNewDocument">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQueryGeneral"
            color="secondaryColor"
            label="Buscar..."
            append-icon="mdi-magnify"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedEstado"
            :items="['Ahorro', 'Disponible', 'Devolucion']"
            append-icon="mdi-information-outline"
            label="Estado"
            color="secondaryColor"
            hide-selected
            hide-no-data
            clearable
            outlined
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredDocuments"
        item-value="id"
        dense
        mobile-breakpoint="0"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.fecha`]="{ item }">
          {{ item.fecha ? item.fecha : '----/--/--'}}
        </template>
        <template v-slot:[`item.monto`]="{ item }">
          {{ formatMil(item.monto) }}
        </template>
        <template v-slot:[`item.categoria`]="{ item }">
          <v-chip
            :color="returnEstado(item).color"
            :text-color="returnEstado(item).text"
            class="ma-1"
          >{{ item.categoria || 'Sin Categoria' }}</v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="secondaryColor" @click="editIngreso(item)" v-bind="attrs" v-on="on">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="dangerColor" @click="deleteIngreso(item.id)" v-bind="attrs" v-on="on" >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
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
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false, align: 'center' },
        { text: 'Categoria', value: 'categoria', sortable: false, align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      boxs: [],
      dialogComponent: false,
      selectedIngreso: null,
      selectedEstado: null,
      searchQueryGeneral: null,
    }
  },
  computed: {
    filteredDocuments() {
      return this.boxs.filter(doc => {
        const estadoMatch = !this.selectedEstado || doc.categoria === this.selectedEstado;
        const fechaMatch = !this.fechaFiltro || doc.fechaEnvio === this.fechaFiltro;
        // Búsqueda general (si hay searchQueryGeneral)
        const generalSearchMatch = !this.searchQueryGeneral ||
        Object.values(doc).some(value => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(this.searchQueryGeneral.toLowerCase());
        });
        return estadoMatch && fechaMatch && generalSearchMatch;
      });
    }
  },
  async beforeMount(){
    await this.fetchIngresos()
  },
  methods: {
    async fetchIngresos(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs
        .filter(box => box.tipo === 'Ingreso')
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    editIngreso(ingreso){
      console.log(ingreso)
      this.selectedIngreso = {...ingreso}
      this.dialogComponent = true
    },
    openNewDocument() {
     this.selectedIngreso = {
        id: null,
        fecha: this.getFechaHoy(),
        monto: 0,
        descripcion: '',
        categoria: ''
      }
      this.dialogComponent = true
    },
    getFechaHoy() {
      const hoy = new Date();
      return hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    },
    returnEstado(item) {
      let color = "default";
      let text = "default";

      if (item.categoria === "Disponible") {
        color = "#D4F8E8"; // Verde
        text = "#26734D";
      } else if (item.categoria === "Ahorro") {
        color = "#FFD6D9"; // Rojo
        text = "#A8323E";
      } else if (item.categoria === "Otro") {
        color = "#FFF4C2"; // Amarillo
        text = "#B8860B";
      }
      return { color, text };
    },
    formatMil(monto) {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      }).format(monto);
    },
    async deleteIngreso(id) {
      console.log(id)
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