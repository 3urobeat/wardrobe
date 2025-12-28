<!--
/*
 * File: outfits.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:40:46
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 13:39:52
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
    <TitleBarFull
        buttonRedirectTo="/outfits/edit?id=new"
        ref="titleBarFull"
    >
        <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
        Add Outfit
    </TitleBarFull>

    <div
        class="overflow-x-clip"
        :class="titleBarFull.selectedFilters?.length > 0 ? 'py-27 md:py-20' : 'py-20'"
    >

        <!-- Responsive grid for outfits - Thank you: https://stevekinney.com/courses/tailwind/grid-auto-fit-and-auto-fill-patterns -->
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(365px,_1fr))] gap-x-6 gap-y-10">

            <!-- Outfit Cards -->
            <NuxtLink
                class="flex flex-col h-96 w-full lg:w-96 p-4 rounded-2xl shadow-lg cursor-pointer bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisOutfit in getItemsToShow(storedOutfits, titleBarFull.selectedSort, titleBarFull.selectedFilters) as Outfit[]"
                :key="thisOutfit.id"
                :to="'/outfits/view?id=' + thisOutfit.id"
            >
                <!-- <img class="w-fit h-50 sm:h-60 mb-1 self-center" :src="thisOutfit.imgPath" :alt="'Image for ' + thisOutfit.title"> --> <!-- TODO: Pre-render preview image from view page and display that here -->
                <label class="self-start font-semibold mb-1">{{ thisOutfit.title }}</label>

                <!-- Filter Labels --> <!-- TODO: Click goes through and triggers redirect -->
                <div class="mt-4">
                    <button
                        class="custom-wardrobe-label-clickable m-0.5"
                        :class="titleBarFull.selectedFilters.includes(thisLabel.name) ? 'custom-wardrobe-label-selected-outline' : ''"
                        v-for="thisLabel in storedLabels.filter((e) => thisOutfit.labelIDs.includes(e.id))"
                        :key="thisLabel.id"
                        @click.prevent="titleBarFull.toggleFilter(thisLabel.id)"
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
    import type { Category, Label } from "~/model/label";
    import type { Outfit } from "~/model/outfit";
    import { defaultSortMode, type sortModes } from "~/model/sort-modes";


    // Get global cache from app.vue
    const storedLabels:     Ref<Label[]>    = useState("storedLabels");
    //const storedCategories: Ref<Category[]> = useState("storedCategories");

    // Cache
    const storedOutfits: Ref<Outfit[]> = ref([]);

    // Get refs to props exported by defineExpose() in TitleBarFull
    const titleBarFull: Ref<{ selectedSort: sortModes, selectedFilters: string[], toggleFilter: (thisFilter: string) => void }> = ref({ selectedSort: defaultSortMode, selectedFilters: [], toggleFilter: () => {} }); // TODO: Can this be an exported type somewhere?


    // Get all outfits and their details on load
    let res = await useFetch("/api/get-all-outfits");
    storedOutfits.value = res.data.value!; // TODO: Error handling


    // Redirect to view page (or a popup?)
    async function viewOutfit(selectedItem: Outfit) {

    }

</script>
