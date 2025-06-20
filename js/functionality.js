


const cognDisOptions = ["All or Nothing (AKA Black and White)", "Overgeneralization", "Mental Filtering", "Disqualifying the Positive", "Jumping to Conclusions", "Magnification or Minimization", "Emotional Reasoning", "\"Should\" Statements", "Labeling and Mislabeling", "Personalization"]
let activeFunc = "CBT Thought Process";
let activeTherapyView = "calendar";
if (localStorage.getItem("activeTherapyView")) {
    activeTherapyView = localStorage.getItem("activeTherapyView");
}
let cogDistStr = "";
for (let i = 0; i < cognDisOptions.length; i++) {
    cogDistStr = cogDistStr + "<li class='list-group-item'><label><input type='checkbox'/ name='" + cognDisOptions[i] + "' data-options /> " + cognDisOptions[i] + "</label></li>";
}
document.getElementById("cognitiveDistortion").innerHTML = cogDistStr;

let thoughtObj = [];
let journalObj = [];



const timestamp = () => {

    const date = new Date();
    let day = date.getDate();
    let month = Number(date.getMonth()) + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    let hoursOriginal = hours;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();



    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hours > 12) {
        hours = hours - 12;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (hoursOriginal > 11) {
        hours = "PM-" + hours;

    } else {
        hours = "AM-" + hours;
    }
    return (year + "-" + month + "-" + day + "_" + hours + ":" + minutes + ":" + seconds);
}



function populateEditMenus() {
    let thoughtDateSrt = "<option value='default'>Select by date</option>";
    for (let i = 0; i < thoughtObj.length; i++) {
        thoughtDateSrt = thoughtDateSrt + "<option value='" + i + "'>" + thoughtObj[i].thoughtDateTime + "</option>";
    }
    document.querySelector("select[name='thoughtObjDateList']").innerHTML = thoughtDateSrt;

    let journalDateSrt = "<option value='default'>Select by date</option>";
    for (let i = 0; i < journalObj.length; i++) {
        journalDateSrt = journalDateSrt + "<option value='" + i + "'>" + journalObj[i].journalDateTime + "</option>";
    }
    document.querySelector("select[name='journalDateList']").innerHTML = journalDateSrt;
}



function buildList() {



    if (localStorage.getItem("thoughtObj")) {
        thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
    } else {
        globalAlert("alert-warning", "No Thoughts submitted.");
        return false;
    }


    let thoughtStr = "";
    for (let i = 0; i < thoughtObj.length; i++) {


        let thoughtDateTime;

        try {
            if (thoughtObj[i].thoughtDateTime !== undefined) {
                thoughtDateTime = thoughtObj[i].thoughtDateTime;
            } else {
                thoughtDateTime = timestamp();
            }

        } catch (error) {

            console.log("Error: " + error)

        }

        thoughtStr = thoughtStr + "<li class='list-group-item' data-row='" + i + "' ><label><u> " + (i + 1) + ". Thought: </u>" + thoughtObj[i].automaticThought
            + "</label><br/><i>Date Time: " + thoughtDateTime + "</i><hr/><label><u>Cognitive Distortion</u></label><p>" + thoughtObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" +
            thoughtObj[i].rationalThought + "</p><button class='form-control btn btn-danger' onClick='deleteThought(" + i + ")'> <i class='fas fa-trash'></i> Delete Thought " + (i + 1) + "</button></li>";
    }

    document.getElementById("thoughtTarget").innerHTML = thoughtStr;
    populateEditMenus();

}


function submitThought(addEdit) {

    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.classList.remove("error");
    })

    let automaticThought = "";
    try {
        automaticThought = document.getElementById("automaticThought").value;

    } catch (error) {

        document.getElementById("automaticThought").classList.add("error");
        return false

    }

    if (automaticThought === "") {
        globalAlert("alert-danger", "What is your thought?");
        document.getElementById("automaticThought").classList.add("error");
        return false;
    }


    let cognitiveDistortion = "";
    [].forEach.call(document.querySelectorAll("[data-options]"), (e, i) => {


        if (e.checked) {
            cognitiveDistortion = cognitiveDistortion + " - " + cognDisOptions[i]
        }
    });

    if (!document.querySelector("[data-options]:checked")) {

        globalAlert("alert-danger", "What is the cognitive distortion?");
        document.getElementById("cognitiveDistortion").classList.add("error");
        return false;
    }

    /* 
      try {
          cognitiveDistortion = document.getElementById("cognitiveDistortion").value;
      } catch (error) {
          console.log("cognitiveDistortion Error: " + error);
          document.getElementById("cognitiveDistortion").classList.add("error");
          return false
      }
  
      if (cognitiveDistortion === "") {
          globalAlert("alert-danger", "What is the cognitive distortion?");
          document.getElementById("cognitiveDistortion").classList.add("error");
          return false;
      }
  */

    let rationalThought = "";
    try {
        rationalThought = document.getElementById("rationalThought").value;
    } catch (error) {

        document.getElementById("rationalThought").classList.add("error");
        return false
    }

    if (rationalThought === "") {
        globalAlert("alert-danger", "What is your rational thought?");
        document.getElementById("rationalThought").classList.add("error");
        return false;
    }

    if (addEdit === "add") {
        thoughtObj = [...thoughtObj, {
            automaticThought,
            cognitiveDistortion,
            rationalThought,
            thoughtDateTime: timestamp()
        }];

    }

    if (addEdit === "edit") {

        let selectedNum = document.querySelector("select[name='thoughtObjDateList']").value;
        if (selectedNum == "default") {
            globalAlert("alert-warning", "Please select a date.");
            return false;
        }

        thoughtObj[selectedNum].automaticThought = automaticThought;
        thoughtObj[selectedNum].cognitiveDistortion = cognitiveDistortion;
        thoughtObj[selectedNum].rationalThought = rationalThought;


    }

    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));
    globalAlert("alert-success", "Thought " + addEdit + "ed.");

    buildList();

    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.value = "";
    });

    [].forEach.call(document.querySelectorAll("[data-options]"), (e) => {

        e.checked = false;
    });

}






function downloadData() {
    let tempData = [{ thoughtObj: [], journalObj: [] }];
    if (localStorage.getItem("thoughtObj")) {
        tempData[0].thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
    }

    if (localStorage.getItem("journalObj")) {
        tempData[0].journalObj = JSON.parse(localStorage.getItem("journalObj"));
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tempData, null, 2)], {
        type: 'application/json'
    }));
    a.setAttribute("download", "iHaveThoughts_" + timestamp() + ".json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}




/****START JOURNAL */




function buildJournalList() {


    let journalStr = "";
    for (let i = 0; i < journalObj.length; i++) {


        let journalDateTime;

        try {
            if (journalObj[i].journalDateTime !== undefined) {
                journalDateTime = journalObj[i].journalDateTime;
            } else {
                journalDateTime = timestamp();
            }

        } catch (error) {

            console.log("Error: " + error)

        }

        /*
                journalTitleSubmission,
        journalSubmission,
        journalDateTime: timestamp()
        */

        journalStr = journalStr + "<li class='list-group-item' data-row='" + i + "'><label><u> " + (i + 1) + ". Journal Title: " + journalObj[i].journalTitleSubmission
            + "</u></label><br/><p>" + journalObj[i].journalSubmission
            + "</p><i>Date Time: " + journalDateTime + "</i><hr/><button class='form-control btn btn-danger' onClick='deleteJournal(" + i + ")'> <i class='fas fa-trash'></i> Delete Journal " + (i + 1) + "</button></li>";
    }

    document.getElementById("journalSubmissionsTarget").innerHTML = journalStr;

    populateEditMenus();


}




function submitJournalThought(addEdit) {
    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.classList.remove("error");
    });

    [].forEach.call(document.querySelectorAll("input[type='text']"), (e) => {
        e.classList.remove("error");
    });

    let journalSubmission = "";
    try {
        journalSubmission = document.getElementById("journalInput").value;

    } catch (error) {

        document.getElementById("journalInput").classList.add("error");
        return false
    }

    let journalTitleSubmission = "";
    try {
        journalTitleSubmission = document.getElementById("journalTitle").value;
    } catch (error) {

        document.getElementById("journalTitle").classList.add("error");
        return false
    }

    if (journalTitleSubmission === "") {
        globalAlert("alert-danger", "What is your thought's title?");
        document.getElementById("journalTitle").classList.add("error");
        return false;
    }


    if (journalSubmission === "") {
        globalAlert("alert-danger", "What is your thought?");
        document.getElementById("journalInput").classList.add("error");
        return false;
    }
    if (addEdit === "add") {


        journalObj = [...journalObj, {
            journalTitleSubmission,
            journalSubmission,
            journalDateTime: timestamp()
        }];
    }

    if (addEdit === "edit") {

        let selectedEdit = document.querySelector("select[name='journalDateList']").value;
        if (selectedEdit == "default") {
            globalAlert("alert-warning", "Please select a date.");
            return false;
        }


        journalObj[selectedEdit].journalTitleSubmission = journalTitleSubmission;
        journalObj[selectedEdit].journalSubmission = journalSubmission;

    }



    localStorage.setItem("journalObj", JSON.stringify(journalObj));

    document.getElementById("journalInput").value = "";
    document.getElementById("journalTitle").value = "";

    buildJournalList();
    globalAlert("alert-success", "Journal entry " + addEdit + "ed.");
}


if (localStorage.getItem("journalObj")) {
    journalObj = JSON.parse(localStorage.getItem("journalObj"));
    buildJournalList();
}






/*START NAV JS*/
const toggleMobileNav = (whichElem) => {

    if (whichElem === "mobileNav") {//navbar-collapse collapse
        if (document.querySelector(".collapse.navbar-collapse")) {
            document.querySelector(".navbar-collapse").classList.remove("collapse");
            document.querySelector(".navbar-collapse").classList.add("show");
        } else {
            document.querySelector(".navbar-collapse").classList.remove("show");
            document.querySelector(".navbar-collapse").classList.add("collapse");
        }

    }


}





let navData = [{ name: "CBT Thought Process", address: "#top" }, { name: "Journal", address: "#top" }];
let navLinkHTML = "";
for (let i = 0; i < navData.length; i++) {
    let active = "";
    if (i === 0) {
        active = "active";
    }
    navLinkHTML = navLinkHTML + `<li class='nav-item'> <a class='nav-link ${active}' data-selected='${navData[i].name}' href='#top' onClick="toggleSection('${navData[i].name}', true)"><u>${navData[i].name}</u></a></li>`;
}
document.getElementById("navLinkTarget").innerHTML = navLinkHTML;





/*START UPLOAD DATA */
//START FILE READER
const fileReader = new FileReader();
let file;
function handleOnChange(event) {
    if (event.target.files[0]) {
        file = event.target.files[0];

        document.querySelector("#fileUpload").classList.remove("hide");
        window.location.href = "#fileUpload";
        //  document.querySelector("#fileMerge").classList.remove("hide");
        globalAlert("alert-warning", `File selected. click the "Upload New Data" button.`);
    } else {
        document.querySelector("#fileUpload").classList.add("hide");
        // document.querySelector("#fileMerge").classList.add("hide");
    }
};





//START GLOBAL ALERT
function globalAlert(alertLevel, message) {

    document.getElementById("globalAlert").classList.remove("hide");
    document.getElementById("globalAlert").classList.add(alertLevel);
    document.getElementById("globalAlert").classList.add("animated");
    document.getElementById("globalAlert").innerHTML = message;

    setTimeout(function () {
        document.getElementById("globalAlert").classList.add("hide");
        document.getElementById("globalAlert").classList.remove(alertLevel);
    }, 5000);

}

/*START GLOBAL TOGGLE FUNCTION*/




function toggle(what) {

    [].forEach.call(document.querySelectorAll("[data-toggle]"), (e) => {
        e.classList.add("hide");
        if (e.dataset.toggle === what) {
            e.classList.remove("hide");
        }
    });



}


function clearData() {


    [].forEach.call(document.querySelectorAll("[data-direction='0']"), (e) => {
        e.classList.remove("alert");
        e.classList.remove("alert-success");
    });
    document.getElementById("submissionTarget").innerHTML = "";

    thoughtObj = [];
    journalObj = [];
    localStorage.removeItem("thoughtObj");
    localStorage.removeItem("journalObj");
    document.getElementById("thoughtTarget").innerHTML = "";
    document.getElementById("journalSubmissionsTarget").innerHTML = "";
    globalAlert("alert-success", "Your data was removed.");
    toggle("default");
    return false;
}


if (localStorage.getItem("thoughtObj")) {
    buildList();
}

function runSearch() {

    tempObj = JSON.parse(localStorage.getItem("thoughtObj"));
    if (localStorage.getItem("iHaveThoughtsSection") === "Journal") {
        tempObj = JSON.parse(localStorage.getItem("journalObj"));
    }

    let searchTerm = document.querySelector("[name='searchField-" + localStorage.getItem("iHaveThoughtsSection") + "']").value.toLowerCase();

    [].forEach.call(document.querySelectorAll("li.list-group-item[data-row]"), (e, i) => {

        e.classList.add("hide");

    });

    for (let i = 0; i < tempObj.length; i++) {
        console.log("tempObj[i].toString().toLowerCase(): " + tempObj[i].toString().toLowerCase());
        console.log("searchTerm: " + searchTerm)
        if (JSON.stringify(tempObj[i]).toLowerCase().indexOf(searchTerm) !== -1) {
            document.querySelector("li.list-group-item[data-row='" + i + "']").classList.remove("hide");
        }
    }


}

function updateCRUD(addEdit) {
    [].forEach.call(document.querySelectorAll("[data-edit]"), (e) => {
        e.classList.add("hide");
    });

    [].forEach.call(document.querySelectorAll("input[type='checkbox'][data-options]"), (e) => {
        e.checked = false;
    });

    [].forEach.call(document.querySelectorAll("input[type='text']"), (e) => {
        e.value = "";
    });


    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.value = "";
    });



    [].forEach.call(document.querySelectorAll("[data-edit='" + addEdit + "']"), (e) => {
        e.classList.remove("hide");
    });

    globalAlert("alert-info", "You are in " + addEdit + " mode.");
    //document.querySelector("[data-edit='" + addEdit + "']").classList.remove("hide");

}

function populateForEdit(whichObj) {



    if (whichObj === "journalDateList") {

        let selectedNum = document.querySelector("select[name='journalDateList']").value;
        if (selectedNum === "default") {
            return false;
        }

        document.getElementById("journalInput").value = journalObj[selectedNum].journalSubmission;
        document.getElementById("journalTitle").value = journalObj[selectedNum].journalTitleSubmission;

    }

    if (whichObj === "thoughtObjDateList") {
        let selectedNum = document.querySelector("select[name='thoughtObjDateList']").value;
        if (selectedNum === "default") {
            return false;
        }

        document.getElementById("automaticThought").value = thoughtObj[selectedNum].automaticThought;
        document.getElementById("rationalThought").value = thoughtObj[selectedNum].rationalThought;

        [].forEach.call(document.querySelectorAll("input[type='checkbox'][data-options]"), (e) => {
            e.checked = false;
        });


        for (let i = 0; i < cognDisOptions.length; i++) {
            console.log("thoughtObj[selectedNum].cognitiveDistortion: " + thoughtObj[selectedNum].cognitiveDistortion);
            if (thoughtObj[selectedNum].cognitiveDistortion.indexOf(cognDisOptions[i]) !== -1) {
                document.querySelector("input[type='checkbox'][name='" + cognDisOptions[i] + "']").checked = true;
            }

        }

    }

}