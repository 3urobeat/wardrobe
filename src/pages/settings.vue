<!--
/*
 * File: settings.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:51:02
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-10 16:37:07
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
    <div id="title" class="absolute w-full right-5 mb-5 lg:mb-7 select-none">
        <!-- Save button -->
        <div class="flex justify-end items-center">
            <button class="flex items-center justify-center py-1 px-3 rounded-md shadow-md bg-bg-input-light dark:bg-bg-input-dark outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="lg:flex lg:flex-col lg:mx-12 mb-5 lg:mb-7" @change="changesMade = true"> <!-- Offset content to the right on desktop to give headline more presence -->
    </div>
</template>


<script setup lang="ts">
    import { PhCheck } from "@phosphor-icons/vue";
    import type { Settings } from "~/model/settings";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "./helpers/responseIndicator";


    const settings: Ref<Settings> = ref({

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



    // Load data
    const serverData = await useFetch<any>("/api/get-settings");

    settings.value = serverData.data.value;


    // Sends changes to the database
    async function saveChanges() {

        const success = await useFetch("/api/set-settings", {
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
        }

    }

</script>
