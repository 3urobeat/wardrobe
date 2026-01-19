<!--
/*
 * File: view.vue
 * Project: wardrobe
 * Created Date: 2025-09-10 17:37:07
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-19 19:42:16
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
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
        <NuxtLink :to="'/outfits/edit?id=' + (thisOutfit ? thisOutfit.id : 'new')" class="custom-button-primary">
            <PhPencil class="mr-2 size-5"></PhPencil>
            Edit
        </NuxtLink>
    </TitleBarBasic>

    <!-- Title bar for edit -->
    <TitleBarBasic :backRedirectTo="outfitId == 'new' ? '/outfits' : '/outfits/view?id=' + (thisOutfit ? thisOutfit.id : 'new')" v-if="editModeEnabled">
        <template v-slot:secondary v-if="outfitId != 'new'">
            <button class="custom-button-primary" @click="deleteOutfit">
                <PhTrash class="mr-2 size-5 text-red-600"></PhTrash>
                Delete
            </button>
        </template>

        <button class="custom-button-primary" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>


    <!-- Page content -->
    <div class="py-20" @change="changesMade = true">
        <div class="flex mb-4 md:mb-8 justify-between">
            <!-- Outfit title -->
            <div class="w-1/3 ml-0.5">
                <p     v-if="!editModeEnabled" class="custom-label-primary w-full">{{ thisOutfit.title }}</p>
                <input v-if="editModeEnabled"  class="custom-input-secondary w-full" placeholder="Name" v-model.trim="thisOutfit.title" />
            </div>

            <!-- Label selector bar with expanding popup -->
            <div class="flex justify-end rounded-md overflow-x-scroll shadow-md select-none p-1 gap-x-1.5 bg-bg-field-light dark:bg-bg-field-dark transition-all w-full lg:w-1/2">
                <!-- Selected labels list -->
                <p
                    class="custom-wardrobe-label"
                    v-for="thisLabel in storedLabels.filter((e: Label) => thisOutfit.labelIDs.includes(e.id))"
                    :key="thisLabel.id"
                    v-if="!editModeEnabled"
                >
                    {{ thisLabel.name }}
                </p>

                <button
                    class="custom-wardrobe-label-clickable"
                    :class="thisOutfit.labelIDs.includes(thisLabel.id) ? 'custom-wardrobe-label-selected-outline' : ''"
                    v-for="thisLabel in storedLabels.filter((e) => thisOutfit.labelIDs.includes(e.id))"
                    :key="thisLabel.id"
                    @click="toggleLabel(thisLabel)"
                    v-if="editModeEnabled"
                >
                    {{ thisLabel.name }}
                </button>

                <!-- Labels selector popout -->
                <PickerDialog
                    toggleText="Open labels selector"
                    hideSearch
                >
                    <template v-slot:toggle>
                        <PhCaretDown class="self-center mx-2 size-5"></PhCaretDown>
                    </template>

                    <!-- TODO: Overflows screen width due to being centered to right aligned CaretDown -->
                    <template v-slot:items>
                        <!-- Separate labels by category -->
                        <div class="flex w-180 max-h-140 my-1.5 gap-1.5" v-for="thisCategory in storedCategories" :key="thisCategory.id">
                            <div class="custom-label-primary py-0! px-2!">
                                {{ thisCategory.name }}:
                            </div>

                            <!-- List all labels for this category -->
                            <p
                                class="custom-wardrobe-label"
                                v-for="thisLabel in storedLabels.filter((e: Label) => thisOutfit.labelIDs.includes(e.id) && e.categoryID == thisCategory.id)"
                                :key="thisLabel.id"
                                v-if="!editModeEnabled"
                            >
                                {{ thisLabel.name }}
                            </p>

                            <button
                                class="custom-wardrobe-label-clickable"
                                :class="thisOutfit.labelIDs.some((e) => e == thisLabel.id) ? 'custom-wardrobe-label-selected-outline' : ''"
                                v-for="thisLabel in storedLabels.filter((e: Label) => e.categoryID == thisCategory.id)"
                                :key="thisLabel.id"
                                @click="toggleLabel(thisLabel)"
                                v-if="editModeEnabled"
                            >
                                {{ thisLabel.name }}
                            </button>
                        </div>
                    </template>
                </PickerDialog>
            </div>
        </div>

        <div class="flex gap-4 md:gap-8 select-none">
            <!-- Preview container --> <!-- TODO: Highlight item here when hovering it in the label container? -->
            <div class="w-1/3 min-h-90 rounded-xl shadow-md bg-bg-embed-light dark:bg-bg-embed-dark">
            </div>

            <!-- Clothes per label container -->
            <div class="flex flex-col gap-4 md:gap-8 w-2/3">
                <div class="flex w-full h-65 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all" v-for="thisLabel in bodyPartLabels" :key="thisLabel.id">
                    <div>
                        <!-- Title -->
                        <div class="custom-label-primary w-fit py-0! px-2! m-2">
                            {{ thisLabel.name }}
                        </div>

                        <!-- Clothes of this label -->
                        <div class="flex h-50 mx-2 overflow-x-scroll"> <!-- TODO: Make clothes clickable in view mode to view them -->
                            <div
                                class="flex flex-col w-55 shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                                v-for="thisClothing in storedClothes.filter((e) => thisOutfit.clothes.some((f) => f.clothingID == e.id) && e.labelIDs.includes(thisLabel.id))"
                                :key="thisClothing.id"
                            >
                                <!-- Label title bar when in edit mode, let it clip over the image -->
                                <div class="flex w-full mt-2 -mb-2 justify-end" v-if="editModeEnabled">
                                    <button
                                        class="absolute z-20 custom-button-icon-only"
                                        @click="removeClothing(thisClothing.id)"
                                        title="Remove Item"
                                    >               <!-- Give this button a higher z-level than the close-popover-dummy to be able to delete clothes while the picker stays open -->
                                        <PhX class="size-5 text-red-500"></PhX>
                                    </button>
                                </div>

                                <img class="h-35 my-1.5 self-center" :src="'data:image/png;base64,' + clothingImages.find((e) => e.id == thisClothing.id)?.imgBlob" :alt="'Image for ' + thisClothing.title">
                                <label class="self-start font-semibold mx-1">{{ thisClothing.title }}</label>
                            </div>
                        </div>
                    </div>

                    <!-- Add clothing to label button when in edit mode -->
                    <div class="self-center mt-8" v-if="editModeEnabled">  <!-- TODO: Does this picker for every label increase resource usage by a lot? -->
                        <PickerDialog
                            toggleText="Add Item"
                        >
                            <!-- This is the element that will be displayed in the open/close button -->
                            <template v-slot:toggle>
                                <div class="custom-button-icon-only">
                                    <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                                </div>
                            </template>

                            <!-- Items area -->
                            <template v-slot:items="slotProps">
                                <div class="w-180 max-h-140 grid grid-cols-3 gap-4 overflow-y-scroll"> <!-- TODO: overflow-y-scroll clips shadow -->
                                    <button
                                        class="flex flex-col h-55 aspect-square p-1 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-embed-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-embed-hover-dark hover:transition-all"
                                        v-for="thisClothing in getClothesToShowInPopout(thisLabel, slotProps.searchStr)"
                                        :key="thisClothing.id"
                                        @click="addClothing(thisClothing.id)"
                                    >
                                        <img class="h-35 my-1.5 self-center" :src="'data:image/png;base64,' + clothingImages.find((e) => e.id == thisClothing.id)?.imgBlob" :alt="'Image for ' + thisClothing.title">
                                        <label class="self-start font-semibold ml-2">{{ thisClothing.title }}</label>

                                        <!-- Labels --> <!-- TODO: Too many labels will probably clip out, allow x scroll? -->
                                        <div class="flex mt-1 ml-1">
                                            <div
                                                class="custom-wardrobe-label"
                                                v-for="thisLabel in storedLabels.filter((e) => thisClothing.labelIDs.includes(e.id))"
                                                :key="thisLabel.name"
                                            >
                                                {{ thisLabel.name }}
                                            </div>
                                        </div>
                                    </button>

                                    <label class="self-start pl-5 pb-5" v-if="getClothesToShowInPopout(thisLabel, slotProps.searchStr).length == 0">No items to show.</label>
                                </div>
                            </template>
                        </PickerDialog>
                    </div>
                </div>

                <div v-if="!bodyPartsCategory" class="flex h-full justify-center items-center text-text-secondary-light dark:text-text-secondary-dark select-none">
                    <!-- No items available text (DB empty) -->
                    <label class="custom-label-primary flex items-center w-fit">
                        <PhBinoculars class="shrink-0 mr-2"></PhBinoculars>
                        It looks like there is no label category marked with speciality 'Body Part' yet!
                    </label>
                </div>
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">
    import { PhCheck, PhPencil, PhPlus, PhX, PhCaretDown, PhTrash, PhBinoculars } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import PickerDialog from "~/components/pickerDialog.vue";
    import { sortLabelsList, type Label } from "~/model/label";
    import { getLabelsOfCategory, type Category } from "~/model/label-category";
    import { CategorySpecialityID } from "~/model/label-category-speciality";
    import type { Clothing } from "~/model/clothing";
    import type { Outfit } from "~/model/outfit";
    import { defaultSortMode } from "~/model/sort-modes";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";


    // Get global cache from app.vue
    const storedLabels:     Ref<Label[]> = useState("storedLabels");
    const storedCategories: Ref<Category[]>     = useState("storedCategories");

    // Refs
    const thisOutfit:     Ref<Outfit>         = ref({ id: "", title: "", clothes: [], labelIDs: [], previewImgPath: "", addedTimestamp: 0, modifiedTimestamp: 0 });
    const bodyPartLabels: Ref<Label[]> = ref([]);
    const storedClothes:  Ref<Clothing[]>     = ref([]); // Edit Mode only
    const clothingImages: Ref<{ id: string, imgBlob: string }[]> = ref([]); // Edit Mode only


    // Check if edit mode is enabled based on if name of this route is outfits-view or outfits-edit
    const editModeEnabled = (useRoute().name == "outfits-edit");

    // Get ID of the outfit to view from query parameters
    const outfitId = useRoute().query.id || "new";

    // Redirect to edit page if view was opened with id new
    if (!editModeEnabled && outfitId == "new") useRouter().push("/outfits/edit?id=new");

    // Get all labels on page load
    const bodyPartsCategory = storedCategories.value.find((e) => e.specialityID == CategorySpecialityID.Body_Part);

    if (bodyPartsCategory) {
        bodyPartLabels.value = sortLabelsList(getLabelsOfCategory(storedLabels.value!, bodyPartsCategory?.id));
    }


    // Get outfits and their data
    let clothingRes = await useFetch("/api/get-all-clothes");
    storedClothes.value = clothingRes.data.value!; // TODO: Error handling

    // Get outfit data if not new
    if (outfitId != "new") {
        const outfitRes = await useFetch("/api/get-outfit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: outfitId
            })
        });

        thisOutfit.value = outfitRes.data.value!; // TODO: Error handling
    }

    // Load images for clothes // TODO: Lazy load
    onMounted(() => {
        storedClothes.value.forEach(async (e) => {
            clothingImages.value.push({
                id: e.id,
                imgBlob: await getImage(e.imgPath)
            })
        });
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
                width: 256
            })
        });

        return await res.text();
    }


    // Add clothing to a label of this outfit
    function addClothing(id: string) {
        thisOutfit.value.clothes.push({
            order: 0,       // TODO: Order
            clothingID: id
        });

        changesMade.value = true;
    }


    // Remove clothing from a label of this outfit
    function removeClothing(id: string) {
        thisOutfit.value.clothes = thisOutfit.value.clothes.filter((e) => e.clothingID != id);

        changesMade.value = true;
    }


    // Gets items to show to in the popout for each label
    function getClothesToShowInPopout(thisLabel: Label, searchStr: string = "") {
        // Get all clothes that have this body part label
        const clothesForThisLabel = getItemsToShow(storedClothes.value, defaultSortMode, [ thisLabel.id ]) as Clothing[];

        // Remove clothes that are already added to this outfit
        const clothesNotAddedYet = clothesForThisLabel.filter((e) => !thisOutfit.value?.clothes.some((f) => f.clothingID == e.id));

        // Remove clothes that do not match search string
        const clothesMatchingSearch = clothesNotAddedYet.filter((e) => e.title.toLowerCase().includes(searchStr.toLowerCase())); // TODO: How much does this search suck compared to some guideline?

        return clothesMatchingSearch;
    }


    // Adds/Removes a label
    async function toggleLabel(selectedLabel: Label) {
        // Get all selected labels without this one
        const filtered = thisOutfit.value.labelIDs.filter((e: string) => e != selectedLabel.id);

        // If length does not match, the label must be selected
        if (filtered.length != thisOutfit.value.labelIDs.length) {
            // ...and we can simply remove it without filtering again
            thisOutfit.value.labelIDs = filtered;
        } else {
            // ...otherwise we can simply add it
            thisOutfit.value.labelIDs.push(selectedLabel.id);
        }

        changesMade.value = true;
    }


    // Sends delete request to the database
    async function deleteOutfit() {

        const confirmed = confirm(`Are you sure you want to delete '${thisOutfit.value.title}'?\nThis action cannot be undone!`);

        // Send request to API if user confirmed
        if (confirmed) {
            const res = await fetch("/api/rm-outfit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: thisOutfit.value.id
                })
            });

            // Indicate success/failure
            /* if (success.data.value) {
                responseIndicatorSuccess();

                changesMade.value = false;
            } else {
                responseIndicatorFailure();
                return;
            } */

            // Redirect back to outfits page on success
            useRouter().push("/outfits");
        }

    }


    // Sends changes to the database in edit mode
    async function saveChanges() {

        // Send data to API
        const res = await fetch("/api/set-outfit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                outfit: thisOutfit.value
            })
        });

        // Indicate success/failure
        /* if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        } */

        const resBody = await res.json();

        console.log(resBody)

        // Update local refs
        thisOutfit.value = resBody.document;
        changesMade.value = false;

        // Redirect back on success
        useRouter().push("/outfits/view?id=" + thisOutfit.value.id);

    }

</script>
