<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 17:28:24
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
    <div id="title" class="fixed w-full right-8 mb-5 lg:mb-7 pt-10 select-none">
        <!-- Add button -->
        <div class="flex justify-end items-center">
            <NuxtLink to="/clothing/add" class="flex items-center justify-center py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                Add Clothing
            </NuxtLink>
        </div>

        <!-- Add scaling slider -->
        <!-- TODO -->
    </div>

    <div class="pt-28 pb-10 px-8">

        <!-- Responsive grid for items - Thank you: https://stevekinney.com/courses/tailwind/grid-auto-fit-and-auto-fill-patterns -->
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(365px,_1fr))] gap-x-6 gap-y-10">

            <!-- Clothing Items --> <!-- TODO: This outer button must be something else, e.g. an anchor, to prevent the inner button applying its styling to the outer one. If this gets fixed, remove cursor-pointer from the anchor element. -->
            <a
                class="flex flex-col h-96 md:w-96 w-full p-4 rounded-2xl shadow-lg cursor-pointer bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisItem in storedItems"
                :key="thisItem.id"
                @click="viewItem(thisItem)"
            >
                <img class="w-fit h-60 mb-1 self-center" :src="thisItem.imgPath" alt="Image for '{{ thisItem.title }}'">
                <label class="self-start font-semibold mb-1">{{ thisItem.title }}</label>

                <!-- Filter Labels --> <!-- TODO: Align left instead of being centered-->
                <div class="mt-4">
                    <button class="w-fit rounded-xl px-2 m-0.5 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all" v-for="thisLabel in thisItem.labels" :key="thisLabel.id" @click="toggleFilter(thisLabel)">
                        {{ thisLabel.name }}
                    </button>
                </div>
            </a>

        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhPlus } from "@phosphor-icons/vue";
    import type { Item, Label } from "~/model/item";


    // Cache
    const storedItems:     Ref<Item[]>  = ref(null!);
    const selectedFilters: Ref<Label[]> = ref(null!);


    // Get all clothing and their details on load
    let res = await useFetch<Item[]>("/api/get-all-items");

    storedItems.value  = res.data.value!;


    // Redirect to add page
    async function addItem() {

    }

    // Redirect to view page (or a popup?)
    async function viewItem(selectedItem: Item) {

    }

    // Applies or removes a filter to/from the view
    async function toggleFilter(selectedFilter: Label) {

    }

</script>
