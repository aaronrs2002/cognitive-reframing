
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

            if (tempObj[i].journalDateTime.indexOf(dateOfSubmission) !== -1) {
                tempJournalStr = tempJournalStr + "<li class='list-group-item'><label><u> " + (1 + Number(i)) + ". Journal Title: " + tempObj[i].journalTitleSubmission + "</u></label><br/><p>" + tempObj[i].journalSubmission + "</p><i>Date Time: " + tempObj[i].journalDateTime + "</i><hr/><button class='form-control btn btn-danger' onClick='deleteJournal(" + i + ")'> <i class='fas fa-trash'></i> Delete Journal " + (Number(i) + 1) + "</button></li>";
            }
        }
        document.getElementById("submissionTarget").innerHTML = tempJournalStr;
        return false;
    }



    if (activeFunc === "CBT Thought Process") {

        if (localStorage.getItem("thoughtObj")) {
            tempObj = JSON.parse(localStorage.getItem("thoughtObj"));

            console.log("tempObj.length: " + tempObj.length)
        } else {
            globalAlert("alert-warning", "No current thoughts.");
            return false;
        }

        console.log("CBT Thought Process")


        let tempThoughtStr = "";
        for (let i = 0; i < tempObj.length; i++) {

            console.log("checking dates: " + tempObj[i].thoughtDateTime.indexOf(dateOfSubmission))
            if (tempObj[i].thoughtDateTime.indexOf(dateOfSubmission) !== -1) {


                console.log("found one: " + tempObj[i].thoughtDateTime.indexOf(dateOfSubmission));
                tempThoughtStr = tempThoughtStr + "<li class='list-group-item' ><label><u> " + (1 + Number(i)) + ". Thought: </u>" + tempObj[i].automaticThought + "</label><br/><i>Date Time: " + tempObj[i].thoughtDateTime + "</i><hr/><label><u>Cognitive Distortion</u></label><p>" + tempObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" + tempObj[i].rationalThought + "</p><button class='form-control btn btn-danger' onClick='deleteThought(" + Number(i) + ")'> <i class='fas fa-trash'></i> Delete Thought " + (Number(i) + 1) + "</button></li>";


                console.log("tempThoughtStr" + tempThoughtStr)
            }
            document.getElementById("submissionTarget").innerHTML = tempThoughtStr;
        }

        window.location.href = "#submissionTarget";
        return false;

    }


}




function convertForCalendar() {


    if (localStorage.getItem("iHaveThoughtsSection")) {
        activeFunc = localStorage.getItem("iHaveThoughtsSection");
    }

    [].forEach.call(document.querySelectorAll("[data-direction='0']"), (e) => {
        let fistTxt = e.innerHTML;

        let datSrt = e.dataset.daynum;

        if (activeFunc === "Journal") {
            if (localStorage.getItem("journalObj")) {
                tempObj = JSON.parse(localStorage.getItem("journalObj"));

                console.log("tempObj.length: " + tempObj.length)
            } else {
                globalAlert("alert-warning", "No current Journal.");
                return false;
            }


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

            if (localStorage.getItem("thoughtObj")) {
                tempObj = JSON.parse(localStorage.getItem("thoughtObj"));


            } else {
                globalAlert("alert-warning", "No current thoughts.");
                return false;
            }

            for (let i = 0; i < tempObj.length; i++) {


                if (tempObj[i].thoughtDateTime.indexOf(datSrt) !== -1) {

                    e.innerHTML = datSrt.substring(8, 10);
                    e.classList.add("alert")
                    e.classList.add("alert-success")
                } else {
                    e.innerHTML = datSrt.substring(8, 10)
                };
            }

            window.location.href = "#submissionTarget";
            return false;

        }
        return false;
    });



}

let picker = datepicker('#datePickerCalendarTarget', {
    // Event callbacks.
    onSelect: instance => {
        // Show which date was selected.
        console.log(instance.dateSelected);


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
        convertForCalendar()
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




function viewVersion(view) {


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

    let whatSection = "CBT Thought Process";

    if (localStorage.getItem("iHaveThoughtsSection")) {
        whatSection = localStorage.getItem("iHaveThoughtsSection");
    }



    if (view === "calendar") {

        buildJournalList();

        writeDayNums(timestamp().substring(0, 7));
        convertForCalendar();

        [].forEach.call(document.querySelectorAll("[data-view='list']"), (e) => {
            e.classList.add("hide");
        })

        document.querySelector("#calendarWrapper").classList.remove("hide");

        viewSubmission(timestamp().substring(0, 10))
    }


    if (view === "list") {


        buildList();

        [].forEach.call(document.querySelectorAll("[data-view='list']"), (e) => {
            e.classList.add("hide");
        })

        document.querySelector("#calendarWrapper").classList.add("hide");



        document.querySelector("[data-section='" + whatSection + "'][data-view='list']").classList.remove("hide");

    }



}


function toggleSection(whatSection, toggleMobileFunc) {


    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }
    setTimeout(() => {
        viewVersion(activeView);
    }, 1000);


    localStorage.setItem("iHaveThoughtsSection", whatSection);

    [].forEach.call(document.querySelectorAll("[data-section]"), (e) => {
        e.classList.add("hide");
    })
    document.querySelector("[data-section='" + whatSection + "']").classList.remove("hide");

    if (toggleMobileFunc) {
        toggleMobileNav("mobileNav");
    }



    [].forEach.call(document.querySelectorAll("[data-selected]"), (e) => {
        e.classList.remove("active");
    });

    document.querySelector("[data-selected='" + whatSection + "']").classList.add("active");
}



if (localStorage.getItem("iHaveThoughtsSection")) {
    toggleSection(localStorage.getItem("iHaveThoughtsSection"), false);
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
    let activeView = "list";
    /* if (localStorage.getItem('activeTherapyView')) {
         activeView = localStorage.getItem('activeTherapyView');
     }*/

    viewVersion(activeView);



    // toggleEdit();








};


writeDayNums(timestamp().substring(0, 7));
convertForCalendar();


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

    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }

    viewVersion(activeView);



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

    let activeView = "list";
    if (localStorage.getItem('activeTherapyView')) {
        activeView = localStorage.getItem('activeTherapyView');
    }

    viewVersion(activeView);



}

/*

let thoughtObj = [];
let journalObj = [];
let journalDateList = [];
let thoughtObjDateList = [];

select[name='journalDateList']
select[name='thoughtObjDateList']

*/

populateEditMenus();