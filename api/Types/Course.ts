class Course {
  constructor(
    name: string,
    slug: string,
    url: string,
    zip: Number,
    dbID: Number,
    scorecardUrl: string,
    scorecardHtml: string
  ) {
    this.name = name;
    this.slug = slug;
    this.url = url;
    this.zip = zip;
    this.dbID = dbID;
    this.scorecardUrl = scorecardUrl;
    this.scorecardHtml = scorecardHtml;
  }
  name: string;
  slug: string;
  url?: string;
  zip?: Number;
  dbID?: Number;
  scorecardUrl?: string;
  scorecardHtml?: string;
}

export default Course;
