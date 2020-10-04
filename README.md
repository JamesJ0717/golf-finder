# Golf Finder :golf:

[https://golf-finder.herokuapp.com](https://golf-finder.herokuapp.com)

## What is it?

This is a project of mine that I came up with after watching a YouTube video on web scraping with Node.js. In the video, the creator scraped data from Wikipedia, and was able to redisplay the data cleaner. I liked that idea, so I took it and scraped a website that has a ton on information about local golf courses. From that website, I was able to get a list of the courses within 50 miles of a provided zip code and quickly display things like the par, yardage, slope, and rating of the different tees (if any).

This was a really cool project for me to work on. It was the first web project I had worked on in a really long time, so it felt good being able to have something that worked and that I think others might actually use.

## Technologies

### Backend

The backend is all Node.js code.

### Frontend

The frontend is a really simple Vue.js app that is served by the Node backend.

### Hosting

In a different YouTube video, the creator used [heroku](https://heroku.com) to host a Node backend and I didn't have a server running or an EC2 instance to deploy this to, so I tried out heroku. It is suprisingly easy to deploy some code with. They even give you a pretty clean url; [https://golf-finder.herokuapp.com](https://golf-finder.herokuapp.com) is a lot nicer than some of the other options out there.

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
