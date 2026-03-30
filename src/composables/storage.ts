/*
 * File: storage.ts
 * Project: wardrobe
 * Created Date: 2026-03-23 21:34:56
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-30 17:10:21
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Clothing, Outfit } from "~/model/item";
import type { Label } from "~/model/label";
import type { Category } from "~/model/label-category";
import { defaultServerSettings, StorageKind, type CachedImage, type ServerSettings, type StorageKindDataMap } from "~/model/storage";


// The type of storage kinds we want to cache here. They all have an ID prop, which is used for add/update/remove actions
type CachableStorageKind =
  | StorageKind.CLOTHES
  | StorageKind.LABEL_CATEGORIES
  | StorageKind.LABELS
  | StorageKind.OUTFITS
  | StorageKind.IMAGES;


// Cache
class Cache<T extends CachableStorageKind> {
    data: Ref<StorageKindDataMap<T>[]> = ref([]);

    // Adds to array and returns new length
    add(elem: StorageKindDataMap<T>): number {
        return this.data.value.push(elem);
    }
    // Flat-adds array to array and returns new length
    addArray(elem: StorageKindDataMap<T>[]): number {
        return this.data.value.push(...elem);
    }

    // Updates element with matching ID or inserts a new one and returns index
    upsert(elem: StorageKindDataMap<T>): number {
        const index = this.data.value.findIndex((e) => e.id == elem.id);

        if (index == -1) {
            return this.add(elem) - 1; // -1 since add() returns new array length
        } else {
            this.data.value[index] = elem;
            return index;
        }
    }

    // Removes any elements with matching ID and returns new length
    remove(elem: StorageKindDataMap<T>): number {
        this.data.value = this.data.value.filter((e) => e.id != elem.id);
        return this.data.value.length;
    }
    // Removes array of IDs and returns new length
    removeArray(ids: string[]): number {
        this.data.value = this.data.value.filter((e) => !ids.includes(e.id));
        return this.data.value.length;
    }
}
// TODO: Test Reactivity
// TODO: Limit size
// TODO: Establish cache update socket with server


const cachedImages     = new Cache<StorageKind.IMAGES>();
const storedLabels     = new Cache<StorageKind.LABELS>();
const storedCategories = new Cache<StorageKind.LABEL_CATEGORIES>();

const storedServerSettings: Ref<ServerSettings> = ref({} as ServerSettings); // Does not use Cache as it's just a singular object


async function sendApiRequest(route: string, data: object): Promise<any> {
    const res = await fetch("/api/" + route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return await res.json();
}

export async function initGlobalCache()  {
    console.debug("[DEBUG] Initializing global cache...");

    const [labels, categories, settings] = await Promise.all([
        useFetch("/api/get-all-labels"),
        useFetch("/api/get-all-label-categories"),
        useFetch("/api/get-settings")
    ]);

    storedLabels.data          = ref(labels.data.value as Label[]);
    storedCategories.data      = ref(categories.data.value!);
    storedServerSettings.value = settings.data.value!;
}


/*
    -------------------- CLOTHES --------------------
*/

export async function getAllClothesFromServer(): Promise<Clothing[]> {
    return (await useFetch("/api/get-all-clothes")).data.value!;
}

export async function getClothingFromServer(id: string): Promise<Clothing> {
    return await sendApiRequest("get-clothing", { id: id });
}

export async function setClothingToServer(data: Clothing) {
    return await sendApiRequest("set-clothing", { clothing: data });
}

export async function rmClothingToServer(id: string) {
    return await sendApiRequest("rm-clothing", { id: id });
}


/*
    -------------------- OUTFITS --------------------
*/

export async function getAllOutfitsFromServer(): Promise<Outfit[]> {
    return (await useFetch("/api/get-all-outfits")).data.value!;
}

export async function getOutfitFromServer(id: string): Promise<Outfit> {
    return await sendApiRequest("get-outfit", { id: id });
}

export async function setOutfitToServer(data: Outfit) {
    return await sendApiRequest("set-outfit", { outfit: data });
}

export async function rmOutfitToServer(id: string) {
    return await sendApiRequest("rm-outfit", { id: id });
}


/*
    -------------------- LABELS --------------------
*/

export function getAllLabelsFromServer(): Ref<Label[]> {
    return storedLabels.data;
}

export function getAllLabelCategoriesFromServer(): Ref<Category[]> {
    return storedCategories.data;
}

export async function setCategoriesAndLabelsToServer(categoryData: Category[] | undefined, labelsData: Label[] | undefined) {
    const resBody = await sendApiRequest("set-labels", {
        categories: categoryData,
        labels: labelsData
    });

    if (resBody.success) {
        if (categoryData) storedCategories.addArray(categoryData);
        if (labelsData)   storedLabels.addArray(labelsData);
    }

    return resBody;
}

export async function rmLabelsToServer(categoryIDs: string[] | undefined, labelIDs: string[] | undefined) {
    const resBody = await sendApiRequest("rm-labels", {
        categoryIDs: categoryIDs,
        labelIDs: labelIDs
    });

    if (resBody.success) {
        if (categoryIDs) storedCategories.removeArray(categoryIDs);
        if (labelIDs)    storedLabels.removeArray(labelIDs);
    }

    return resBody;
}


/*
    -------------------- SETTINGS --------------------
*/

export function getServerSettingsFromServer(): Ref<ServerSettings> {
    return storedServerSettings; // TODO: Error handling
}

export async function setServerSettingsToServer(data: ServerSettings) {
    const resBody = await sendApiRequest("rm-labels", data);

    if (resBody.success) {
        storedServerSettings.value = data;
    }

    return resBody;
}


/*
    -------------------- IMAGES --------------------
*/

/**
 * Helper function to get image from server
 * @param imgPath File path to request
 * @param width Optional: Request scaled down image
 * @returns Returns image blob as string on success
 */
export async function getImageFromServer(imgPath: string, width: number | undefined): Promise<CachedImage | null> {
    if (!imgPath) return null;

    // Attempt to find image with matching size (or none) in cache
    const cachedImg = cachedImages.data.value.find((e) => e.id == imgPath && e.imgWidth == width);

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

    const imageBlob = await res.text(); // TODO: Adapt route to return JSON and use sendApiRequest()

    // Add to cache
    const cacheLength = cachedImages.add({ id: imgPath, imgBlob: imageBlob, imgWidth: width });
    console.debug(`[DEBUG] getImageFromServer: Fetched image '${imgPath}' from server. Image cache has ${cacheLength} entries now.`);

    return cachedImages.data.value[cacheLength - 1] as CachedImage;
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
    // TODO: Return imgBlob from API route and replace every matching imgPath using map() instead of deleting them
    cachedImages.remove({ id: resBody.filePath, imgBlob: "", imgWidth: 0 });
    console.debug(`[DEBUG] sendImageToServer: Removed '${resBody.filePath}' from image cache...`);

    return resBody;

}
