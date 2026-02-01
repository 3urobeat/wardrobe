<!--
/*
 * File: threedModelViewer.vue
 * Project: wardrobe
 * Created Date: 2026-01-31 17:03:57
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-01 15:41:22
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>

    <div class="relative">
        <!-- Auto Spin toggle -->
        <button class="absolute right-0 top-0 m-4 custom-button-icon-only" :class="autoRotationEnabled ? 'bg-green-500/50!' : ''"
            title="Toggle auto rotation" @click="autoRotationEnabled = !autoRotationEnabled"
        >
            <PhArrowCounterClockwise class="ml-0.25 size-5"></PhArrowCounterClockwise>
        </button>

        <!-- Renderer Canvas Container -->
        <div
            ref="container"
            id="3d-model-viewer-container"
            class="flex w-full h-full cursor-grab items-center"
            @mousedown="rendererOnMouseDown"
            @mouseup="rendererOnMouseUp"
            @mousemove="rendererOnMouseMove"
            @mouseleave="rendererOnMouseUp"
        >
        </div>

        <!-- Indicator that canvas is rotatable -->
        <div class="absolute flex justify-between bottom-1/5 w-full">
            <PhCaretLeft class="custom-label-icon-only size-7 ml-12"></PhCaretLeft>
            <PhCaretRight class="custom-label-icon-only size-7 mr-12"></PhCaretRight>
        </div>
    </div>

</template>


<script setup lang="ts">
    import { PhArrowCounterClockwise, PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
    import * as threeJs from "three";
    import { GLTFLoader, type GLTF } from "three-stdlib";


    // Refs
    const autoRotationEnabled                      = ref(false);
    const container: Ref<HTMLDivElement|undefined> = ref();

    let scene:      threeJs.Scene<threeJs.Object3DEventMap>;
    let camera:     threeJs.PerspectiveCamera;
    let renderer:   threeJs.WebGLRenderer;
    let loader:     GLTFLoader;
    let model:      GLTF;             // Stores currently loaded GLTF model
    let boundingBox         = new threeJs.Box3();
    let rendererIsMouseDown = false;
    let rendererMouseX      = 0;
    let rendererMouseY      = 0;


    // Updates size of renderer if container got resized
    function setRendererSize() {
        try {

            const width  = container.value!.clientWidth;
            const height = container.value!.clientHeight;

            if (renderer.domElement.width != width || renderer.domElement.height != height) {
                let factor = width / boundingBox.max.x;
                renderer.setSize(width, boundingBox.max.y * factor, false); // Experimental: Attempt to scale renderer height to model
                renderer.render(scene, camera);
            }

        } catch(err) {
            console.log("Failed to set threeJs renderer size: " + err);
            throw err;
        }
    }


    function initRenderer() {
        try {

            // Create a new threeJs renderer
            scene    = new threeJs.Scene();
            camera   = new threeJs.PerspectiveCamera();
            renderer = new threeJs.WebGLRenderer({ antialias: true, alpha: true });

            // Give renderer a transparent background
            renderer.setClearColor(0x000000, 0);

            // Apply renderer to container div
            container.value!.appendChild(renderer.domElement);

            // Create some light so the model is viewable
            const light = new threeJs.AmbientLight(0xffffff, 1.0);
            scene.add(light);

            // Set a default camera position
            camera.position.z = 5;

        } catch(err) {
            console.error("Failed to init threeJs renderer: " + err);
            throw err;
        }
    }


    async function loadModel(path: string) {
        try {

            // Load the mannequin model
            loader = new GLTFLoader();
            model = await loader.loadAsync(path);

            // Experimental: Attempt to get size of model to scale renderer later
            boundingBox.setFromObject(model.scene);

            // Set default rotation
            rotateModel(props.yRotationDefault, props.xRotationDefault);

            // Add model to scene
            scene.add(model.scene);

        } catch(err) {
            console.error("Failed to load threeJs model: " + err);
            throw err;
        }
    }


    // Functions for handling model rotation using mouse - Credit: https://stackoverflow.com/a/19589151
    function rendererOnMouseMove(evt: MouseEvent) {
        if (!rendererIsMouseDown) {
            return;
        }

        evt.preventDefault();

        // Calculate delta between last known position and now, refresh last known position and render change
        let deltaX = evt.clientX - rendererMouseX;
        let deltaY = evt.clientY - rendererMouseY;
        rendererMouseX = evt.clientX;
        rendererMouseY = evt.clientY;

        rotateModel(deltaX, deltaY);
    }

    function rendererOnMouseDown(evt: MouseEvent) {
        evt.preventDefault();
        rendererIsMouseDown = true;

        // Set starting position to calculate delta on mouseMove
        rendererMouseX = evt.clientX;
        rendererMouseY = evt.clientY;
    }

    function rendererOnMouseUp(evt: MouseEvent) {
        evt.preventDefault();
        rendererIsMouseDown = false;
    }


    // Rotates model
    function rotateModel(deltaX: number, deltaY: number, ratio: number = 100) {
        if (model && model.scene) {
            model.scene.rotation.y += deltaX / ratio;
            model.scene.rotation.x += deltaY / ratio; // TODO: Can we detect full model rotation and reset values to 0?

            // Limit rotation if desired
            if (props.yRotationLimit != null && Math.abs(model.scene.rotation.y) > props.yRotationLimit) { // Check must ignore sign (positive/negative)
                model.scene.rotation.y = props.yRotationLimit * Math.sign(model.scene.rotation.y);         // Restore sign to limit in both directions
            }

            if (props.xRotationLimit != null && Math.abs(model.scene.rotation.x) > props.xRotationLimit) {
                model.scene.rotation.x = props.xRotationLimit * Math.sign(model.scene.rotation.x);
            }

            // Render rotation
            renderer.render(scene, camera);
        }
    }


    // Setup - Client Side only
    onMounted(async () => {
        try {
            // Setup renderer, load model and scale renderer to model dimensions
            initRenderer();
            await loadModel(props.modelUrl);
            setRendererSize();

            // Animate!
            const animate = () => {
                // Abort if container does not exist (e.g. on page switch)
                if (container.value != null) {
                    setRendererSize();   // Check if container got resized
                    requestAnimationFrame(animate);

                    if (autoRotationEnabled.value) {
                        rotateModel(1, 0); // Constantly rotate model
                    }
                }
            };

            renderer.render(scene, camera);
            animate();
        } catch(err) {
            console.error("Failed to setup preview viewer: " + err);
        }
    });


    // Define Props to be accepted by this component
    const props = defineProps({
        modelUrl: {
            type: String,
            required: true
        },
        yRotationDefault: {
            default: 0,
            type: Number,
            required: false
        },
        xRotationDefault: {
            default: 0,
            type: Number,
            required: false
        },
        yRotationLimit: {
            default: null,
            type: Number,
            required: false
        },
        xRotationLimit: {
            default: null,
            type: Number,
            required: false
        },
    });

    // Define stuff that can be accessed by the page
    defineExpose({
    });

</script>
