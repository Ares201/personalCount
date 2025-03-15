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
                  v-model="hwork.numero"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  label="Evento"
                  v-model="hwork.evento"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['CONDESTABLE', 'CEMENTO CL', 'ECOSERM CL', 'CERRO LINDO', 'ATACOCHA', 'CATALINA HUANCA', 'EN BASE']"
                  label="Operación"
                  v-model="hwork.operacion"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Ubicacion"
                  v-model="hwork.ubicacion"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Fecha de Envío"
                  v-model="hwork.fechaEnvio"
                  outlined
                  type="date"
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Tracto"
                  v-model="hwork.placaTracto"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Placa Carreta"
                  v-model="hwork.placaCarreta"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="employees"
                  label="Empleado"
                  v-model="hwork.employee"
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
              <v-col v-if="hwork.fechaRepuesta" cols="12" md="6">
                <v-select
                  :items="['En Proceso', 'Completado', 'No Solicitado']"
                  label="Estado"
                  v-model="hwork.estado"
                  outlined
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <label style="color: black;">Detalle del Hworko</label>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                label="Fecha Solicitud de Requerimientos"
                v-model="hwork.fechaSolicitud"
                outlined
                type="date"
                dense
              />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Fecha de Respuesta"
                  v-model="hwork.fechaRepuesta"
                  outlined
                  type="date"
                  dense
                />
              </v-col>
              <v-col v-if="hwork.fechaRepuesta" cols="12" md="6">
                <v-select
                  :items="['Giancarlo Cervera', 'Paolo Limaco', 'Jair Macazana', 'Ronal Zevallos', 'Victor Pinto']"
                  label="Operador CC"
                  v-model="hwork.operador"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col v-if="hwork.fechaRepuesta" cols="12" md="6">
                <v-text-field
                label="Link"
                v-model="hwork.link"
                outlined
                dense />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveHwork" :loading="loading">
          {{ this.hwork.id === null ? 'Guardar' : 'Editar' }}
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
import { createHwork, updateHwork } from '../services/hworkServices';
import { getEmployees } from '../services/employeeServices';
import addEmployee from '../components/configuracion/addEmployee';

export default {
  name: 'addHwork',
  components: {
    addEmployee
  },
  props: {
    dialog: { type: Boolean, default: false },
    hworks: {
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
      hwork: { ...this.hworks },
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
          this.hwork = this.hworks.id ? { ...this.hworks } :
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
    hworks: {
      handler(newHwork) {
        this.hwork = { ...newHwork }
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.hwork.id === null ? 'Nuevo Hworko' : 'Editar Hworko'
    }
  },
  beforeMount() {
    this.getEmployees()
  },
  methods: {
    async saveHwork() {
      try {
        this.loading= true
        if (this.hwork.id) {
          await updateHwork(this.hwork.id, {
            numero: this.hwork.numero,
            operacion: this.hwork.operacion,
            evento: this.hwork.evento,
            fechaEnvio: this.hwork.fechaEnvio,
            ubicacion: this.hwork.ubicacion,
            placaTracto: this.hwork.placaTracto,
            placaCarreta:this.hwork.placaCarreta,
            fechaRepuesta: this.hwork.fechaRepuesta,
            fechaSolicitud: this.hwork.fechaSolicitud,
            operador: this.hwork.operador,
            link: this.hwork.link,
            estado: this.hwork.estado,
            employee: this.hwork.employee
          })
        } else {
          await createHwork({
            numero: this.hwork.numero,
            operacion: this.hwork.operacion,
            evento: this.hwork.evento,
            fechaEnvio: this.hwork.fechaEnvio,
            ubicacion: this.hwork.ubicacion,
            placaTracto: this.hwork.placaTracto,
            placaCarreta:this.hwork.placaCarreta,
            fechaRepuesta: this.hwork.fechaRepuesta,
            fechaSolicitud: this.hwork.fechaSolicitud,
            operador: this.hwork.operador,
            link: this.hwork.link,
            estado: 'Pendiente',
            employee: this.hwork.employee
          })
        }
        this.$emit('saveHwork')
        this.close()
        this.loading= false
      } catch (error) {
        console.error('Error al guardar hworko:', error)
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
      this.hwork = {
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