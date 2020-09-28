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
  },
  methods: {
    async getCourses() {
      this.loading = true;
      console.log(this.zip);
      let res = await fetch(`/api/v1/courses?zip=${this.zip}`);
      let body = await res.json();
      console.log(body.courses);
      this.courses = body.courses;
      let courses = body.courses;

      this.done = true;
      const courseList = document.getElementById("courses");
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
      console.log(event.target.value);
      let res = await fetch(`/api/v1/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: event.target.value }),
      });
      let body = await res.json();
      console.log(body);
      this.course = body.course;
      this.scorecard = body.course.scorecardUrl;
    },
  },
});
