<template>
    <section class="flex w-screen h-screen" :class="{ 'dark': darkThemeEnabled }">
      <Sidebar />
      <div class="max-h-screen overflow-y-auto flex-grow bg-white text-primary-950 dark:bg-gray-900 dark:text-gray-50" >
        <slot />
      </div>
    </section>
</template>

<script setup lang="ts">
const darkThemeEnabled = ref(true);
</script>
