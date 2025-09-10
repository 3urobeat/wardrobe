<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 16:37:09
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 - 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <div id="title" class="fixed flex justify-end w-full gap-4 right-8 mb-5 lg:mb-7 pt-10 select-none">
        <!-- Filters selection -->
        <div class="flex w-1/2 justify-end overflow-scroll rounded-xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark" v-if="selectedFilters.length > 0">
            <button
                class="w-fit rounded-xl px-2 m-1 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                :class="selectedFilters.includes(thisFilter) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                v-for="thisFilter in selectedFilters"
                :key="thisFilter"
                @click="toggleFilter(thisFilter)"
            >
                {{ thisFilter }}
            </button>
        </div>

        <!-- Sort dropdown -->
        <!-- TODO -->

        <!-- Add button -->
        <NuxtLink to="/clothing/add" class="flex items-center justify-center py-1 px-3 rounded-sm shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
            <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
            Add Clothing
        </NuxtLink>


        <!-- Scaling slider -->
        <!-- TODO -->
    </div>

    <div class="py-20">

        <!-- Responsive grid for items - Thank you: https://stevekinney.com/courses/tailwind/grid-auto-fit-and-auto-fill-patterns -->
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(365px,_1fr))] gap-x-6 gap-y-10">

            <!-- Clothing Items --> <!-- TODO: This outer button must be something else, e.g. an anchor, to prevent the inner button applying its styling to the outer one. If this gets fixed, remove cursor-pointer from the anchor element. -->
            <a
                class="flex flex-col h-96 lg:w-96 w-full p-4 rounded-2xl shadow-lg cursor-pointer bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisItem in storedItems.filter(e => e.labels.some(f => selectedFilters.length > 0 ? selectedFilters.includes(f.name) : true))"
                :key="thisItem.id"
                @click="viewItem(thisItem)"
            >
                <img class="w-fit h-60 mb-1 self-center" :src="thisItem.imgPath" alt="Image for '{{ thisItem.title }}'">
                <label class="self-start font-semibold mb-1">{{ thisItem.title }}</label>

                <!-- Filter Labels -->
                <div class="mt-4">
                    <button
                        class="w-fit rounded-xl px-2 m-0.5 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                        :class="selectedFilters.includes(thisLabel.name) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                        v-for="thisLabel in thisItem.labels"
                        :key="thisLabel.name"
                        @click="toggleFilter(thisLabel.name)"
                    >
                        {{ thisLabel.name }}
                    </button>
                </div>
            </a>

        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhPlus } from "@phosphor-icons/vue";
    import type { Item } from "~/model/item";
    import type { Label } from "~/model/label";


    // Cache
    const storedItems:     Ref<Item[]>  = ref([]);
    const selectedFilters: Ref<string[]> = ref([]);


    // Get all clothing and their details on load
    let res = await useFetch<Item[]>("/api/get-all-items");

    storedItems.value  = res.data.value!;


    // Redirect to view page (or a popup?)
    async function viewItem(selectedItem: Item) {

    }

    // Applies or removes a filter to/from the view
    async function toggleFilter(selectedFilter: string) {
        console.log("DEBUG - index: Toggling filter " + selectedFilter);

        // Get all selected labels without this one
        const filtered = selectedFilters.value.filter((e) => e != selectedFilter);

        // If length does not match, the label must be selected
        if (filtered.length != selectedFilters.value.length) {
            // ...and we can simply remove it without filtering again
            selectedFilters.value = filtered;
        } else {
            // ...otherwise we can simply add it
            selectedFilters.value.push(selectedFilter);
        }
    }

</script>
