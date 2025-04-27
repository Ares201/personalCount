<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-text-field
                  label="N° Flash Report"
                  class="custom-autocomplete"
                  v-model="document.numero"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  label="Evento"
                  class="custom-autocomplete"
                  v-model="document.evento"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="document.operacion"
                  color="secondaryColor"
                  :items="operations"
                  item-text="name"
                  label="Operacion"
                  class="custom-autocomplete"
                  clearable
                  outlined
                  dense
                  hide-no-data
                  hide-selected
                  hide-details
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicacion"
                  class="custom-autocomplete"
                  v-model="document.ubicacion"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-menu
                  v-model="menuFecha"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="document.fechaEnvio"
                      label="Fecha"
                      append-icon="mdi-calendar"
                      color="secondaryColor"
                      class="custom-autocomplete"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                      clearable
                      outlined
                      dense
                      hide-details
                    />
                  </template>
                  <v-date-picker color="secondaryColor" v-model="document.fechaEnvio" @input="menuFecha = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  :items="vehicles"
                  v-model="document.placaTracto"
                  item-text="plate"
                  item-value="id"
                  label="Placa Tracto"
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
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Carreta"
                  class="custom-autocomplete"
                  v-model="document.placaCarreta"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="employees"
                  v-model="document.employee"
                  item-text="name"
                  item-value="id"
                  label="Empleado"
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
                    <v-list-item link @click="OpenDialogEmployee()" class="fixed-option">
                        <a>
                          + Empleado
                        </a>
                      </v-list-item>
                    <v-divider />
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Condición"
                  class="custom-autocomplete"
                  v-model="document.condition"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Líder de Convoy"
                  class="custom-autocomplete"
                  v-model="document.leaderConvoy"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="Descripcion (¿Qué pasó?)"
                  class="custom-autocomplete"
                  v-model="document.detail"
                  outlined
                  dense
                  rows="3"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-switch
                  v-model="noSolicitado"
                  label="No Solicitado"
                  color="primary"
                  class="custom-autocomplete"
                  hide-details
                  dense
                ></v-switch>
              </v-col>
              <!-- <v-col cols="12" md="6">
                <v-select
                  :items="['En Proceso', 'Completado', 'No Solicitado']"
                  label="Estado"
                  v-model="document.estado"
                  outlined
                  dense
                  clearable
                />
              </v-col> -->
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <label style="color: black;">Detalle del Documento</label>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menuFecha2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="document.fechaSolicitud"
                      label="Fecha de Solicitud"
                      append-icon="mdi-calendar"
                      color="secondaryColor"
                      class="custom-autocomplete"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                      clearable
                      outlined
                      dense
                      hide-details
                    />
                  </template>
                  <v-date-picker color="secondaryColor" v-model="document.fechaSolicitud" @input="menuFecha2 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menuFecha3"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="document.fechaRepuesta"
                      label="Fecha de Respuesta"
                      append-icon="mdi-calendar"
                      color="secondaryColor"
                      class="custom-autocomplete"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                      clearable
                      outlined
                      dense
                      hide-details
                    />
                  </template>
                  <v-date-picker color="secondaryColor" v-model="document.fechaRepuesta" @input="menuFecha3 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-select
                  :items="employees"
                  item-text="name"
                  item-value="id"
                  label="Operador CC"
                  class="custom-autocomplete"
                  v-model="document.operador"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-text-field
                label="Link"
                class="custom-autocomplete"
                v-model="document.link"
                outlined
                dense />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primaryColor" text @click="saveDocument">
          {{ this.document.id === null ? 'Guardar' : 'Editar' }}
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
import { createDocument, updateDocument } from '../../services/documentServices';
import { getEmployees } from '../../services/employeeServices';
import { getVehicles } from '../../services/vehicleServices';
import addEmployee from '../../components/configuracion/addEmployee';
import addVehicle from '../../components/configuracion/addVehicle.vue';
import { getOperationMines } from '../../services/operationMineServices';

export default {
  name: 'addDocument',
  components: {
    addEmployee,
    addVehicle
  },
  props: {
    dialog: { type: Boolean, default: false },
    documents: {
      type: Object,
      default: () => ({
        id: null,
        numero: '',
        operacion: '',
        evento: '',
        placaTracto: '',
        placaCarreta:'',
        ubicacion: '',
        fechaEnvio: '',
        fechaRepuesta: '',
        fechaSolicitud: '',
        detail: null,
        leaderConvoy: '',
        condition: '',
        operador: '',
        link: '',
        estado: '',
        employee: null
      })
    }
  },
  data() {
    return {
      document: { ...this.documents },
      employees : [],
      vehicles: [],
      operations : [],
      dialogEmployee: false,
      dialogVehicle: false,
      menuFecha: false,
      menuFecha2: false,
      menuFecha3: false,
      noSolicitado: false,
      currentEmployee: {  // Added property
        name: '',
        workstation: '',
        area: ''
      },
    }
  },
  watch: {
    dialog: {
      handler(newVal) {
        if (newVal) {
          this.document = this.documents.id ? { ...this.documents } :
          {
            id: null,
            numero: '',
            operacion: '',
            evento: '',
            placaTracto: '',
            placaCarreta:'',
            ubicacion: '',
            fechaEnvio: '',
            fechaRepuesta: '',
            fechaSolicitud: '',
            detail: null,
            leaderConvoy: '',
            condition: '',
            operador: '',
            link: '',
            estado: '',
            employee: null
          }
        }
      },
      immediate: true
    },
    documents: {
      handler(newDocument) {
        this.document = { ...newDocument }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.document.id === null ? 'Nuevo Documento' : 'Editar Documento'
    }
  },
  beforeMount() {
    this.getEmployees()
    this.getVehicles()
    this.getOperationMines()
  },
  methods: {
    async saveDocument() {
      try {
        let estado = 'Pendiente';
        if (this.document.fechaSolicitud) estado = 'En Proceso';
        if (this.document.fechaRepuesta) estado = 'Completado';
        if (this.noSolicitado) estado = 'No Solicitado';

        const docData = {
          numero: this.document.numero || '',
          operacion: this.document.operacion || '',
          evento: this.document.evento || '',
          fechaEnvio: this.document.fechaEnvio || null,
          ubicacion: this.document.ubicacion || '',
          placaTracto: this.document.placaTracto || '',
          placaCarreta: this.document.placaCarreta || '',
          fechaRepuesta: this.document.fechaRepuesta || null,
          fechaSolicitud: this.document.fechaSolicitud || null,
          detail: this.document.detail || '', // Asegura que no sea undefined
          leaderConvoy: this.document.leaderConvoy || '',
          condition: this.document.condition || '',
          operador: this.document.operador || '',
          link: this.document.link || '',
          estado: estado,
          employee: this.document.employee || null, // Asegura que no sea undefined
        };

        if (this.document.id) {
          await updateDocument(this.document.id, docData);
        } else {
          await createDocument(docData);
        }

        this.$emit('saveDocument');
        this.close();
      } catch (error) {
        console.error('Error al guardar documento:', error);
        Swal.fire('Error', 'No se pudo guardar el documento', 'error');
      }
    },
    OpenDialogEmployee(){
      this.dialogEmployee = true
    },
    OpenDialogVehicle(){
      this.dialogVehicle = true
    },
    async getOperationMines() {
      try {
        this.operations = await getOperationMines()
      } catch (error) {
        console.error('Error al obtener operaciones:', error)
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
    closedialogEmployee() {
      this.dialogEmployee = false;
      this.getEmployees()
      this.getOperationMines()
    },
    closedialogVehicle() {
      this.dialogVehicle = false;
      this.getVehicles()
      this.getOperationMines()
    },
    close() {
      this.$emit('closedialog')
      this.document = {
        id: null,
        numero: '',
        operacion: '',
        evento: '',
        placaTracto: '',
        placaCarreta:'',
        ubicacion: '',
        fechaEnvio: '',
        fechaRepuesta: '',
        fechaSolicitud: '',
        detail: null,
        leaderConvoy: '',
        condition: '',
        operador: '',
        link: '',
        estado: '',
        employee: null
      }
    },
  }
}
</script>
<style scoped>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
</style>