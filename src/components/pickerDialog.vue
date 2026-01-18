<!--
/*
 * File: pickerDialog.vue
 * Project: wardrobe
 * Created Date: 2025-12-24 12:09:18
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-18 16:46:30
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

    <!-- Open/Close button -->
    <div class="flex flex-col items-center">
        <button
            class="h-fit z-20"
            :title="toggleText" @click="isOpen = !isOpen"
        >           <!-- Give this button a higher z-level than the close-popover-dummy to be able to open another picker and close the current one at the same time, saving a click -->
            <slot name="toggle"></slot>
        </button>

        <!-- Position dialog absolute to parent by setting parent to relative -->
        <div v-if="isOpen" class="absolute z-50 mt-6 transition-all">
            <!-- Dummy filling the entire page to close popout when clicking on anything outside popout -->
            <div class="fixed top-0 left-0 h-screen w-screen opacity-0" @click="isOpen = !isOpen"></div>

            <div class="flex flex-col transition-all">
                <!-- Triangle -->
                <p class="self-center text-2xl -mb-1.5 text-bg-field-light dark:text-bg-field-dark">&#x25B2;</p>

                <!-- Content -->
                <dialog id="picker-dialog" class="relative flex flex-col p-4 gap-4 rounded-xl shadow-md dark:text-text-dark bg-bg-field-light dark:bg-bg-field-dark">

                    <!-- Search and Close button -->
                    <div class="flex justify-end gap-x-4">
                        <input
                            class="w-full custom-input-primary"
                            placeholder="Search"
                            v-model.trim="searchStr"
                            type="search"
                            v-if="!hideSearch"
                        />

                        <button class="custom-input-primary" @click="isOpen = !isOpen">
                            Close
                        </button>
                    </div>

                    <!-- Items -->
                    <div>
                        <slot name="items" :searchStr="searchStr"></slot>
                    </div>

                </dialog>
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">

    const isOpen:    Ref<boolean> = ref(false);
    const searchStr: Ref<string>  = ref("");

    // Define Props to be accepted by this component
    defineProps({
        toggleText: {
            type: String,
            required: true
        },
        hideSearch: {
            type: Boolean,
            required: false
        }
    });

    // Define stuff that can be accessed by the page
    defineExpose({
        isOpen,
        searchStr
    });

</script>
