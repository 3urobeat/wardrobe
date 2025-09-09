<!--
/*
 * File: add.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:36:43
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 22:17:48
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
    <div id="title" class="right-8 pt-10 select-none">
        <div class="flex w-full">
            <div class="flex justify-start">
                <NuxtLink to="/" class="flex items-center justify-center h-8 py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                    <PhCaretLeft class="size-5 text-text-light dark:text-text-dark"></PhCaretLeft>
                </NuxtLink>
            </div>

            <div class="flex w-full justify-end">
                <button class="flex items-center justify-center h-8 py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                    <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                    Save
                </button>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center pt-12 pb-10 px-8" @change="changesMade = true">
        <!-- TODO: Pop-In Animation -->
        <div class="flex flex-col w-full md:w-xl h-190 px-8 py-4 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all">

            <!-- Image Upload -->
            <button class="flex justify-center items-center self-center w-6/7 sm:w-2/3 aspect-square m-6 rounded-2xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 outline-dashed hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark transition-all" @click="">
                <PhUploadSimple class="text-2xl text-text-light dark:text-text-dark"></PhUploadSimple>
            </button>

            <!-- Name input -->
            <input
                class="w-full sm:w-1/2 self-center sm:self-start my-2 py-1 px-3 rounded-sm shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 transition-all"
                placeholder="Name"
                v-model.trim="itemName"
            />

            <!-- Description input -->
            <textarea
                class="w-full h-20 shrink-0 self-center my-2 py-2 px-3 rounded-sm shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-primary-light dark:outline-border-primary-dark outline-2"
                placeholder="Description"
                v-model.trim="itemDescription"
            />

            <!-- Label selector area -->
            <div class="w-full h-full overflow-scroll self-center my-4 rounded-xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark transition-all">
                <!-- Separate labels by category -->
                <div class="flex px-2 m-1.5" v-for="thisCategory in storedCategories" :key="thisCategory.id">
                    <label class="text-md text-text-light dark:text-text-dark">{{ thisCategory.name }}: </label>

                    <!-- List all labels for this category -->
                    <button
                        class="w-fit rounded-xl px-2 mx-1 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                        :class="selectedLabels.includes(thisLabel) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                        v-for="thisLabel in storedLabels.filter((e) => e.category.name == thisCategory.name)"
                        :key="thisLabel.id"
                        @click="toggleLabel(thisLabel)"
                    >
                        {{ thisLabel.name }}
                    </button>

                    <!-- Label Quick Add Button -->
                    <button class="" @click="quickAddLabel(thisCategory)">
                        <PhPlus class="fill-text-light dark:fill-text-dark"></PhPlus>
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCaretLeft, PhCheck, PhPlus, PhUploadSimple } from "@phosphor-icons/vue";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "../helpers/responseIndicator";
    import type { Category, Label } from "~/model/label";

    // Refs
    const uploadImg       = ref(null);
    const itemName        = ref(null);
    const itemDescription = ref(null);

    const storedLabels: Ref<Label[]> = ref([]);
    const storedCategories: Ref<Category[]> = ref([]);

    const selectedLabels: Ref<Label[]> = ref([]);


    // Get all labels & categories on page load
    let labelsRes = await useFetch<Label[]>("/api/get-all-labels");
    storedLabels.value = labelsRes.data.value!;

    let categoriesRes = await useFetch<Category[]>("/api/get-all-categories");
    storedCategories.value = categoriesRes.data.value!;


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


    // Adds/Removes a label
    async function toggleLabel(selectedLabel: Label) {
        console.log("DEBUG - add: Toggling label " + selectedLabel.id);

        // Get all selected labels without this one
        const filtered = selectedLabels.value.filter((e) => e.id != selectedLabel.id);

        // If length does not match, the label must be selected
        if (filtered.length != selectedLabels.value.length) {
            // ...and we can simply remove it without filtering again
            selectedLabels.value = filtered;
        } else {
            // ...otherwise we can simply add it
            selectedLabels.value.push(selectedLabel);
        }
    }


    // Label quick add function
    async function quickAddLabel(category: Category) {

    }


    // Sends changes to the database
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
