<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <v-row>
            <v-col cols="12" md="8">
              <span class="text-h6">
                <v-icon color="primaryColor" class="mr-3">mdi-text-box-check-outline</v-icon>
                TAREAS
              </span>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end">
              <v-switch
                @click="switchMode"
                :label="model ? 'Tarjeta' : 'Tabla'"
                class="mr-8"
                color="secondaryColor"
              ></v-switch>
              <v-btn color="primaryColor" small fab dark @click="openNewDocument">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="model">
      <v-row dense>
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
              :items="['Pendiente', 'Cancelado']"
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
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip
            :color="returnEstado(item).color"
            :text-color="returnEstado(item).textColor"
            class="ma-1"
          >
            {{ returnEstado(item).text }}
          </v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="secondaryColor" @click="editCompra(item)" v-bind="attrs" v-on="on">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="dangerColor" @click="deleteCompra(item.id)" v-bind="attrs" v-on="on" >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" sm="12">
        <v-row dense>
          <v-col
            v-for="box in boxs.filter(item => item.estado === false)"
            :key="box.id"
            cols="12" sm="6" md="4"
          >
            <div
              @touchstart="touchStart($event, box)"
              @touchmove="touchMove"
              @touchend="touchEnd(box)"
              style="touch-action: pan-y;"
            >
              <v-card
                @click="editCompra(box)"
                class="pa-2 mb-4"
                style="border: 2px solid orange; border-radius: 10px;"
              >
                <v-row dense>
                  <v-col cols="4" class="d-flex justify-center align-center">
                    <v-progress-circular
                      :value="calculateProgress(box)"
                      color="secondaryColor"
                      rotate="360"
                      size="50"
                      width="5"
                    >
                      {{ calculateProgress(box) }}%
                    </v-progress-circular>
                  </v-col>
                  <v-col cols="8">
                    <v-chip
                      :color="returnEstado(box).color"
                      :text-color="returnEstado(box).textColor"
                      class="ma-1"
                    >
                      {{ returnEstado(box).text }}
                    </v-chip>
                    <v-card-text>
                      <p>{{ box.descripcion }}</p>
                      <strong>Monto:</strong>
                      <p>S/.{{ box.monto }}</p>
                    </v-card-text>
                  </v-col>
                </v-row>
                <span class="d-flex justify-end grey--text text--darken-1 font-weight-medium">
                  {{ box.fecha }}
                </span>
                <v-expand-transition>
                  <div v-if="box.showActions" class="d-flex justify-end pa-2">
                    <v-btn icon @click.stop="deleteCompra(box.id)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon @click.stop="toggleActions(box)">
                      <v-icon color="primary">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Componente addCompra -->
    <addCompra
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveCompra="fetchCompras"
      :boxs="selectedCompra"
    />
  </v-card>
</template>
<script>
import Swal from 'sweetalert2';
import { getBoxs, deleteBox } from '../../services/boxServices';
import addCompra from '../../components/finanzas/addCompra.vue';
export default {
  name: 'Compras',
  components :{
    addCompra
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Categoria', value: 'categoria', sortable: false },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false },
        { text: 'Estado', value: 'estado', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      model: false,
      boxs: [],
      selectedCompra: null,
      searchQueryGeneral: null,
      selectedEstado: null,
      touchStartX: 0,
      touchEndX: 0,
      touchStartY: 0,
      swipeThreshold: 50, // Sensibilidad del swipe (píxeles)
      currentBox: null    // Tarjeta actual interactuada
    }
  },
  computed: {
    filteredDocuments() {
      return this.boxs.filter(doc => {
        const estadoMatch =
          !this.selectedEstado ||
          (this.selectedEstado === 'Pendiente' && !doc.estado) ||
          (this.selectedEstado === 'Cancelado' && doc.estado);
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
    await this.fetchCompras()
  },
  methods: {
    async fetchCompras(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .filter(box => box.tipo === 'Compra')
        .map(box => ({
          ...box,
          estado: box.detailBox.length > 0 && box.detailBox.every(detail => detail.estado)
        }));
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    openNewDocument(){
      this.selectedCompra = {
        id: null,
        fecha: new Date().toISOString().substr(0, 10),
        categoria: '',
        descripcion: '',
        monto: 0,
        estado: false,
        detailBox: []
      }
      this.dialogComponent = true
    },
    returnEstado(item) {
      let color = "default";
      let textColor = "default";
      let text = item.estado

      if (item.estado === true) {
        color = "#D4F8E8"; // Verde
        textColor = "#26734D";
        text = "Cancelado"
      } else if (item.estado === false) {
        color = "#FFD6D9"; // Rojo
        textColor = "#A8323E";
        text = "Pendiente"
      }
      return { color, textColor, text };
    },
    calculateProgress(box) {
      if (!box.detailBox || box.detailBox.length === 0) return 0;
      const totalTasks = box.detailBox.length;
      const completedTasks = box.detailBox.filter(detail => detail.estado).length;
      return Math.round((completedTasks / totalTasks) * 100);
    },
    switchMode(){
      this.model = !this.model
    },
    formatMil(monto) {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      }).format(monto);
    },
    // --- Gestos táctiles ---
    touchStart(e, box) {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
      this.currentBox = box;
    },
    touchMove(e) {
      // Solo registra movimiento horizontal si el vertical es mínimo
      if (Math.abs(e.changedTouches[0].screenY - this.touchStartY) < 20) {
        this.touchEndX = e.changedTouches[0].screenX;
      }
    },
    touchEnd(box) {
      if (this.touchEndX - this.touchStartX > this.swipeThreshold) {
        // Swipe derecho detectado
        // Swal.fire("Succes", `¡Tarjeta movida a la derecha!\n${box.descripcion}`);
        this.toggleActions(box); // Muestra/oculta acciones
      }
      this.resetTouch();
    },
    resetTouch() {
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.currentBox = null;
    },
    // --- Métodos existentes ---
    toggleActions(box) {
      if (typeof box.showActions === 'undefined') {
        this.$set(box, 'showActions', true);
      } else {
        box.showActions = !box.showActions;
      }
    },
    editCompra(Compra){
      this.selectedCompra = {...Compra}
      this.dialogComponent = true
    },
    async deleteCompra(id) {
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
          this.fetchCompras()
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
/* Efecto visual al hacer swipe */
.v-card {
  transition: transform 0.2s;
}
.v-card.swipe-right {
  transform: translateX(10px);
}
</style>