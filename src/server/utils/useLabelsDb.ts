/*
 * File: useLabelsDb.ts
 * Project: wardrobe
 * Created Date: 2025-12-06 17:28:44
 * Author: 3urobeat
 *
 * Last Modified: 2026-01-01 13:55:48
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 - 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import nedb from "@seald-io/nedb";
import type { Label } from "~/model/label";
import type { Category } from "~/model/label-category";


// Load database
const labelsDb          = new nedb({ filename: "data/database/labels.db", autoload: true });
const labelCategoriesDb = new nedb({ filename: "data/database/label-categories.db", autoload: true });


/**
 * Provide function to access Database instance from API
 * @returns Nedb database instance
 */
/* export function useLabelsDb() {
    return labelsDb;
} */


/**
 * Inserts new or updates existing label
 * @param label Label to upsert. Leave id field empty to insert new label
 * @returns
 */
function upsertLabel(label: Label) {

    // Generate identifier for new label
    if (!label.id) {
        label.id = crypto.randomUUID();
    }

    return labelsDb.updateAsync({ id: label.id }, { $set: label }, { upsert: true, returnUpdatedDocs: true })
        .then((res) => {
            return {
                success: true,
                message: "",
                document: res.affectedDocuments
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err,
                document: null
            };  // TODO: Does this return work?
        });

}

/**
 * Inserts new or updates existing labels
 * @param labels Labels to upsert. Leave id field of new labels empty
 * @returns
 */
export async function upsertLabels(labels: Label[]) {

    // Call upsertLabel for every label and await all resulting promises
    return Promise.all(labels.map((e) => upsertLabel(e)))
        .then((res) => {
            return {
                success: true,
                message: "",
                document: res.map((e) => e.document)
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err,
                document: null
            };  // TODO: Does this return work?
        });

}


/**
 * Removes label
 * @param labelID Label ID to remove
 * @returns
 */
function removeLabel(labelID: string) {

    return labelsDb.removeAsync({ id: labelID }, {})
        .then((res) => {
            return {
                success: true,
                message: ""
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err
            };  // TODO: Does this return work?
        });

}

/**
 * Removes list of labels
 * @param labelIDs Labels to remove
 * @returns
 */
export async function removeLabels(labelIDs: string[]) {

    // Call removeLabel for every label and await all resulting promises
    return Promise.all(labelIDs.map((e) => removeLabel(e)))
        .then((res) => {
            return {
                success: true,
                message: ""
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err
            };  // TODO: Does this return work?
        });

}

/**
 * Retrieves all labels from the database
 * @returns Returns an array of all matching labels
 */
export async function getAllLabels(): Promise<Label[]> {
    return await labelsDb.findAsync({});
}



/**
 * Inserts new or updates existing category
 * @param category Category to upsert. Leave id field empty to insert new category
 * @returns
 */
function upsertLabelCategory(category: Category) {

    // Generate identifier for new category
    if (!category.id) {
        category.id = crypto.randomUUID();
    }

    return labelCategoriesDb.updateAsync({ id: category.id }, { $set: category }, { upsert: true, returnUpdatedDocs: true })
        .then((res) => {
            return {
                success: true,
                message: "",
                document: res.affectedDocuments
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err,
                document: null
            };  // TODO: Does this return work?
        });

}

/**
 * Inserts new or updates existing categories
 * @param categories Categories to upsert. Leave id field of new categories empty
 * @returns
 */
export async function upsertLabelCategories(categories: Category[]) {

    // Call upsertLabelCategory for every category and await all resulting promises
    await Promise.all(categories.map((e) => upsertLabelCategory(e)))
        .then((res) => {
            return {
                success: true,
                message: "",
                //document: res.affectedDocuments
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err,
                document: null
            };  // TODO: Does this return work?
        });

}

/**
 * Removes category
 * @param categoryID Category ID to remove
 * @returns
 */
function removeLabelCategory(categoryID: string) {

    return labelCategoriesDb.removeAsync({ id: categoryID }, {})
        .then((res) => {
            return {
                success: true,
                message: ""
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err
            };  // TODO: Does this return work?
        });

    // TODO: Delete labels referencing this category

}

/**
 * Removes list of categories
 * @param categoryIDs Labels to remove
 * @returns
 */
export async function removeLabelCategories(categoryIDs: string[]) {

    // Call removeLabelCategory for every category and await all resulting promises
    return Promise.all(categoryIDs.map((e) => removeLabelCategory(e)))
        .then((res) => {
            return {
                success: true,
                message: ""
            };
        })
        .catch((err) => {
            return {
                success: false,
                message: err
            };  // TODO: Does this return work?
        });

}

/**
 * Retrieves all labels from the database
 * @returns Returns an array of all matching labels
 */
export async function getAllLabelCategories(): Promise<Category[]> {
    return await labelCategoriesDb.findAsync({});
}
