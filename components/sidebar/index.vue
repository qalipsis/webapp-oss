<template>
    <div 
        class="flex-grow-0 flex-shrink-0 relative border-r border-solid border-gray-100 dark:border-gray-800 transition-all duration-200 bg-white dark:bg-gray-950 dark:text-gray-50"
        :class="{
            'basis-60': !collapsed,
            'basis-20': collapsed
        }"
    >
        <div 
            class="absolute top-10 w-8 h-8 flex items-center justify-center cursor-pointer border border-solid border-gray-100 dark:border-gray-800 rounded-full bg-white dark:bg-gray-900"
            :class="{
                'left-56': !collapsed,
                'left-16': collapsed
            }"
            @click="collapsed = !collapsed">
            <BaseIcon :icon="collapsedIcon" />
        </div>
        <nav class="h-screen flex flex-col justify-between">
            <SidebarMenuItems
                :menu-items="menuItems"
                :collapsed="collapsed"
            />
            <div>
                <SidebarThemeToggleButton
                    :collapsed="collapsed"
                />
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
const menuItems = SidebarHelper.getMenuItems();
const collapsed = ref(false);

const collapsedIcon = computed(() => {
    return collapsed.value ? "/icons/icon-arrow-right-light-black.svg" : "/icons/icon-arrow-left-light-black.svg";
})

</script>
