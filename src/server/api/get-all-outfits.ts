/*
 * File: get-all-outfits.ts
 * Project: wardrobe
 * Created Date: 2025-09-10 16:55:08
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-12 20:58:00
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getOutfit } from "~/server/utils/useOutfitsDb";


/**
 * This API route gets all stored outfits and returns them
 * Params: {}
 * Returns: { }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    console.debug("API get-all-outfits: Received request");

    // Ask db helper to retrieve items
    const outfits = getOutfit(null);

    return outfits;

});
