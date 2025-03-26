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
                  v-model="document.numero"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  label="Evento"
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
                  clearable
                  outlined
                  dense
                  hide-no-data
                  hide-selected
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicacion"
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
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Tracto"
                  v-model="document.placaTracto"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Carreta"
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
                  v-model="document.condition"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Líder de Convoy"
                  v-model="document.leaderConvoy"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="Descripcion (¿Qué pasó?)"
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
                  :items="['Giancarlo Cervera', 'Paolo Limaco', 'Jair Macazana', 'Ronal Zevallos', 'Victor Pinto']"
                  label="Operador CC"
                  v-model="document.operador"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-text-field
                label="Link"
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
        <v-btn color="primaryColor" text @click="saveDocument" :loading="loading">
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
    </v-card>
  </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import { createDocument, updateDocument } from '../../services/documentServices';
import { getEmployees } from '../../services/employeeServices';
import addEmployee from '../../components/configuracion/addEmployee';
import { getOperationMines } from '../../services/operationMineServices';

export default {
  name: 'addDocument',
  components: {
    addEmployee
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
        detail: '',
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
      loading: false,
      document: { ...this.documents },
      employees : [],
      operations : [],
      dialogEmployee: false,
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
            detail: '',
            leaderConvoy: '',
            condition: '',
            operador: '',
            link: '',
            estado: '',
            employee: ''
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
    this.getOperationMines()
  },
  methods: {
    async saveDocument() {
      try {
        this.loading = true;
        let estado = 'Pendiente';
        if (this.document.fechaSolicitud) {
          estado = 'En Proceso';
        }
        if (this.document.fechaRepuesta) {
          estado = 'Completado';
        }
        if (this.noSolicitado) {
          estado = 'No Solicitado';
        }
        if (this.document.id) {
          await updateDocument(this.document.id, {
            numero: this.document.numero,
            operacion: this.document.operacion,
            evento: this.document.evento,
            fechaEnvio: this.document.fechaEnvio,
            ubicacion: this.document.ubicacion,
            placaTracto: this.document.placaTracto,
            placaCarreta: this.document.placaCarreta,
            fechaRepuesta: this.document.fechaRepuesta,
            fechaSolicitud: this.document.fechaSolicitud,
            detail: this.document.detail,
            leaderConvoy: this.document.leaderConvoy,
            condition: this.document.condition,
            operador: this.document.operador,
            link: this.document.link,
            estado: estado,
            employee: this.document.employee
          });
        } else {
          await createDocument({
            numero: this.document.numero,
            operacion: this.document.operacion,
            evento: this.document.evento,
            fechaEnvio: this.document.fechaEnvio,
            ubicacion: this.document.ubicacion,
            placaTracto: this.document.placaTracto,
            placaCarreta: this.document.placaCarreta,
            fechaRepuesta: this.document.fechaRepuesta,
            fechaSolicitud: this.document.fechaSolicitud,
            detail: this.document.detail,
            leaderConvoy: this.document.leaderConvoy,
            condition: this.document.condition,
            operador: this.document.operador,
            link: this.document.link,
            estado: estado, // Usamos el estado calculado
            employee: this.document.employee
          });
        }
        this.$emit('saveDocument');
        this.close();
        this.loading = false;
      } catch (error) {
        console.error('Error al guardar documento:', error);
        this.loading = false;
      }
    },
    OpenDialogEmployee(){
      console.log(this.dialogEmployee)
      this.dialogEmployee = true
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
    saveEmployees() {
      Swal.fire({
        icon: 'success',
        title: 'Empleado guardado con éxito',
        showConfirmButton: false,
        timer: 1500
      })
    },
    closedialogEmployee() {
      this.dialogEmployee = false;
      this.getEmployees()
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
        detail: '',
        leaderConvoy: '',
        condition: '',
        operador: '',
        link: '',
        estado: '',
        employee: ''
      }
    },
  }
}
</script>