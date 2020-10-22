# Golf Finder :golf:

[![CircleCI](https://circleci.com/gh/JamesJ0717/golf-finder/tree/master.svg?style=svg)](https://circleci.com/gh/JamesJ0717/golf-finder/tree/master)
[https://golf-finder.herokuapp.com](https://golf-finder.herokuapp.com)

## What is it?

This is a project of mine that I came up with after watching a YouTube video on web scraping with Node.js. In the video, the creator scraped data from Wikipedia, and was able to redisplay the data cleaner. I liked that idea, so I took it and scraped a website that has a ton on information about local golf courses. From that website, I was able to get a list of the courses within 50 miles of a provided zip code and quickly display things like the par, yardage, slope, and rating of the different tees (if any).

This was a really cool project for me to work on. It was the first web project I had worked on in a really long time, so it felt good being able to have something that worked and that I think others might actually use.

## Technologies

I used something new for me this time, Next.js. This is a very popular framework in web development now since it takes the best of React and makes it even easier to develop on top of an api that you write. Everything, front and back end, are in one `src` folder and one command will build both. You no longer have to have one terminal prompt for running your React app and another for running your server. Both are contained in one folder structure that makes sense.

## TODO

_This is still a work in progress..._

- [x] Better layout
- [ ] Pages for other tools
  - [x] Handicap Calc
  - [ ] Account
  - [ ] Contests
- [ ] Integrated scorecard
- [ ] Auth
  - [ ] Keeping track of scores
  - [ ] Contests
- [ ] PWA
- [x] Use PostgreSQL instead of sqlite
