/*
 * File: label.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 21:59:50
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-26 15:11:06
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * Implements type definitions and operations on labels & categories
 */


export type Label = {
    id: string,
    name: string,
    orderIndex: number, // Floating point number
    categoryID: string
}

/**
 * Helper: Gets a new last orderIndex for (unsorted) list of labels
 * @param list List of labels to analyze
 * @returns {number} New last orderIndex floating point number. If list is empty, 0.0 will be returned.
 */
export function getNewLastLabelOrderIndex(list: Label[]) {
    if (!list || list.length == 0) return 0.0;

    // Quickly find the currently greatest orderIndex
    let thisOrderIndex = list[0]!.orderIndex;
    let max = thisOrderIndex;

    for (let i = 1; i < list.length; i++) {
        thisOrderIndex = list[i]!.orderIndex;
        if (thisOrderIndex > max) max = thisOrderIndex;
    }

    // Remove decimals and add 1.0 to get new index
    return Math.trunc(max) + 1.0;
}

/**
 * Helper: Calculates orderIndex to position new element between two existing elements
 * @param el1 Preceding list element
 * @param el2 Succeeding list element
 * @returns {number} Floating point number half way between el1 & el2
 */
export function getLabelOrderIndexBetween(el1: Label, el2: Label) {
    if (!el1 || !el2) throw("Parameters el1 & el2 must not be undefined");

    return (el1.orderIndex + el2.orderIndex) / 2;
}


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
