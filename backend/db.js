'use strict';
import sqlite3 from "sqlite3";

const db = new sqlite3.Database('memory-keeper.db');


export {db};