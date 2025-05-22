



let thoughtObj = []
if (localStorage.getItem("thoughtObj")) {
    thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
}



function buildList() {

    let thoughtStr = "";
    for (let i = 0; i < thoughtObj.length; i++) {
        thoughtStr = thoughtStr + "<li class='list-group-item'><label> " + (i + 1) + ". Thought: " + thoughtObj[i].automaticThought
            + "</label><hr/><label><u>Cognitive Distortion</u></label><p>" + thoughtObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" +
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
        rationalThought
    }];

    localStorage.setItem("thoughtObj", JSON.stringify(thoughtObj));

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
    let tempData = [];
    if (localStorage.getItem("thoughtObj")) {
        tempData = JSON.parse(localStorage.getItem("thoughtObj"));
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tempData, null, 2)], {
        type: 'application/json'
    }));
    a.setAttribute("download", "cognitiveDistortion.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            const tempObj = event.target.result;
            if (type === "json") {

                let ck = JSON.parse(tempObj)

                if (ck[0].automaticThought === undefined) {
                    console.log("tempObj[0].automaticThought: " + ck[0].automaticThought)

                    globalAlert("alert-danger", "This data does not have the correct keys and values.");
                    return false;
                }


                localStorage.setItem("thoughtObj", tempObj);
                thoughtObj = JSON.parse(tempObj);


                buildList();
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



function clearData() {
    localStorage.removeItem("thoughtObj");
    document.getElementById("thoughtTarget").innerHTML = "";
    globalAlert("alert-success", "Your data was removed.");
    return false;
}

function toggle(what) {

    [].forEach.call(document.querySelectorAll("[data-toggle]"), (e) => {
        e.classList.add("hide");
        if (e.dataset.toggle === what) {
            e.classList.remove("hide");
        }
    });



}




if (localStorage.getItem("thoughtObj")) {
    buildList();
}
