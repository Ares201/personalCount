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
                      v-model="hwork.date"
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
                  <v-date-picker color="secondaryColor" v-model="hwork.date" @input="menuFecha = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="hwork.operationMina"
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
              <!-- <v-col cols="12" md="12">
                <v-text-field
                  label="Fecha"
                  v-model="hwork.date"
                  type="date"
                  dense
                />
              </v-col> -->
              <v-col cols="12" md="12" class="d-flex justify-center align-center">
                <v-chip v-if="!hwork.startTime" class="ml-2 text-h6" color="secondaryColor" outlined label>
                  {{ currentTime }}
                </v-chip>
                <v-text-field
                  v-else
                  class="ml-2 text-h6"
                  v-model="hwork.startTime"
                  color="secondaryColor"
                  outlined type="time"
                  dense
                  hide-details
                />
                <v-text-field
                  v-if="hwork.endTime"
                  class="ml-2 text-h6"
                  v-model="hwork.endTime"
                  color="secondaryColor"
                  type="time"
                  outlined
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-autocomplete
                  :items="employees"
                  color="secondaryColor"
                  v-model="hwork.employee"
                  class="custom-autocomplete"
                  label="Empleado"
                  item-text="name"
                  item-value="id"
                  return-object
                  outlined
                  clearable
                  dense
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
                <v-sheet class="pa-2 rounded-lg border-radio">
                  <label for="">Ingreso</label>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primaryColor" text @click="saveHwork" :loading="loading">
          {{ this.hwork.id === null ? 'Guardar' : 'Editar' }}
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
import { Timestamp } from "firebase/firestore";
import { createHwork, updateHwork } from '../../services/hworkServices';
import { getEmployees } from '../../services/employeeServices';
import addEmployee from '../../components/configuracion/addEmployee';
import { getOperationMines } from '../../services/operationMineServices';

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
        operationMina: '',
        endTime: '',
        employee: null,
        status:'',
      })
    }
  },
  data() {
    return {
      employees : [],
      operations : [],
      hwork: { ...this.hworks },
      currentEmployee: {
        name: '',
        workstation: '',
        area: ''
      },
      dialogEmployee: false,
      menuFecha: false,
      loading: false,
      currentTime: '',
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
            endTime: '',
            employee: null,
            status:'',
            operationMina: ''
          }
        }
      },
      immediate: true
    },
    hworks: {
      handler(newHwork) {
        if (newHwork) {
          this.hwork = {
            ...newHwork,
            startTime: this.formatTime(newHwork.startTime),
            endTime: this.formatTime(newHwork.endTime),
          };
        }
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
    this.getOperationMines()
  },
  methods: {
    formatTime(timestamp) {
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      }
      return "";
    },
    async saveHwork() {
      try {
        this.loading = true;
        if (!this.hwork.startTime) {
          this.hwork.startTime = this.currentTime;
        }
        if (this.hwork.startTime) {
          const [hours, minutes] = this.hwork.startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0, 0);
          this.hwork.startTime = Timestamp.fromDate(startDate);
        }
        if (this.hwork.endTime) {
          const [hours, minutes] = this.hwork.endTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0, 0);
          this.hwork.endTime = Timestamp.fromDate(startDate);
        }
        if (this.hwork.id) {
          await updateHwork(this.hwork.id, {
            startTime: this.hwork.startTime,
            date: this.hwork.date,
            status: this.hwork.status,
            employee: this.hwork.employee,
            endTime: this.hwork.endTime,
            operationMina: this.hwork.operationMina
          });
        } else {
          await createHwork({
            startTime: this.hwork.startTime,
            endTime: this.hwork.endTime,
            date: this.hwork.date,
            status: 'income',
            employee: this.hwork.employee,
            operationMina: this.hwork.operationMina
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
        employee: '',
        startTime: '',
        endTime: '',
        operationMina:''
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