/*
 * File: get-image.ts
 * Project: wardrobe
 * Created Date: 2025-12-06 18:05:20
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-27 21:46:17
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getImage } from "~/composables/useImagesStorage";


/**
 * This API route retrieves an image by file path from storage and serves it as base64 encoded blob
 * Params: { filePath: string }
 * Returns: string
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || params.filePath === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "filePath parameter is required"
        });
    }

    console.log(`API get-image: Received request to retrieve image '${params.filePath}'...`);

    // Request item // TODO: Image access restricions?
    const item = await getImage(params.filePath);

    if (!item) {
        throw createError({
            statusCode: 500,
            statusMessage: "No matching image found"
        });
    }

    return item.toString("base64");

});
