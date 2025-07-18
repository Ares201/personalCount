<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <span class="text-h6">
            <v-icon color="primaryColor" class="mr-3">mdi-account-tie</v-icon>
            ASIGNACIÓN DE UNIDADES
          </span>
          <div class="d-flex">
            <v-btn color="primaryColor" small fab dark @click="openNewAssignment" class="mr-2">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-menu
            v-model="menuFecha"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaFiltro"
                label="Fecha"
                append-icon="mdi-calendar"
                color="secondaryColor"
                class="mt-2"
                v-bind="attrs"
                v-on="on"
                readonly
                clearable
                outlined
                dense
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker color="secondaryColor" v-model="fechaFiltro" @input="menuFecha = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            color="secondary"
            label="Buscar por placa, conductor o contrato"
            append-icon="mdi-magnify"
            class="mt-2"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            class="mt-2"
            v-model="statusFilter"
            :items="statusOptions"
            label="Filtrar por estado"
            clearable
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" md="2">
          <v-btn color="success" small fab dark @click="exportToExcel" class="mr-2">
            <v-icon dark>mdi-file-excel</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="10" md="3">
          <v-icon color="grey" class="mr-2">mdi-chart-line</v-icon>
          <span class="text-caption grey--text">{{ filteredAssignments.length || 0 }} asignaciones encontradas</span>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredAssignments"
        :loading="loading"
        item-value="id"
        dense
      >
        <!-- <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template> -->
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.tractoId`]="{ item }">
          <div class="d-flex align-center">
            <div>
              <div class="font-weight-medium">{{ item.tractoId.plate }}</div>
              <div class="text-caption grey--text">{{ item.tractoId.brand }} - {{ item.tractoId.vehicleType }}</div>
            </div>
          </div>
        </template>
        <template v-slot:[`item.carretaId`]="{ item }">
          <div v-if="item.carretaId" class="d-flex align-center">
            <div>
              <div class="font-weight-medium">{{ item.carretaId.plate }}</div>
              <div class="text-caption grey--text">{{ item.carretaId.brand }} - {{ item.carretaId.vehicleType }}</div>
            </div>
          </div>
          <v-chip v-else small color="grey lighten-2">Sin asignar</v-chip>
        </template>
        <template v-slot:[`item.employeeId`]="{ item }">
          <div class="d-flex align-center">
            <div>
              <div class="font-weight-medium">{{ item.employeeId.name || '' }}</div>
              <div class="text-caption grey--text">Telf: {{ item.phoneCorporate }}</div>
            </div>
          </div>
        </template>
        <template v-slot:[`item.operationId`]="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.operationId.name || '' }}</div>
            <div class="text-caption grey--text">{{ item.operationId.department }}</div>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip :color="getStatusColor(item.status)" small dark>
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:[`item.assigned`]="{ item }">
          {{ formatDate(item.assigned) }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="indigo"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="viewHistory(item.tractoId.id, item.tractoId.plate)"
                >
                  mdi-history
                </v-icon>
              </template>
              <span>Ver historial</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="primaryColor"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="editAssignment(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Editar asignación</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="dangerColor"
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmUnassign(item)"
                >
                  mdi-link-variant-off
                </v-icon>
              </template>
              <span>Desasignar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small color="dangerColor" @click="deleteAssing(item.id)" v-bind="attrs" v-on="on" >
                  mdi-delete
                </v-icon>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:no-data>
          <div class="text-center py-4">
            <v-icon size="48" color="grey lighten-1">mdi-account-tie</v-icon>
            <div class="grey--text mt-2">No se encontraron asignaciones</div>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
    <addAsignacion
      :dialog="dialogComponent"
      @closeDialog="closeDialog"
      @saveAssignment="fetchData"
      :assignments="selectAssignment"
    />
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar desasignación
        </v-card-title>
        <v-card-text>
          ¿Está seguro que desea desasignar esta configuración?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="unassign">Desasignar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import addAsignacion from '../../components/saturno/addAsignacion.vue';
import { getAssignments, updateAssignment , deleteAssignment } from '../../services/assignmentsServices'

export default {
  name: 'Asignacion',
  components: {
    addAsignacion,
  },
  data() {
    return {
      searchQuery: '',
      loading: false,
      menuFecha: false,
      dialogComponent: false,
      confirmDialog: false,
      statusOptions: ['Asignado', 'En mantenimiento', 'Desasignado'],
      headers: [
        { text: '#', value: 'index', sortable: false, width: '60px' },
        { text: 'Tracto', value: 'tractoId', sortable: true },
        { text: 'Carreta', value: 'carretaId', sortable: true },
        { text: 'Conductor', value: 'employeeId', sortable: true },
        { text: 'Operación', value: 'operationId', sortable: true },
        { text: 'Estado', value: 'status', sortable: true },
        { text: 'Acciones', value: 'acciones', sortable: false, width: '120px' }
      ],
      assignments: [],
      assignmentHistory: [],
      vehicles: [],
      employeeIds: [],
      defaultItem: {
        id: null,
        tractoId: null,
        carretaId: null,
        employeeId: null,
        operationId: null,
        status: 'Asignado',
        assigned: new Date(),
        unassigned: null,
        isActive: true,
        // unassignedBy: null,
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      statusFilter: null,
      itemToUnassign: null,
      selectAssignment: null,
      fechaFiltro: this.getFechaHoy()
    };
  },
  computed: {
    filteredAssignments() {
      return this.assignments.filter(assignment => {
        const statusMatch = !this.statusFilter || assignment.status === this.statusFilter;
        const searchMatch = !this.searchQuery ||
          assignment.tractoId.plate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (assignment.carretaId && assignment.carretaId.plate.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          assignment.employeeId.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          assignment.operationId.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const fechaMatch = !this.fechaFiltro || assignment.assignedDate === this.fechaFiltro;
        return statusMatch && searchMatch && fechaMatch;
      });
    }
  },
  async beforeMount() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.assignments = await getAssignments();
        this.assignments = this.assignments.map(assign => {
        if (assign.assigned && assign.assigned.seconds) {
          assign.assignedDate = new Date(assign.assigned.seconds * 1000).toISOString().split('T')[0];
        }
        return assign;
    });
      } catch (error) {
        console.error('Error al obtener asignaciones:', error);
      }
    },
    getStatusColor(status) {
      const colors = {
        'Asignado': 'success',
        'En mantenimiento': 'warning',
        'Desasignado': 'error'
      };
      return colors[status] || 'grey';
    },
    openNewAssignment() {
      this.selectAssignment = {
        id: null,
        tractoId: null,
        carretaId: null,
        employeeId: null,
        operationId: null,
        status: 'Asignado',
        assigned: new Date(),
        unassigned: null,
        isActive: true,
        // unassignedBy: null,
      }
      this.dialogComponent = true;
    },
    editAssignment(item) {
      this.selectAssignment = { ...item };
      this.dialogComponent = true;
    },
    confirmUnassign(item) {
      this.itemToUnassign = item;
      this.confirmDialog = true;
    },
    async unassign() {
      try {
        const updateUnassigned = {
          status: "Desasignado",
          unassigned: new Date(),
          isActive: false,
          // unassignedBy: this.$store.state.user.id, // Si necesitas registrar quién desasigna
        };
        await updateAssignment(this.itemToUnassign.id, updateUnassigned);
        await this.fetchData();
        this.confirmDialog = false;
        this.showSnackbar('Asignación desactivada correctamente', 'success');
      } catch (error) {
        console.error('Error al desasignar:', error);
        this.showSnackbar('Error al desasignar', 'error');
      }
    },
    closeDialog() {
      this.dialogComponent = false;
    },
    async viewHistory() {
      alert('Función de historial aún no implementada');
    },
    async openHistoryDialog() {
      try {
        this.loading = true;
      } catch (error) {
        console.error("Error al cargar historial general:", error);
        this.showSnackbar("Error al cargar historial general", "error");
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(message, color = 'success') {
      this.snackbar = {
        show: true,
        message,
        color
      };
    },
    formatDate(timestamp) {
      if (!timestamp || !timestamp.seconds) return '';
      const date = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6));
      return date.toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: false,
      });
    },
    getFechaHoy() {
      const hoy = new Date();
      return hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    },
    // exportToExcel() {
    //   // Preparar los datos para el Excel
    //   const data = this.filteredAssignments.map(item => ({
    //     '#': this.filteredAssignments.indexOf(item) + 1,
    //     'Tracto': item.tractoId.plate,
    //     'Carreta': item.carretaId?.plate || 'Sin asignar',
    //     'Conductor': item.employeeId.name,
    //     'Operación': item.operationId.name,
    //     'Estado': item.status,
    //     'Fecha Asignación': this.formatDate(item.assigned),
    //     'Fecha Desasignación': item.unassigned ? this.formatDate(item.unassigned) : ''
    //   }));
    //   // Crear libro de trabajo y hoja de cálculo
    //   const wb = XLSX.utils.book_new();
    //   const ws = XLSX.utils.json_to_sheet(data);
    //   // Añadir la hoja al libro
    //   XLSX.utils.book_append_sheet(wb, ws, "Asignaciones");
    //   // Generar el archivo y descargarlo
    //   const fecha = new Date().toISOString().split('T')[0];
    //   XLSX.writeFile(wb, `Asignaciones_${fecha}.xlsx`);
    // },
    exportToExcel() {
      // Preparar los datos para el Excel
      const data = this.filteredAssignments.map(item => {
        const row = {
           '#': this.filteredAssignments.indexOf(item) + 1,
          'Tracto': item.tractoId.plate,
          'Carreta': item.carretaId?.plate || 'Sin asignar',
          'Conductor': item.employeeId.name,
          'Operación': item.operationId.name,
          'Estado': item.status,
          'Fecha Asignación': this.formatDate(item.assigned),
          'Fecha Desasignación': item.unassigned ? this.formatDate(item.unassigned) : ''
        };
        // Fechas como objetos Date nativos (Excel las reconocerá automáticamente)
        if (item.assigned && item.assigned.seconds) {
          row['Fecha Asignación'] = new Date(item.assigned.seconds * 1000);
        }
        if (item.unassigned && item.unassigned.seconds) {
          row['Fecha Desasignación'] = new Date(item.unassigned.seconds * 1000);
        }
        return row;
      });
      // Crear hoja de trabajo a partir de los datos
      const ws = XLSX.utils.json_to_sheet(data);
      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, "Asignaciones");
      // Generar el archivo y descargarlo
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Asignaciones_${fecha}.xlsx`);
    },
    async deleteAssing(id) {
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
          console.log("Eliminando evento con ID:", id);
          await deleteAssignment(id);
          await this.fetchData();
          Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar evento:", error);
          Swal.fire("Error", "No se pudo eliminar el evento.", "error");
        }
      }
    }
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}

.font-weight-medium {
  font-weight: 500;
}
</style>