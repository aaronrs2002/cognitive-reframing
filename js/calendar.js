
/*START CALENDAR*/
let calendarData = [];
let calendarObjs = [];
let dateTxt = null;
let updateCalendar = true;
let activePad = "default";
let whichMonth = "";


const writeDayNums = (yrMo) => {
    [].forEach.call(document.querySelectorAll("[data-direction='0']"), (e) => {
        let fistTxt = e.innerHTML;
        if (fistTxt.length === 1) {
            fistTxt = "0" + fistTxt;
        }
        e.dataset.daynum = yrMo + "-" + fistTxt;

        e.innerHTML = fistTxt
    });
    return false;
}

let whatSection = "CBT Thought Process";

if (localStorage.getItem("iHaveThoughtsSection")) {
    whatSection = localStorage.getItem("iHaveThoughtsSection");
}


function viewSubmission(dateOfSubmission) {





    let tempObj = [];
    if (activeFunc === "Journal") {
        if (localStorage.getItem("journalObj")) {
            tempObj = JSON.parse(localStorage.getItem("journalObj"));
        } else {
            globalAlert("alert-warning", "No current Journal.");
            return false;
        }
        let tempJournalStr = "";
        for (let i = 0; i < tempObj.length; i++) {

            let journalTopicStr = "";
            let topicsTitle = "";
            if (journalObj[i].topics !== undefined) {
                topicsTitle = "<label>Topics:</label>";
                for (let j = 0; j < journalObj[i].topics.length; j++) {
                    journalTopicStr = journalTopicStr + `<span class="badge rounded-pill bg-dark"> ${journalObj[i].topics[j]}</span>`;
                }

                console.log("journalObj[i].topics: " + journalObj[i].topics);
            }


            if (tempObj[i].journalDateTime.indexOf(dateOfSubmission) !== -1) {
                tempJournalStr = tempJournalStr + "<li class='list-group-item'><label><u> " + (1 + Number(i)) + ". Journal Title: " + tempObj[i].journalTitleSubmission + "</u></label><br/><p>" + tempObj[i].journalSubmission + "</p>" + topicsTitle + "<div>" + journalTopicStr + "</div><i>Date Time: " + tempObj[i].journalDateTime + "</i><hr/><button class='form-control btn btn-danger'  onClick=\"toggle('journal-" + i + "')\"> <i class='fas fa-trash'></i> Delete Journal " + (i + 1) + "</button><div  class='hide' data-toggle='journal-" + i + "' class='alert alert-info'><p>Are you sure you want to delete Journal number " + (1 + i) + "?</p><button class='btn btn-secondary' onClick=\"toggle('')\">No</button><button class='btn btn-danger'  onClick='deleteJournal(" + i + ")'>Yes</button></div></li>";
            }
        }
        document.getElementById("submissionTarget").innerHTML = tempJournalStr;
        return false;
    }



    if (activeFunc === "CBT Thought Process") {

        if (localStorage.getItem("thoughtObj")) {
            tempObj = JSON.parse(localStorage.getItem("thoughtObj"));


        } else {
            globalAlert("alert-warning", "No current thoughts.");
            return false;
        }




        let tempThoughtStr = "";
        for (let i = 0; i < tempObj.length; i++) {


            let cbtTopicStr = "";
            let topicsTitle = ""
            if (thoughtObj[i].topics !== undefined) {
                topicsTitle = "<label>Topics:</label>";
                for (let j = 0; j < thoughtObj[i].topics.length; j++) {
                    cbtTopicStr = cbtTopicStr + `<span class="badge rounded-pill bg-dark"> ${thoughtObj[i].topics[j]}</span>`;
                }

                console.log("thoughtObj[i].topics: " + thoughtObj[i].topics);
            }

            if (tempObj[i].thoughtDateTime.indexOf(dateOfSubmission) !== -1) {



                tempThoughtStr = tempThoughtStr + "<li class='list-group-item' ><label><u> " + (1 + Number(i)) + ". CBT Thought: </u>" + tempObj[i].automaticThought + "</label><br/><i>Date Time: " + tempObj[i].thoughtDateTime + "</i><hr/><label><u>Cognitive Distortion</u></label><p>" + tempObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" + tempObj[i].rationalThought + "</p>" + topicsTitle + "<div>" + cbtTopicStr + "</div><button class='form-control btn btn-danger' onClick=\"toggle('thought-" + i + "')\"> <i class='fas fa-trash'></i> Delete Thought " + (i + 1) + "</button><div  class='hide' data-toggle='thought-" + i + "' class='alert alert-info'><p>Are you sure you want to delete thought " + (1 + i) + "?</p><button class='btn btn-secondary' onClick=\"toggle('')\">No</button><button class='btn btn-danger'  onClick='deleteThought(" + i + ")'>Yes</button></div></li>";


            }
            document.getElementById("submissionTarget").innerHTML = tempThoughtStr;
        }

        window.location.href = "#submissionTarget";
        return false;

    }


}




function convertForCalendar(windowLocation) {

    if (localStorage.getItem("iHaveThoughtsSection")) {
        activeFunc = localStorage.getItem("iHaveThoughtsSection");
    }

    if (activeFunc === "Journal") {
        if (localStorage.getItem("journalObj")) {
            tempObj = JSON.parse(localStorage.getItem("journalObj"));


        } else {
            globalAlert("alert-warning", "No current Journal.");
            return false;
        }
    } else {
        if (localStorage.getItem("thoughtObj")) {
            tempObj = JSON.parse(localStorage.getItem("thoughtObj"));

        } else {
            globalAlert("alert-warning", "No current thoughts.");
            return false;
        }
    }

    [].forEach.call(document.querySelectorAll("[data-direction='0']"), (e) => {
        let fistTxt = e.innerHTML;

        let datSrt = e.dataset.daynum;

        if (activeFunc === "Journal") {



            let tempJournalStr = "";
            for (let i = 0; i < tempObj.length; i++) {

                if (tempObj[i].journalDateTime.indexOf(datSrt) !== -1) {

                    e.innerHTML = datSrt.substring(8, 10);
                    e.classList.add("alert")
                    e.classList.add("alert-success")
                } else {
                    e.innerHTML = datSrt.substring(8, 10)
                };
            }

        }


        if (activeFunc === "CBT Thought Process") {



            for (let i = 0; i < tempObj.length; i++) {


                if (tempObj[i].thoughtDateTime.indexOf(datSrt) !== -1) {

                    e.innerHTML = datSrt.substring(8, 10);
                    e.classList.add("alert")
                    e.classList.add("alert-success")
                } else {
                    e.innerHTML = datSrt.substring(8, 10)
                };
            }





        }

    });

    window.location.href = "#" + windowLocation;

}
/*
After discussion with chatGPT, this may help safari iphone 13 bug:
https://chatgpt.com/share/68730b76-292c-8003-addf-9a5b87ec55fd
*/

let picker = datepicker('#datePickerCalendarTarget', {
    // Event callbacks.
    onSelect: instance => {
        // Show which date was selected.



        const date = new Date(instance.dateSelected);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`);
        window.location.href = "#submissionTarget";

        viewSubmission(`${year}-${month}-${day}`)

    },
    onShow: instance => {
        if (updateCalendar) {
            let tempMonth = timestamp().substring(4, 6);
            whichMonth = instance.currentYear + "-" + tempMonth;
        } else {
            console.log("updateCalendar did not show: " + updateCalendar)
        }
    },
    onHide: instance => {
        [].forEach.call(document.querySelectorAll("[data-daynum]"), (e) => {
            let dayVal = e.getAttribute("data-daynum");
            e.innerHTML = dayVal.substring(8, 10)
        });
    },
    onMonthChange: instance => {

        // Show the month of the selected date. 
        // console.log(instance.currentYear)
        // console.log(instance.currentMonth);
        let tempMonth = instance.currentMonth + 1;
        if (tempMonth < 10) {
            tempMonth = "0" + tempMonth;
        }
        whichMonth = instance.currentYear + "-" + tempMonth;
        writeDayNums(whichMonth);
        convertForCalendar("submissionTarget")
    },
    // Customizations.
    formatter: (input, date, instance) => {
        // This will display the date as `1/1/2019`.
        input.value = date.toDateString()
    },
    position: 'c', // Top right.
    startDay: 1, // Calendar week starts on a Monday.
    customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
    customMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    customOverlayMonths: ['😀', '😂', '😎', '😍', '🤩', '😜', '😬', '😳', '🤪', '🤓 ', '😝', '😮'],
    overlayButton: 'Go!',
    overlayPlaceholder: 'Enter a 4-digit year',
    // Settings.
    alwaysShow: true,//Never hide the calendar.
    dateSelected: new Date(), // Today is selected.
    /*events: [
        new Date(2024, 8, 22),
        new Date(2024, 8, 10),
        new Date(2024, 10, 20),
    ],*/
    maxDate: new Date(2099, 0, 1), // Jan 1st, 2099.
    minDate: new Date(2016, 5, 1), // June 1st, 2016.
    startDate: new Date(), // This month.
    showAllDates: false, // Numbers for leading & trailing days outside the current month will show.
    // Disabling things.
    /* noWeekends: true, // Saturday's and Sunday's will be unselectable.
     disabler: date => (date.getDay() === 2 && date.getMonth() === 9), // Disabled every Tuesday in October
     disabledDates: [new Date(2050, 0, 1), new Date(2050, 0, 3)], // Specific disabled dates.
     disableMobile: true, // Conditionally disabled on mobile devices.
     disableYearOverlay: true, // Clicking the year or month will *not* bring up the year overlay.*/
    // ID - be sure to provide a 2nd picker with the same id to create a daterange pair.
    id: 1
});





function rebuildCalendarTarget() {

    // Find the parent wrapper
    const wrapper = document.getElementById('calendarWrapper');

    if (!wrapper) return null;

    // Remove any existing calendar target completely
    const oldTarget = document.getElementById('datePickerCalendarTarget');
    if (oldTarget) {
        oldTarget.remove(); // fully detaches the node, freeing memory


    }

    // Create a fresh calendar target div
    const newTarget = document.createElement('div');
    newTarget.id = 'datePickerCalendarTarget';
    wrapper.appendChild(newTarget);

    return newTarget;

}


function viewVersion(view, onload) {



    [].forEach.call(document.querySelectorAll("[data-option]"), (e) => {
        e.classList.remove("active");
    });
    document.querySelector("[data-option='" + view + "']").classList.add("active");

    [].forEach.call(document.querySelectorAll("[data-direction='0']"), (e) => {
        e.classList.remove("alert");
        e.classList.remove("alert-success");
    });

    document.getElementById("submissionTarget").innerHTML = "";

    localStorage.setItem("activeTherapyView", view);



    if (localStorage.getItem("iHaveThoughtsSection")) {
        whatSection = localStorage.getItem("iHaveThoughtsSection");
    } else {
        whatSection = "CBT Thought Process";
    }

    if (whatSection === "Journal") {
        if (localStorage.getItem("journalObj")) {
            buildJournalList("viewVersion");
        }

    }


    if (view === "calendar") {

        viewSubmission(timestamp().substring(0, 10));


        writeDayNums(timestamp().substring(0, 7));
        if (!onload) {
            convertForCalendar("calendarWrapper");
        }


        [].forEach.call(document.querySelectorAll("[data-view='list']"), (e) => {
            e.classList.add("hide");
        })

        document.querySelector("#calendarWrapper").classList.remove("hide");


        window.location.href = "#calendarWrapper";


    }


    if (view === "list") {
        window.location.href = "#viewListTarget";


        if (localStorage.getItem("thoughtObj")) {
            buildList("viewVersion");
        }


        [].forEach.call(document.querySelectorAll("[data-view='list']"), (e) => {
            e.classList.add("hide");
        })

        document.querySelector("#calendarWrapper").classList.add("hide");


        if (document.querySelector("[data-section='" + whatSection + "'][data-view='list']")) {
            document.querySelector("[data-section='" + whatSection + "'][data-view='list']").classList.remove("hide");
        }



    }


    runMoodChart();


}


function toggleSection(whatSection, toggleMobileFunc, onload) {
    document.getElementById("activeTitleTarget").innerHTML = whatSection;
    if (whatSection !== "Analytics") {


        [].forEach.call(document.querySelectorAll(".viewOptionWrapper"), (e) => {
            e.classList.remove("hide");
        });
    } else {
        document
            .querySelector("#chart")
            .scrollIntoView({ behavior: "smooth" });
        [].forEach.call(document.querySelectorAll(".viewOptionWrapper"), (e) => {
            e.classList.add("hide");
        });

    }


    document.getElementById("submissionTarget").innerHTML = "";
    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }
    if (activeView === "calendar") {

        rebuildCalendarTarget();

        picker.setDate(new Date(), true);

    }
    //  setTimeout(() => {

    //   }, 1000);


    localStorage.setItem("iHaveThoughtsSection", whatSection);

    [].forEach.call(document.querySelectorAll("[data-section]"), (e) => {

        if (e.dataset.section === whatSection) {
            e.classList.remove("hide");
        } else {
            e.classList.add("hide");
        }

    })
    //document.querySelector("[data-section='" + whatSection + "']").classList.remove("hide");



    console.log("whatSection: " + whatSection)
    if (toggleMobileFunc) {
        toggleMobileNav("mobileNav");
    }



    [].forEach.call(document.querySelectorAll("[data-selected]"), (e) => {

        if (e.dataset.selected === whatSection) {
            e.classList.remove("active");
        } else {
            e.classList.add("active");
        }

    });

    // document.querySelector("[data-selected='" + whatSection + "']").classList.add("active");

    if (localStorage.getItem("iHaveThoughtsSection") !== "Analytics") {

        try {
            if (document.querySelector("[data-addeditbt='edit'].active")) {
                globalAlert("alert-info", "You are in \"edit\" mode.");
            }
        } catch (error) {
            console.log("error: " + error)
        }

        try {
            if (document.querySelector("[data-addeditbt='add'].active")) {
                globalAlert("alert-info", "You are in \"add\" mode.");
            }
        } catch (error) {
            console.log("error: " + error)
        }

    }


    viewVersion(activeView, onload);

}



if (localStorage.getItem("iHaveThoughtsSection")) {
    toggleSection(localStorage.getItem("iHaveThoughtsSection"), false, true);
}


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


                    globalAlert("alert-danger", "This data does not have the correct keys and values.");
                    return false;
                }
                thoughtObj = tempObj[0].thoughtObj;
                localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));
                journalObj = tempObj[0].journalObj;
                localStorage.setItem("journalObj", JSON.stringify(journalObj));

                buildList("handleOnSubmit");
                buildJournalList("handleOnSubmit");

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
    let activeView = "list";
    /* if (localStorage.getItem('activeTherapyView')) {
         activeView = localStorage.getItem('activeTherapyView');
     }*/

    viewVersion(activeView);



    // toggleEdit();








};


writeDayNums(timestamp().substring(0, 7));
convertForCalendar("top");


function deleteJournal(num) {

    let tempObj = [];
    for (let i = 0; i < journalObj.length; i++) {
        if (num !== i) {
            tempObj.push(journalObj[i])
        }
    }
    journalObj = tempObj;
    localStorage.setItem("journalObj", JSON.stringify(journalObj));

    buildJournalList("deleteJournal");

    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }

    viewVersion(activeView);

    runMoodChart();


}


function deleteThought(num) {

    if (localStorage.getItem("thoughtObj")) {
        thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
    } else {
        console.log("there was no localStorage - thoughtObj");
        return false;
    }
    let tempObj = [];
    for (let i = 0; i < thoughtObj.length; i++) {
        if (num !== i) {
            tempObj.push(thoughtObj[i])
        }
    }

    thoughtObj = tempObj;
    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));

    buildList("deleteThought");

    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }

    viewVersion(activeView);



}


function submitJournalThought(addEdit) {

    let mood = document.getElementById("mood").value;

    if (document.getElementById("mood").value === "default") {
        globalAlert("alert-danger", "Select an option for your current mood please.");
        document.getElementById("mood").classList.add("error");
        return false;
    } else {
        document.getElementById("mood").classList.remove("error");
    }


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
            journalDateTime: timestamp(),
            mood,
            topics: journalTopics
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
        journalObj[selectedEdit].mood = mood;
        journalObj[selectedEdit].topics = journalTopics;

    }

    localStorage.setItem("journalObj", JSON.stringify(journalObj));

    document.getElementById("journalInput").value = "";
    document.getElementById("journalTitle").value = "";

    buildJournalList("submitJournalThought");
    writeDayNums(timestamp().substring(0, 7));
    convertForCalendar("submissionTarget");
    document.getElementById("submissionTarget").innerHTML = "";
    globalAlert("alert-success", "Journal entry " + addEdit + "ed.");
    document.querySelector("select#mood").selectedIndex = 0;
    journalTopics = [];
    document.getElementById("submissionTarget").innerHTML = "";
    document.getElementById("journalTopicsTarget").innerHTML = "";

}





function submitThought(addEdit) {



    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.classList.remove("error");
    });

    document.getElementById("cognitiveDistortion").classList.remove("error");

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
            automaticThought: automaticThought,
            cognitiveDistortion,
            rationalThought: rationalThought,
            thoughtDateTime: timestamp(),
            topics: cbtTopics
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
        thoughtObj[selectedNum].topics = cbtTopics;



    }

    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));
    globalAlert("alert-success", "Thought " + addEdit + "ed.");

    buildList("submitThought");
    writeDayNums(timestamp().substring(0, 7));
    convertForCalendar("submissionTarget");

    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.value = "";
    });

    [].forEach.call(document.querySelectorAll("[data-options]"), (e) => {

        e.checked = false;
    });

    document.getElementById("submissionTarget").innerHTML = "";
    document.getElementById("cbtTopicsTarget").innerHTML = "";

    cbtTopics = [];



}





populateEditMenus();



function addTopic(whichTopic) {
    document.querySelector("[name='journalTopic']").classList.remove("error");
    document.querySelector("[name='cbtTopic']").classList.remove("error");

    if (whichTopic === "CBT") {

        console.log("document.querySelector([name = 'cbtTopic']).value: " + document.querySelector("[name='cbtTopic']").value)
        let topic = document.querySelector("[name='cbtTopic']").value;
        topic = topic.toLowerCase();
        if (topic !== "") {

            cbtTopics.push(topic);
            document.querySelector("[name='cbtTopic']").value = "";
            // globalAlert("alert-success", "Topic: " + topic + " saved.");//cbtTopicsTarget
            let currentCbtTopics = document.getElementById("cbtTopicsTarget").innerHTML;
            currentCbtTopics = currentCbtTopics + `<li class="list-group-item p-0"><button onClick="deleteTopic('CBT','${topic}')" class="btn btn-dark"><i class="fas fa-trash"></i> ${topic}</button></li>`;
            document.getElementById("cbtTopicsTarget").innerHTML = currentCbtTopics;

        } else {
            document.querySelector("[name='cbtTopic']").classList.add("error");
            return false;
        }
    } else {








        console.log("document.querySelector([name = 'journalTopic']).value: " + document.querySelector("[name='journalTopic']").value)
        let topic = document.querySelector("[name='journalTopic']").value;
        topic = topic.toLowerCase();
        if (topic !== "") {

            journalTopics.push(topic);
            document.querySelector("[name='journalTopic']").value = "";
            //globalAlert("alert-success", "Topic: " + topic + " saved.");
            let currentJournalTopics = document.getElementById("journalTopicsTarget").innerHTML;
            currentJournalTopics = currentJournalTopics + `<li class="list-group-item p-0"><button onClick="deleteTopic('Journal','${topic}')" class="btn btn-dark "><i class="fas fa-trash"></i> ${topic}</button></li>`;
            document.getElementById("journalTopicsTarget").innerHTML = currentJournalTopics;


        } else {
            document.querySelector("[name='journalTopic']").classList.add("error");
            return false;
        }
    }


}

/*
let cbtTopics = [];
let journalTopics = [];
*/


function deleteTopic(journalCBT, name) {
    let selectedNum = document.querySelector("select[name='thoughtObjDateList']").value;
    if (journalCBT === "Journal") {
        selectedNum = document.querySelector("select[name='journalDateList']").value;
    }
    console.log("selectedNum: " + selectedNum)

    if (journalCBT === "Journal") {
        let topicArray = []

        document.getElementById("journalTopicsTarget").innerHTML = "";
        if (selectedNum === "default") {
            topicArray = journalTopics;
            console.log("we are going with journalTopics: " + journalTopics)
        } else {
            topicArray = journalObj[selectedNum].topics
        }

        console.log("before loop topicArray: " + topicArray);
        let tempJournalTopics = [];
        let journalTopicStr = "";
        for (let i = 0; i < topicArray.length; i++) {
            console.log("topicArray[i]: " + topicArray[i] + " name: " + name);
            if (topicArray[i] !== name) {
                journalTopicStr = journalTopicStr + `<li class="list-group-item p-0"><button onClick="deleteTopic('Journal','${topicArray[i]}')" class="btn btn-dark"><i class="fas fa-trash"></i> ${topicArray[i]}</button></li>`;

                tempJournalTopics.push(topicArray[i])
            } else {
                console.log("it equalled: " + name);
            }
        }
        console.log("before loop topicArray: " + topicArray);
        //topicArray = tempJournalTopics;
        journalTopics = tempJournalTopics;
        console.log("topicArray: " + topicArray);
        if (selectedNum !== "default") {
            journalObj[selectedNum].topics = tempJournalTopics;
        }
        document.getElementById("journalTopicsTarget").innerHTML = journalTopicStr;
















    } else {


        let topicArray = []

        document.getElementById("cbtTopicsTarget").innerHTML = "";
        if (selectedNum === "default") {
            topicArray = cbtTopics;
        } else {
            topicArray = thoughtObj[selectedNum].topics
        }
        let tempCbtTopics = [];

        let cbtTopicStr = "";
        console.log("before loop topicArray: " + topicArray);
        for (let i = 0; i < topicArray.length; i++) {
            if (topicArray[i] !== name) {
                cbtTopicStr = cbtTopicStr + `<li class="list-group-item p-0"><button onClick="deleteTopic('CBT','${topicArray[i]}')" class="btn btn-dark"><i class="fas fa-trash"></i> ${topicArray[i]}</button></li>`;

                tempCbtTopics.push(topicArray[i]);
            }

        }
        console.log("afetr loop topicArray: " + topicArray);

        if (selectedNum !== "default") {
            thoughtObj[selectedNum].topics = tempCbtTopics
        }
        cbtTopics = tempCbtTopics;
        console.log("tempCbtTopics: " + tempCbtTopics);

        document.getElementById("cbtTopicsTarget").innerHTML = cbtTopicStr;
    }

}