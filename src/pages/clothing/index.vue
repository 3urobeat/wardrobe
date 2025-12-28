<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 13:48:21
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
                v-for="thisClothing in (getItemsToShow(storedClothing, titleBarFull.selectedSort, titleBarFull.selectedFilters) as Clothing[])"
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
</template>


<script setup lang="ts">
    import { PhPlus } from "@phosphor-icons/vue";
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
