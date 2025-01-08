<template>
  <div>
    <!-- <p>Modo Actual: {{ $colorMode.preference }}</p> -->
    <v-icon
      v-if="$colorMode.preference === 'dark'"
      @click="toggleColorMode"
      color="white"
      class="icon"
    >
      mdi-moon-waxing-crescent
    </v-icon>
    <v-icon
      v-else
      @click="toggleColorMode"
      color="black"
      class="icon"
    >
      mdi-weather-sunny
    </v-icon>
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