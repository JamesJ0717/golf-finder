class Course {
  constructor(
    name: string,
    slug: string,
    url: string,
    zip: Number,
    dbid: Number,
    scorecardurl: string,
    scorecardhtml: string
  ) {
    this.name = name;
    this.slug = slug;
    this.url = url;
    this.zip = zip;
    this.dbid = dbid;
    this.scorecardurl = scorecardurl;
    this.scorecardhtml = scorecardhtml;
  }
  name: string;
  slug: string;
  url?: string;
  zip?: Number;
  dbid?: Number;
  scorecardurl?: string;
  scorecardhtml?: string;
}

export default Course;
