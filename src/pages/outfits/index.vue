<!--
/*
 * File: outfits.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:40:46
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-19 13:36:30
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
        <div class="grid grid-cols-[repeat(auto-fill,minmax(365px,1fr))] gap-x-6 gap-y-10">

            <!-- Outfit Cards -->
            <NuxtLink
                class="flex flex-col h-96 w-full lg:w-96 p-4 rounded-2xl shadow-lg cursor-pointer bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                v-for="thisOutfit in outfitsToShow"
                :key="thisOutfit.id"
                :to="'/outfits/view?id=' + thisOutfit.id"
            >
                <img
                    class="w-fit h-50 sm:h-60 mb-1 self-center"
                    :src="'data:image/png;base64,' + outfitImages.find((e) => e.id == thisOutfit.id)?.imgBlob"
                    :alt="'Image for ' + thisOutfit.title"
                >
                <label class="self-start font-semibold mb-1">{{ thisOutfit.title }}</label>

                <!-- Filter Labels --> <!-- TODO: Click goes through and triggers redirect -->
                <div class="mt-4">
                    <button
                        class="custom-wardrobe-label-clickable m-0.5"
                        :class="titleBarFull.selectedFilters.includes(thisLabel.id) ? 'custom-wardrobe-label-selected-outline' : ''"
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

    <div class="w-full flex justify-center items-center text-text-secondary-light dark:text-text-secondary-dark select-none"> <!-- TODO: Could be a little lower -->
        <!-- No items available text (DB empty) -->
        <label class="custom-label-primary flex items-center w-fit" v-if="storedOutfits.length == 0">
            <PhBinoculars class="shrink-0 mr-2"></PhBinoculars>
            It's empty here. Would you like to create an outfit?
        </label>

        <!-- Nothing to show text (Filter/Search matches no items) -->
        <label class="custom-label-primary flex items-center w-fit" v-else-if="outfitsToShow.length == 0">
            <PhMagnifyingGlass class="shrink-0 mr-2"></PhMagnifyingGlass>
            Nothing matches your search/filter...
        </label>
    </div>
</template>


<script setup lang="ts">
    import { PhBinoculars, PhMagnifyingGlass, PhPlus } from "@phosphor-icons/vue";
    import TitleBarFull from "~/components/titleBarFull.vue";
    import type { Label } from "~/model/label";
    import type { Outfit } from "~/model/outfit";
    import { defaultSortMode, type sortModes } from "~/model/sort-modes";


    // Get global cache from app.vue
    const storedLabels: Ref<Label[]> = useState("storedLabels");

    // Cache
    const storedOutfits: Ref<Outfit[]>                          = ref([]);
    const outfitImages:  Ref<{ id: string, imgBlob: string }[]> = ref([]);

    // Get refs to props exported by defineExpose() in TitleBarFull
    const titleBarFull: Ref<{ selectedSort: sortModes, selectedFilters: string[], toggleFilter: (thisFilter: string) => void }> = ref({ selectedSort: defaultSortMode, selectedFilters: [], toggleFilter: () => {} }); // TODO: Can this be an exported type somewhere?


    // Get all outfits and their details on load
    let res = await useFetch("/api/get-all-outfits");
    storedOutfits.value = res.data.value!; // TODO: Error handling

    // Load images for outfits // TODO: Lazy load
    storedOutfits.value.forEach(async (e) => {
        console.log(e.previewImgPath)
        outfitImages.value.push({
            id: e.id,
            imgBlob: await getImage(e.previewImgPath)
        })
    });

    // Pre-calculate items that should be shown. Can be accessed multiple times in template without re-calculation. Updates when sort/filter/search changes due to reactivity
    let outfitsToShow = computed(() => getItemsToShow(storedOutfits.value, titleBarFull.value.selectedSort, titleBarFull.value.selectedFilters) as Outfit[]);


    // Gets image from server
    async function getImage(imgPath: string) {
        if (!imgPath) return "";

        const res = await fetch("/api/get-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filePath: imgPath,
                width: 384
            })
        });

        return await res.text();
    }

</script>
