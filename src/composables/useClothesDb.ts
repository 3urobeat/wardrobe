/*
 * File: useClothesDb.ts
 * Project: wardrobe
 * Created Date: 2025-12-06 17:28:44
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 14:51:32
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
import type { Clothing } from "~/model/clothing";


// Load database
const clothesDb = new nedb({ filename: "data/database/clothes.db", autoload: true });


/**
 * Provide function to access Database instance from API
 * @returns Nedb database instance
 */
/* export function useClothesDb() {
    return clothesDb;
} */


/**
 * Inserts a new piece of clothing or updates an existing one
 * @param clothing Clothing data to set. Leave id field empty to insert new clothing
 * @returns
 */
export async function upsertClothing(clothing: Clothing) {

    // Generate identifier for new piece of clothing
    if (!clothing.id) {
        clothing.id = crypto.randomUUID();
    }

    // Update metadata
    if (!clothing.addedTimestamp) {
        clothing.addedTimestamp = Date.now();
    }

    clothing.modifiedTimestamp = Date.now();

    return clothesDb.updateAsync({ id: clothing.id }, { $set: clothing }, { upsert: true, returnUpdatedDocs: true })
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
 * Deletes a piece of clothing
 * @param clothingID ID of the clothing to remove
 * @returns
 */
export async function deleteClothing(clothingID: string) {

    return clothesDb.removeAsync({ id: clothingID }, { })
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
 * Retrieves a piece of clothing or all from the database
 * @param id Optional: ID of the clothing to retrieve. Leave empty to get all clothes
 * @returns Returns an array of all matching clothes
 */
export async function getClothing(id: string|null): Promise<Clothing[]> {
    return await clothesDb.findAsync(id ? { id: id } : {});
}
