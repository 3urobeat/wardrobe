<!--
/*
 * File: pickerDialog.vue
 * Project: wardrobe
 * Created Date: 2025-12-24 12:09:18
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-02 21:32:26
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>

    <!-- Open/Close button -->
    <div class="flex flex-col items-center">
        <!-- Give this button a higher z-level than the close-popover-dummy to be able to open another picker and close the current one at the same time, saving a click --> <!-- TODO: Does this still work? -->
        <button class="h-fit z-20" :title="toggleText" @click="isOpen = !isOpen" ref="pickerDialogToggleBtn">
            <slot name="toggle"></slot>
            <!-- WARN: This slot *must not* contain another <button>, it will cause a hydration mismatch! -->
        </button>

        <!-- Triangle -->
        <p v-if="isOpen" class="absolute z-50 self-center text-2xl pt-2 text-bg-field-light dark:text-bg-field-dark">&#x25B2;</p>

        <!--
            Position dialog absolute to parent by setting parent to relative.
            Bind position to computed dialogPosition to be able to move container based on distance to screen bounds.
        -->
        <div v-if="isOpen" class="absolute z-50 mt-6 transition-all" :class="dialogPosition"> <!-- TODO: Apply dialogPosition only to itemsDiv, keep triangle centered to button -->
            <!-- Dummy filling the entire page to close popout when clicking on anything outside popout -->
            <div class="fixed top-0 left-0 min-h-screen min-w-screen opacity-0" @click="isOpen = !isOpen"></div>

            <!-- Content -->
            <dialog id="picker-dialog" class="relative mt-2 max-w-screen flex flex-col p-2 md:p-4 gap-4 rounded-xl shadow-md dark:text-text-dark bg-bg-field-light dark:bg-bg-field-dark">

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

                <!-- Items. Restrict width to screen size -->
                <div ref="pickerDialogItemsDiv" class="max-w-screen overflow-x-auto">
                    <slot name="items" :searchStr="searchStr"></slot>
                </div>

            </dialog>
        </div>
    </div>

</template>


<script setup lang="ts">

    // Refs
    const isOpen:                Ref<boolean>                     = ref(false);
    const pickerDialogToggleBtn: Ref<HTMLButtonElement|undefined> = ref();
    const searchStr:             Ref<string>                      = ref("");
    const pickerDialogItemsDiv:  Ref<HTMLDivElement|undefined>    = ref();

    // Calculate distance to screen bounds and position dialog accordingly to prevent x-overflow
    const dialogPosition = computed(() => {
        const buttonRect  = pickerDialogToggleBtn.value?.getBoundingClientRect(); // Get location of button that toggles dialog
        const dialogWidth = pickerDialogItemsDiv.value?.clientWidth;              // Get width of dialog

        // Value is initially undefined, prob due to transition. Only take action once itemsDiv width is known
        if (dialogWidth && buttonRect) {
            // Calculate distance to left & right screen border. If value is negative, the dialog overflows
            const leftOverflow  = buttonRect.left - dialogWidth;
            const rightOverflow = window.innerWidth - (buttonRect.right + dialogWidth);
            //console.log("[DEBUG] Picker left & right screen border distances:", leftOverflow, rightOverflow)

            // Picker dialog overflows on both screen borders, center on screen and shrink content
            if (leftOverflow < 0 && rightOverflow < 0) {
                return "left-1/2 transform -translate-x-1/2";

            } else {    // Picker dialog overflows only on one screen border

                // Align dialog to left or right screen border, depending on which overflows
                if (leftOverflow < 0) {
                    return "left-0";
                } else if (rightOverflow < 0) {
                    return "right-0";
                } else {
                    return ""; // No overflow
                }
            }
        }
    });

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
