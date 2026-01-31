<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2025-09-09 17:13:32
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-31 12:40:21
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
    <TitleBarBasic>
        <button class="custom-button-primary" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>

    <div class="flex flex-col items-center py-20 gap-8" @change="changesMade = true">

        <div
            class="flex flex-col w-full h-60 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all"
            v-for="thisCategory in localCategories"
            :key="thisCategory.id"
        >
            <!-- Category Title/Name, Speciality Selector & Delete button -->
            <div class="flex items-center justify-between m-2">
                <div class="flex gap-6">
                    <input
                        class="custom-input-primary py-0.5! h-fit! w-1/3 sm:w-full transition-all"
                        placeholder="Category Name"
                        v-model.trim="thisCategory.name"
                    />

                    <div class="flex custom-input-primary h-fit! py-0.75! px-1!" @change="updateCategorySpeciality(thisCategory)">
                        <select class="px-1" v-model="thisCategory.specialityID">
                            <option v-for="thisSpeciality in CategorySpecialities" :value="thisSpeciality.id">{{ thisSpeciality.name }}</option>
                        </select>
                    </div>
                </div>

                <button class="custom-button-icon-only" @click="deleteCategory(thisCategory)" title="Delete Label">
                    <PhX class="size-5 text-red-500"></PhX>
                </button>
            </div>

            <!-- Category content -->
            <div class="flex">
                <!-- Labels of this category -->
                <div
                    class="flex h-44 mx-2 overflow-x-scroll"
                    :id="'labels-' + thisCategory.id"
                >                                               <!-- TODO: I don't like the hardcoded height but h-full glitches out of the box? Also changing any width breaks scroll overflow? -->
                    <div
                        class="w-60 shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                        v-for="thisLabel in labelsPerCategory[thisCategory.id]"
                        :key="thisLabel.id"
                    >
                        <!-- Label title bar -->
                        <div class="flex w-full mt-2 mb-1">
                            <div class="flex justify-start ml-1">
                                <PhTag class="self-center size-5 text-text-light dark:text-text-dark"></PhTag>
                            </div>

                            <div class="flex w-full justify-end">
                                <button class="custom-button-icon-only p-0.75!" @click="deleteLabel(thisLabel)" title="Delete Label">
                                    <PhX class="size-5 text-red-500"></PhX>
                                </button>
                            </div>
                        </div>

                        <!-- Label content -->
                        <input
                            class="custom-input-primary w-full my-2"
                            placeholder="Name"
                            v-model.trim="thisLabel.name"
                        />

                        <div class="flex justify-between mt-9 m-1">
                            <!-- Icon acting as handle for drag interaction and indicating that item is draggable -->
                            <DraggableHandle id="drag-handle"></DraggableHandle>

                            <!-- Category Speciality Value Input --> <!-- TODO: I *also* dislike this entire block. Moving to a component would be better but complicate value passing & updating -->
                            <div
                                v-if="thisCategory.specialityID && CategorySpecialities.find((e) => e.id == thisCategory.specialityID)?.value != undefined"
                                title="Configure Label Speciality"
                            >
                                <select v-if="thisCategory.specialityID == CategorySpecialityID.Body_Part" class="custom-input-primary w-32 h-fit! px-1.5!" v-model="thisLabel.specialityValue">
                                    <!-- <option value=undefined disabled selected hidden>{{ CategorySpecialities.find((e) => e.id == thisCategory.specialityID)?.description }}</option> -->
                                    <option v-for="[key, value] of Object.entries(CategorySpecialityBodyPartValue)" :value="key">{{ value }}</option>
                                </select>
                                <input v-else-if="thisCategory.specialityID == CategorySpecialityID.Color" class="w-7 h-7 rounded-4xl" type="color" :placeholder="CategorySpecialities.find((e) => e.id == thisCategory.specialityID)?.description" v-model="thisLabel.specialityValue">
                                <div v-else-if="thisCategory.specialityID == CategorySpecialityID.Season" class="">
                                    <PickerDialog toggleText="Configure Label Speciality" hide-search>
                                        <!-- This is the element that will be displayed in the open/close button -->
                                        <template v-slot:toggle>
                                            <button class="custom-button-icon-only-secondary">
                                                <PhSlidersHorizontal class="size-5 fill-text-light dark:fill-text-dark"></PhSlidersHorizontal>
                                            </button>
                                        </template>

                                        <!-- Items area -->
                                        <template v-slot:items>
                                            <div class="w-80">
                                                <label for="specialSeasonFromTemp" class="mr-2">From Temperature:</label>
                                                <input id="specialSeasonFromTemp" type="number" class="custom-input-primary w-32 h-fit! my-1 px-1.5!" v-model="getLabelInitialized(thisLabel, thisCategory).specialityValue.fromTemp"> <br>
                                                <label for="specialSeasonToTemp" class="mr-2">To Temperature:</label>
                                                <input id="specialSeasonToTemp"   type="number" class="custom-input-primary w-32 h-fit! my-1 px-1.5!" v-model="getLabelInitialized(thisLabel, thisCategory).specialityValue.toTemp"> <br>
                                                <label for="specialSeasonFromTime" class="mr-2">From Date:</label>
                                                <input id="specialSeasonFromTime" type="date"   class="custom-input-primary w-32 h-fit! my-1 px-1.5!" v-model="getLabelInitialized(thisLabel, thisCategory).specialityValue.fromTimestamp"> <br>
                                                <label for="specialSeasonToTime" class="mr-2">To Date:</label>
                                                <input id="specialSeasonToTime"   type="date"   class="custom-input-primary w-32 h-fit! my-1 px-1.5!" v-model="getLabelInitialized(thisLabel, thisCategory).specialityValue.toTimestamp"> <br>
                                            </div>
                                        </template>
                                    </PickerDialog>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Add label button -->
                <div class="flex m-2 items-center"> <!-- TODO: Auto scroll label container to the end? -->
                    <button class="custom-button-icon-only" @click="addLabel(thisCategory)" title="Add Label">
                        <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                    </button>
                </div>
            </div>

        </div>

        <!-- Add label category button. "p-2!" overwrites custom-button-icon-only's p-1 to make button bigger -->
        <button class="custom-button-icon-only p-2!" @click="addCategory()" title="Add Category">
            <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
        </button>
    </div>

    <!-- No "empty" text here because styling sucks and wardrobe comes with a few pre-configured labels -->
</template>


<script setup lang="ts">
    import { PhCheck, PhPlus, PhSlidersHorizontal, PhTag, PhX } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import { getLabelInitialized, getLabelOrderIndexBetween, getNewLastLabelOrderIndex, sortLabelsList, type Label } from "~/model/label";
    import { getLabelsOfCategory, type Category } from "~/model/label-category";
    import { CategorySpecialities, CategorySpecialityID, CategorySpecialityBodyPartValue, CategorySpecialityMap } from "~/model/label-category-speciality";
    import { moveArrayElement, useSortable } from "@vueuse/integrations/useSortable";
    import type { Reactive } from "vue";
    import type { UseClonedReturn } from "@vueuse/core";


    // Create local clones of global labels & category cache from app.vue. Changes are synced in saveChanges()
    const storedLabels:     Ref<Label[]>    = useState("storedLabels");
    const storedCategories: Ref<Category[]> = useState("storedCategories");
    let   localLabels:      Label[]         = useCloned(storedLabels, { manual: true }).cloned.value;     // I'm not using useCloned's sync() as it just wouldn't work :shrug:
    let   localCategories:  Category[]      = useCloned(storedCategories, { manual: true }).cloned.value;

    // Prepare temporary list for drag & drop reorder functionality. Changes in this list must be synced to localLabels & localCategories!
    // Key/Index is category id
    const labelsPerCategory: Reactive<{ [key: string]: Label[] }> = reactive({}); // Nested data structure must use reactive to update correctly in template when dragged

    localCategories.forEach((thisCategory) => {
        labelsPerCategory[thisCategory.id] = sortLabelsList(getLabelsOfCategory(localLabels, thisCategory.id));

        useSortable(`#labels-${thisCategory.id}`, labelsPerCategory[thisCategory.id]!, { animation: 150, handle: "#drag-handle", onUpdate: moveLabel }); // Handle allows dragging action only on item with that id
    });

    // Cache labels & categories that should be deleted
    let labelIDsToDelete:    string[] = [];
    let categoryIDsToDelete: string[] = [];

    // Track if user made changes
    const changesMade = ref(false);

    onBeforeRouteLeave((to, from, next) => {
        if (changesMade.value) {
            if (!confirm("You have unsaved changes!\nWould you still like to continue?")) {
                next(false);
            }
        }

        next();
    });


    // Add a new label to a category
    async function addLabel(category: Category) {
        const newLabel: Label = {
            id: await getUUIDFromServer(),
            name: "",
            orderIndex: getNewLastLabelOrderIndex(labelsPerCategory[category.id]!),
            categoryID: category.id,
            specialityValue: CategorySpecialityMap[category.specialityID].value // Init val
        };

        localLabels.push(newLabel);
        labelsPerCategory[category.id]!.push(newLabel);

        // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
        changesMade.value = true;
    }

    // Delete a label
    function deleteLabel(selectedLabel: Label) {
        const confirmed = confirm(`Are you sure you want to mark '${selectedLabel.name}' for deletion?\nThis action cannot be undone once you press save!`);

        if (confirmed) {
            labelIDsToDelete.push(selectedLabel.id);
            localLabels = localLabels.filter((e) => e.id != selectedLabel.id);
            labelsPerCategory[selectedLabel.categoryID]! = labelsPerCategory[selectedLabel.categoryID]!.filter((e: Label) => e != selectedLabel);

            // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
            changesMade.value = true;
        }
    }

    // Called when label is moved using useSortable() and synchronizes labelsPerCategory with localLabels
    function moveLabel(event: any) { // This is of type Sortable.SortableEvent but there are no TS type definitons - https://vueuse.org/integrations/useSortable/#usesortable

        // Get data from event
        const categoryID = String(event.from.id).replace("labels-", ""); // Get category id from div id prop
        const labelIndex = event.newIndex;                               // Index of moved element in labelsPerCategory[categoryID]

        if (!labelsPerCategory[categoryID]) throw("Move event for invalid category: " + categoryID); // Uhh

        // Interject - Move item (would be automatic but we overwrote that by hooking our function: https://vueuse.org/integrations/useSortable/#tips)
        moveArrayElement(labelsPerCategory[categoryID], event.oldIndex, labelIndex, event);

        // Calculate new orderIndex after moveArrayElement() microtask has finished
        nextTick(() => {
            const list = labelsPerCategory[categoryID]!;

            const prev = (labelIndex > 0) ? list[labelIndex - 1] : undefined;               // Preceding element. If label was moved to the front, there is no preceding slot -> undefined.
            const succ = (labelIndex < list.length - 1) ? list[labelIndex + 1] : undefined; // Succeeding element. If label was moved to the last slot, ...

            const newOrderIndex = getLabelOrderIndexBetween(prev, succ);

            // Apply orderIndex change to both lists
            labelsPerCategory[categoryID]![labelIndex]!.orderIndex = newOrderIndex;
            localLabels.find((e) => e.id == list[labelIndex]!.id)!.orderIndex = newOrderIndex;

            //console.log(list[labelIndex].name)
            //console.log(labelsPerCategory[categoryID].map((e) => e.orderIndex))
        });

    }

    // Add a new category
    async function addCategory() {
        const e: Category = {
            id: await getUUIDFromServer(),
            name: "",
            specialityID: CategorySpecialityID.No_Speciality
        };

        localCategories.push(e);
        labelsPerCategory[e.id] = [];

        // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
        changesMade.value = true;
    }

    // Delete a category
    function deleteCategory(selectedCategory: Category) {
        const confirmed = confirm(`Are you sure you want to mark '${selectedCategory.name}' and ALL OF ITS LABELS(!) for deletion?\nThis action cannot be undone once you press save!`);

        if (confirmed) {
            categoryIDsToDelete.push(selectedCategory.id);
            localCategories = localCategories.filter((e) => e.id != selectedCategory.id);
            delete labelsPerCategory[selectedCategory.id];

            // Delete all labels of this category
            localLabels = localLabels.filter((e) => {
                if (e.categoryID === selectedCategory.id) {
                    labelIDsToDelete.push(e.id);
                    return false;
                }
                return true;
            });

            // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
            changesMade.value = true;
        }
    }

    // Update value of all labels of a category with default value when speciality changes
    function updateCategorySpeciality(thisCategory: Category) {
        labelsPerCategory[thisCategory.id]?.forEach((e) => {
            e.specialityValue = CategorySpecialityMap[thisCategory.specialityID].value;
        });

        localLabels.forEach((e) => {
            if (e.categoryID == thisCategory.id) {
                e.specialityValue = CategorySpecialityMap[thisCategory.specialityID].value;
            }
        })
    }


    // Sends changes to the database
    async function saveChanges() {

        // Send labels & categories data to API
        let rmResBody = { success: true }; // Default

        if (labelIDsToDelete.length > 0 || categoryIDsToDelete.length > 0) {
            const rmRes = await fetch("/api/rm-labels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    categoryIDs: categoryIDsToDelete,
                    labelIDs: labelIDsToDelete
                })
            });

            rmResBody = await rmRes.json();
        }

        const setRes = await fetch("/api/set-labels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categories: localCategories,
                labels: localLabels
            })
        });

        const setResBody = await setRes.json();

        // Update local refs depending on success/failure and indicate result
        if (rmResBody.success && setResBody.success) {
            responseIndicatorSuccess();

            changesMade.value   = false;
            labelIDsToDelete    = [];
            categoryIDsToDelete = [];
            storedLabels.value     = localLabels;     // Manually sync local clones to global cache, useCloned's sync() didn't work
            storedCategories.value = localCategories;
        } else {
            responseIndicatorFailure();
        }
        // TODO: Handle !success better

    }

</script>
