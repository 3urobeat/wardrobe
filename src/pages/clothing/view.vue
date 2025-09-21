<!--
/*
 * File: view.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:39:55
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-21 21:37:33
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
    This file contains both routes clothing-view & clothing-edit and toggles related components to de-duplicate code.
    The relevant re-route is configured in nuxt.config.ts.
-->


<template>

    <!-- Title bar for edit -->
    <TitleBarBasic backRedirectTo="/" v-if="!editModeEnabled">
        <NuxtLink :to="'/clothing/edit?id=' + clothingId" class="flex items-center justify-center">
            <PhPencil class="mr-2 size-5"></PhPencil>
            Edit
        </NuxtLink>
    </TitleBarBasic>

    <!-- Title bar for edit -->
    <TitleBarBasic :backRedirectTo="clothingId == 'new' ? '/clothing' : '/clothing/view?id=' + clothingId" v-if="editModeEnabled">
        <button class="flex items-center justify-center" @click="saveChanges">
            <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
            Save
        </button>
    </TitleBarBasic>


    <!-- Page content -->
    <div class="flex justify-center items-center py-20" @change="changesMade = true">
        <!-- TODO: Pop-In Animation -->
        <div class="flex flex-col w-full md:w-xl h-200 px-8 py-4 rounded-2xl shadow-lg bg-bg-input-light dark:bg-bg-input-dark transition-all">

            <!-- Image (Upload) -->
            <div
                class="flex m-6 justify-center h-3/6 rounded-2xl shadow-md select-none bg-bg-field-light/35 dark:bg-bg-field-dark/35 outline-border-primary-light dark:outline-border-primary-dark outline-dashed hover:bg-bg-field-hover-light/50 dark:hover:bg-bg-field-hover-dark/50 transition-all"
                :class="editModeEnabled ? 'outline-2 cursor-pointer' : 'outline-0'"
                @click="uploadImg()"
            >
                <img
                    class="rounded-2xl h-full select-none"
                    :class="editModeEnabled ? 'opacity-50' : ''"
                    :src="thisClothing.imgPath" alt=""
                >
                <PhUploadSimple v-if="editModeEnabled" class="absolute self-center text-4xl text-text-light dark:text-text-dark"></PhUploadSimple>
            </div>

            <div class="flex flex-col w-full h-2/3">
                <!-- Name label/input -->
                <p
                    class="w-full sm:w-1/2 self-center sm:self-start my-2 py-1 px-3 rounded-md shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark"
                    v-if="!editModeEnabled"
                >
                    {{ thisClothing.title }}
                </p>
                <input
                    class="w-full sm:w-1/2 self-center sm:self-start my-2 py-1 px-3 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 transition-all"
                    placeholder="Name"
                    v-model.trim="thisClothing.title"
                    v-if="editModeEnabled"
                />

                <!-- Description label/input -->
                <p
                    class="w-full h-20 shrink-0 self-center my-2 py-2 px-3 rounded-md shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark"
                    v-if="!editModeEnabled"
                >
                    {{ thisClothing.description }}
                </p>
                <textarea
                    class="w-full h-20 shrink-0 self-center my-2 py-2 px-3 rounded-md shadow-md bg-bg-field-light dark:bg-bg-field-dark hover:bg-bg-field-hover-light dark:hover:bg-bg-field-hover-dark outline-border-primary-light dark:outline-border-primary-dark outline-2"
                    placeholder="Description"
                    v-model.trim="thisClothing.description"
                    v-if="editModeEnabled"
                />

                <!-- Label selector area -->
                <div class="w-full h-full overflow-scroll self-center my-4 rounded-xl shadow-md select-none bg-bg-field-light dark:bg-bg-field-dark">

                    <!-- Separate labels by category -->
                    <div class="flex px-2 m-1.5" v-for="thisCategory in storedCategories" :key="thisCategory.id">
                        <label class="text-md text-text-light dark:text-text-dark">{{ thisCategory.name }}: </label>

                        <!-- List all labels for this category -->
                        <p
                            class="w-fit rounded-xl px-2 mx-1 text-gray-100 bg-gray-400 dark:bg-gray-600"
                            v-for="thisLabel in thisClothing.labels.filter((e: Label) => e.category.name == thisCategory.name)"
                            :key="thisLabel.id"
                            v-if="!editModeEnabled"
                        >
                            {{ thisLabel.name }}
                        </p>

                        <button
                            class="w-fit rounded-xl px-2 mx-1 text-gray-100 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400 hover:transition-all"
                            :class="thisClothing.labels.some((e) => e.id == thisLabel.id) ? 'outline-green-700 dark:outline-green-500 outline-2 bg-green-600/60' : ''"
                            v-for="thisLabel in storedLabels.filter((e: Label) => e.category.name == thisCategory.name)"
                            :key="thisLabel.id"
                            @click="toggleLabel(thisLabel)"
                            v-if="editModeEnabled"
                        >
                            {{ thisLabel.name }}
                        </button>

                        <!-- Label Quick Add Button -->
                        <button class="" @click="quickAddLabel(thisCategory)" v-if="editModeEnabled">
                            <PhPlus class="fill-text-light dark:fill-text-dark"></PhPlus>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhPencil, PhPlus, PhUploadSimple } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";
    import type { Clothing } from "~/model/clothing";
    import type { Category, Label } from "~/model/label";


    // Refs
    const thisClothing: Ref<Clothing> = ref({ id: "", title: "", description: "", imgPath: "", labels: [], addedTimestamp: 0 });

    const storedLabels: Ref<Label[]> = ref([]);
    const storedCategories: Ref<Category[]> = ref([]);


    // Check if edit mode is enabled based on if name of this route is outfits-view or outfits-edit
    const editModeEnabled = (useRoute().name == "clothing-edit");

    // Get ID of the outfit to view from query parameters
    const clothingId = useRoute().query.id || "new";

    // Redirect to edit page if view was opened with id new
    if (!editModeEnabled && clothingId == "new") useRouter().push("/clothing/edit?id=new");


    // Get clothing
    onBeforeMount(async () => {
        if (clothingId != "new") {
            const res = await useFetch<Clothing>("/api/get-clothing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: clothingId
                })
            });

            thisClothing.value = res.data.value!;
        }
    });


    // Get all labels and categories
    let categoriesRes = await useFetch<Category[]>("/api/get-all-categories");
    storedCategories.value = categoriesRes.data.value!;

    if (editModeEnabled) {
        let labelsRes = await useFetch<Label[]>("/api/get-all-labels");
        storedLabels.value = labelsRes.data.value!;
    }

    // Track if user made changes
    const changesMade = ref(false);

    onBeforeRouteLeave((to, from, next) => {
        if (editModeEnabled && changesMade.value) {
            if (!confirm("You have unsaved changes!\nWould you still like to continue?")) {
                next(false);
            }
        }

        next();
    });


    // Process image upload
    function uploadImg() {
        if (editModeEnabled) {

        }
    }

    // Adds/Removes a label
    async function toggleLabel(selectedLabel: Label) {
        console.log("DEBUG - add: Toggling label " + selectedLabel.id);

        // Get all selected labels without this one
        const filtered = thisClothing.value.labels.filter((e: Label) => e.id != selectedLabel.id);

        // If length does not match, the label must be selected
        if (filtered.length != thisClothing.value.labels.length) {
            // ...and we can simply remove it without filtering again
            thisClothing.value.labels = filtered;
        } else {
            // ...otherwise we can simply add it
            thisClothing.value.labels.push(selectedLabel);
        }
    }


    // Label quick add function
    async function quickAddLabel(thisCategory: Category) {
        const name = prompt("Quick Add Label: Enter a name");

        if (name) {
            const newLabel: Label = {
                id: "0",
                name: name,
                category: thisCategory
            };

            storedLabels.value.push(newLabel);

            // Directly select new label
            thisClothing.value.labels.push(newLabel);

            // Vue does not detect this change (as no element was edited in the DOM) so we need to track this manually
            changesMade.value = true;
        }
    }


    // Sends changes to the database
    async function saveChanges() {

        // Do not forget to save storedLabels (if quick add was used)

        // Indicate success/failure
        /* if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        } */

    }

</script>
