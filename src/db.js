"use strict";
const sqlite3 = require("sqlite3").verbose();
const { Pool } = require("pg");
class Db {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this.db.connect().then(this.createTable());
  }

  createTable() {
    const sql = [
      `
            CREATE TABLE IF NOT EXISTS course (
                course_id SERIAL PRIMARY KEY,
                name text,
                slug text UNIQUE,
                url text,
                par integer,
                tees text,
                zip integer,
                dbID integer UNIQUE,
                scorecardUrl text
                );`,
      `
            CREATE TABLE IF NOT EXISTS zips (
                zip_id SERIAL PRIMARY KEY,
                zip_code integer unique,
                lat Decimal(8, 6),
                lng Decimal(9, 6),
                city text,
                state text
                );`,
      `
            CREATE TABLE IF NOT EXISTS scores (
                score_id SERIAL PRIMARY KEY,
                course_name text,
                score integer
                );
            `,
    ];
    sql.forEach((statement) =>
      this.db.query(statement, (err, result) => {
        if (err) {
          console.error(err.message);
          return;
        }
      })
    );
    return;
  }

  getAllCourses(callback) {
    return this.db.query(`SELECT * FROM course`, function (err, rows) {
      callback(err, rows);
    });
  }

  getByZip(zip, callback) {
    return this.db.query(`SELECT * FROM course WHERE zip = $1`, [zip], (err, row) => {
      callback(err, row);
    });
  }

  getByCourse(slug, callback) {
    return this.db.query(`SELECT * FROM course WHERE slug = $1`, [slug], (err, row) => callback(err, row));
  }

  insertCourse(course, callback) {
    return this.db.query(
      "INSERT INTO course(name,slug,url,par,tees,zip,dbID,scorecardUrl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [course.name, course.slug, course.url, course.par, course.tees, course.zip, course.dbID, course.scorecardUrl],
      (err, res) => callback(err, res)
    );
  }

  insertZip(area, callback) {
    return this.db.query(
      `INSERT INTO zips(zip_code,lat,lng,city,state) VALUES ($1, $2, $3, $4, $5)`,
      [area.zip, area.lat, area.lng, area.city, area.state],
      (err, res) => callback(err, res)
    );
  }

  getZip(zip, callback) {
    return this.db.query(`SELECT * FROM zips WHERE zip_code = $1`, [zip], (err, data) => callback(err, data));
  }
}

module.exports = Db;
