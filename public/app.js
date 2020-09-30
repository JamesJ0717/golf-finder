const app = new Vue({
  el: "#app",
  data: {
    zip: 10001,
    courses: null,
    course: null,
    scorecard: null,
    formVisible: true,
    loading: false,
    done: false,
    courseHandicap: 0,
    playerIndex: 0,
    courseSlope: 0,
  },
  methods: {
    async getCourses() {
      this.loading = true;
      this.course = null;
      // console.log(this.zip);
      let res = await fetch(`/api/v1/courses?zip=${this.zip}`);
      let body = await res.json();
      console.log(body.courses);
      this.courses = body.courses;
      let courses = body.courses;

      this.done = true;
      const courseList = document.getElementById("courses");

      document.getElementById("courseSelect").style.display = "block";
      for (let i = courseList.options.length - 1; i >= 0; i--) {
        courseList.remove(i);
      }
      courses.forEach((course) => {
        let courseSelector = document.createElement("option");
        courseSelector.setAttribute("value", course.slug);
        courseSelector.textContent = course.name;
        courseList.appendChild(courseSelector);
      });
      this.loading = false;
    },
    async chooseCourse(event) {
      // console.log(event.target.value);
      let res = await fetch(`/api/v1/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: event.target.value }),
      });
      let body = await res.json();
      // console.log(body);
      this.course = body.course[0];
      this.scorecard = body.course[0].tees.search("Error") >= 0 ? "" : JSON.parse(body.course[0].tees);
      console.log(this.scorecard);
    },
    calcHandicap() {
      //Course Handicap = (Handicap Index) X (Slope Rating**) ÷ 113
      this.courseHandicap = ((this.playerIndex * this.courseSlope) / 113).toFixed(0);
    },
  },
});
