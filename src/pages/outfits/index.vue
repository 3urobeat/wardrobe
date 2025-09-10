<!--
/*
 * File: outfits.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:40:46
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 22:25:02
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <!-- TODO: Blur only size of components -->
    <div id="fixed-title" class="fixed flex flex-col right-0 top-20.5 w-full text-nowrap select-none p-1.5 px-3 md:px-7 gap-y-3 rounded-2xl backdrop-blur-lg">
        <div class="flex w-full justify-between md:justify-end gap-x-4">
            <!-- Sort dropdown -->
            <div class="flex justify-end overflow-scroll rounded-xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark">
                <select class="w-full px-2 m-0.5" v-model="selectedSort">
                    <option value="date-desc">Date (Newest first)</option>
                    <option value="date-asc">Date (Oldest first)</option>
                    <option value="name-desc">Name (A-Z)</option>
                    <option value="name-asc">Name (Z-A)</option>
                </select>
            </div>

            <!-- Filters selection for Desktop --> <!-- TODO: Does not want to scroll -->
            <div class="flex justify-end rounded-xl overflow-x-scroll shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark transition-all" :class="selectedFilters.length > 0 ? 'h-0 md:h-fit w-0 md:w-full lg:w-1/3' : 'w-0 invisible'">
                <button
                    class="rounded-xl px-2 m-1 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                    :class="selectedFilters.includes(thisFilter) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                    v-for="thisFilter in selectedFilters"
                    :key="thisFilter"
                    @click="toggleFilter(thisFilter)"
                >
                    {{ thisFilter }}
                </button>
            </div>

            <!-- Add button -->
            <NuxtLink to="/outfits/edit?id=new" class="flex items-center justify-center py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                Add Outfit
            </NuxtLink>

            <!-- Scaling slider -->
            <!-- TODO -->
        </div>

        <!-- TODO: Having to duplicate the entire filter selection sucks -->
        <div id="title-mobile-extension" v-if="selectedFilters.length > 0">
            <!-- Filters selection for Mobile --> <!-- TODO: Does not want to scroll -->
            <div class="flex justify-center rounded-xl overflow-x-scroll shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark transition-all" :class="selectedFilters.length > 0 ? 'h-fit md:h-0 w-full md:w-0 lg:w-1/3' : 'w-0 invisible'">
                <button
                    class="rounded-xl px-2 m-1 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                    :class="selectedFilters.includes(thisFilter) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                    v-for="thisFilter in selectedFilters"
                    :key="thisFilter"
                    @click="toggleFilter(thisFilter)"
                >
                    {{ thisFilter }}
                </button>
            </div>
        </div>
    </div>

    <div class="overflow-x-clip" :class="selectedFilters.length > 0 ? 'py-27 md:py-20' : 'py-20'">

        <!-- Responsive grid for items - Thank you: https://stevekinney.com/courses/tailwind/grid-auto-fit-and-auto-fill-patterns -->
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(365px,_1fr))] gap-x-6 gap-y-10">

            <!-- Clothing Items -->
            <NuxtLink
                class="flex flex-col h-96 w-full lg:w-96 p-4 rounded-2xl shadow-lg cursor-pointer bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisOutfit in getItemsToShow()"
                :key="thisOutfit.id"
                :to="'/outfits/view?id=' + thisOutfit.id"
            >
                <!-- <img class="w-fit h-50 sm:h-60 mb-1 self-center" :src="thisOutfit.imgPath" alt="Image for '{{ thisItem.title }}'"> --> <!-- TODO -->
                <label class="self-start font-semibold mb-1">{{ thisOutfit.title }}</label>

                <!-- Filter Labels --> <!-- TODO: Click goes through and triggers redirect -->
                <div class="mt-4">
                    <button
                        class="w-fit rounded-xl shadow-md px-2 m-0.5 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                        :class="selectedFilters.includes(thisLabel.name) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                        v-for="thisLabel in thisOutfit.labels"
                        :key="thisLabel.name"
                        @click="toggleFilter(thisLabel.name)"
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
    import type { Item } from "~/model/item";
    import type { Outfit } from "~/model/outfit";


    // Cache
    const storedOutfits:   Ref<Outfit[]> = ref([]);
    const selectedSort:    Ref<string>   = ref("date-desc");
    const selectedFilters: Ref<string[]> = ref([]);


    // Get all clothing and their details on load
    let res = await useFetch<Outfit[]>("/api/get-all-outfits");

    storedOutfits.value  = res.data.value!;


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

    // Returns items to display sorted & filtered
    function getItemsToShow() {
        let items: Outfit[] = storedOutfits.value;

        // Apply filter
        if (selectedFilters.value.length > 0) {
            items = storedOutfits.value.filter(e => e.labels.some(f => selectedFilters.value.includes(f.name)));
        }

        // Apply sort to storedItems
        switch (selectedSort.value) {
            case "date-desc":
                items = items.sort((a, b) => b.addedTimestamp - a.addedTimestamp);
                break;

            case "date-asc":
                items = items.sort((a, b) => a.addedTimestamp - b.addedTimestamp);
                break;

            case "name-desc":
                items = items.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
                break;

            case "name-asc":
                items = items.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0));
                break;

            default:
                break; // Sorted by ID, invisible to user
        }

        return items;
    }

</script>
