let loaderEl = document.querySelector(".loader");
let skillList = document.querySelector(".skill-list");
let skillCategories= [];
document.addEventListener("DOMContentLoaded", () => {
  loaderEl.style.display = "block";
  console.log("DOM loaded");

  // Add Demo data to firestore for testing
  //   db.collection("services")
  //     .add({
  //       name: "HTML",
  //       userUid: localStorage.getItem("userUid"),
  //       ratings: [{ stars: 4, uid: "123456" }]
  //     })
  //     .then(() => {
  //       loaderEl.style.display = "none";
  //       console.log("Data Written");
  //     });

  // Add more
  db.collection("servicesName")
    .doc("name")
    .set({
      services: [{ name: "HTML", users: "2" }, { name: "CSS", users: "4" }]
    });

  // Fetch Demo data
  db.collection("servicesName")
    .doc("name")
    .get()
    .then(data => {
      console.log(data.data());
      loaderEl.style.display = "none";
      data.data().services.forEach(data => {
        skillCategories.push(data.name);
        skillList.innerHTML += `
                <li class="list-group-item skill-item">
                    <span class="left-content">${data.name}</span>
                    <span class="right-content">
                        <span class="badge badge-dark">${data.users}</span>
                        <i class="fas fa-angle-right small-icon"></i>
                    </span>
                </li>
            `;
      });
    });
});
