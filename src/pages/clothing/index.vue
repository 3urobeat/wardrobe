<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 14:06:25
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
        <div class="grid grid-cols-[repeat(auto-fill,minmax(365px,1fr))] gap-x-6 gap-y-10">

            <!-- Clothing Cards -->
            <NuxtLink
                class="flex flex-col h-96 w-full lg:w-96 p-4 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisClothing in clothesToShow"
                :key="thisClothing.id"
                :to="'/clothing/view?id=' + thisClothing.id"
            >
                <img
                    class="w-fit h-50 sm:h-60 mb-1 self-center"
                    :src="'data:image/png;base64,' + clothingImages.find((e) => e.id == thisClothing.id)?.imgBlob"
                    :alt="'Image for ' + thisClothing.title"
                >
                <label class="self-start font-semibold mb-1">{{ thisClothing.title }}</label>

                <!-- Labels -->
                <div class="mt-4">
                    <button
                        class="custom-wardrobe-label-clickable m-0.5"
                        :class="titleBarFull.selectedFilters.includes(thisLabel.id) ? 'custom-wardrobe-label-selected-outline' : ''"
                        v-for="thisLabel in storedLabels.filter((e) => thisClothing.labelIDs.includes(e.id))"
                        :key="thisLabel.id"
                        @click.prevent="titleBarFull.toggleFilter(thisLabel.id)"
                    >
                        {{ thisLabel.name }}
                    </button>
                </div>
            </NuxtLink>

        </div>

    </div>

    <div class="w-full flex justify-center items-center text-text-secondary-light dark:text-text-secondary-dark select-none"> <!-- TODO: Could be a little lower -->
        <!-- No items available text (DB empty) -->
        <label class="custom-label-primary flex items-center w-fit" v-if="storedClothing.length == 0">
            <PhBinoculars class="shrink-0 mr-2"></PhBinoculars>
            It's empty here. Would you like to add a piece of clothing?
        </label>

        <!-- Nothing to show text (Filter/Search matches no items) -->
        <label class="custom-label-primary flex items-center w-fit" v-else-if="clothesToShow.length == 0">
            <PhMagnifyingGlass class="shrink-0 mr-2"></PhMagnifyingGlass>
            Nothing matches your search/filter...
        </label>
    </div>
</template>


<script setup lang="ts">
    import { PhBinoculars, PhMagnifyingGlass, PhPlus } from "@phosphor-icons/vue";
    import TitleBarFull from "~/components/titleBarFull.vue";
    import type { Clothing } from "~/model/clothing";
    import type { Label } from "~/model/label";
    import { defaultSortMode, sortModes } from "~/model/sort-modes";


    // Get global cache from app.vue
    const storedLabels: Ref<Label[]> = useState("storedLabels");

    // Cache
    const storedClothing: Ref<Clothing[]>                        = ref([]);
    const clothingImages: Ref<{ id: string, imgBlob: string }[]> = ref([]);

    // Get refs to props exported by defineExpose() in TitleBarFull
    const titleBarFull: Ref<{ selectedSort: sortModes, selectedFilters: string[], toggleFilter: (thisFilter: string) => void }> = ref({ selectedSort: defaultSortMode, selectedFilters: [], toggleFilter: () => {} }); // TODO: Can this be an exported type somewhere?


    // Get all clothing and their details on load
    let res = await useFetch("/api/get-all-clothes");
    storedClothing.value = res.data.value!; // TODO: Error handling

    // Load images for clothes // TODO: Lazy load
    storedClothing.value.forEach(async (e) => {
        clothingImages.value.push({
            id: e.id,
            imgBlob: await getImage(e.imgPath)
        })
    });

    // Pre-calculate items that should be shown. Can be accessed multiple times in template without re-calculation. Updates when sort/filter/search changes due to reactivity
    let clothesToShow = computed(() => getItemsToShow(storedClothing.value, titleBarFull.value.selectedSort, titleBarFull.value.selectedFilters) as Clothing[]);


    // Gets image from server
    async function getImage(imgPath: string) {
        if (!imgPath) return "";

        const res = await fetch("/api/get-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filePath: imgPath
            })
        });

        return await res.text();
    }

</script>
