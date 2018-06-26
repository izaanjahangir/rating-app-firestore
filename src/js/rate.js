let skillNameEl = document.getElementById("skill-name");
let skillEl = document.querySelector(".skill");
let skillName = localStorage.getItem("skillName");
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
  skillData = data.doc.data();
  if(data.type === "added"){
      skillEl.innerHTML += `
            <li class="list-group-item html skill-item ${skillData.userUid}">
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

    let starsInnerEl = skillEl.querySelector(`.${skillData.userUid} .stars-inner`);
    starsInnerEl.style.width = (skillData.avRating / 5) * 100 + "%";
}
