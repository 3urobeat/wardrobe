/*
 * File: getItemsToShow.ts
 * Project: wardrobe
 * Created Date: 2025-09-17 17:25:36
 * Author: 3urobeat
 *
 * Last Modified: 2025-09-19 19:01:24
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Item } from "~/model/item";


/**
 * Returns items to display based on selectedSort & selectedFilters
 * @param storedItems
 * @param selectedSort
 * @param selectedFilters
 */
export default function(storedItems: Item[], selectedSort?: string, selectedFilters?: string[]) {

    // Apply filter
    if (selectedFilters && selectedFilters.length > 0) {
        storedItems = storedItems.filter(e => e.labels.some(f => selectedFilters.includes(f.name)));
    }

    // Apply sort to storedItems
    switch (selectedSort) {
        case "date-desc":
            storedItems = storedItems.sort((a, b) => b.addedTimestamp - a.addedTimestamp);
            break;

        case "date-asc":
            storedItems = storedItems.sort((a, b) => a.addedTimestamp - b.addedTimestamp);
            break;

        case "name-desc":
            storedItems = storedItems.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0)); /* TODO: Does not sort e.g. "Bc 1" & "Bd 2" */
            break;

        case "name-asc":
            storedItems = storedItems.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0));
            break;

        default:
            break; // Sorted by ID, invisible to user
    }

    return storedItems;

}
