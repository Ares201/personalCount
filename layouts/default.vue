<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in filteredItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-group
            v-model="item.active"
            no-action
            offset-y
          >
            <template v-slot:activator>
              <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :to="child.to"
              router
              exact
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <!-- Modo Oscuro -->
        <v-list-item>
          <v-list-item-action>
            <switchMode />
          </v-list-item-action>
        </v-list-item>
        <!-- Cambiar de Lado -->
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Cambiar de Lado.</v-list-item-title>
        </v-list-item>
        <!-- Cerrar Sesion -->
         <v-list-item  @click="logout">
          <v-list-item-action>
            <v-icon light>
              mdi-logout
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Cerrar Sesion</v-list-item-title>
         </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import switchMode from '../components/colorMode.vue';
import {  getUsers } from '~/services/userServices'
export default {
  components: {
    switchMode
  },
  name: 'DefaultLayout',
  middleware: 'auth',
  data () {
  return {
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false,
    user: { role: '', permissions: [] },
    title: 'ARES',
    items: [
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/'
      },
      {
        icon: 'mdi-account',
        title: 'Configuracion',
        children: [
          { title: 'Usuarios', to: '/mantenimiento/usuarios' },
          { title: 'Permisos', to: '/mantenimiento/permisos' },
          { title: 'Empleados', to: '/mantenimiento/empleados' }
        ]
      },
      {
        icon: 'mdi-cash',
        title: 'Finanzas',
        children: [
          { title: 'Dashboard', to: '/finanzas/dashboard'},
          { title: 'Ingresos', to: '/finanzas/ingresos' },
          { title: 'Salidas', to: '/finanzas/salidas' }
        ]
      },
      {
        icon: 'mdi-basket',
        title: 'Tareas y Compras',
        children: [
          { title: 'Compras', to: '/compras/compras' }
        ]
      },
      {
        icon: 'mdi-tools',
        title: 'Saturno',
        children: [
          { title: 'Dashboard', to:'/saturno/dashboard' },
          { title:'Horas Laborales', to:'/saturno/horasLaborales' },
          { title: 'FlashReport', to:'/saturno/flashreport' },
          { title:'Eventos', to:'/saturno/eventos' },
        ]
      }
    ]
  }
},
computed: {
  filteredItems() {
      if (this.user.role === 'Administrador') {
        return this.items; // Mostrar todos los ítems
      } else {
        return this.items
          .map(section => ({
            ...section,
            children: section.children
              ? section.children.filter(child => this.user.permissions.includes(child.to))
              : []
          }))
          .filter(section => section.children.length > 0 || !section.children);
      }
    }
  },
  mounted() {
    // Acceder a localStorage solo en el cliente
    if (process.client) {
      this.user = JSON.parse(localStorage.getItem('user')) || {};
    }
  },
  methods: {
    async logout() {
      await this.$router.push({ path: '/auth/login' })
      localStorage.removeItem('user')
      window.location.reload()
    },
    async fetchUsers() {
      try {
        this.usuarios = await getUsers()
      } catch (error) {
        console.error('Error al obtener Registros.', error)
      }
    },
  }
}
</script>
