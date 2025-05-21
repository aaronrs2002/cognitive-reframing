



let thoughtObj = []
if (localStorage.getItem("thoughtObj")) {
    thoughtObj = JSON.parse(localStorage.getItem("thoughtObj"));
}



function buildList() {

    let thoughtStr = "";
    for (let i = 0; i < thoughtObj.length; i++) {
        thoughtStr = thoughtStr + "<li class='list-group-item'><label>Thought: " + thoughtObj[i].automaticThought
            + "</label><hr/><label><u>Cognitive Distortion</u></label><p>" + thoughtObj[i].cognitiveDistortion + "</p><hr/><label><u>Rational Thought</u></label><p>" +
            thoughtObj[i].rationalThought + "</p><button class='form-control btn btn-danger' onClick='deleteThought(" + i + ")'>Delete</button></li>";
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



if (localStorage.getItem("thoughtObj")) {
    buildList();
}
