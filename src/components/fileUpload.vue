<!--
/*
 * File: fileUpload.vue
 * Project: wardrobe
 * Created Date: 2025-12-06 19:23:27
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-06 23:06:58
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

    <!-- Full size container, accepts drag and drop upload -->
    <div
        @dragover="dragOver"
        @dragleave="dragLeave"
        @drop="drop"
    >
        <!-- File picker upload, hidden to hide ugly text -->
        <input
            id="file-input"
            type="file"
            @change="onChange"
            accept=".jpg,.jpeg,.png,.gif"
            hidden
        />

        <!-- Full size label without text that triggers file input -->
        <label for="file-input" class="absolute w-full h-full cursor-pointer"></label>
    </div>

</template>


<script setup lang="ts">

    // Refs
    const isDragging: Ref<boolean> = ref(false);


    // Process image upload
    async function uploadImg(file: File) {
        // Construct form to post
        const formData = new FormData();
        formData.append("file", file);
        //formData.append("imgType", "clothing"); // TODO: Image type is hardcoded

        try {

            // Attempt to post file to upload-img API endpoint
            const res = await fetch("/api/upload-img", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw("Failed to upload image: " + res.statusText);
            }

            // Get file name from response
            const resBody = await res.json();

            // Emit uploadSuccess event for parent to listen for
            emit("uploadSuccess", resBody.fileName);

        } catch(err) {
            throw("Failed to upload image: " + err);
        }
    }

    // Handle file picker
    function onChange(e: Event) {
        const input = e.target as HTMLInputElement;

        if (input && input.files && input.files.length > 0) {
            uploadImg(input.files.item(0)!);
        }
    }

    // Handle drag and drop
    function dragOver(e: Event) {
        e.preventDefault();
        isDragging.value = true;
    }

    function dragLeave() {
        isDragging.value = false;
    }

    function drop(e: DragEvent) {
        e.preventDefault();

        const t = e.dataTransfer;

        if (t && t.files.length > 0) {
            uploadImg(t.files.item(0)!);
        }

        isDragging.value = false;
    }


    // Define Props to be accepted by this component
    /* defineProps({

    }); */

    // Define stuff that can be accessed by the page
    /* defineExpose({

    }); */

    const emit = defineEmits(["uploadSuccess"]);

</script>
