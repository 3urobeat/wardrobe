/*
 * File: useOutfitsDb.ts
 * Project: wardrobe
 * Created Date: 2025-12-06 17:28:44
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-29 16:11:02
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import nedb from "@seald-io/nedb";
import crypto from "node:crypto";
import type { Outfit } from "~/model/outfit";
import { serverGenerateOutfitPreviewImage } from "~/composables/outfitPreviewImage";


// Load database
const outfitsDb = new nedb({ filename: "data/database/outfits.db", autoload: true });


/**
 * Provide function to access Database instance from API
 * @returns Nedb database instance
 */
/* export function useOutfitsDb() {
    return outfitsDb;
} */


/**
 * Inserts a new outfit or updates an existing one
 * @param outfit Outfit data to set. Leave id field empty to insert new outfit
 * @returns
 */
export async function upsertOutfit(outfit: Outfit) {

    // Generate identifier for new outfit
    if (!outfit.id) {
        outfit.id = crypto.randomUUID();
    }

    // Re-generate preview image // TODO: ...when previewImgPath == null or imgPath of referenced clothing has changed
    const newPreviewImg = await serverGenerateOutfitPreviewImage(outfit);

    if (newPreviewImg) {
        outfit.previewImgPath = newPreviewImg;
    }

    // Update metadata
    if (!outfit.addedTimestamp) {
        outfit.addedTimestamp = Date.now();
    }

    outfit.modifiedTimestamp = Date.now();

    return outfitsDb.updateAsync({ id: outfit.id }, { $set: outfit }, { upsert: true, returnUpdatedDocs: true })
        .then((res) => {
            return {
                success: true,
                message: "",
                document: res.affectedDocuments
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err,
                document: null
            };  // TODO: Does this return work?
        });

}

/**
 * Deletes an outfit
 * @param outfitID ID of the outfit to remove
 * @returns
 */
export async function deleteOutfit(outfitID: string) {

    return outfitsDb.removeAsync({ id: outfitID }, { })
        .then(() => {
            return {
                success: true,
                message: ""
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err
            };  // TODO: Does this return work?
        });

}

/**
 * Retrieves one or all outfits from the database
 * @param id Optional: ID of the outfit to retrieve. Leave empty to get all outfits
 * @returns Returns an array of all matching outfits
 */
export async function getOutfit(id: string|null): Promise<Outfit[]> {
    return await outfitsDb.findAsync(id ? { id: id } : {});
}

/**
 * Retrieves all outfits containing a piece of clothing
 * @param clothingID ID of clothing to search for
 * @returns Returns an array of outfits
 */
export async function getOutfitsContainingClothing(clothingID: string): Promise<Outfit[]> {
    return await outfitsDb.findAsync({ clothes: { $elemMatch: { clothingID: clothingID } } });
}
