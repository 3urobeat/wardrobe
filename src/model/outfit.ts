/*
 * File: outfit.ts
 * Project: wardrobe
 * Created Date: 2025-09-09 20:13:08
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-28 14:47:03
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { Implements } from "./Implements";
import type { Item } from "./item";


// Implements Item
export type Outfit = Implements<Item, {
    id: string,
    title: string,
    clothes: { order: number, clothingID: string }[],
    labelIDs: string[], // Label[]
    addedTimestamp: number,
    modifiedTimestamp: number
}>
