<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h6">Gestión de Usuarios</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" small fab dark @click="openDialog"><v-icon dark>mdi-plus</v-icon></v-btn>
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
          <template v-slot:[`item.acciones`]="{ item }">
            <v-icon small color="blue" @click="editUser(item)">mdi-pencil</v-icon>
            <v-icon small color="red" @click="deleteUser(item.id)">mdi-delete</v-icon>
          </template>
          <template v-slot:[`item.password`]="{ item }">
            {{ item.password && item.password.length > 0 ? '******' : 'Sin Seguridad' }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- Dialogo para agregar/editar usuario -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Nombre"
              v-model="currentUser.name"
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="Email"
              v-model="currentUser.email"
              type="email"
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="Seguridad"
              v-model="currentUser.password"
              type="email"
              outlined
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="saveUser">Guardar</v-btn>
          <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { createUser, getUsers, updateUser, deleteUser } from '~/services/userServices'

export default {
  data() {
    return {
      headers: [
        { text: '#', value: 'index', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Seguridad', value: 'password', sortable: false,  align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      usuarios: [],
      search: '',
      dialog: false,
      currentUser: {
        id: null,
        name: '',
        email: ''
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.currentUser.id ? 'Editar Usuario' : 'Agregar Usuario'
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        this.usuarios = await getUsers()
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
      }
    },
    openDialog() {
      this.dialog = true
      this.currentUser = { id: null, name: '', email: '', password: '' }
    },
    async saveUser() {
      if (!this.$refs.form.validate()) return

      try {
        if (this.currentUser.id) {
          // Editar usuario existente
          await updateUser(this.currentUser.id, {
            name: this.currentUser.name,
            email: this.currentUser.email,
            password: this.currentUser.password,
          })
        } else {
          // Agregar nuevo usuario
          await createUser({
            name: this.currentUser.name,
            email: this.currentUser.email,
            password: this.currentUser.password,
          })
        }

        this.dialog = false
        await this.fetchUsers()
      } catch (error) {
        console.error('Error al guardar usuario:', error)
      }
    },
    editUser(user) {
      this.currentUser = { ...user }
      this.dialog = true
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
  },
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
