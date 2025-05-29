



let thoughtObj = [];
let journalObj = [];
if (localStorage.getItem("thoughtObj")) {
    thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
}


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





function buildList() {




    let thoughtStr = "";
    for (let i = 0; i < thoughtObj.length; i++) {


        let thoughtDateTime;
        console.log("thoughtObj[i].thoughtDateTime: " + thoughtObj[i].thoughtDateTime);
        try {
            if (thoughtObj[i].thoughtDateTime !== undefined) {
                thoughtDateTime = thoughtObj[i].thoughtDateTime;
            } else {
                thoughtDateTime = timestamp();
            }

        } catch (error) {

            console.log("Error: " + error)

        }

        thoughtStr = thoughtStr + "<li class='list-group-item' ><label> " + (i + 1) + ". Thought: " + thoughtObj[i].automaticThought
            + "</label><br/><i>Date Time: " + thoughtDateTime + "</i><hr/><label><u>Cognitive Distortion</u></label><p>" + thoughtObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" +
            thoughtObj[i].rationalThought + "</p><button class='form-control btn btn-danger' onClick='deleteThought(" + i + ")'> <i class='fas fa-trash'></i> Delete Thought " + (i + 1) + "</button></li>";
    }

    document.getElementById("thoughtTarget").innerHTML = thoughtStr;

}


function submitTought() {

    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.classList.remove("error");
    })

    let automaticThought = "";
    try {
        automaticThought = document.getElementById("automaticThought").value;

    } catch (error) {
        console.log("automaticThought Error: " + error);
        document.getElementById("automaticThought").classList.add("error");
        return false

    }
    let cognitiveDistortion = "";
    try {
        cognitiveDistortion = document.getElementById("cognitiveDistortion").value;
    } catch (error) {
        console.log("cognitiveDistortion Error: " + error);
        document.getElementById("cognitiveDistortion").classList.add("error");
        return false
    }
    let rationalThought = "";
    try {
        rationalThought = document.getElementById("rationalThought").value;
    } catch (error) {
        console.log("rationalThought Error: " + error);
        document.getElementById("rationalThought").classList.add("error");
        return false
    }




    thoughtObj = [...thoughtObj, {
        automaticThought,
        cognitiveDistortion,
        rationalThought,
        thoughtDateTime: timestamp()
    }];

    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));
    globalAlert("alert-success", "Thought added.");

    buildList();

    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.value = "";
    })

}




function deleteThought(num) {

    let tempObj = [];
    for (let i = 0; i < thoughtObj.length; i++) {
        if (num !== i) {
            tempObj.push(thoughtObj[i])
        }
    }
    thoughtObj = tempObj;
    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));

    buildList();


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
    a.setAttribute("download", "iHaveThoughts.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


if (localStorage.getItem("thoughtObj")) {
    buildList();
}



/****START JOURNAL */




function buildJournalList() {


    let journalStr = "";
    for (let i = 0; i < journalObj.length; i++) {


        let journalDateTime;
        console.log("journalObj[i].thoughtDateTime: " + journalObj[i].journalSubmission);
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

        journalStr = journalStr + "<li class='list-group-item'><label> " + (i + 1) + ". Journal Title: " + journalObj[i].journalTitleSubmission
            + "</label><br/><p>" + journalObj[i].journalSubmission
            + "</p><i>Date Time: " + journalDateTime + "</i><hr/><button class='form-control btn btn-danger' onClick='deleteJournal(" + i + ")'> <i class='fas fa-trash'></i> Delete Journal " + (i + 1) + "</button></li>";
    }

    document.getElementById("journalSubmissionsTarget").innerHTML = journalStr;


}




function submitJournalThought() {
    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.classList.remove("error");
    })

    let journalSubmission = "";
    try {
        journalSubmission = document.getElementById("journalInput").value;

    } catch (error) {
        console.log("journalInput Error: " + error);
        document.getElementById("journalInput").classList.add("error");
        return false
    }

    let journalTitleSubmission = "";
    try {
        journalTitleSubmission = document.getElementById("journalTitle").value;
    } catch (error) {
        console.log("journalInputTitle Error: " + error);
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

    journalObj = [...journalObj, {
        journalTitleSubmission,
        journalSubmission,
        journalDateTime: timestamp()
    }];

    localStorage.setItem("journalObj", JSON.stringify(journalObj));

    document.getElementById("journalInput").value = "";
    document.getElementById("journalTitle").value = "";

    buildJournalList();
    globalAlert("alert-success", "Journal entry added.");
}


if (localStorage.getItem("journalObj")) {
    journalObj = JSON.parse(localStorage.getItem("journalObj"));
    buildJournalList();
}




function deleteJournal(num) {

    let tempObj = [];
    for (let i = 0; i < journalObj.length; i++) {
        if (num !== i) {
            tempObj.push(journalObj[i])
        }
    }
    journalObj = tempObj;
    localStorage.setItem("journalObj", JSON.stringify(journalObj));

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
    navLinkHTML = navLinkHTML + `<li class='nav-item'> <a class='nav-link ${active}' data-selected='${navData[i].name}' href="${navData[i].address} " onClick="toggleSection('${navData[i].name}')"><u>${navData[i].name}</u></a></li>`;
}
document.getElementById("navLinkTarget").innerHTML = navLinkHTML;


function toggleSection(whatSection) {

    [].forEach.call(document.querySelectorAll("[data-section]"), (e) => {
        e.classList.add("hide");
    })
    document.querySelector("[data-section='" + whatSection + "']").classList.remove("hide");
    toggleMobileNav("mobileNav");


    [].forEach.call(document.querySelectorAll("[data-selected]"), (e) => {
        e.classList.remove("active");
    });

    document.querySelector("[data-selected='" + whatSection + "']").classList.add("active");
}



/*START UPLOAD DATA */
//START FILE READER
const fileReader = new FileReader();
let file;
function handleOnChange(event) {
    if (event.target.files[0]) {
        file = event.target.files[0];
        console.log("event.target.files[0]: " + JSON.stringify(event.target.files[0]));
        document.querySelector("#fileUpload").classList.remove("hide");
        //  document.querySelector("#fileMerge").classList.remove("hide");
        globalAlert("alert-warning", `File selected. click the "Upload New Data" button.`);
    } else {
        document.querySelector("#fileUpload").classList.add("hide");
        // document.querySelector("#fileMerge").classList.add("hide");
    }
};
function handleOnSubmit(event, type, merge) {
    event.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            let tempObj = event.target.result;
            if (type === "json") {

                if ((typeof tempObj) === "string") {
                    tempObj = JSON.parse(tempObj);
                }

                if (tempObj[0].thoughtObj === undefined || tempObj[0].journalObj === undefined) {
                    console.log("tempObj[0].tempObj: " + JSON.stringify(tempObj[0].thoughtObj) + "  - " + JSON.stringify(tempObj[0].journalObj))

                    globalAlert("alert-danger", "This data does not have the correct keys and values.");
                    return false;
                }
                thoughtObj = tempObj[0].thoughtObj;
                localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));
                journalObj = tempObj[0].journalObj;
                localStorage.setItem("journalObj", JSON.stringify(journalObj));

                buildList();
                buildJournalList();
                globalAlert("alert-success", "Your file was uploaded.");
                return false;

            }
            else {
                console.log("That wasn't json.")
            }
        };
        fileReader.readAsText(file);
    }
    document.querySelector("input[type='file']").value = "";
    document.querySelector("#fileUpload").classList.add("hide");

    // toggleEdit();








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
    localStorage.removeItem("thoughtObj");
    localStorage.removeItem("journalObj");
    document.getElementById("thoughtTarget").innerHTML = "";
    document.getElementById("journalSubmissionsTarget").innerHTML = "";
    globalAlert("alert-success", "Your data was removed.");
    toggle("default");
    return false;
}
