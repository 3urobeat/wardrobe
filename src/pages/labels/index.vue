<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2025-09-09 17:13:32
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-26 15:02:32
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
    <TitleBarBasic>
        <button class="flex items-center justify-center" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>

    <div class="flex flex-col items-center py-20 gap-8" @change="changesMade = true">

        <div
            class="flex w-full h-60 p-2 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all"
            v-for="thisCategory in storedCategories"
            :key="thisCategory.id"
        >
            <div>
                <!-- Title -->
                <div class="w-fit px-1 m-2 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark">
                    <input
                        class="w-fit py-0.5 px-3 rounded-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 transition-all"
                        placeholder="Category Name"
                        v-model.trim="thisCategory.name"
                    />
                </div>

                <!-- Labels of this category -->
                <div
                    class="flex h-44 mx-2 overflow-x-scroll"
                    :id="'labels-' + thisCategory.id"
                >                                               <!-- TODO: I don't like the hardcoded height but h-full glitches out of the box? Also changing any width breaks scroll overflow? -->
                    <div
                        class="shrink-0 px-2 m-2 rounded-xl shadow-md cursor-move bg-bg-field-light dark:bg-bg-field-dark"
                        v-for="thisLabel in labelsPerCategory[thisCategory.id]"
                        :key="thisLabel.id"
                    >                               <!-- TODO: Doing this by ID could fix disappearing on rename bug -->
                        <!-- Label title bar -->
                        <div class="flex w-full mt-2 mb-1">
                            <div class="flex justify-start ml-1">
                                <PhTag class="self-center size-5 text-text-light dark:text-text-dark"></PhTag>
                            </div>

                            <div class="flex w-full justify-end">
                                <button class="flex p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="deleteLabel(thisLabel)" title="Delete Label">
                                    <PhX class="size-5 text-red-500"></PhX>
                                </button>
                            </div>
                        </div>

                        <!-- Label content -->
                        <input
                            class="w-full self-center sm:self-start my-2 py-1 px-3 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-secondary-light dark:outline-border-secondary-dark outline-2 transition-all"
                            placeholder="Name"
                            v-model.trim="thisLabel.name"
                        />

                        <!-- Draggable icon --> <!-- Fixed mt should be fine here since height of container is hard coded as well -->
                        <svg class="mt-9 ml-1 size-6 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="4" cy="4" r="1"></circle>
                            <circle cx="4" cy="12" r="1"></circle>
                            <circle cx="4" cy="20" r="1"></circle>
                            <circle cx="12" cy="4" r="1"></circle>
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="20" r="1"></circle>
                            <circle cx="20" cy="4" r="1"></circle>
                            <circle cx="20" cy="12" r="1"></circle>
                            <circle cx="20" cy="20" r="1"></circle>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Add label button -->
            <div class="flex m-2 items-center"> <!-- TODO: Auto scroll label container to the end? -->
                <button class="h-fit p-1 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="addLabel(thisCategory)" title="Add Label">
                    <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
                </button>
            </div>
        </div>

        <!-- Add label category button -->
        <button class="items-center justify-center p-2 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="addCategory()" title="Add Category">
            <PhPlus class="size-5 fill-text-light dark:fill-text-dark"></PhPlus>
        </button>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhPlus, PhTag, PhX } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import type { Category, Label } from "~/model/label";
    import { useSortable } from "@vueuse/integrations/useSortable";
    import type { Reactive } from "vue";


    // Get global cache from app.vue
    const storedLabels:     Ref<Label[]>    = useState("storedLabels");
    const storedCategories: Ref<Category[]> = useState("storedCategories");


    // Prepare drag & and droppable lists. Key/Index is category id
    const labelsPerCategory: Reactive<{ [key: string]: Label[] }> = reactive({}); // Nested data structure must use reactive to update correctly in template when dragged

    storedCategories.value.forEach((thisCategory) => {
        labelsPerCategory[thisCategory.id] = storedLabels.value.filter((e: Label) => e.categoryID == thisCategory.id);
        useSortable(`#labels-${thisCategory.id}`, labelsPerCategory[thisCategory.id]!, { animation: 150 });
    });

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
    function addLabel(category: Category) {
        storedLabels.value.push({
            id: crypto.randomUUID(), // TODO: This should be server sided
            name: "",
            orderIndex: 0.0, // TODO
            categoryID: category.id
        });

        // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
        changesMade.value = true;
    }

    // Delete a label
    function deleteLabel(selectedLabel: Label) {
        storedLabels.value = storedLabels.value.filter((e) => e != selectedLabel);

        // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
        changesMade.value = true;
    }

    // Add a new category
    function addCategory() {
        storedCategories.value.push({
            id: crypto.randomUUID(), // TODO: This should be server sided
            name: ""
        });

        // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
        changesMade.value = true;
    }


    // Sends changes to the database
    async function saveChanges() {

        // Send label categories data to API

        // Send labels data to API
        const res = await fetch("/api/set-labels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categories: storedCategories.value,
                labels: storedLabels.value
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

        // Update local refs
        changesMade.value = false;

        // TODO: Use response and update ref?
        console.log(resBody)

    }

</script>
