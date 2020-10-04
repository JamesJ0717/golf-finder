import React from "react";

export const About = () => {
  const pad = { padding: "1em" };

  return (
    <div style={pad}>
      <p>
        This is a project of mine that I came up with after watching a YouTube video on web scraping with Node.js. In
        the video, the creator scraped data from Wikipedia, and was able to redisplay the data cleaner. I liked that
        idea, so I took it and scraped a website that has a ton on information about local golf courses. From that
        website, I was able to get a list of the courses within 50 miles of a provided zip code and quickly display
        things like the par, yardage, slope, and rating of the different tees (if any).
      </p>
      <p>
        For more information or to request a feature, head over to{" "}
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/jamesj0717/golf-scrape">
          https://github.com/jamesj0717/golf-scrape
        </a>
        .
      </p>
    </div>
  );
};
