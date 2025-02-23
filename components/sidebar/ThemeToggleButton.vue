<template>
    <div class="h-14 flex items-center pl-4">
        <div class="relative inline-block w-11 h-6">
            <input
                id="theme-switcher" 
                :checked="darkThemeEnabled"
                v-model="darkThemeEnabled"
                type="checkbox"
                class="
                    peer appearance-none w-11 h-6 rounded-full 
                    bg-primary-200 checked:bg-gray-600 cursor-pointer
                    transition-colors duration-300
                "
            />
            <label 
                for="theme-switcher"
                class="
                    absolute top-0 left-0 w-6 h-6
                    bg-white rounded-full border border-gray-300 shadow-sm
                    transition-transform duration-300 peer-checked:translate-x-6
                    peer-checked:border-gray-800 cursor-pointer
                "
            >  
                <div class="w-full h-full flex items-center justify-center">
                    <BaseIcon 
                        class="w-5 h-5"
                        icon="/icons/icon-dark-theme.svg"
                    />
                    <!-- <BaseIcon 
                        class="w-4 h-4"
                        icon="/icons/icon-light-theme.svg"
                    /> -->
                </div>
            </label>
        </div>
        <label v-if="!collapsed" for="theme-switcher" class="pl-4 hover:text-primary-400 cursor-pointer">Dark mode</label>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    /**
     * A flag to indicate if the sidebar is collapsed.
     */
    collapsed: boolean
}>();



const darkThemeEnabled = ref(true);

</script>

<style scoped>

</style>