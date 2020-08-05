// SoundVisualizer
// Original source: https://github.com/ryan-pfeifer1111/SoundVisualizer

var HTML_index = document.getElementById("HTML_index");
var HTML_audiorecord = document.getElementById("HTML_audiorecord");

var mic = document.getElementById("mic");
var micActive = document.getElementById("micActive");
var loadDots = document.getElementById("loadDots");

var i = 0, diir = -1;
var dotCnt = 6;
var startTime;
var timeDelay = 800;
/*
var BGcolor;
var BGr = 32, BGg = 25, BGb = 60;
var colorRdir = colorGdir = -10;

var changeBGcolor = function() {
    let origBGr = BGr, origBGg = BGg;
    BGr += colorRdir;
    BGg += colorGdir;
    if (BGr < 10 || BGr > origBGr) colorRdir *= -1;
    if (BGg < 0 || BGb > origBGg) colorGdir *= -1;

    BGcolor = "color: rgb(" + BGr + "," + BGg + "," + BGb + ")";
    
    let forebody = document.getElementsByClassName('body:before');
    for(let i=0; i<forebody.length; i++) {
        forebody[i].setAttribute("style", 'linear-gradient(#55507e, ' + 'rgb(80, 64, 143)' + ', #0c0e14) no-repeat center center');
    }

    //document.body.before.setAttribute("style", "color: " + BGcolor + ";");
    
    requestAnimationFrame(changeBGcolor);
}
changeBGcolor();
*/
if (HTML_index) {
    
    mic.addEventListener("click", function() {
        mic.onclick = window.location.href = 'audiorecord.html';
    });
}

if (HTML_audiorecord) {

    document.body.setAttribute("style", "font-family: NanumSquareRoundR");
    loadDots.setAttribute("style", "color: #9966ff;");
    
    micActive.addEventListener("click", function() {
        micActive.onclick = window.location.href = 'index.html';
    });
    micActive.addEventListener("mouseover", function() {
        loadDots.setAttribute("style", "color: #6666ff;");
    });
    micActive.addEventListener("mouseout", function() {
        loadDots.setAttribute("style", "color: #9966ff;");
    });

    startTime = performance.now();

    var dotsfunc = function() {
        if (i >= dotCnt-1 || i < 0) diir *= -1;
        
        if (performance.now() - startTime > timeDelay) {
            if (diir > 0) loadDots.innerHTML += " .";
            else if (loadDots.innerHTML.slice(-2) == " .") loadDots.innerHTML = loadDots.innerHTML.slice(0, -2);
            startTime = performance.now();
            i += diir;
        }
        requestAnimationFrame(dotsfunc);
    }
    dotsfunc();
}