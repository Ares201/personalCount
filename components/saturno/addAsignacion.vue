<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-label>Placa Tracto:</v-label>
                <v-autocomplete
                  :items="tractoVehicles"
                  v-model="localAssignment.tractoId"
                  item-text="plate"
                  item-value="id"
                  :rules="[v => !!v || 'Tracto es requerido']"
                  color="secondaryColor"
                  class="custom-autocomplete"
                  outlined
                  dense
                  clearable
                  hide-details
                  required
                  return-object
                  prepend-inner-icon="mdi-truck"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar>
                      <v-icon color="blue">mdi-truck</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.plate }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.brand }} - {{ item.vehicleType }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Placa Carreta:</v-label>
                <v-autocomplete
                  v-model="localAssignment.carretaId"
                  :items="carretaVehicles"
                  item-text="plate"
                  item-value="id"
                  color="secondaryColor"
                  class="custom-autocomplete"
                  outlined
                  dense
                  clearable
                  hide-details
                  return-object
                  prepend-inner-icon="mdi-truck-trailer"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar>
                      <v-icon color="green">mdi-truck-trailer</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.plate }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.brand }} - {{ item.vehicleType }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Empleado</v-label>
                <v-autocomplete
                  v-model="localAssignment.employeeId"
                  :items="employees"
                  item-text="name"
                  item-value="id"
                  color="secondaryColor"
                  class="custom-autocomplete"
                  required
                  outlined
                  dense
                  clearable
                  hide-details
                  return-object
                  prepend-inner-icon="mdi-account"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar>
                      <v-icon color="purple">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name || '' }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.workstation }} - Telf: {{ item.phoneCorporate }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Operacion</v-label>
                <v-autocomplete
                  v-model="localAssignment.operationId"
                  :items="operations"
                  item-text="name"
                  item-value="id"
                  color="secondaryColor"
                  class="custom-autocomplete"
                  required
                  outlined
                  dense
                  clearable
                  hide-details
                  return-object
                  prepend-inner-icon="mdi-map-marker"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar>
                      <v-icon color="orange">mdi-map-marker</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name || '' }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.district }}, {{ item.department }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-label>Estado</v-label>
                <v-select
                  v-model="localAssignment.status"
                  :items="statusOptions"
                  color="secondaryColor"
                  class="custom-autocomplete"
                  outlined
                  dense
                  clearable
                  prepend-inner-icon="mdi-chart-line"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primaryColor text" @click="saveAssignment" :disabled="!valid">
          {{ this.localAssignment.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
        <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { checkExistingPlates, createAssignment, updateAssignment, unassignAssignment  } from '../../services/assignmentsServices';
import { getVehicles } from '../../services/vehicleServices';
import { getEmployees } from '../../services/employeeServices';
import { getOperationMines } from '../../services/operationMineServices';

export default {
  name: 'addAssignment',
  props: {
    dialog: { type: Boolean, default: false },
    assignments: {
      type: Object,
      default: () => ({
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
      })
    },
  },
  data() {
    return {
      valid: false,
      statusOptions: ['Asignado', 'En mantenimiento'],
      vehicles: [],
      operations: [],
      employees: [],
      localAssignment: { ...this.assignments}
    };
  },
  computed: {
    formTitle() {
      return this.localAssignment.id === null ? 'Editar Asignación' : 'Nueva Asignación';
    },
    tractoVehicles() {
      return this.vehicles.filter(vehicle => vehicle.vehicleType === 'TRACTO')
    },
    carretaVehicles() {
      return this.vehicles.filter(vehicle =>
        vehicle.vehicleType === 'CARRETA' ||
        vehicle.vehicleType === 'BOMBONA'
      )
    },
  },
  watch: {
    assignments: {
      handler(newVal) {
        if (newVal) {
          this.localAssignment = this.assignments.id ? { ...this.assignments } :
         {
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
          };
        }
      },
      immediate: true
    },
    assignments: {
      handler(newAssigment) {
        this.localAssignment = { ...newAssigment }
      },
      deep: true
    }
  },
  beforeMount() {
    this.getVehicles();
    this.getEmployees();
    this.getOperationMines();
  },
  methods: {
    async saveAssignment() {
      try {
        if (this.$refs.form.validate()) {
          const tractoPlate = this.localAssignment.tractoId?.plate;
          const carretaPlate = this.localAssignment.carretaId?.plate || null;
          const employeeName = this.localAssignment.employeeId?.name || null;
          if (tractoPlate || carretaPlate || employeeName) {
            const { tractoExists, carretaExists, nameExists, existingAssignments } = await checkExistingPlates(
              tractoPlate,
              carretaPlate,
              employeeName,
              this.localAssignment.id
            );
            if (tractoExists || carretaExists || nameExists) {
              let errorMessage = '';
              if (tractoExists && carretaExists && nameExists) {
                errorMessage = `Las placas ${tractoPlate} (tracto) y ${carretaPlate} (carreta) y el empleado ${employeeName} ya están asignados.`;
              } else if (tractoExists && carretaExists) {
                errorMessage = `Las placas ${tractoPlate} (tracto) y ${carretaPlate} (carreta) ya están asignadas.`;
              } else if (tractoExists && nameExists) {
                errorMessage = `El tracto con placa ${tractoPlate} y el empleado ${employeeName} ya están asignados.`;
              } else if (carretaExists && nameExists) {
                errorMessage = `La carreta con placa ${carretaPlate} y el empleado ${employeeName} ya están asignados.`;
              } else if (tractoExists) {
                errorMessage = `El tracto con placa ${tractoPlate} ya está asignado.`;
              } else if (carretaExists) {
                errorMessage = `La carreta con placa ${carretaPlate} ya está asignada.`;
              } else if (nameExists) {
                errorMessage = `El empleado ${employeeName} ya tiene una asignación activa.`;
              }
              const result = await Swal.fire({
                icon: 'warning',
                title: 'Asignación existente',
                text: errorMessage,
                showCancelButton: true,
                confirmButtonText: 'Asignar de todos modos',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
              });
              if (!result.isConfirmed) return;
              await Promise.all(
                existingAssignments.map(assignment =>
                  unassignAssignment(assignment.id)
              ))
            }
          }
          const assignmentData = {
            tractoId: this.localAssignment.tractoId,
            carretaId: this.localAssignment.carretaId || null,
            employeeId: this.localAssignment.employeeId,
            operationId: this.localAssignment.operationId,
            status: this.localAssignment.id ? this.localAssignment.status : "Asignado",
            assigned: this.localAssignment.id ? this.localAssignment.assigned : new Date(),
            unassigned: this.localAssignment.unassigned || null,
            isActive: this.localAssignment.isActive !== false
          };
          let savedAssignment;
          if (this.localAssignment.id) {
            await updateAssignment(this.localAssignment.id, assignmentData);
            savedAssignment = { id: this.localAssignment.id, ...assignmentData };
            Swal.fire({
              icon: 'success',
              title: 'Registro actualizado',
              text: 'La asignación ha sido modificada exitosamente.',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            savedAssignment = await createAssignment(assignmentData);
            Swal.fire({
              icon: 'success',
              title: 'Registro creado',
              text: 'Nueva asignación registrada exitosamente.',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.$emit('saveAssignment', savedAssignment);
          this.close();
        }
      } catch (error) {
        console.error('Error al guardar asignación:', error);
        Swal.fire({
          title: 'Error',
          html: `<p>Ocurrió un error al guardar:</p><pre>${error.message || 'Error desconocido'}</pre>`,
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    },
    async getVehicles() {
      try {
        this.vehicles = await getVehicles()
      } catch (error) {
        console.error('Error al obtener vehiculos:', error)
      }
    },
    async getEmployees() {
      try {
        this.employees = await getEmployees()
      } catch (error) {
        console
      }
    },
    async getOperationMines() {
      try {
        this.operations = await getOperationMines()
      } catch (error) {
        console.error('Error al obtener operaciones:', error)
      }
    },
    close() {
      this.$emit('closeDialog');
    },
  }
};
</script>
<style scoped>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
</style>