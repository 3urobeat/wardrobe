<!--
/*
 * File: titleBarBasic.vue
 * Project: wardrobe
 * Created Date: 2025-09-17 17:25:36
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-27 18:23:26
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

    <div id="title" class="absolute right-0 flex w-full pt-4 px-1 md:px-5 select-none">
        <div class="flex justify-start" v-if="backRedirectTo">
            <NuxtLink :to="backRedirectTo" class="custom-button-primary">
                <PhCaretLeft class="size-5 text-text-light dark:text-text-dark"></PhCaretLeft>
            </NuxtLink>
        </div>

        <div class="flex gap-4 w-full justify-end">
            <div class="custom-button-primary">
                <slot></slot>
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">
    import { PhCaretLeft } from "@phosphor-icons/vue";

    // Define Props to be accepted by this component
    defineProps({
        backRedirectTo: { // Leave empty to disable back button
            type: String,
            required: false
        }
    });

</script>
