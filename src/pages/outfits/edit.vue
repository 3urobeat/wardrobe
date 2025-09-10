<!--
/*
 * File: edit.vue
 * Project: wardrobe
 * Created Date: 2025-09-10 17:37:07
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 20:58:19
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
            <NuxtLink :to="'/outfits/view?id=' + itemId" class="flex items-center justify-center h-8 py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                <PhCaretLeft class="size-5 text-text-light dark:text-text-dark"></PhCaretLeft>
            </NuxtLink>
        </div>

        <div class="flex w-full justify-end">
            <button class="flex items-center justify-center h-8 py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="flex flex-col items-center py-20 gap-8" @change="changesMade = true">
    </div>
</template>


<script setup lang="ts">
    import { PhCaretLeft, PhCheck } from "@phosphor-icons/vue";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "../helpers/responseIndicator";


    // Get ID of the outfit to view from query parameters
    const itemId = useRoute().query.id;


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
