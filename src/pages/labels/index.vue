<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2025-09-09 17:13:32
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-09 22:51:23
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
    <div id="title" class="absolute w-full right-5 mb-5 lg:mb-7 pt-10 select-none">
        <!-- Save button -->
        <div class="flex justify-end items-center">
            <button class="flex items-center justify-center py-1 px-3 rounded-sm shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="flex flex-col items-center pt-28 pb-10 px-8 gap-8" @change="changesMade = true">
        <div class="flex w-full h-60 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all" v-for="thisCategory in storedCategories" :key="thisCategory.id">
            <div>
                <!-- Title -->
                <div class="w-fit px-1 m-2 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                    <input
                        class="w-fit py-0.5 px-3 rounded-sm bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 transition-all"
                        placeholder="Category Name"
                        v-model.trim="thisCategory.name"
                    />
                </div>

                <!-- Labels of this category -->
                <div class="flex h-42 mx-2 overflow-x-scroll"> <!-- TODO: I don't like the hardcoded h-42 but h-full glitches out of the box? -->
                    <div
                        class="shrink-0 px-2 m-2 rounded-xl shadow-md bg-bg-field-light dark:bg-bg-field-dark"
                        v-for="thisLabel in storedLabels.filter((e) => e.category.name == thisCategory.name)"
                        :key="thisLabel.id"
                    >
                        <!-- Label title bar -->
                        <div class="flex w-full mt-2 mb-1">
                            <div class="flex justify-start ml-1">
                                <PhTag class="self-center size-5 text-text-light dark:text-text-dark"></PhTag>
                            </div>

                            <div class="flex w-full justify-end">
                                <button class="flex p-1 rounded-sm shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="deleteLabel(thisLabel)" title="Delete Label">
                                    <PhX class="size-5 text-red-500"></PhX>
                                </button>
                            </div>
                        </div>

                        <!-- Label content -->
                        <input
                            class="w-full self-center sm:self-start my-2 py-1 px-3 rounded-sm shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 transition-all"
                            placeholder="Name"
                            v-model.trim="thisLabel.name"
                        />
                    </div>
                </div>
            </div>

            <!-- Add label button -->
            <div class="flex m-2 items-center">
                <button class="h-fit p-1 rounded-sm shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="addLabel(thisCategory)" title="Add Label">
                    <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                </button>
            </div>
        </div>

        <!-- Add label category button -->
        <button class="items-center justify-center p-2 rounded-sm shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="addCategory()" title="Add Category">
            <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
        </button>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhPlus, PhTag, PhX } from "@phosphor-icons/vue";
    import type { Category, Label } from "~/model/label";


    // Cache
    const storedLabels:     Ref<Label[]>    = ref([]);
    const storedCategories: Ref<Category[]> = ref([]);


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



    async function addLabel(category: Category) {

    }

    async function deleteLabel(selectedLabel: Label) {

    }

    async function addCategory() {

    }


    // Sends changes to the database
    async function saveChanges() {

        /* const success = await useFetch("/api/set-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings.value)
        });

        // Indicate success/failure
        if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        } */

    }

</script>
