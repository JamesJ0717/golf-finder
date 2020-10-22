import { Pool, QueryResult, PoolClient } from "pg";
import Area from "./Types/Area";
import Course from "./Types/Course";
require("dotenv").config();

class Db {
  db: Pool = new Pool();
  client: PoolClient;
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
    });
    try {
      this.db.connect().then((client) => {
        console.log(`DB Connected`);
        this.createTable();
        this.client = client;
      });
    } catch (error) {
      console.error(error);
    }
  }

  createTable() {
    const sql = `
            CREATE TABLE IF NOT EXISTS course (
                course_id SERIAL PRIMARY KEY,
                name text,
                slug text UNIQUE,
                url text,
                zip integer,
                dbID integer UNIQUE,
                scorecardUrl text,
                scorecardHtml text
                );
    
            CREATE TABLE IF NOT EXISTS zips (
                zip_id SERIAL PRIMARY KEY,
                zip_code integer unique,
                lat Decimal(8, 6),
                lng Decimal(9, 6),
                city text,
                state text
                );
    
            CREATE TABLE IF NOT EXISTS scores (
                score_id SERIAL PRIMARY KEY,
                course_name text,
                score integer
                );
            `;
    this.db.query(sql, (err: Error, result: QueryResult<any>) => {
      if (err) {
        console.error(err.message);
        close();
        return;
      }
    });
    return;
  }

  getAllCourses(callback: (err: Error, rows: QueryResult<Course[]>) => void) {
    this.db.query(`SELECT * FROM course`, function (err, rows) {
      callback(err, rows);
    });
    return;
  }

  getByZip(zip: Number, callback: (err: Error, row: QueryResult<Course[]>) => void) {
    this.db.query(`SELECT * FROM course WHERE zip = $1`, [zip], (err, row) => {
      callback(err, row);
    });
    return;
  }

  getByCourse(slug: string, callback: (err: Error, row: QueryResult<Course[]>) => void) {
    this.db.query(`SELECT * FROM course WHERE slug = $1`, [slug], (err, row) => callback(err, row));
    return;
  }

  insertCourse(course: Course, callback: (err: Error, res?: any) => void) {
    this.db.query(
      "INSERT INTO course(name,slug,url,zip,dbID,scorecardUrl,scorecardHtml) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [course.name, course.slug, course.url, course.zip, course.dbid, course.scorecardurl, course.scorecardhtml],
      (err, res) => callback(err, res)
    );
    return;
  }

  insertZip(area: Area, callback: (err: Error) => void) {
    this.db.query(
      `INSERT INTO zips(zip_code,lat,lng,city,state) VALUES ($1, $2, $3, $4, $5)`,
      [area.zip, area.lat, area.lng, area.city, area.state],
      (err, res) => callback(err)
    );
    return;
  }

  getZip(zip: Number, callback: (err: Error, data: QueryResult<Area[]>) => void) {
    this.db.query(`SELECT * FROM zips WHERE zip_code = $1`, [zip], (err, data) => callback(err, data));
    return;
  }

  close() {
    this.client.release();
    this.db.end(() => console.log("Database ended"));
  }
}

export default Db;
