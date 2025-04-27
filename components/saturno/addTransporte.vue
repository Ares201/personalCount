<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row dense>
                <v-col cols="6" md="6">
                  <v-label>Placa Tracto:</v-label>
                  <v-autocomplete
                    :items="vehiclesTracto"
                    v-model="transport.placaTracto"
                    item-text="plate"
                    item-value="id"
                    color="secondaryColor"
                    class="custom-autocomplete"
                    outlined
                    dense
                    clearable
                    return-object
                    hide-details
                  >
                    <template #append-item>
                      <v-divider />
                      <v-list-item link @click="OpenDialogVehicle()" class="fixed-option">
                          <a>
                            + Placa Tracto
                          </a>
                        </v-list-item>
                      <v-divider />
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="6" md="6">
                  <v-label>Material:</v-label>
                  <v-text-field
                    v-model="transport.material"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-label>Ubicacion:</v-label>
                  <v-text-field
                    v-model="transport.location"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-label>Empleado:</v-label>
                  <v-autocomplete
                    :items="employees"
                    v-model="transport.employee"
                    outlined
                    dense
                    clearable
                    item-text="name"
                    item-value="id"
                    return-object
                    hide-details
                  >
                    <template #append-item>
                      <v-divider />
                      <v-list-item link @click="OpenDialogEmployee()" class="fixed-option">
                          <a>
                            + Empleado
                          </a>
                        </v-list-item>
                      <v-divider />
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                  <v-label>Observaciòn:</v-label>
                  <v-text-field
                    v-model="transport.observation"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primaryColor" text @click="saveTransport">
          {{ this.transport.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
        <v-btn color="neutralColor" text @click="close">Cancelar</v-btn>
      </v-card-actions>
       <!-- addEmployee -->
       <add-employee
          :dialog="dialogEmployee"
          @closedialog="closedialogEmployee"
          @saveEmployee="saveEmployees"
        />
      <!-- Componente addVehicle -->
      <add-vehicle
        :dialog = "dialogVehicle"
        @closedialog="closedialogVehicle"
        @saveVehicle="saveVehicle"
      />
    </v-card>
  </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createTransport, updateTransport } from '../../services/transportServices';
import { getEmployees } from '../../services/employeeServices';
import { getVehicles } from '../../services/vehicleServices';
import addEmployee from '../../components/configuracion/addEmployee';
import addVehicle from '../../components/configuracion/addVehicle.vue';

export default {
  name: 'addTransport',
  components: {
    addEmployee,
    addVehicle
  },
  props: {
    dialog: { type: Boolean, default: false },
    transports: {
      type: Object,
      default: () => ({
        id: null,
        placaTracto: '',
        material: '',
        location: '',
        employee: '',
        observation: ''
      })
    }
  },
  data() {
    return {
      dialogEmployee: false,
      dialogVehicle: false,
      menuFecha: false,
      employees : [],
      vehicles: [],
      transport: { ...this.transports },
    }
  },
  watch: {
    dialog: {
      handler(newVal) {
        if (newVal) {
          this.transport = this.transports.id ? { ...this.transports } :
          {
            id: null,
            placaTracto: '',
            material: '',
            location: '',
            employee: '',
            observation: ''
          }
        }
      },
      immediate: true
    },
    transports: {
      handler(newTransport) {
        this.transport = { ...newTransport }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.transport.id === null ? 'Nuevo Registro' : 'Editar Registro'
    },
    vehiclesTracto() {
      return this.vehicles.filter( item => item.vehicleType === 'TRACTO')
    }
  },
  beforeMount() {
    this.getEmployees()
    this.getVehicles()
  },
  methods: {
    async saveTransport() {
      try {
        const docData = {
          placaTracto: this.transport.placaTracto,
          material: this.transport.material,
          location: this.transport.location,
          employee: this.transport.employee,
          observation: this.transport.observation,
          stage: 1
        }
        if (this.transport.id) {
          await updateTransport(this.transport.id, docData)
        } else {
          await createTransport(docData)
        }
        this.$emit('saveDocument')
        this.close()
        Swal.fire({
          icon: 'success',
          title: 'Transporte guardado con éxito',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error al guardar documento:', error)
        Swal.fire('Error', 'No se pudo guardar el documento', 'error')
      }
    },
    OpenDialogEmployee(){
      this.dialogEmployee = true
    },
    OpenDialogVehicle(){
      this.dialogVehicle = true
    },
    async getEmployees() {
      try {
        this.employees = await getEmployees()
      } catch (error) {
       Swal.fire('Error al obtener empleados:', error);
      }
    },
    async getVehicles() {
      try {
        this.vehicles = await getVehicles()
      } catch (error) {
        Swal.fire('Error al obtener vehiculos:', error)
      }
    },
    saveEmployees() {
      Swal.fire({
        icon: 'success',
        title: 'Empleado guardado con éxito',
        showConfirmButton: false,
        timer: 1500
      })
    },
    async saveVehicle() {
      Swal.fire({
        icon: 'success',
        title: 'Vehiculo guardado con éxito',
        showConfirmButton: false,
        timer: 1500
      })
    },
    closedialogEmployee() {
      this.dialogEmployee = false;
      this.getEmployees()
    },
    closedialogVehicle() {
      this.dialogVehicle = false;
      this.getVehicles()
    },
    close() {
      this.$emit('closedialog')
      this.transport = {
        id: null,
        placaTracto: '',
        material: '',
        location: '',
        employee: '',
        observation: ''
      }
    },
  }
}
</script>