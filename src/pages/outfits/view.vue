<!--
/*
 * File: view.vue
 * Project: wardrobe
 * Created Date: 2025-09-10 17:37:07
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-21 17:56:00
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
    <TitleBarBasic :backRedirectTo="outfitId == 'new' ? '/outfits' : '/outfits/view?id=' + thisOutfitId" v-if="editModeEnabled">
        <button class="flex items-center justify-center" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>


    <!-- Page content -->
    <div class="py-20">
        <div class="w-1/3 ml-0.5 mb-4 md:mb-8 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark">
            <p     v-if="!editModeEnabled" class="w-full py-1 px-3 select-none">{{ thisOutfit.title }}</p>
            <input v-if="editModeEnabled"  class="w-full py-1 px-3 rounded-md outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark transition-all" placeholder="Name" v-model.trim="thisOutfit.title" />
        </div>

        <div class="flex gap-4 md:gap-8 select-none" @change="changesMade = true">
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
                                    <button
                                        class="absolute p-1 z-20 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                        @click="removeClothing(thisItem.clothing)"
                                        title="Remove Item"
                                    >               <!-- Give this button a higher z-level than the close-popover-dummy to be able to delete clothes while the picker stays open -->
                                        <PhX class="size-5 text-red-500"></PhX>
                                    </button>
                                </div>

                                <img class="h-35 my-1.5 self-center" :src="thisItem.clothing.imgPath" :alt="'Image for ' + thisItem.clothing.title">
                                <label class="self-start font-semibold mx-1">{{ thisItem.clothing.title }}</label>
                            </div>
                        </div>
                    </div>

                    <!-- Add clothing to label button when in edit mode -->
                    <div class="relative flex flex-col justify-center items-center" v-if="editModeEnabled">
                        <div class="flex m-2 items-center">
                            <button
                                class="h-fit p-1 z-20 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all"
                                title="Add Item" @click="toggleClothingPicker(thisLabel.name)"
                            >           <!-- Give this button a higher z-level than the close-popover-dummy to be able to open another picker and close the current one at the same time, saving a click -->
                                <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                            </button>
                        </div>

                        <!-- Position dialog absolute to parent by setting parent to relative -->
                        <div v-if="clothingPickerIsOpen.find((e) => e.name == thisLabel.name)!.isOpen" class="absolute top-0 mt-33 transition-all"> <!-- TODO: top is necessary so box grows downward, which then requires that stupid mt... -->
                            <!-- Dummy filling the entire page to close popout when clicking on anything outside popout -->
                            <div class="fixed top-0 left-0 h-screen w-screen opacity-0" @click="toggleClothingPicker(thisLabel.name)"></div>

                            <div class="relative flex flex-col transition-all">

                                <!-- Triangle -->
                                <p class="self-center text-2xl -mb-1.5 text-bg-field-light dark:text-bg-field-dark">&#x25B2;</p>

                                <!-- Content -->
                                <dialog id="clothing-picker" class="relative flex flex-col items-center z-50 w-180 max-h-140 rounded-xl shadow-md dark:text-text-dark bg-bg-field-light dark:bg-bg-field-dark">

                                    <!-- Search and Close button -->
                                    <div class="flex w-full p-4 gap-4">
                                        <input
                                            class="w-full self-center py-1 px-3 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 transition-all"
                                            placeholder="Search"
                                            v-model.trim="searchStr"
                                            type="search"
                                        />

                                        <button
                                            class="w-fit self-center py-1 px-3 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-field-hover-light hover:dark:bg-bg-field-hover-dark hover:transition-all"
                                            @click="toggleClothingPicker(thisLabel.name)"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <!-- Clothes --> <!-- TODO: Does this picker for every label increase resource usage by a lot? -->
                                    <div class="grid grid-cols-3 gap-4 pb-5 overflow-y-scroll" v-if="getClothesToShowInPopout(thisLabel).length > 0"> <!-- TODO: overflow-y-scroll clips shadow -->
                                        <button
                                            class="flex flex-col h-55 aspect-square p-1 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-embed-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-embed-hover-dark hover:transition-all"
                                            v-for="thisClothing in getClothesToShowInPopout(thisLabel)"
                                            :key="thisClothing.id"
                                            @click="addClothing(thisClothing)"
                                        >
                                            <img class="h-35 my-1.5 self-center" :src="thisClothing.imgPath" :alt="'Image for ' + thisClothing.title">
                                            <label class="self-start font-semibold ml-2">{{ thisClothing.title }}</label>

                                            <!-- Labels --> <!-- TODO: Too many labels will probably clip out, allow x scroll? -->
                                            <div class="flex mt-1 ml-1">
                                                <div
                                                    class="w-fit rounded-xl shadow-md px-2 m-0.5 text-sm text-gray-100 bg-gray-400 dark:bg-gray-600"
                                                    v-for="thisLabel in thisClothing.labels"
                                                    :key="thisLabel.name"
                                                >
                                                    {{ thisLabel.name }}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <label class="self-start pl-5 pb-5" v-else>No items to show.</label>

                                </dialog>

                            </div>
                        </div>
                        <!-- End of clothing picker -->
                    </div>
                </div>
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
    import { defaultSortMode } from "~/model/sort-modes";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";


    // Refs
    const thisOutfit:     Ref<Outfit>     = ref({ id: "", title: "", clothes: [], addedTimestamp: 0, labels: [] });
    const thisOutfitId:   Ref<string>     = ref(thisOutfit.value ? thisOutfit.value.id : "new");
    const bodyPartLabels: Ref<Label[]>    = ref([]);
    const storedClothes:  Ref<Clothing[]> = ref([]); // Edit Mode only
    const searchStr:      Ref<string>     = ref("");

    // Check if edit mode is enabled based on if name of this route is outfits-view or outfits-edit
    const editModeEnabled = (useRoute().name == "outfits-edit");

    // Get ID of the outfit to view from query parameters
    const outfitId = useRoute().query.id || "new";

    // Redirect to edit page if view was opened with id new
    if (!editModeEnabled && outfitId == "new") useRouter().push("/outfits/edit?id=new");

    // Get all labels on page load
    let labelsRes = await useFetch<Label[]>("/api/get-all-labels");
    bodyPartLabels.value = labelsRes.data.value!.filter((e) => e.category.name == "body part");

    // Save open state for every clothing picker for every label
    const clothingPickerIsOpen = ref(Array.from({ length: bodyPartLabels.value.length }, (_, i) => ({ name: bodyPartLabels.value[i]?.name, isOpen: false })));


    // Get outfit
    onBeforeMount(async () => {
        if (outfitId != "new") {
            const res = await useFetch<Outfit>("/api/get-outfit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: outfitId
                })
            });

            thisOutfit.value = res.data.value!;
        }
    });


    // Get all clothes for clothing picker dialog when in edit mode. Do this after page load to reduce wait time, the picker is closed anyway
    if (editModeEnabled) {
        let res = await useFetch<Clothing[]>("/api/get-all-clothes");

        storedClothes.value = res.data.value!;
    }


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


    // Opens a new clothing picker or closes the current one for a label
    function toggleClothingPicker(labelName: string) {
        clothingPickerIsOpen.value.forEach((e, i) => {
            if (labelName == e.name) {
                clothingPickerIsOpen.value[i]!.isOpen = !clothingPickerIsOpen.value[i]!.isOpen; // Toggle this picker
            } else {
                clothingPickerIsOpen.value[i]!.isOpen = false;                                  // Close all other currently open pickers
            }
        });
    }


    // Add clothing to a label of this outfit
    function addClothing(clothing: Clothing) {
        thisOutfit.value.clothes.push({
            order: 0,
            clothing: clothing
        });
    }


    // Remove clothing from a label of this outfit
    function removeClothing(clothing: Clothing) {
        thisOutfit.value.clothes = thisOutfit.value.clothes.filter((e) => e.clothing.id != clothing.id);
    }


    // Gets items to show to in the popout for each label
    function getClothesToShowInPopout(thisLabel: Label) {
        // Get all clothes that have this body part label
        const clothesForThisLabel = getItemsToShow(storedClothes.value, defaultSortMode, [ thisLabel.name ]) as Clothing[];

        // Remove clothes that are already added to this outfit
        const clothesNotAddedYet = clothesForThisLabel.filter((e) => !thisOutfit.value?.clothes.some((f) => f.clothing.id == e.id));

        // Remove clothes that do not match search string
        const clothesMatchingSearch = clothesNotAddedYet.filter((e) => e.title.toLowerCase().includes(searchStr.value.toLowerCase())); // TODO: How much does this search suck compared to some guideline?

        return clothesMatchingSearch;
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
