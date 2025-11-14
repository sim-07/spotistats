<template>
    <div style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; background-color: black;">
        <ColorBends
            :colors="['#ff5c7a', '#8a5cff', '#00ffd1']"
            :rotation="0"
            :speed="0.2"
            :scale="1.0"
            :frequency="1.0"
            :warpStrength="1.0"
            :mouseInfluence="0.1"
            :parallax="0.5"
            :noise="0.2"
            transparent
        />
    </div>
</template>
  
<script setup>
    import ColorBends from '../DesignComponent/ColorBends.vue'
</script>