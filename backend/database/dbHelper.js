'use strict';

import { db } from "../db.js";


function get(query, params=[]) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err.message);
            resolve(row || null);
        });
    });
}

function run(query, params=[]) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) return reject(err.message);
            resolve();
        });
    });
}

export {get, run}