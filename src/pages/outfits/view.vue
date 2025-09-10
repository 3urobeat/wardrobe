<!--
/*
 * File: view.vue
 * Project: wardrobe
 * Created Date: 2025-09-10 17:37:07
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 22:15:59
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
    <!-- Page title bar -->
    <div id="title" class="flex w-full select-none">
        <div class="flex justify-start">
            <NuxtLink to="/outfits" class="flex items-center justify-center h-8 py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhCaretLeft class="size-5 text-text-light dark:text-text-dark"></PhCaretLeft>
            </NuxtLink>
        </div>

        <div class="flex w-full justify-end">
            <NuxtLink :to="'/outfits/edit?id=' + (thisOutfit ? thisOutfit.id : 'new')" class="flex items-center justify-center h-8 py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhPencil class="mr-2 size-5"></PhPencil>
                Edit
            </NuxtLink>
        </div>
    </div>

    <div class="flex py-12 gap-4 md:gap-8 select-none">
        <!-- Preview container -->
        <div class="w-1/3 rounded-xl shadow-md bg-bg-embed-light dark:bg-bg-embed-dark">
        </div>

        <div class="flex flex-col gap-4 md:gap-8 w-2/3">
            <div class="flex w-full h-60 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all" v-for="thisLabel in bodyPartLabels" :key="thisLabel.id">
                <div>
                    <!-- Title -->
                    <div class="w-fit px-1 m-2 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                        {{ thisLabel.name }}
                    </div>

                    <!-- Clothes of this label -->
                    <div class="flex h-44 mx-2 overflow-x-scroll"> <!-- TODO: I don't like the hardcoded height but h-full glitches out of the box? Also changing any width breaks scroll overflow? -->
                        <div
                            class="shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                            v-for="thisItem in thisOutfit ? thisOutfit.items.filter(e => e.item.labels.some(f => f.id == thisLabel.id)) : []"
                            :key="thisItem.order"
                        >
                            <!-- Label title bar -->
                            <div class="flex w-full mt-2 mb-1 justify-end">
                                <button class="flex p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="removeItem(thisLabel, thisItem.item)" title="Remove Item">
                                    <PhX class="size-5 text-red-500"></PhX>
                                </button>
                            </div>

                            <img class="mb-1 self-center" :src="thisItem.item.imgPath" :alt="'Image for ' + thisItem.item.title">
                            <label class="self-start font-semibold mb-1">{{ thisItem.item.title }}</label>
                        </div>
                    </div>
                </div>

                <!-- Add clothing to label button -->
                <div class="flex m-2 items-center">
                    <button class="h-fit p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" title="Add Item">
                        <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                    </button>
                </div>
                <!-- TODO: Implement item picker -->
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCaretLeft, PhPencil, PhPlus, PhX } from "@phosphor-icons/vue";
    import type { Item } from "~/model/item";
    import type { Label } from "~/model/label";
    import type { Outfit } from "~/model/outfit";


    // Refs
    const thisOutfit:     Ref<Outfit>  = ref(null!);
    const bodyPartLabels: Ref<Label[]> = ref([]);

    // Get ID of the outfit to view from query parameters
    const itemId = useRoute().query.id;

    // Get outfit
    onBeforeMount(async () => {

        const res = await useFetch<Outfit>("/api/get-outfit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: itemId
            })
        });

        thisOutfit.value = res.data.value!;

    });


    // Get all labels on page load
    let labelsRes = await useFetch<Label[]>("/api/get-all-labels");
    bodyPartLabels.value = labelsRes.data.value!.filter((e) => e.category.name == "body part");


    // Remove item from a label of this outfit
    async function removeItem(label: Label, item: Item) {

    }

</script>
