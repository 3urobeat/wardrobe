/*
 * File: label-category.ts
 * Project: wardrobe
 * Created Date: 2025-12-31 17:00:33
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-01 14:03:45
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Label } from "./label";


export type Category = {
    id: string,
    name: string
}

/**
 * Helper: Gets all labels belonging to a specified category
 * @param list List of labels to analyze
 * @param categoryID ID of Category to filter for
 * @returns {Label[]} Array of labels from `list` belonging to `categoryID`
 */
export function getLabelsOfCategory(list: Label[], categoryID: string) {
    return list.filter((e) => e.categoryID == categoryID);
}
