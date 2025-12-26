/*
 * File: set-labels.ts
 * Project: wardrobe
 * Created Date: 2025-12-08 17:43:05
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-26 22:17:32
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { upsertLabelCategories, upsertLabels } from "~/composables/useLabelsDb";


/**
 * This API route inserts/updates labels and label categories
 * Params: { labels: Label[]?, categories: Category[]? }
 * Returns:
 */

/* {
    id: "0",
    name: "Winter",
    categoryID: "0"
},
{
    id: "4",
    name: "Blue",
    categoryID: "4"
} */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || (!params.labels && !params.categories)) {
        throw createError({
            statusCode: 400,
            statusMessage: "No labels or categories to set!",
        });
    }

    console.log("API set-labels: Received request for: ", params.labels, params.categories);

    // Ask db helper to upsert entries
    let categoriesRes;

    if (params.categories) {
        categoriesRes = await upsertLabelCategories(params.categories);
    }

    /* if (!categoriesRes) { // TODO: Abort if setting categories already failed
        return categoriesRes;
    } */

    let labelsRes;

    if (params.labels) {
        labelsRes = await upsertLabels(params.labels);
    }

    return labelsRes;

});
