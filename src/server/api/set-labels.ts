/*
 * File: set-labels.ts
 * Project: wardrobe
 * Created Date: 2025-12-08 17:43:05
 * Author: 3urobeat
 *
 * Last Modified: 2026-02-12 20:59:05
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { upsertLabelCategories, upsertLabels } from "~/server/utils/useLabelsDb";


/**
 * This API route inserts/updates labels and label categories
 * Params: { labels?: Label[], categories?: Category[] }
 * Returns:
 */


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

    console.debug("API set-labels: Received request for: ", params.labels, params.categories);

    // Ask db helper to process entries
    let categoriesRes;
    if (params.categories) {
        categoriesRes = await upsertLabelCategories(params.categories);
    }

    let labelsRes;
    if (params.labels) {
        labelsRes = await upsertLabels(params.labels);
    }

    // TODO: Process failure, return success/failure info

    return labelsRes;

});
