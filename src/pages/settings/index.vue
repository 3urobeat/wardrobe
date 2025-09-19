<!--
/*
 * File: index.vue
 * Project: wardrobe
 * Created Date: 2025-09-08 15:51:02
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-19 18:02:18
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

    <div class="py-20" @change="changesMade = true"> <!-- Offset content to the right on desktop to give headline more presence -->
    </div>
</template>


<script setup lang="ts">
    import { PhCheck } from "@phosphor-icons/vue";
    import TitleBarBasic from "~/components/titleBarBasic.vue";
    import type { Settings } from "~/model/settings";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "~/composables/responseIndicator";


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
