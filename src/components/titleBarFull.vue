<!--
/*
 * File: titleBarFull.vue
 * Project: wardrobe
 * Created Date: 2025-09-17 17:25:36
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-25 12:00:03
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>

    <!-- TODO: Blur only size of components -->
    <div id="fixed-title" class="fixed flex flex-col right-0 top-20.5 w-full text-nowrap select-none p-1.5 px-3 md:px-7 rounded-2xl backdrop-blur-lg">

        <!-- Title Bar which is always displayed -->
        <div class="flex w-full justify-between md:justify-end gap-x-4">
            <!-- Sort dropdown -->
            <div class="flex justify-end overflow-scroll rounded-xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark">
                <select class="w-full px-2 m-0.5" v-model="selectedSort">
                    <option :value="sortModes.dateDesc">Date (Newest first)</option>
                    <option :value="sortModes.dateAsc">Date (Oldest first)</option>
                    <option :value="sortModes.nameDesc">Name (A-Z)</option>
                    <option :value="sortModes.nameAsc">Name (Z-A)</option>
                </select>
            </div>

            <!-- Filters selection for Desktop --> <!-- TODO: Does not want to scroll -->
            <div
                class="justify-end rounded-xl overflow-x-scroll shadow-md select-none gap-2 bg-bg-field-light dark:bg-bg-field-dark transition-all"
                :class="selectedFilters.length > 0 ? 'hidden md:flex w-0 md:w-full lg:w-1/3 p-1' : 'w-0 p-0'"
            >
                <button
                    class="custom-wardrobe-label-clickable"
                    :class="selectedFilters.includes(thisFilter.id) ? 'custom-wardrobe-label-selected-outline' : ''"
                    v-for="thisFilter in storedLabels.filter((e) => selectedFilters.includes(e.id))"
                    :key="thisFilter.id"
                    @click="toggleFilter(thisFilter.id)"
                >
                    {{ thisFilter.name }}
                </button>
            </div>

            <!-- Add button -->
            <NuxtLink :to="buttonRedirectTo" class="custom-button-primary">
                <slot></slot>
            </NuxtLink>

            <!-- Scaling slider -->
            <!-- TODO -->
        </div>


        <!-- Title bar extension that gets added on mobile -->
        <!-- TODO: Having to duplicate the entire filter selection sucks -->
        <div id="title-mobile-extension" v-if="selectedFilters.length > 0">
            <!-- Filters selection for Mobile --> <!-- TODO: Does not want to scroll -->
            <div
                class="justify-center rounded-xl overflow-x-scroll shadow-md select-none gap-2 bg-bg-field-light dark:bg-bg-field-dark transition-all"
                :class="selectedFilters.length > 0 ? 'flex md:hidden w-full md:w-0 lg:w-1/3 p-1 mt-3' : 'w-0 p-0'"
            >
                <button
                    class="custom-wardrobe-label-clickable text-sm"
                    :class="selectedFilters.includes(thisFilter.id) ? 'custom-wardrobe-label-selected-outline' : ''"
                    v-for="thisFilter in storedLabels.filter((e) => selectedFilters.includes(e.id))"
                    :key="thisFilter.id"
                    @click="toggleFilter(thisFilter.id)"
                >
                    {{ thisFilter.name }}
                </button>
            </div>
        </div>

    </div>

</template>


<script setup lang="ts">
    import type { Label } from '~/model/label';
    import { sortModes } from '~/model/sort-modes';


    // Get global cache from app.vue
    const storedLabels: Ref<Label[]> = useState("storedLabels");

    // Refs
    const selectedSort:    Ref<sortModes> = ref(sortModes.dateDesc);
    const selectedFilters: Ref<string[]>       = ref([]);


    /**
     * Applies or removes a filter to/from the view
     * @param thisFilter Filter to add/remove
     */
    const toggleFilter = (thisFilter: string) => {

        // Get all selected labels without this one
        const filtered = selectedFilters.value.filter((e: string) => e != thisFilter);

        // If length does not match, the label must be selected
        if (filtered.length != selectedFilters.value.length) {
            // ...and we can simply remove it without filtering again
            selectedFilters.value = filtered;

            console.log("DEBUG - toggleFilter: Disabled " + thisFilter);
        } else {
            // ...otherwise we can simply add it
            selectedFilters.value.push(thisFilter);

            console.log("DEBUG - toggleFilter: Enabled " + thisFilter);
        }

    }


    // Define Props to be accepted by this component
    defineProps({
        buttonRedirectTo: {
            type: String,
            required: true
        }
    });

    // Define stuff that can be accessed by the page
    defineExpose({
        selectedSort,
        selectedFilters,
        toggleFilter
    });

</script>
