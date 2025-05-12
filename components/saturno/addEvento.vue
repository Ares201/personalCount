<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card>
        <!-- <v-card-title class="headline">CENTRO CONTROL INFORMA</v-card-title> -->
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row dense>
                <v-col cols="6">
                  <v-label>Evento:</v-label>
                  <v-autocomplete
                    :items="plantillas"
                    v-model="event.evento"
                    item-text="title"
                    item-value="id"
                    color="secondaryColor"
                    class="custom-autocomplete"
                    outlined
                    dense
                    clearable
                    return-object
                    hide-details
                    @change="updateLevel"
                  >
                    <template #append-item>
                      <v-divider />
                      <v-list-item link @click="OpenDialogPlantilla()" class="fixed-option">
                          <a>
                            + Plantilla
                          </a>
                        </v-list-item>
                      <v-divider />
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-label>Nivel:</v-label>
                  <v-text-field
                    v-model="event.nivel"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-label>Placa Tracto:</v-label>
                  <v-autocomplete
                    :items="tractoVehicles"
                    v-model="event.placaTracto"
                    item-text="plate"
                    item-value="id"
                    color="secondaryColor"
                    class="custom-autocomplete"
                    outlined
                    dense
                    clearable
                    return-object
                    hide-details
                    @change="updateCamera"
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
                <v-col cols="12" md="3">
                  <v-label>Placa Carreta:</v-label>
                  <v-autocomplete
                    :items="carretaVehicles"
                    v-model="event.placaCarreta"
                    item-text="plate"
                    item-value="id"
                    color="secondaryColor"
                    class="custom-autocomplete"
                    outlined
                    dense
                    clearable
                    return-object
                    hide-details
                    @change="updateCamera"
                  >
                    <template #append-item>
                      <v-divider />
                      <v-list-item link @click="OpenDialogVehicle()" class="fixed-option">
                          <a>
                            + Placa Carreta
                          </a>
                        </v-list-item>
                      <v-divider />
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-label>Fecha:</v-label>
                  <v-menu
                    v-model="menuFecha"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="event.fecha"
                        append-icon="mdi-calendar"
                        color="secondaryColor"
                        v-bind="attrs"
                        v-on="on"
                        readonly
                        clearable
                        outlined
                        dense
                        hide-details
                      />
                    </template>
                    <v-date-picker color="secondaryColor" v-model="event.fecha" @input="menuFecha = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-label>Hora:</v-label>
                  <v-text-field
                    v-model="event.hora"
                    type="time"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label>Empleado:</v-label>
                  <v-autocomplete
                    :items="employees"
                    v-model="event.employee"
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
                <v-col cols="3">
                  <v-label>Estado:</v-label>
                  <v-select
                    :items="['Cargado', 'Vacío']"
                    v-model="event.estado"
                    outlined
                    dense
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="3">
                  <v-label>Cámaras:</v-label>
                  <v-text-field
                    v-model="event.camaras"
                    outlined
                    dense
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Operaciòn:</v-label>
                  <v-text-field
                    v-model="event.contrato"
                    outlined
                    dense
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="6">
                  <v-label>Ubicación:</v-label>
                  <v-text-field v-model="event.ubicacion" outlined dense hide-details />
                </v-col>
                <v-col cols="12">
                  <v-label>Detalles:</v-label>
                  <v-textarea v-model="event.detalle" outlined dense hide-details />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primaryColor" text @click="saveEvent">
          {{ this.event.id === null ? 'Guardar' : 'Editar' }}
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
      <!-- Componente addPlantilla -->
      <add-plantilla
        :dialog = "dialogPlantilla"
        @closedialog="closedialogPlantilla"
        @savePlantilla="savePlantilla"
      />
    </v-card>
  </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createEvent, updateEvent } from '../../services/eventServices';
import { getPlantillas } from '../../services/plantillaServices';
import { getEmployees } from '../../services/employeeServices';
import { getVehicles } from '../../services/vehicleServices';
import addEmployee from '../../components/configuracion/addEmployee';
import addVehicle from '../../components/configuracion/addVehicle.vue';
import addPlantilla from '../../components/configuracion/addPlantilla.vue';

export default {
  name: 'addEvent',
  components: {
    addEmployee,
    addVehicle,
    addPlantilla
  },
  props: {
    dialog: { type: Boolean, default: false },
    events: {
      type: Object,
      default: () => ({
        id: null,
        id: null,
        evento: '',
        nivel: '',
        placaTracto: '',
        placaCarreta: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        employee: '',
        contrato: '',
        ubicacion: '',
        detalle: ''
      })
    }
  },
  data() {
    return {
      dialogEmployee: false,
      dialogVehicle: false,
      dialogPlantilla: false,
      menuFecha: false,
      plantillas: [],
      employees : [],
      vehicles: [],
      event: { ...this.events },
    }
  },
  watch: {
    dialog: {
      handler(newVal) {
        if (newVal) {
          this.event = this.events.id ? { ...this.events } :
          {
            id: null,
            evento: '',
            nivel: '',
            placaTracto: '',
            placaCarreta: '',
            fecha: '',
            hora: '',
            estado: '',
            camaras: '',
            employee: '',
            contrato: '',
            ubicacion: '',
            detalle: ''
          }
        }
      },
      immediate: true
    },
    events: {
      handler(newEvent) {
        this.event = { ...newEvent }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.event.id === null ? 'Nuevo Evento' : 'Editar Evento'
    },
    tractoVehicles() {
      return this.vehicles.filter(vehicle => vehicle.vehicleType === 'TRACTO')
    },
    carretaVehicles() {
      return this.vehicles.filter(vehicle => vehicle.vehicleType === 'CARRETA')
    },
  },
  beforeMount() {
    this.getPlantillas()
    this.getEmployees()
    this.getVehicles()
  },
  methods: {
    async saveEvent() {
      try {
        if (this.event.id) {
          await updateEvent(this.event.id, {
            evento: this.event.evento,
            nivel: this.event.nivel,
            placaTracto: this.event.placaTracto,
            placaCarreta: this.event.placaCarreta,
            fecha: this.event.fecha,
            hora: this.event.hora,
            estado: this.event.estado,
            camaras: this.event.camaras,
            employee: this.event.employee,
            contrato: this.event.contrato,
            ubicacion: this.event.ubicacion,
            detalle: this.event.detalle
          })
        } else {
          await createEvent({
            evento: this.event.evento,
            nivel: this.event.nivel,
            placaTracto: this.event.placaTracto,
            placaCarreta: this.event.placaCarreta,
            fecha: this.event.fecha,
            hora: this.event.hora,
            estado: this.event.estado,
            camaras: this.event.camaras,
            employee: this.event.employee,
            contrato: this.event.contrato,
            ubicacion: this.event.ubicacion,
            detalle: this.event.detalle
          })
        }
        this.$emit('saveEvent')
        this.close()
      } catch (error) {
        console.error('Error al guardar evento:', error)
      }
    },
    OpenDialogEmployee(){
      console.log(this.dialogEmployee)
      this.dialogEmployee = true
    },
    OpenDialogVehicle(){
      this.dialogVehicle = true
    },
    OpenDialogPlantilla(){
      this.dialogPlantilla = true
    },
    async getPlantillas() {
      try {
        this.plantillas = await getPlantillas()
      } catch (error) {
        console.error('Error al obtener plantillas:', error)
      }
    },
    async getEmployees() {
      try {
        this.employees = await getEmployees()
        console.log(this.employees)
      } catch (error) {
        console.error('Error al obtener empleados:', error)
      }
    },
    async getVehicles() {
      try {
        this.vehicles = await getVehicles()
      } catch (error) {
        console.error('Error al obtener vehiculos:', error)
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
    async savePlantilla() {
      Swal.fire({
        icon: 'success',
        title: 'Plantilla guardada con éxito',
        showConfirmButton: false,
        timer: 1500
      })
    },
    updateCamera(vehicle) {
      console.log(vehicle)
      if (vehicle) {
        this.event.camaras = vehicle.camera ? 'Si Cuenta' : 'No Cuenta';
        this.event.contrato = vehicle.operations || null;
      }
    },
    updateLevel(plantilla) {
      console.log(plantilla)
      if (plantilla) {
        this.event.nivel = plantilla.level
        this.event.detalle = plantilla.description
      } else {
        this.event.nivel = ''
      }
    },
    closedialogEmployee() {
      this.dialogEmployee = false;
      this.getEmployees()
    },
    closedialogVehicle() {
      this.dialogVehicle = false;
      this.getVehicles()
    },
    closedialogPlantilla() {
      this.dialogPlantilla = false;
      this.getPlantillas()
    },
    close() {
      this.$emit('closedialog')
      this.event = {
        id: null,
        evento: '',
        nivel: '',
        placaTracto: '',
        placaCarreta: '',
        fecha: '',
        hora: '',
        estado: '',
        camaras: '',
        employee: '',
        contrato: '',
        ubicacion: '',
        detalle: ''
      }
    },
  }
}
</script>