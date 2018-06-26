document.addEventListener('DOMContentLoaded',()=>{
    showLoader();
    let skillName = localStorage.getItem('skillName');
    console.log(skillName);
    db.collection('services').where('name', '==', skillName)
        .get()
        .then((querySnapshot)=>{
            hideLoader();
            querySnapshot.forEach((snapshot)=>{
                console.log(snapshot.data());
            })
        })
})