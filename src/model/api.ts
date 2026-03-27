/*
 * File: api.ts
 * Project: wardrobe
 * Created Date: 2026-03-26 18:57:42
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-27 16:29:02
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import type { StorageKind, StorageKindDataMap } from "./storage";


// Data Format returned by api routes
export type ApiResponse = {
}
// TODO


// Event types broadcasted by the 'subscribe' API Route
export enum SubscriptionEventType {
    STORAGE
}

// Event actions
export enum SubscriptionEventAction {
    NEW,
    UPDATE,
    DELETE
}

// Generic SubscriptionEvent type broadcasted by 'subscribe' API Route to client
export interface SubscriptionEvent {
    type: SubscriptionEventType,
    action: SubscriptionEventAction | null
}

// Specific SubscriptionEvent type for storage updates
export interface StorageSubscriptionEvent extends SubscriptionEvent {
    type: SubscriptionEventType.STORAGE,
    action: SubscriptionEventAction.NEW | SubscriptionEventAction.UPDATE | SubscriptionEventAction.DELETE,
    storage: StorageKind, //Omit<StorageKind, StorageKind.LOCAL_STORAGE>,
    newData: StorageKindDataMap<StorageKind>
}
