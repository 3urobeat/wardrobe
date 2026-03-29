/*
 * File: storage.ts
 * Project: wardrobe
 * Created Date: 2026-03-23 21:34:56
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-29 15:54:34
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Label } from "~/model/label";
import type { Category } from "~/model/label-category";
import type { CachedImage, ServerSettings } from "~/model/storage";


// Cache
const storedLabels: Ref<Label[]> = ref([]);
const storedCategories: Ref<Category[]> = ref([]);
const storedServerSettings: Ref<ServerSettings> = ref({} as ServerSettings);
const cachedImages: Ref<CachedImage[]> = ref([]);
// TODO: Test Reactivity
// TODO: Limit size
// TODO: Establish cache update socket with server


export async function initLabels() {
    storedLabels.value = (await useFetch("/api/get-all-labels")).data.value!;
}

export function getAllLabelsFromServer(): Ref<Label[]> {
    return storedLabels;
}

export async function initLabelCategories() {
    storedCategories.value = (await useFetch("/api/get-all-label-categories")).data.value!;
}

export function getAllLabelCategoriesFromServer(): Ref<Category[]> {
    return storedCategories;
}

export async function setCategoriesAndLabelsToServer(categoryData: Category[] | undefined, labelsData: Label[] | undefined) {
    const setRes = await fetch("/api/set-labels", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            categories: categoryData,
            labels: labelsData
        })
    });

    const resBody = await setRes.json();

    if (resBody.success) {
        if (categoryData) storedCategories.value.push(...categoryData);
        if (labelsData)   storedLabels.value.push(...labelsData);
    }

    return resBody;
}

export async function rmLabelsToServer(categoryIDs: string[] | undefined, labelIDs: string[] | undefined) {
    const rmRes = await fetch("/api/rm-labels", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            categoryIDs: categoryIDs,
            labelIDs: labelIDs
        })
    });

    const resBody = await rmRes.json();

    if (resBody.success) {
        if (categoryIDs) storedCategories.value = storedCategories.value.filter((e) => !categoryIDs.includes(e.id));
        if (labelIDs)    storedLabels.value     = storedLabels.value.filter((e) => !labelIDs.includes(e.id));
    }

    return resBody;
}

export async function initServerSettings() {
    storedServerSettings.value = (await useFetch("/api/get-settings")).data.value!;
}

export function getServerSettingsFromServer(): Ref<ServerSettings> {
    return storedServerSettings; // TODO: Error handling
}

export async function setServerSettingsToServer(data: ServerSettings) {
    const stringifiedData = JSON.stringify(data);

    const res = await fetch("/api/set-settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: stringifiedData
    })

    const resBody = await res.json();

    if (resBody.success) {
        storedServerSettings.value = data;
    }

    return resBody;
}


/**
 * Helper function to get image from server
 * @param imgPath File path to request
 * @param width Optional: Request scaled down image
 * @returns Returns image blob as string on success
 */
export async function getImageFromServer(imgPath: string, width: number | undefined): Promise<CachedImage | null> {
    if (!imgPath) return null;

    // Attempt to find image with matching size (or none) in cache
    const cachedImg = cachedImages.value.find((e) => e.imgPath == imgPath && e.imgWidth == width);

    if (cachedImg) {
        console.debug(`[DEBUG] getImageFromServer: Found image '${imgPath}' in cache!`);
        return cachedImg;
    }

    // Fetch image from server
    const res = await fetch("/api/get-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filePath: imgPath,
            width: width
        })
    });

    const imageBlob = await res.text();

    // Add to cache
    const cacheLength = cachedImages.value.push({ imgPath: imgPath, imgBlob: imageBlob, imgWidth: width });
    console.debug(`[DEBUG] getImageFromServer: Fetched image '${imgPath}' from server. Image cache has ${cacheLength} entries now.`);

    return cachedImages.value[cacheLength - 1] as CachedImage;
}


/**
 * Sends new image to server and updates cache
 * @param file File to send
 * @returns API response body
 */
export async function sendImageToServer(file: File): Promise<any> {

    // Construct form to post
    const formData = new FormData();
    formData.append("file", file);
    //formData.append("imgType", "clothing"); // TODO: Image type is hardcoded

    // Attempt to post file to API
    const res = await fetch("/api/set-clothing-image", {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw("Failed to upload image: " + res.statusText);
    }

    // Get file name from response
    const resBody = await res.json();

    // Remove all references of image from cache to fetch next usage from server again
    // TODO: Return imgBlob from API route and replace every matching imgPath using map()
    cachedImages.value = cachedImages.value.filter((e) => {
        const match = e.imgPath == resBody.filePath;
        if (match) console.debug(`[DEBUG] sendImageToServer: Removing '${resBody.filePath}' from image cache...`);
        return !match;
    });

    return resBody;

}
