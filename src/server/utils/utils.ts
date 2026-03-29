/*
 * File: utils.ts
 * Project: wardrobe
 * Created Date: 2026-03-27 16:50:16
 * Author: 3urobeat
 *
 * Last Modified: 2026-03-29 19:23:20
 * Modified By: 3urobeat
 *
 * Copyright (c) 2026 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { IncomingMessage } from "http";


/**
 * Gets IP of client who sent the request
 * @param req Incoming request
 * @returns IP
 */
export function getIpFromRequest(req: IncomingMessage) {
    return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress).replace("::ffff:", "");
}


/**
 * Constructs prefix that is used in all API log messages
 * @param event Incoming request event
 * @returns String to be used as log message prefix
 */
export function apiLogPrefix(event: any) {
    return `[API] ${event.node.req.method} '${event.node.req.url}' from ${getIpFromRequest(event.node.req)}:`;
}
