<template>
  <v-card height="100%" tile>
    <v-card-title>
      <span class="text-h6">Gestión de Usuarios</span>
      <v-spacer />
      <v-btn color="primary" small fab dark @click="dialogComponent = true"><v-icon dark>mdi-plus</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        item-value="id"
        dense
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.password`]="{ item }">
          {{ item.password && item.password.length > 0 ? '******' : 'Sin Seguridad' }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-icon small color="blue" @click="editUser(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteUser(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Componente addUser -->
    <add-user
      :dialog = "dialogComponent"
      @closedialog="closedialog"
      @saveUser="fetchUsers"
      :user="selectedUser"
    />
  </v-card>
</template>

<script>
import {  getUsers, deleteUser } from '~/services/userServices'
import addUser from '../../components/configuracion/addUser.vue';
export default {
  name: 'Usuarios',
  components:{
    addUser
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Rol', value: 'role', sortable: false },
        { text: 'Seguridad', value: 'password', sortable: false,  align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      usuarios: [],
      search: '',
      dialog: false,
      dialogComponent: false,
      selectedUser: null
    }
  },
  async beforeMount() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.usuarios = await getUsers()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
    editUser(user) {
      this.selectedUser = { ...user }
      this.dialogComponent = true
    },
    async deleteUser(userId) {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await deleteUser(userId)
          await this.fetchUsers()
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
        }
      }
    },
    openDialog() {
      this.dialogComponent = true
    },
    closedialog() {
      this.dialogComponent = false
    },
  },
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
