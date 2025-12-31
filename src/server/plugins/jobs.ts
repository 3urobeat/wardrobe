/*
 * File: jobs.ts
 * Project: wardrobe
 * Created Date: 2025-12-29 14:47:41
 * Author: 3urobeat
 *
 * Last Modified: 2025-12-31 14:03:25
 * Modified By: 3urobeat
 *
 * Copyright (c) 2025 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { Job } from "~/model/job";

// Import core jobs
import dataCleanupJob from "../utils/jobs/dataCleanup";


let _jobInterval; // eslint-disable-line @typescript-eslint/no-unused-vars
const _registeredJobs: Job[] = [];


/**
 * Registers a job.
 * @throws Throws exception if Job with that name is already registered
 * @param job Job to register
 */
export function registerJob(job: Job) {

    // Check for duplicate name
    if (_registeredJobs.some((e) => e.info.name == job.info.name)) {
        throw("A Job with that is already registered");
    }

    console.log(`DEBUG Jobs Plugin: Registering job '${job.info.name}' which executes ${job.info.runOnRegistration ? "now and then " : ""}every ${job.info.interval}ms`);

    // Check if job shall run on registration
    if (job.info.runOnRegistration) {
        job.run();
        job.info._lastExecTimestamp = Date.now();
    } else {
        job.info._lastExecTimestamp = 0;
    }

    // Register job
    job.info._registeredAt = Date.now();
    _registeredJobs.push(job);

}


/**
 * Unregisters a job
 * @param jobName Name of the job to unregister
 */
export function unregisterJob(jobName: string) {

    // Search for job
    const index = _registeredJobs.findIndex((e) => e.info.name === jobName);

    // Check if job does not exist
    if (index === -1) {
        throw("No job with that name exists!");
    }

    // Remove job
    _registeredJobs.splice(index, 1);

}


/**
 * Internal: Runs all due jobs
 */
function _runDueJobs() {

    _registeredJobs.forEach((job) => {
        if (job.info._lastExecTimestamp! + job.info.interval < Date.now()) {
            console.log(`DEBUG - JobManager: Running due job '${job.info.name}'...`);

            job.run();

            job.info._lastExecTimestamp = Date.now();
        }
    });

}


/**
 * Returns all registered jobs
 * @returns All registered jobs
 */
export function getRegisteredJobs(): Job[] {
    return _registeredJobs;
}


// This function is executed when the server starts up
export default defineNitroPlugin(() => {

    // Register interval for checking for due jobs
    _jobInterval = setInterval(() => {
        _runDueJobs();
    }, 1000);

    // Call register for internal jobs after 30 seconds
    console.log("DEBUG - Jobs Plugin: Registering core jobs in 30 seconds...");

    setTimeout(() => {
        registerJob(dataCleanupJob);
    }, 30000);

});
