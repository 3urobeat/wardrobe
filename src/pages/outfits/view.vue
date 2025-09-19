<!--
/*
 * File: view.vue
 * Project: wardrobe
 * Created Date: 2025-09-10 17:37:07
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-19 18:02:20
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<!--
    This file contains both routes outfits-view & outfits-edit and toggles related components to de-duplicate code.
    The relevant re-route is configured in nuxt.config.ts.
-->


<template>

    <!-- Title Bar for view -->
    <TitleBarBasic backRedirectTo="/outfits" v-if="!editModeEnabled">
        <NuxtLink :to="'/outfits/edit?id=' + thisOutfitId" class="flex items-center justify-center">
            <PhPencil class="mr-2 size-5"></PhPencil>
            Edit
        </NuxtLink>
    </TitleBarBasic>

    <!-- Title bar for edit -->
    <TitleBarBasic :backRedirectTo="'/outfits/view?id=' + thisOutfitId" v-if="editModeEnabled">
        <button class="flex items-center justify-center" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>


    <!-- Page content -->
    <div class="flex py-20 gap-4 md:gap-8 select-none" @change="changesMade = true">
        <!-- Preview container --> <!-- TODO: Highlight item here when hovering it in the label container? -->
        <div class="w-1/3 rounded-xl shadow-md bg-bg-embed-light dark:bg-bg-embed-dark">
        </div>

        <!-- Clothes per label container -->
        <div class="flex flex-col gap-4 md:gap-8 w-2/3">
            <div class="flex w-full h-65 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all" v-for="thisLabel in bodyPartLabels" :key="thisLabel.id">
                <div>
                    <!-- Title -->
                    <div class="w-fit px-2 m-2 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                        {{ thisLabel.name }}
                    </div>

                    <!-- Clothes of this label -->
                    <div class="flex h-50 mx-2 overflow-x-scroll"> <!-- TODO: Make clothes clickable in view mode to view them -->
                        <div
                            class="flex flex-col w-55 shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                            v-for="thisItem in (thisOutfit ? thisOutfit.clothes.filter((e) => e.clothing.labels.some((f: Label) => f.id == thisLabel.id)) : [])"
                            :key="thisItem.order"
                        >
                            <!-- Label title bar when in edit mode, let it clip over the image -->
                            <div class="flex w-full mt-2 -mb-2 justify-end" v-if="editModeEnabled">
                                <button class="absolute p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="removeClothing(thisLabel, thisItem.clothing)" title="Remove Item">
                                    <PhX class="size-5 text-red-500"></PhX>
                                </button>
                            </div>

                            <img class="h-35 my-1.5 self-center" :src="thisItem.clothing.imgPath" :alt="'Image for ' + thisItem.clothing.title">
                            <label class="self-start font-semibold mx-1">{{ thisItem.clothing.title }}</label>
                        </div>
                    </div>
                </div>

                <!-- Add clothing to label button when in edit mode -->
                <div class="flex m-2 items-center" v-if="editModeEnabled">
                    <button class="h-fit p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" title="Add Item">
                        <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                    </button>
                </div>
                <!-- TODO: Implement clothing picker -->
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">
    import { PhCheck, PhPencil, PhPlus, PhX } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import type { Label } from "~/model/label";
    import type { Clothing } from "~/model/clothing";
    import type { Outfit } from "~/model/outfit";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";


    // Refs
    const thisOutfit:     Ref<Outfit>  = ref(null!);
    const thisOutfitId:   Ref<string>  = ref(thisOutfit.value ? thisOutfit.value.id : "new");
    const bodyPartLabels: Ref<Label[]> = ref([]);

    // Check if edit mode is enabled based on if name of this route is outfits-view or outfits-edit
    const editModeEnabled = (useRoute().name == "outfits-edit");

    // Get ID of the outfit to view from query parameters
    const clothingId = useRoute().query.id;

    // Get all labels on page load
    let labelsRes = await useFetch<Label[]>("/api/get-all-labels");
    bodyPartLabels.value = labelsRes.data.value!.filter((e) => e.category.name == "body part");


    // Get outfit
    onBeforeMount(async () => {

        const res = await useFetch<Outfit>("/api/get-outfit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: clothingId
            })
        });

        thisOutfit.value = res.data.value!;

    });


    // Track if user made changes when in edit mode
    const changesMade = ref(false);

    onBeforeRouteLeave((to, from, next) => {
        if (editModeEnabled && changesMade.value) {
            if (!confirm("You have unsaved changes!\nWould you still like to continue?")) {
                next(false);
            }
        }

        next();
    });


    // Remove clothing from a label of this outfit
    async function removeClothing(label: Label, clothing: Clothing) {

    }


    // Sends changes to the database in edit mode
    async function saveChanges() {

        // Indicate success/failure
        /* if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        } */

    }

</script>
