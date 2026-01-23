/*
 * File: rm-labels.ts
 * Project: wardrobe
 * Created Date: 2025-12-27 11:55:39
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-23 22:39:50
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { removeLabelCategories, removeLabels } from "~/server/utils/useLabelsDb";


/**
 * This API route deletes labels and label categories
 * Params: { labelIDs?: string[], categoryIDs?: string[] }
 * Returns:
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || (!params.labelIDs && !params.categoryIDs)) {
        throw createError({
            statusCode: 400,
            statusMessage: "No labelIDs or categoryIDs to remove!",
        });
    }

    console.log("API rm-labels: Received request for: ", params.labelIDs, params.categoryIDs);

    // Ask db helper to process entries
    let labelRmRes;
    if (params.labelIDs) {
        labelRmRes = await removeLabels(params.labelIDs);
    }

    let categoryRmRes;
    if (params.categoryIDs) {
        categoryRmRes = await removeLabelCategories(params.categoryIDs);
    }

    // TODO: Process failure, return success/failure info

    return labelRmRes;

});
