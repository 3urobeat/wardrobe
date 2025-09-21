<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-21 17:34:22
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
    <TitleBarFull
        buttonRedirectTo="/clothing/edit?id=new"
        ref="titleBarFull"
    >
        <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
        Add Clothing
    </TitleBarFull>

    <div
        class="overflow-x-clip"
        :class="titleBarFull.selectedFilters?.length > 0 ? 'py-27 md:py-20' : 'py-20'"
    >

        <!-- Responsive grid for clothing - Thank you: https://stevekinney.com/courses/tailwind/grid-auto-fit-and-auto-fill-patterns -->
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(365px,_1fr))] gap-x-6 gap-y-10">

            <!-- Clothing -->
            <NuxtLink
                class="flex flex-col h-96 w-full lg:w-96 p-4 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisClothing in (getItemsToShow(storedClothing, titleBarFull.selectedSort, titleBarFull.selectedFilters) as Clothing[])"
                :key="thisClothing.id"
                :to="'/clothing/view?id=' + thisClothing.id"
            >
                <img class="w-fit h-50 sm:h-60 mb-1 self-center" :src="thisClothing.imgPath" :alt="'Image for ' + thisClothing.title">
                <label class="self-start font-semibold mb-1">{{ thisClothing.title }}</label>

                <!-- Filter Labels -->
                <div class="mt-4">
                    <button
                        class="w-fit rounded-xl shadow-md px-2 m-0.5 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                        :class="titleBarFull.selectedFilters.includes(thisLabel.name) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                        v-for="thisLabel in thisClothing.labels"
                        :key="thisLabel.name"
                        @click.prevent="titleBarFull.toggleFilter(thisLabel.name)"
                    >
                        {{ thisLabel.name }}
                    </button>
                </div>
            </NuxtLink>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhPlus } from "@phosphor-icons/vue";
    import TitleBarFull from "~/components/titleBarFull.vue";
    import type { Clothing } from "~/model/clothing";
    import { defaultSortMode, sortModes } from "~/model/sort-modes";


    // Cache
    const storedClothing: Ref<Clothing[]> = ref([]);

    // Get refs to props exported by defineExpose() in TitleBarFull
    const titleBarFull: Ref<{ selectedSort: sortModes, selectedFilters: string[], toggleFilter: (thisFilter: string) => void }> = ref({ selectedSort: defaultSortMode, selectedFilters: [], toggleFilter: () => {} }); // TODO: Can this be an exported type somewhere?


    // Get all clothing and their details on load
    let res = await useFetch<Clothing[]>("/api/get-all-clothes");

    storedClothing.value = res.data.value!;


    // Redirect to view page (or a popup?)
    function viewClothing(selectedClothing: Clothing) {

    }

</script>
