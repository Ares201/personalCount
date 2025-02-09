<template>
  <v-card height="100%" tile>
    <v-card-title>
      <v-row dense align="center" class="mb-2">
        <v-col cols="12" md="8">
          <span class="text-h6 font-weight-bold">Compras y Pagos</span>
        </v-col>
        <v-col cols="12" md="4" class="d-flex align-center justify-space-between">
          <v-btn color="primary" small fab dark @click="dialogComponent = true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-switch
            @click="switchMode"
            :label="model ? 'Tarjeta' : 'Tabla'"
          ></v-switch>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="model">
      <v-data-table
        :headers="headers"
        :items="boxs"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.monto`]="{ item }">
          S/.{{ item.monto }}
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="item.estado ? 'green' : 'orange'" dark>
            {{ item.estado ? 'Cancelado' : 'Pendiente' }}
          </v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editCompra(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteCompra(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" sm="12">
        <v-row>
          <v-col v-for="box in boxs.filter(item => item.estado === false)" :key="box.id" cols="12" sm="6" md="4">
            <v-card
              @click="editCompra(box)"
              class="pa-2 mb-4" style="border: 2px solid orange; border-radius: 10px;"
            >
              <v-row dense>
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-progress-circular
                    :value="calculateProgress(box)"
                    color="primary"
                    size="50"
                    width="5"
                  >
                    {{ calculateProgress(box) }}%
                  </v-progress-circular>
                </v-col>
                <v-col cols="8">
                  <v-chip class="ma-2" :color="box.estado ? 'green' : 'orange'" text-color="white">
                    {{ box.estado ? 'Cancelado' : 'Pendiente' }}
                  </v-chip>
                  <v-card-text>
                    <p>{{ box.descripcion }}</p>
                    <strong>Monto:</strong>
                    <p>S/.{{ box.monto }}</p>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Componente addCompra -->
    <addCompra
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveCompra="fetchCompras"
      :boxs="selectedCompra"
    />
  </v-card>
</template>
<script>
import { getBoxs, deleteBox } from '../../services/boxServices';
import addCompra from '../../components/finanzas/addCompra.vue';
export default {
  name: 'Compras',
  components :{
    addCompra
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Concepto', value: 'concepto', sortable: false },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false },
        { text: 'Estado', value: 'estado', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      model: false,
      boxs: [],
      selectedCompra: null,
    }
  },
  async beforeMount(){
    await this.fetchCompras()
  },
  methods: {
    calculateProgress(box) {
      if (!box.detailBox || box.detailBox.length === 0) return 0;
      const totalTasks = box.detailBox.length;
      const completedTasks = box.detailBox.filter(detail => detail.estado).length;
      return Math.round((completedTasks / totalTasks) * 100);
    },
    switchMode(){
      this.model = !this.model
    },
    async fetchCompras(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs
        .filter(box => box.tipo === 'Compra')
        .map(box => ({
          ...box,
          estado: box.detailBox.length > 0 && box.detailBox.every(detail => detail.estado)
        }));
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    editCompra(Compra){
      this.selectedCompra = {...Compra}
      this.dialogComponent = true
    },
    async deleteCompra(id){
      await deleteBox(id)
      this.fetchCompras()
    },
    openDialog(){
      this.dialogComponent = true
    },
    closedialog(){
      this.dialogComponent = false
    }
  }
}
</script>
<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>