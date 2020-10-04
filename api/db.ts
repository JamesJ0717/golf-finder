import { Pool, QueryResult } from "pg";
import Area from "./Types/Area";
import Course from "./Types/Course";

class Db {
  db: Pool;
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this.db.connect().then(() => {
      this.createTable();
      console.log(`DB Connected`);
    });
  }

  createTable() {
    const sql = [
      `
            CREATE TABLE IF NOT EXISTS course (
                course_id SERIAL PRIMARY KEY,
                name text,
                slug text UNIQUE,
                url text,
                zip integer,
                dbID integer UNIQUE,
                scorecardUrl text,
                scorecardHtml text
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
      this.db.query(statement, (err: Error, result: QueryResult<any>) => {
        if (err) {
          console.error(err.message);
          return;
        }
      })
    );
    return;
  }

  getAllCourses(callback: (err: Error, rows: QueryResult<Course[]>) => void) {
    return this.db.query(`SELECT * FROM course`, function (err, rows) {
      callback(err, rows);
    });
  }

  getByZip(zip: Number, callback: (err: Error, row: QueryResult<Course[]>) => void) {
    return this.db.query(`SELECT * FROM course WHERE zip = $1`, [zip], (err, row) => {
      callback(err, row);
    });
  }

  getByCourse(slug: string, callback: (err: Error, row: QueryResult<Course[]>) => void) {
    return this.db.query(`SELECT * FROM course WHERE slug = $1`, [slug], (err, row) => callback(err, row));
  }

  insertCourse(course: Course, callback: (err: Error, res?: any) => void) {
    return this.db.query(
      "INSERT INTO course(name,slug,url,zip,dbID,scorecardUrl,scorecardHtml) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [course.name, course.slug, course.url, course.zip, course.dbID, course.scorecardUrl, course.scorecardHtml],
      (err, res) => callback(err, res)
    );
  }

  insertZip(area: Area, callback: (err: Error) => void) {
    return this.db.query(
      `INSERT INTO zips(zip_code,lat,lng,city,state) VALUES ($1, $2, $3, $4, $5)`,
      [area.zip, area.lat, area.lng, area.city, area.state],
      (err, res) => callback(err)
    );
  }

  getZip(zip: Number, callback: (err: Error, data: QueryResult<Area[]>) => void) {
    return this.db.query(`SELECT * FROM zips WHERE zip_code = $1`, [zip], (err, data) => callback(err, data));
  }
}

export default Db;
