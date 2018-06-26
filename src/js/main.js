// All Functions declerations can found in the bottom of this file


// DOM Shortcuts
let skillList = document.querySelector(".skill-list");
let skillCategories = [];
let yourSkills = [];
let skillForm = document.getElementById("skill-form");
let userSkillEl = document.getElementById("user-skill");
let userUid = window.localStorage.getItem("userUid");
let userSkillList = document.querySelector(".user-skill-list");
let modalEl = document.querySelector('.custom-modal');



document.addEventListener("DOMContentLoaded", () => {
  showLoader();
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
  showLoader()
  let userSkill = userSkillEl.value;
  userSkillEl.value = "";
  checkUserSkill(userSkill);
});



// Render List of user skills on DOM
// This ran when DOM loads and when a new skill is added
function renderUserSkills(change) {
  let skillData = change.doc.data();
  hideLoader();
  if(change.type === "added"){
    yourSkills.push(skillData.name);    
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


// Render List of all skills categories on DOM
// This ran when DOM loads and when a new skill is added
function renderSkillCategories(change) {
  hideLoader();
  let skillData = change.doc.data();
  if (change.type === "added") {
    skillCategories.push(skillData.skill);

    skillList.innerHTML += `
        <li class="list-group-item skill-item ${skillData.skill}" onClick="routeToSkills('${skillData.skill}')">
          <span class="left-content">${skillData.skill}</span>
          <span class="right-content">
              <span class="badge badge-secondary">${
                skillData.users
              }</span>
              <i class="fas fa-angle-right"></i>
          </span>
        </li>
      `;
  }

  if (change.type === "modified") {
    let el = skillList.querySelector(
      `.${skillData.skill} .right-content .badge`
    );
    el.innerText = skillData.users;
  }
}



// Check if entered skill already exist with this account
// If exist does nothing, if not save it on firestore and run checkSkillList() function
function checkUserSkill(userSkill){
  let isFound = false;
  for(let i=0; i<yourSkills.length; i++){
    if (yourSkills[i].toLowerCase() === userSkill.toLowerCase()) {
      let skill = yourSkills[i].toLowerCase();
      isFound = true;
      console.log("Found");
      hideLoader();
      showModal("You already have this skill");
      break;
    }
  }
  if(!isFound){
    console.log("Not Found");
    
    db.collection("services").add({
      name: userSkill,
      userUid,
      ratings: [],
      avRating: 0
    });
    checkSkillList(userSkill);
  }
}


// Check if entered skill already exist on firestore
// If exist increase users by 1
// If not create anothing document on firestore with initual 1 user
function checkSkillList(userSkill){
  let isFound = false;
  for (let i = 0; i < skillCategories.length; i++) {
    if (skillCategories[i].toLowerCase() === userSkill.toLowerCase()) {
      let skill = skillCategories[i].toLowerCase();
      isFound = true;
      db.collection("servicesName")
        .doc(skill)
        .get()
        .then(data => {
          console.log(skill);
          
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

}

function routeToSkills(skill){
    window.localStorage.setItem('skillName',skill);
    window.location.assign('public/skills.html');
}

// Show Modal on DOM with transition
function showModal(text){
  let modalTextEl = modalEl.querySelector('p');
  modalTextEl.innerText = text;
  modalEl.style.display = 'block';
  setTimeout( () => modalEl.style.opacity = '1',100);

  // Hide Modal from DOM automatically after 3s
  setTimeout( hideModal, 3000);
}

// Hide Modal from DOM
function hideModal(){
  modalEl.style.display = 'none';
  modalEl.style.opacity = '0'
}