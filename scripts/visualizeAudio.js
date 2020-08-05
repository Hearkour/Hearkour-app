// SoundVisualizer
// Original source: https://github.com/ryan-pfeifer1111/SoundVisualizer

var audio, freqArr, barHeight, source, colorSelect, grd1, grd2;
var vaCanvas, vaContext; // va = visual audio

var WIDTH, HEIGHT; // CSS에서 받은 width, height 값 저장
var rectW, rectH, arcR1, arcR2;
var loadingBall, lbStyle, lbR, lbRch;

var audioCtx;
var analyser, biquadFilter;

var blinkingSpeed = .5; // 값이 커질수록 각 (점)은 빨라지고, 작아진다.
var INTERVAL = 96; // 세로 블록 개수 128;//256;
var SAMPLES = 1024; // 음이 오른쪽에 그려지는 정도 //4096;//1024;//512;//2048;
var r = 0, g = 0, b = 255, x = 0;
var lr = 0, lg = 0, lb = 255;
var vol, currVol = .3;

function initialize() {
    
    vaCanvas = document.getElementById("visualizer"); //drawing the canvas
    vaContext = vaCanvas.getContext("2d");

    console.log("mic enabled");
    if (navigator.mediaDevices) {

        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia ({ audio: true })
        .then(function(stream) {
            
            MIC_ACCESS = true;
            
            audioCtx = new window.AudioContext();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = SAMPLES;

            biquadFilter = audioCtx.createBiquadFilter();
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            //analyser.connect(source.destination);
            analyser.connect(biquadFilter);
            biquadFilter.connect(audioCtx.destination);
            
            // using earphones
            // these are values of OUTPUT
            biquadFilter.frequency.value = 0; //5000;
            biquadFilter.gain.value = 0; //-1000
            
            audio = document.getElementById("audio");
            audio.volume = 0;
            
            freqArr = new Uint8Array(analyser.frequencyBinCount);

            barHeight = HEIGHT;

            loadingBall = 0;
            lbR = 1 / blinkingSpeed;
            lbRch = 1;
            
            window.requestAnimationFrame(draw);
        })
        .catch(function(err) {
            console.log('The following gUM error occured: ' + err);
        });
    }

    else
        console.log('getUserMedia not supported on your browser!');
}

function draw() {
    
    // CSS 파일에서 받은 #visualizer의 속성값(1024px, 350px)을 사용가능하게 변환(1024, 350)
    WIDTH = getComputedStyle(vaCanvas).width.slice(0, -2);
    HEIGHT = getComputedStyle(vaCanvas).height.slice(0, -2);

    vaCanvas.width = WIDTH;
    vaCanvas.height = HEIGHT;

    // ~~ 은 실수의 소수점을 정수 범위까지 버림
    //INTERVAL = ~~ (WIDTH / 8);

    r = 80;
    g = 100;
    b = 240;
    x = 0;

    vaContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    analyser.getByteFrequencyData(freqArr);

    for(var i = 0; i < INTERVAL; i++) {

        barHeight = ((freqArr[i] - 128) * 2) + 2;
        
        if(barHeight <= 0) barHeight = 0;
        
        r += 4; //this is for the color spectrum
        if(r > 180) r = 180;
        g += 1;
        if(g > 80) g = 80;
        b -= 1;
        if(b < 50) b = 50;
        
        vaContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        if (i == loadingBall) lbStyle = "rgb(" + r + "," + g + "," + b + ")";
        
        // 직사각형 줄의 width, height
        rectW = WIDTH / INTERVAL - 1;
        rectH = barHeight / 2;
        // 둥근 모서리 (위/아래 원)의 radius
        // 깜박깜박
        if (rectH < 2) arcR1 = rectW / lbR*(1/blinkingSpeed);
        else arcR1 = rectW / 2;
        arcR2 = rectW / 8;
        
        /* 둥근 모서리 (위쪽 원) 그리기 */
        vaContext.beginPath();
        // arc: 중심x, 중심y, 반지름, 시작각도, 끝각도, 반시계방향
        vaContext.arc(x + arcR1, HEIGHT/2-rectH, arcR1, 0, Math.PI*2, true);
        vaContext.fill();

        /* 직사각형 줄들 그리기 */
        // fillRect: x, y, width, height
        vaContext.fillRect(x, HEIGHT/2-rectH, rectW, rectH); // 위쪽 절반
        vaContext.fillRect(x, HEIGHT/2, arcR2*2, rectH); // 아래쪽 절반
        
        /* 둥근 모서리 (아래쪽 원) 그리기 */
        vaContext.beginPath();
        // arc: 중심x, 중심y, 반지름, 시작각도, 끝각도, 반시계방향
        vaContext.arc(x + arcR2, HEIGHT/2, arcR2, 0, Math.PI*2, true);
        vaContext.fill();
        
        x += WIDTH / INTERVAL;
    }
    
    vaContext.beginPath();
    vaContext.arc(WIDTH/INTERVAL*loadingBall, HEIGHT/2, lbR, 0, Math.PI*2, true);
    vaContext.fillStyle = lbStyle;
    vaContext.fill();

    if (loadingBall > INTERVAL*1.25) loadingBall = 0;
    else loadingBall += .25;

    if (lbR > arcR1*2) lbRch = -1/blinkingSpeed;
    else if (lbR < arcR1) lbRch = 1/blinkingSpeed;
    lbR += lbRch / 16;

    window.requestAnimationFrame(draw);
}