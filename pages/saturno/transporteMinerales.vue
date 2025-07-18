<template>
  <div>
    <v-row>
      <v-col cols="12" md="12" sm="12" lg="12">
        <v-card-actions class="px-4">
          <v-btn @click="showDashboard = !showDashboard" :color="showDashboard ? 'primary' : 'grey lighten-2'" class="mr-2">
            <v-icon left>mdi-view-dashboard</v-icon>
            Dashboard
          </v-btn>
          <v-btn color="primary" @click="showConvoyManager = true" class="mr-2">
            <v-icon left>mdi-account-group</v-icon>
            Convoys
          </v-btn>
          <v-btn color="secondary" @click="dialogComponent = true">
            <v-icon left>mdi-plus</v-icon>
            Nuevo Registro
          </v-btn>
        </v-card-actions>
        <v-tabs v-model="currentMine" grow>
          <v-tab v-for="operation in operations" :key="operation.id">
            {{ operation.name }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-card-text>
      <Dashboard v-if="showDashboard" :operation="currentMineName"/>
      <v-container fluid v-else>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar por placa o conductor"
          single-line
          hide-details
          class="mb-4"
        ></v-text-field>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="4" @click="editTrips(transports)" v-for="stage in stages" :key="stage.id">
            <v-card>
              <v-card-title class="text-h6">
                <v-icon left>{{ stage.icon }}</v-icon>
                {{ stage.name }}
              </v-card-title>
              <v-card-text>
                <draggable
                  v-model="stage.transport"
                  group="transport"
                  @change="updateVehicleStage(stage.id)"
                  class="drag-area"
                >
                  <v-card
                    v-for="vehicle in filteredVehicles(stage.id)"
                    :key="vehicle.id"
                    class="my-2 vehicle-card"
                    @click="openVehicleDetails(vehicle)"
                  >
                    <v-card-text>
                      <div><strong>Placa:</strong> {{ vehicle.plate }}</div>
                      <div><strong>Material:</strong> {{ vehicle.material }}</div>
                      <div><strong>Conductor:</strong> {{ vehicle.driver }}</div>
                      <div class="text-caption">{{ formatDate(vehicle.timestamp) }}</div>
                    </v-card-text>
                  </v-card>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <addTransporte
      :dialog="dialogComponent"
      @closedialog="closedialogTransporte"
      @vehicle-added="handleVehicleAdded"
      :transports="transports"
    />
  </div>
</template>
<script>
import { getTransports, updateTransport } from '../../services/transportServices'
import { getOperationMines } from '../../services/operationMineServices'
import draggable from 'vuedraggable'
import addTransporte from '../../components/saturno/addTransporte.vue'

export default {
  components: {
    draggable,
    addTransporte,
  },
  data: () => ({
    dialogComponent: false,
    showDashboard: false,
    showConvoyManager: false,
    currentMine: 0,
    search: '',
    selectedVehicle: null,
    transports: [],
    operations: [],
    stages: [
      { id: 1, name: 'BASE', icon: 'mdi-home', transport: [] },
      { id: 2, name: 'RUTA A MINA', icon: 'mdi-road', transport: [] },
      { id: 3, name: 'MINA', icon: 'mdi-pickaxe', transport: [] },
      { id: 4, name: 'RUTA A DEPOSITO', icon: 'mdi-map-marker-path', transport: [] },
      { id: 5, name: 'DEPOSITO', icon: 'mdi-warehouse', transport: [] }
    ],
  }),
  computed: {
    currentMineName() {
      return this.operations[this.currentMine]?.name || ''
    },
    currentOperationId() {
      return this.operations[this.currentMine]?.id || null
    }
  },
  watch: {
    currentMine() {
      this.getTrips()
    }
  },
  mounted() {
    this.getListOperationMines()
  },
  methods: {
    async getListOperationMines() {
      try {
        const response = await getOperationMines()
        this.operations = response.map(mine => ({
          id: mine.id,
          name: mine.name
        }))
        this.getTrips()
      } catch (error) {
        console.error('Error loading operation mines:', error)
      }
    },
    // Lista los Trips(Viajes)
    async getTrips() {
      try {
        const response = await getTransports()
        this.transports = response
        // Limpiar las etapas
        this.stages.forEach(stage => {
          stage.transport = []
        })
        // Asignar transportes a las etapas correspondientes
        response.forEach(transport => {
          // Verificar si el transporte pertenece a la operación actual
          const placaTracto = transport.placaTracto
          const operationMatch = placaTracto?.operations === this.currentMineName ||
                              placaTracto?.operations === this.currentOperationId

          if (operationMatch) {
            // Determinar la etapa (usamos stage si existe, sino BASE por defecto)
            const stageId = transport.stage || 1
            const stage = this.stages.find(s => s.id === stageId)
            if (stage) {
              stage.transport.push({
                id: transport.id,
                plate: placaTracto?.plate || 'Sin placa',
                driver: transport.employee?.name || 'Sin conductor',
                material: transport.material || 'Sin material',
                operation: placaTracto?.operations || 'Sin operación',
                timestamp: transport.createdAt || new Date(),
                originalData: transport // Guardamos todos los datos originales
              })
            }
          }
        })
      } catch (error) {
        console.error('Error loading transports:', error)
      }
    },
    editTrips(item) {
      console.log('Editar viaje', item)
      this.transports = { ...item }
      this.dialogComponent = true
    },
    async updateVehicleStage(stageId) {
      try {
        const stage = this.stages.find(s => s.id === stageId)
        if (!stage || stage.transport.length === 0) return
        // Obtener el último vehículo agregado a la etapa (el que se movió)
        const movedVehicle = stage.transport[stage.transport.length - 1]
        // Actualizar en el backend
        await updateTransport(movedVehicle.id, {
          ...movedVehicle.originalData,
          stage: stageId
        })
        console.log(`Vehículo ${movedVehicle.plate} movido a etapa ${stageId}`)
      } catch (error) {
        console.error('Error al actualizar etapa:', error)
      }
    },

    filteredVehicles(stageId) {
      const stage = this.stages.find(s => s.id === stageId)
      if (!stage) return []
      return stage.transport.filter(v => {
        const matchesSearch = this.search === '' ||
          (v.plate && v.plate.toLowerCase().includes(this.search.toLowerCase())) ||
          (v.driver && v.driver.toLowerCase().includes(this.search.toLowerCase()))
        return matchesSearch
      })
    },

    openVehicleDetails(vehicle) {
      this.selectedVehicle = vehicle
      this.showVehicleDetails = true
    },

    formatDate(date) {
      return date ? new Date(date).toLocaleString() : 'Sin fecha'
    },

    closedialogTransporte() {
      this.dialogComponent = false
    },

    handleVehicleAdded() {
      this.getTrips()
    }
  }
}
</script>

<style scoped>
.drag-area {
  min-height: 60vh;
  padding: 8px;
}

.vehicle-card {
  cursor: pointer;
  transition: all 0.3s;
}

.vehicle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.secondary {
  background-color: #4CAF50 !important;
  color: white !important;
}
</style>