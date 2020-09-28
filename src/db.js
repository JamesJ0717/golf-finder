"use strict";
const sqlite3 = require("sqlite3").verbose();

class Db {
  constructor(file) {
    this.db = new sqlite3.Database(file);
    this.createTable();
  }

  createTable() {
    const sql = [
      `
            CREATE TABLE IF NOT EXISTS course (
                id integer PRIMARY KEY,
                name text,
                slug text UNIQUE,
                par integer,
                yardage integer,
                slope integer,
                zip integer,
                dbID integer UNIQUE,
                scorecardUrl text
                );`,
      `
            CREATE TABLE IF NOT EXISTS zips (
                id integer PRIMARY KEY,
                zip_code integer unique,
                lat Decimal(8, 6),
                lng Decimal(9, 6),
                city text,
                state text
                );`,
      `
            CREATE TABLE IF NOT EXISTS scores (
                id integer PRIMARY KEY,
                course_name text,
                score integer
                );
            `,
    ];
    sql.forEach((statement) => this.db.run(statement));
    return;
  }

  getAllCourses() {
    return this.db.all(`SELECT * FROM course`, function (err, rows) {
      callback(err, rows);
    });
  }

  getByCourse(slug, callback) {
    return this.db.get(`SELECT * FROM course WHERE slug = ?`, slug, (err, data) => callback(err, data));
  }

  insertCourse(course, callback) {
    return this.db.run(
      "INSERT INTO course (name,slug,par,yardage,slope,zip,dbID,scorecardUrl) VALUES (?,?,?,?,?,?,?,?)",
      course,
      (err) => callback(err)
    );
  }

  insertZip(area, callback) {
    return this.db.run(`INSERT INTO zips (zip_code,lat,lng,city,state) VALUES (?,?,?,?,?)`, area, (err) =>
      callback(err)
    );
  }

  getZip(zip, callback) {
    return this.db.get(`SELECT * FROM zips WHERE zip_code = ?`, zip, (err, data) => callback(err, data));
  }
}

module.exports = Db;
