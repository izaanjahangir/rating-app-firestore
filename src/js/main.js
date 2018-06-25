let loaderEl = document.querySelector(".loader");
let skillList = document.querySelector(".skill-list");
let skillCategories = [];
let skillForm = document.getElementById("skill-form");
let userSkillEl = document.getElementById("user-skill");


document.addEventListener("DOMContentLoaded", () => {
  loaderEl.style.display = "block";
  console.log("DOM loaded");
  db.collection("servicesName").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      loaderEl.style.display = "none";      
      if (change.type === "added") {
        skillCategories.push(change.doc.data().skill);

        skillList.innerHTML += `
            <li class="list-group-item skill-item" id=${change.doc.data().skill}>
              <span class="left-content">${change.doc.data().skill}</span>
              <span class="right-content">
                  <span class="badge badge-secondary">${change.doc.data().users}</span>
                  <i class="fas fa-angle-right"></i>
              </span>
            </li>
          `
      }

      if (change.type === "modified") {
        let el = document.querySelector(`#${change.doc.data().skill} .right-content .badge`);
        el.innerText = change.doc.data().users;
      }


    });
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
      db.collection('servicesName').doc(skill)
        .get()
        .then((data)=>{
          db.collection('servicesName').doc(skill)
            .update({users: data.data().users + 1})
        })
      break;
    }
  }
  if (!isFound) {
    db.collection("servicesName")
      .doc(userSkill)
      .set({skill: userSkill,users: 1});
  }
});
