<template>
 <div>
    <v-btn
      icon
      @click="toggleColorMode"
    >
      <v-icon
        :color="$colorMode.preference === 'dark' ? 'white' : 'black'"
        class="icon"
      >
        {{ $colorMode.preference === 'dark' ? 'mdi-weather-sunny' : 'mdi-moon-waxing-crescent' }}
      </v-icon>
    </v-btn>
    <span>{{ $colorMode.preference === 'dark' ? 'Modo Claro' : 'Modo Oscuro' }}</span>
  </div>
</template>
<script>
export default {
  name: 'ColorMode',
  watch: {
    '$colorMode.preference': function(newValue) {
      this.$vuetify.theme.dark = newValue === 'dark';  // Cambia el tema de Vuetify
    }
  },
  mounted() {
    // Inicializar el tema al cargar la aplicación
    this.$vuetify.theme.dark = this.$colorMode.preference === 'dark';
  },

  methods: {
    toggleColorMode() {
      this.$colorMode.preference = this.$colorMode.preference === 'dark' ? 'light' : 'dark';
    }
  }
}
</script>
<style>
.icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.icon:hover {
  transform: scale(1.1);
}
</style>