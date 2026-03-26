<!--
/*
 * File: ImgLazy.vue
 * Project: wardrobe
 * Created Date: 2026-03-24 21:17:26
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-26 17:48:08
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>

    <div
        class="flex items-center justify-center"
        :class="props.class"
        v-element-visibility="onVisibility"
    >
        <div v-if="imgBlob === null" class="absolute self-center loader"></div>
        <PhImageBroken v-else-if="imgBlob === undefined" class="h-2/3 w-2/3 self-center text-text-secondary-light/50 dark:text-text-secondary-dark/50" />

        <!-- Show image if available -->
        <img
            v-else
            class="max-w-full max-h-full"
            :class="{ 'shadow-md': !noShadow, 'rounding-2xl': !noRounding }"
            :src="'data:image/png;base64,' + imgBlob"
            :alt="$t('imageFallbackText', { name: itemName })"
        >
    </div>

</template>


<script setup lang="ts">
    import { PhImageBroken } from "@phosphor-icons/vue";
    import { vElementVisibility } from "@vueuse/components";

    // If null, image has not been loaded yet. If undefined, image does not exist
    const imgBlob: Ref<string | null | undefined> = ref(null);

    // Fetch image upon being visible
    const isVisible = shallowRef(false)

    function onVisibility(state: boolean) {
        isVisible.value = state;

        if (isVisible.value && imgBlob.value === null) {
            console.debug(`[DEBUG] ImgLazy: Image '${props.imgPath}' became visible and is not fetched yet, loading...`);

            getImageFromServer(props.imgPath, props.imgWidth)
                .then((res) => {
                    imgBlob.value = res?.imgBlob;
                })
                .catch((err) => {
                    console.warn(`ImgLazy: Failed to load image '${props.imgPath}': ${err}`);
                    imgBlob.value = undefined;
                })
        }
    }

    // Define Props to be accepted by this component
    const props = defineProps({
        class: {
            type: String,
            required: false
        },
        itemName: {
            type: String,
            required: true
        },
        imgPath: {
            type: String,
            required: true
        },
        imgWidth: {
            type: Number,
            required: false
        },
        noShadow: {
            type: Boolean,
            required: false
        },
        noRounding: {
            type: Boolean,
            required: false
        }
    });

    // Define stuff that can be accessed by the page
    // defineExpose();

</script>
