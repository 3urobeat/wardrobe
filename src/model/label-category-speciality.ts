/*
 * File: label-category-speciality.ts
 * Project: wardrobe
 * Created Date: 2026-01-17 17:38:27
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-19 12:23:35
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


// UUID for each category speciality
export enum CategorySpecialityID {
    "No_Speciality" = "",
    "Body_Part"     = "7d243965-be43-4ab6-b6ac-721e942f38d3",   // No extra function on label
    "Color"         = "ee83f116-fa27-40f7-bdb8-13a2084c1a6f",   // Label should allow picking hex color
    "Season"        = "9217222d-d61a-49fc-b989-46ec84af48a7"    // Label should allow choosing temperature range
}

// I dislike that this is a separately defined enum but I needed to iterate over it in labels page
export enum CategorySpecialityBodyPartValue {
    Head = "Head",
    Arms = "Arms",
    Hands = "Hands",
    Torso = "Torso",
    Legs = "Legs",
    Feet = "Feet"
}


// Maps what a CategorySpeciality expects the label to save. If undefined, label should not display input field. - Thank you @DerDeathraven for TS magic!
export type CategorySpecialityLabelValueMap<T extends CategorySpecialityID> = {
    [CategorySpecialityID.No_Speciality]: null;
    [CategorySpecialityID.Body_Part]:     CategorySpecialityBodyPartValue;
    [CategorySpecialityID.Color]:         `#${string}`;
    [CategorySpecialityID.Season]:        { fromTemp: string, toTemp: string, fromTimestamp: number, toTimestamp: number };
}[T]


export type CategorySpeciality = {
    id: CategorySpecialityID,
    name: string,
    description: string,                                            // Displayed on label
    value: CategorySpecialityLabelValueMap<CategorySpecialityID>    // If undefined, label should not display any selector
}


// Default initialisations
export const CategorySpecialityNoSpeciality: CategorySpeciality = {
    id: CategorySpecialityID.No_Speciality,
    name: "No speciality",
    description: "",
    value: null
} as const;

export const CategorySpecialityBodyPart: CategorySpeciality = {
    id: CategorySpecialityID.Body_Part,
    name: "Body Part",
    description: "Location on Body",
    value: CategorySpecialityBodyPartValue.Head
} as const;

export const CategorySpecialityColor: CategorySpeciality = {
    id: CategorySpecialityID.Color,
    name: "Color",
    description: "Hex Color Code",
    value: "#000000",
} as const;

export const CategorySpecialitySeason: CategorySpeciality = {
    id: CategorySpecialityID.Season,
    name: "Season",
    description: "Temperature Range",
    value: { fromTemp: "", toTemp: "", fromTimestamp: 0, toTimestamp: 0 }
} as const;

export const CategorySpecialityMap = {
    [CategorySpecialityID.No_Speciality]: CategorySpecialityNoSpeciality,
    [CategorySpecialityID.Body_Part]: CategorySpecialityBodyPart,
    [CategorySpecialityID.Color]: CategorySpecialityColor,
    [CategorySpecialityID.Season]: CategorySpecialitySeason
} as const;
// I don't like this, I feel like this could be done better

// All supported specialities in an array to iterate over it in labels page
export const CategorySpecialities: CategorySpeciality[] = Object.values(CategorySpecialityMap);
