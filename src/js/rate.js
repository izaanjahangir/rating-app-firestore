let skillNameEl = document.getElementById("skill-name");
let skillEl = document.querySelector(".skill");
let skillName = localStorage.getItem("skillName");
let selectedId;
let userUid = window.localStorage.getItem("userUid");
let userRateEl = document.getElementById("user-rate");
let modalEl = document.querySelector(".custom-modal");
let flag = false;
skillNameEl.innerText = skillName;

document.addEventListener("DOMContentLoaded", () => {
  showLoader();
  console.log(skillName);
  db.collection("services")
    .where("name", "==", skillName)
    .onSnapshot(querySnapshot => {
      hideLoader();
      querySnapshot.docChanges().forEach(change => renderAllSkills(change));
    });
});

function renderAllSkills(data) {
  let skillKey = data.doc.id;
  skillData = data.doc.data();

  if (data.type === "added") {
    skillEl.innerHTML += `
            <li class="list-group-item html skill-item" id="a${skillKey}" onClick="selectSkill(this)">
                <span class="left-content">${skillData.userUid}</span>
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
      
    let starsInnerEl = skillEl.querySelector(`#a${skillKey} .stars-inner`);
    starsInnerEl.style.width = (skillData.avRating / 5) * 100 + "%";
}

function selectSkill(el) {
  removeSelection();
  el.style.background = "#dcdde1";
  selectedId = el.id;
}

function addRating() {
  if (!selectedId) {
    showModal("Please Select something");    
    return false;
  }
  if (userRateEl.value.length < 1) {
    showModal("Please Write something");        
    return false;
  }
  showLoader();
  let userRate = parseFloat(userRateEl.value);
  selectedId = selectedId.slice(1);
  console.log(selectedId);
  console.log(selectedId.search('izaan'));
  
  
  db.collection("services")
    .doc(selectedId)
    .get()
    .then(snapshot => {
      console.log(selectedId);
      console.log(snapshot);
      checkRatings(snapshot.data(), userRate);
    });
}

function checkRatings(snapshot, userRate) {
  let createdUserUid = snapshot.userUid;
  let ratings = snapshot.ratings;
  if (userUid === createdUserUid) {
    showModal("You can't rate yourself");
    removeSelection();
    hideLoader();
    return false;
  }

  let isRated = false;
  ratings.forEach(value => {
    if (value.uid == userUid) {
      isRated = true;
      showModal("You have already rated this!");
      removeSelection();
      hideLoader();
    }
  });
  if (!isRated) {
    let rateObject = {
      uid: userUid,
      rate: userRate
    };
    ratings.push(rateObject);
    calcAvg(snapshot,ratings);
  }
}

function calcAvg(snapshot,ratings) {
    let totalRatings = 0;
    console.log(snapshot);
    console.log(ratings);
    ratings.forEach( value => totalRatings += value.rate);
    console.log(totalRatings);
    let avg = totalRatings/ratings.length;
    db.collection("services")
      .doc(selectedId)
      .update({ ratings,avRating:avg })
      .then(() => {
        hideLoader();
        removeSelection(); 
      });
}

function removeSelection(){
  let listArr = skillEl.querySelectorAll("li");
  listArr.forEach(skill => (skill.style.background = "none"));
  selectedId = undefined;
}