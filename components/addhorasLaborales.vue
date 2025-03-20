<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="justify-center mb-2">
        <span class="text-h6">{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="12">
                <v-text-field
                  label="Fecha"
                  v-model="hwork.date"
                  type="date"
                  dense
                />
              </v-col>
              <v-switch
                @click="switchMode"
                :label="model ? 'Ahora' : 'Ingresar'"
              ></v-switch>
              <v-col cols="12" md="12" class="d-flex justify-center">
                <v-chip v-if="!model" class="mx-4 mt-2 text-h6" color="blue darken-2" label>
                  {{ currentTime }}
                </v-chip>
                <v-text-field
                  v-else
                  class="mx-4 text-h6"
                  v-model="hwork.startTime"
                  outlined type="time"
                  dense
                  hide-details
                />
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
                  class="custom-autocomplete"
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
                <v-sheet class="pa-2 rounded-lg border-radio">
                  <v-radio-group v-model="hwork.status" row>
                    <v-radio label="Ingreso" value="income"></v-radio>
                    <v-radio label="Salida" value="out"></v-radio>
                  </v-radio-group>
                </v-sheet>
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
import { Timestamp } from "firebase/firestore";
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
        startTime: '',
        employee: null,
        status:'',
      })
    }
  },
  data() {
    return {
      currentTime: '',
      loading: false,
      model: false,
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
            startTime: '',
            employee: null,
            status:'',
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
      return this.hwork.id === null ? 'Nueva Asistencia' : 'Editar Asistencia'
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // Se actualiza cada segundo
  },
  beforeMount() {
    this.getEmployees()
  },
  methods: {
    switchMode(){
      this.model = !this.model
    },
    async saveHwork() {
      try {
        this.loading = true;
        if (this.hwork.startTime) {
          const [hours, minutes] = this.hwork.startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0, 0);
          this.hwork.startTime = Timestamp.fromDate(startDate);
        }
        if (this.hwork.id) {
          await updateHwork(this.hwork.id, {
            startTime: this.hwork.startTime,
            date: this.hwork.date,
            status: this.hwork.status,
            employee: this.hwork.employee
          });
        } else {
          await createHwork({
            startTime: this.hwork.startTime,
            date: this.hwork.date,
            status: this.hwork.status,
            employee: this.hwork.employee
          });
        }
        this.$emit("saveHwork");
        this.close();
        this.loading = false;
      } catch (error) {
        console.error("Error al guardar hwork:", error);
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
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    },
    close() {
      this.$emit('closedialog')
      this.hwork = {
        id: null,
        status: '',
        employee: ''
      }
    },
  }
}
</script>
<style scoped>
.custom-autocomplete ::v-deep(.v-input__control) {
  border-radius: 10px;
}
.border-radio {
  border: 2px solid #90a4ae;
  background-color: #eceff1;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>