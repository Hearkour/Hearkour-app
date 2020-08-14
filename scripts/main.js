var HTML_index = document.getElementById("HTML_index");
var HTML_audiorecord = document.getElementById("HTML_audiorecord");

var mic = document.getElementById("mic");
var micActive = document.getElementById("micActive");
var loadDots = document.getElementById("loadDots");

var i = 0, diir = -1;
var dotCnt = 6;
var startTime;
var timeDelay = 800;

if (HTML_index) {
    
    mic.addEventListener("click", function() {
        window.location.href = 'audiorecord.html';
    });
}

if (HTML_audiorecord) {

    document.body.setAttribute("style", "font-family: NanumSquareRoundR");
    loadDots.setAttribute("style", "color: #9966ff;");
    
    micActive.addEventListener("click", function() {
        window.location.href = 'index.html';
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