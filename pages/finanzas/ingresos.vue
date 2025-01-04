<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Ingresos</span>
      <v-spacer />
      <v-btn color="primary" small fab dark @click="dialogComponent = true">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="boxs"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editIngreso(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteIngreso(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addIngreso -->
    <addIngreso
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveIngreso="fetchIngresos"
      :boxs="selectedIngreso"
    />
  </v-card>
</template>
<script>
import { getBoxs, deleteBox } from '../../services/boxServices';
import addIngreso from '../../components/finanzas/addIngreso.vue';
export default {
  name: 'Ingresos',
  components :{
    addIngreso
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Tipo', value: 'tipo', sortable: false },
        { text: 'Fecha', value: 'fecha', sortable: false },
        { text: 'Monto', value: 'monto', sortable: false },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      dialogComponent: false,
      boxs: [],
      selectedIngreso: null,
    }
  },
  async beforeMount(){
    await this.fetchIngresos()
  },
  methods: {
    async fetchIngresos(){
      try {
        const allBoxs = await getBoxs()
        this.boxs = allBoxs.filter(box => box.tipo === 'Ingreso')
      } catch (error) {
        console.log('Error al obtener Registros', error)
      }
    },
    editIngreso(ingreso){
      this.selectedIngreso = {...ingreso}
      this.dialogComponent = true
    },
    async deleteIngreso(id){
      await deleteBox(id)
      this.fetchIngresos()
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