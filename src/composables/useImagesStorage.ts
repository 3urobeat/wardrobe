/*
 * File: useImagesStorage.ts
 * Project: wardrobe
 * Created Date: 2025-12-06 17:28:44
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-27 21:51:17
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import crypto from "node:crypto";

// Use images storage - storage bucket is defined in nuxt.config.ts
const imagesStorage = useStorage("images");


/**
 * Retrieves an image from storage
 * @param filePath File path of the image to retrieve
 * @returns Image buffer
 */
export async function getImage(filePath: string): Promise<Buffer<ArrayBufferLike>|null> {
    if (!filePath) throw("filePath parameter is required");

    // Get item
    const item = await imagesStorage.getItemRaw(filePath);

    if (!item) {
        console.error(`Server getImage: No image found at '${filePath}'!`);
        return null;
    }

    return item;
}


/**
 * Saves an image to the image storage
 * @param type Type of image, used as directory name in storage
 * @param fileBuffer File buffer to save
 * @returns Path of image in storage
 */
export async function saveImage(type: string, fileBuffer: Buffer<ArrayBufferLike>): Promise<string> {
    if (!fileBuffer) throw("File parameter is required");

    try {

        // Calculate hash from buffer
        const hash = crypto.createHash("sha256");
        hash.update(fileBuffer);

        // Save file with hash as name
        const fileName = hash.digest("hex");
        const path = `${type}/${fileName}`;
        await imagesStorage.setItemRaw(path, fileBuffer); // TODO: Image type is hardcoded

        return path;

    } catch (err) {
        console.error("Server saveImage: Failed to upload image! " + err);
        throw("Failed to upload file!");
    }

}
