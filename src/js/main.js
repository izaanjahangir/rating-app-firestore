let loaderEl = document.querySelector(".loader");
let skillList = document.querySelector(".skill-list");
let skillCategories = [];
let skillForm = document.getElementById("skill-form");
let userSkillEl = document.getElementById("user-skill");
let userUid = window.localStorage.getItem("userUid");
let userSkillList = document.querySelector(".user-skill-list");

document.addEventListener("DOMContentLoaded", () => {
  loaderEl.style.display = "block";
  console.log("DOM loaded");
  db.collection("servicesName").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => renderSkillCategories(change));
  });

  db.collection("services")
    .where("userUid", "==", userUid)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => renderUserSkills(change));
    });
});

skillForm.addEventListener("submit", e => {
  e.preventDefault();
  loaderEl.style.display = "block";
  let userSkill = userSkillEl.value;
  userSkillEl.value = "";
  let isFound = false;
  for (let i = 0; i < skillCategories.length; i++) {
    if (skillCategories[i].toLowerCase() === userSkill.toLowerCase()) {
      let skill = skillCategories[i].toLowerCase();
      isFound = true;
      db.collection("servicesName")
        .doc(skill)
        .get()
        .then(data => {
          db.collection("servicesName")
            .doc(skill)
            .update({ users: data.data().users + 1 });
        });
      break;
    }
  }
  if (!isFound) {
    db.collection("servicesName")
      .doc(userSkill)
      .set({ skill: userSkill, users: 1 });
  }
  db.collection("services").add({
    name: userSkill,
    userUid,
    ratings: [],
    avRating: 0
  });
});

function renderUserSkills(change) {
  let skillData = change.doc.data();
  loaderEl.style.display = "none";
  if(change.type === "added"){
    userSkillList.innerHTML += `
      <li class="list-group-item skill-item" class=${skillData.name}>
        <span class="left-content">${skillData.name}</span>
        <span class="right-content">
            <span class="stars-outer">
                <i class="fas fa-star star-black"></i>
                <i class="fas fa-star star-black"></i>
                <i class="fas fa-star star-black"></i>
                <i class="fas fa-star star-black"></i>
                <i class="fas fa-star star-black"></i>
                <span class="stars-inner">
                    <i class="fas fa-star star-yellow"></i>
                    <i class="fas fa-star star-yellow"></i>                                
                    <i class="fas fa-star star-yellow"></i>                                
                    <i class="fas fa-star star-yellow"></i>                                
                    <i class="fas fa-star star-yellow"></i>                                                                                                
                </span>
            </span>
        </span>
      </li>
    `;
  }
  let starsInnerEl = document.querySelector('.stars-inner');
  starsInnerEl.style.width = (skillData.avRating/5)*100 + '%';
}

function renderSkillCategories(change) {
  loaderEl.style.display = "none";
  if (change.type === "added") {
    skillCategories.push(change.doc.data().skill);

    skillList.innerHTML += `
        <li class="list-group-item skill-item ${change.doc.data().skill}">
          <span class="left-content">${change.doc.data().skill}</span>
          <span class="right-content">
              <span class="badge badge-secondary">${
                change.doc.data().users
              }</span>
              <i class="fas fa-angle-right"></i>
          </span>
        </li>
      `;
  }

  if (change.type === "modified") {
    let el = skillList.querySelector(
      `.${change.doc.data().skill} .right-content .badge`
    );
    el.innerText = change.doc.data().users;
  }
}
