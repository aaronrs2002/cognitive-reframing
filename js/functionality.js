

let cbtTopics = [];
let journalTopics = [];
const cognDisOptions = ["All or Nothing (AKA Black and White)", "Overgeneralization", "Mental Filtering", "Disqualifying the Positive", "Jumping to Conclusions", "Magnification or Minimization", "Emotional Reasoning", "\"Should\" Statements", "Labeling and Mislabeling", "Personalization"]
let activeFunc = "CBT Thought Process";

let activeTherapyView = "calendar";
if (localStorage.getItem("activeTherapyView")) {
    activeTherapyView = localStorage.getItem("activeTherapyView");
}
;/*//localStorage.setItem("iHaveThoughtsSection", "CBT Thought Process")set deafault for search to work*/

[].forEach.call(document.querySelectorAll("[data-instructions='top']"), (e) => {
    e.innerHTML = "This application has no database. What is typed is stored in your browser's local storage.All data can be downloaded and uploaded at the <a href='#downloadOption' > bottom of the page.</a>"
})


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
let oneTopicStr = "<option value='default'>Select previous topic<option>";
let tempList = [];

function buildList(fromWhere) {
    document.getElementById("thoughtTarget").innerHTML = "";
    let thoughtStr = "";


    if (localStorage.getItem("thoughtObj")) {
        thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
    } else {
        globalAlert("alert-warning", "No Thoughts submitted.");
        return false;
    }


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



        let cbtTopicStr = "";
        let topicsTitle = "";

        if (thoughtObj[i].topics !== undefined) {



            for (let j = 0; j < thoughtObj[i].topics.length; j++) {
                let prepWord = thoughtObj[i].topics[j].toLocaleLowerCase();
                if (tempList.indexOf(prepWord) === -1) {

                    tempList.push(prepWord);

                }
            }





            topicsTitle = "<label>Topics:</label>";
            for (let j = 0; j < thoughtObj[i].topics.length; j++) {
                cbtTopicStr = cbtTopicStr + `<span class="badge rounded-pill bg-secondary">${thoughtObj[i].topics[j]}</span>`;
            }

            // console.log("thoughtObj[i].topics: " + thoughtObj[i].topics);
        }

        thoughtStr = thoughtStr + "<li class='list-group-item' data-row='" + i + "' ><label><u> " + (i + 1) + ". Thought: </u>" + thoughtObj[i].automaticThought
            + "</label><br/><i>Date Time: " + thoughtDateTime + "</i><hr/><label><u>Cognitive Distortion</u></label><p>" + thoughtObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" +
            thoughtObj[i].rationalThought + "</p>" + topicsTitle + "<div class='py-1'>" + cbtTopicStr + "</div><button class='form-control btn btn-danger' onClick=\"toggle('thought-" + i + "')\"> <i class='fas fa-trash'></i> Delete Thought " + (i + 1) + "</button><div  class='hide' data-toggle='thought-" + i + "' class='alert alert-info'><p>Are you sure you want to delete thought " + (1 + i) + "?</p><button class='btn btn-secondary' onClick=\"toggle('')\">No</button><button class='btn btn-danger'  onClick='deleteThought(" + i + ")'>Yes</button></div></li>";
    }

    document.getElementById("thoughtTarget").innerHTML = thoughtStr;




    populateEditMenus();
    let preCk = document.getElementById("topicsListTarget").innerHTML;
    if (preCk === "") {
        for (let j = 0; j < tempList.length; j++) {
            oneTopicStr = oneTopicStr + "<option value='" + tempList[j] + "'>" + tempList[j] + "</option>";

        }
    }

    document.getElementById("topicsListTarget").innerHTML = oneTopicStr;

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




function buildJournalList(fromWhere) {





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
        let journalTopicStr = "";
        let topicsTitle = "";
        if (journalObj[i].topics !== undefined) {
            topicsTitle = "<label>Topics:</label>";
            for (let j = 0; j < journalObj[i].topics.length; j++) {
                journalTopicStr = journalTopicStr + `<span class="badge rounded-pill bg-secondary">${journalObj[i].topics[j]}</span>`;
            }


        }


        /*
                journalTitleSubmission,
        journalSubmission,
        journalDateTime: timestamp()
        */

        journalStr = journalStr + "<li class='list-group-item' data-row='" + i + "'><label><u> " + (i + 1) + ". Journal Title: " + journalObj[i].journalTitleSubmission
            + "</u></label><br/><p>" + journalObj[i].journalSubmission
            + "</p>" + topicsTitle + "<div class='py-1'>" + journalTopicStr + "</div><i>Date Time: " + journalDateTime + "</i><hr/><button class='form-control btn btn-danger'  onClick=\"toggle('journal-" + i + "')\"> <i class='fas fa-trash'></i> Delete Journal " + (i + 1) + "</button><div  class='hide' data-toggle='journal-" + i + "' class='alert alert-info'><p>Are you sure you want to delete Journal number " + (1 + i) + "?</p><button class='btn btn-secondary' onClick=\"toggle('')\">No</button><button class='btn btn-danger'  onClick='deleteJournal(" + i + ")'>Yes</button></div></li>";
    }

    document.getElementById("journalSubmissionsTarget").innerHTML = journalStr;

    populateEditMenus();
    runMoodChart();


}



if (localStorage.getItem("journalObj")) {
    journalObj = JSON.parse(localStorage.getItem("journalObj"));
    //buildJournalList("localStorage");
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






let navData = [{ name: "CBT Thought Process", address: "#top" }, { name: "Journal", address: "#top" }, { name: "Analytics", address: "#chart" }];
let navLinkHTML = "";


for (let i = 0; i < navData.length; i++) {
    navLinkHTML = navLinkHTML + `<li class='nav-item'> <a class='nav-link' data-selected='${navData[i].name}' href='#top' onClick="toggleSection('${navData[i].name}', true)"><u>${navData[i].name}</u></a></li>`;
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
    buildList("LocalStorage");
}

function runSearch() {
    let idTarget = "thoughtTarget";
    tempObj = JSON.parse(localStorage.getItem("thoughtObj"));
    if (localStorage.getItem("iHaveThoughtsSection") === "Journal") {
        tempObj = JSON.parse(localStorage.getItem("journalObj"));
        idTarget = "journalSubmissionsTarget";
    }
    let searchTerm = document.querySelector("[name='searchField-" + localStorage.getItem("iHaveThoughtsSection") + "']").value.toLowerCase();
    for (let i = 0; i < tempObj.length; i++) {
        let searchTopics = "";
        if (tempObj[i].topics !== undefined) {
            searchTopics = tempObj[i].topics;
        }
        if (idTarget === "thoughtTarget") {

            if (tempObj[i].automaticThought.toLowerCase().indexOf(searchTerm) !== -1 || tempObj[i].cognitiveDistortion.toLowerCase().indexOf(searchTerm) !== -1 || tempObj[i].rationalThought.toLowerCase().indexOf(searchTerm) !== -1 || tempObj[i].thoughtDateTime.indexOf(searchTerm) !== -1 || searchTopics.toString().indexOf(searchTerm) !== -1) {
                if (document.querySelector("#" + idTarget + " li.list-group-item.hide[data-row='" + i + "']")) {
                    document.querySelector("#" + idTarget + " li.list-group-item[data-row='" + i + "']").classList.remove("hide");
                }
            } else {
                document.querySelector("#" + idTarget + " li.list-group-item[data-row='" + i + "']").classList.add("hide");
            }
        } else {
            if (tempObj[i].journalTitleSubmission.toLowerCase().indexOf(searchTerm) !== -1 || tempObj[i].journalSubmission.toLowerCase().indexOf(searchTerm) !== -1 || tempObj[i].journalDateTime.indexOf(searchTerm) !== -1 ||
                searchTopics.toString().indexOf(searchTerm) !== -1) {
                if (document.querySelector("#" + idTarget + " li.list-group-item.hide[data-row='" + i + "']")) {
                    document.querySelector("#" + idTarget + " li.list-group-item[data-row='" + i + "']").classList.remove("hide");
                }
            } else {
                document.querySelector("#" + idTarget + " li.list-group-item[data-row='" + i + "']").classList.add("hide");
            }
        }
    }
}

function updateCRUD(addEdit) {
    [].forEach.call(document.querySelectorAll("[data-addeditbt]"), (e) => {
        if (e.dataset.addeditbt !== addEdit) {
            e.classList.remove("active");
        } else {
            e.classList.add("active");
        }

    });

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

    globalAlert("alert-info", "You are in \"" + addEdit + "\" mode.");


    //document.querySelector("[data-edit='" + addEdit + "']").classList.remove("hide");

}

function populateForEdit(whichObj) {

    document.getElementById("cbtTopicsTarget").innerHTML = "";
    document.getElementById("cbtTopicsTarget").innerHTML = "";

    if (whichObj === "journalDateList") {

        let selectedNum = document.querySelector("select[name='journalDateList']").value;
        if (selectedNum === "default") {
            return false;
        }

        document.getElementById("journalInput").value = journalObj[selectedNum].journalSubmission;
        document.getElementById("journalTitle").value = journalObj[selectedNum].journalTitleSubmission;
        if (journalObj[selectedNum].mood) {
            document.getElementById("mood").value = journalObj[selectedNum].mood;
        }

        if (journalObj[selectedNum].topics !== undefined) {
            let journalTopicStr = "";
            for (let i = 0; i < journalObj[selectedNum].topics.length; i++) {
                journalTopicStr = journalTopicStr + `<li class="list-group-item p-0"><button onClick="deleteTopic('Journal','${journalObj[selectedNum].topics[i]}')" class="btn btn-dark"><i class="fas fa-trash"></i> ${journalObj[selectedNum].topics[i]}</button></li>`;
            }
            journalTopics = journalObj[selectedNum].topics;
            document.getElementById("journalTopicsTarget").innerHTML = journalTopicStr;
        }



    }

    if (whichObj === "thoughtObjDateList") {

        let selectedNum = document.querySelector("select[name='thoughtObjDateList']").value;

        if (selectedNum === "default") {
            return false;
        }

        document.getElementById("automaticThought").value = thoughtObj[selectedNum].automaticThought;
        document.getElementById("rationalThought").value = thoughtObj[selectedNum].rationalThought;
        if (thoughtObj[selectedNum].mood) {
            document.getElementById("mood").value = thoughtObj[selectedNum].mood;
        }


        [].forEach.call(document.querySelectorAll("input[type='checkbox'][data-options]"), (e) => {
            e.checked = false;
        });


        for (let i = 0; i < cognDisOptions.length; i++) {

            if (thoughtObj[selectedNum].cognitiveDistortion.indexOf(cognDisOptions[i]) !== -1) {
                document.querySelector("input[type='checkbox'][name='" + cognDisOptions[i] + "']").checked = true;
            }

        }


        if (thoughtObj[selectedNum].topics !== undefined) {
            cbtTopics = thoughtObj[selectedNum].topics;


            let cbtTopicStr = "";
            for (let i = 0; i < thoughtObj[selectedNum].topics.length; i++) {
                cbtTopicStr = cbtTopicStr + `<li class="list-group-item p-0"><button onClick="deleteTopic('CBT','${thoughtObj[selectedNum].topics[i]}')" class="btn btn-dark"><i class="fas fa-trash"></i> ${thoughtObj[selectedNum].topics[i]}</button></li>`;
            }

            document.getElementById("cbtTopicsTarget").innerHTML = cbtTopicStr;
        }


    }

}


/*START THEMES*/
const themesList = ["Spacelab", "United", "Slate", "Cerulean", "Darkly", "Litera", "Materia", "Sandstone", "Superhero", "Cosmo", "Flatly", "Lumen", "Minty", "Simplex", "Solar", "Cyborg", "Journal", "Lux", "Pulse", "Sketchy", "Yeti", "Morph", "Quartz", "Vapor", "Zephyr"];
let chosenTheme;
let url = window.location;
let themeVal = {};
let themeOptions = "<option value='default'>Select Theme</option>";

for (let i = 0; i < themesList.length; i++) {
    themeOptions = themeOptions + "<option value='" + themesList[i].toLocaleLowerCase() + "'>Theme: <span class='capitalize'>" + themesList[i] + "</span></option>";
}
document.getElementById("themes").innerHTML = themeOptions;

function changeTheme() {
    let gaParam = "";
    if (url.toString().indexOf("exclude") !== -1) {
        gaParam = "exclude=true";
    }
    let whichTheme = document.getElementById("themes").value;
    if (whichTheme === "default") {
        return false;
    } else {
        // document.getElementById("themedStyle").setAttribute("href", "https://bootswatch.com/5/" + whichTheme + "/bootstrap.css");
        chosenTheme = whichTheme.replace("https://bootswatch.com/5/", "").replace("/bootstrap.css");
        localStorage.setItem("theme", chosenTheme);
        //setGameLinks(chosenTheme);
        window.location = "?" + gaParam + "&theme=" + chosenTheme + "&";
    }

}
/*SPLIT PARAMS*/
(url + "?")
    .split("?")[1]
    .split("&")
    .forEach(function (pair) {
        pair = (pair + "=").split("=").map(decodeURIComponent);
        if (pair[0].length) {
            themeVal[pair[0]] = pair[1];
            if (pair[0] === "theme") {

                const themeFromUrl = "https://bootswatch.com/5/" + pair[1] + "/bootstrap.css";

                document.getElementById("themedStyle").setAttribute("href", themeFromUrl);
                localStorage.setItem("theme", pair[1]);
            }

        }
    });
let tempTheme = localStorage.getItem("theme");
if (localStorage.getItem("theme")) {

    let needAddress = "https://bootswatch.com/5/";
    if (localStorage.getItem("theme").indexOf("boot") !== -1) {
        needAddress = "";
    }


    if (tempTheme.indexOf("bootstrap.css") !== -1) {
        tempTheme = tempTheme.replace("/bootstrap.css", "");
    }

    document.getElementById("themedStyle").setAttribute("href", needAddress + tempTheme + "/bootstrap.css");
} else {

    localStorage.setItem("theme", "spacelab");
}
document.querySelector("#themes option:first-child").innerHTML = "Selected theme: " + tempTheme;
//END THEMES


/* mood functionality. start*/
let counter = 0;
let counterHTML = "<option value='default'>Select 1 (terrible) - 10 (great)</option>";
for (let i = 0; i < 10; i++) {
    counter = counter + 1;
    counterHTML = counterHTML + "<option value='" + counter + "' >" + counter + "</option>"
}
document.getElementById("mood").innerHTML = counterHTML;


/*START MOOD LINE CHART
let thoughtObj = [];
let journalObj = [];
*/
function runMoodChart() {




    let moodData = [];
    let moodDates = []
    /*for (let i = 0; i < thoughtObj.length; i++) {
        if (thoughtObj[i].mood) {
            moodData.push(thoughtObj[i].mood);
            moodDates.push(thoughtObj[i].thoughtDateTime.substring(0, 19))
        }

    }*/
    for (let i = 0; i < journalObj.length; i++) {
        if (journalObj[i].mood) {
            moodData.push(journalObj[i].mood)
            moodDates.push(journalObj[i].journalDateTime.substring(5, 19))
        }

    }


    if (moodData.length === 0) {
        console.log("we didn't find a mood data point.");
        return false;
    }
    var options = {
        series: [{
            name: "Mood Metric",
            data: moodData
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Mood Trends 1 (awful) to 10 (great)',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: moodDates,
            labels: {
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                trim: false,
                minHeight: undefined,
                maxHeight: 120,
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
                offsetX: 0,
                offsetY: 0,
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    setTimeout(() => {
        document.getElementById("chart").innerHTML = "";
        chart.render();
    }, 500)

}

