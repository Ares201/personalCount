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
                />
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  label="Evento"
                  v-model="document.evento"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['CONDESTABLE', 'CEMENTO CL', 'ECOSERM CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA', 'EN BASE']"
                  label="Operación"
                  v-model="document.operacion"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicacion"
                  v-model="document.ubicacion"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Fecha de Envío"
                  v-model="document.fechaEnvio"
                  outlined
                  type="date"
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Tracto"
                  v-model="document.placaTracto"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Carreta"
                  v-model="document.placaCarreta"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="employees"
                  label="Empleado"
                  v-model="document.employee"
                  outlined
                  dense
                  clearable
                  item-text="name"
                  item-value="id"
                  return-object
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
              <v-col v-if="document.fechaRepuesta" cols="12" md="6">
                <v-select
                  :items="['En Proceso', 'Completado', 'No Solicitado']"
                  label="Estado"
                  v-model="document.estado"
                  outlined
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <label style="color: black;">Detalle del Documento</label>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                label="Fecha Solicitud de Requerimientos"
                v-model="document.fechaSolicitud"
                outlined
                type="date"
                dense
              />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Respuesta"
                  v-model="document.fechaRepuesta"
                  outlined
                  type="date"
                  dense
                />
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
        <v-btn color="blue darken-1" text @click="saveDocument" :loading="loading">
          {{ this.document.id === null ? 'Guardar' : 'Editar' }}
        </v-btn>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
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
import { createDocument, updateDocument } from '../services/documentServices';
import { getEmployees } from '../services/employeeServices';
import addEmployee from '../components/configuracion/addEmployee';

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
      dialogEmployee: false,
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
  },
  methods: {
    async saveDocument() {
      try {
        this.loading= true
        if (this.document.id) {
          await updateDocument(this.document.id, {
            numero: this.document.numero,
            operacion: this.document.operacion,
            evento: this.document.evento,
            fechaEnvio: this.document.fechaEnvio,
            ubicacion: this.document.ubicacion,
            placaTracto: this.document.placaTracto,
            placaCarreta:this.document.placaCarreta,
            fechaRepuesta: this.document.fechaRepuesta,
            fechaSolicitud: this.document.fechaSolicitud,
            operador: this.document.operador,
            link: this.document.link,
            estado: this.document.estado,
            employee: this.document.employee
          })
        } else {
          await createDocument({
            numero: this.document.numero,
            operacion: this.document.operacion,
            evento: this.document.evento,
            fechaEnvio: this.document.fechaEnvio,
            ubicacion: this.document.ubicacion,
            placaTracto: this.document.placaTracto,
            placaCarreta:this.document.placaCarreta,
            fechaRepuesta: this.document.fechaRepuesta,
            fechaSolicitud: this.document.fechaSolicitud,
            operador: this.document.operador,
            link: this.document.link,
            estado: 'Pendiente',
            employee: this.document.employee
          })
        }
        this.$emit('saveDocument')
        this.close()
        this.loading= false
      } catch (error) {
        console.error('Error al guardar documento:', error)
      }
    },
    OpenDialogEmployee(){
      console.log(this.dialogEmployee)
      this.dialogEmployee = true
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
        operador: '',
        link: '',
        estado: '',
        employee: ''
      }
    },
  }
}
</script>