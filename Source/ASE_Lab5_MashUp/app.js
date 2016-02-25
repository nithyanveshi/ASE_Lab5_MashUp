/**
 * Created by rapar on 2/24/2016.
 */
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var mic_img = document.getElementById("mic_img");
var final_span = document.getElementById("final_span");
var interim_span = document.getElementById("interim_span");
var msg = document.getElementById("msg");
msg.innerHTML = "Click on the microphone icon and begin speaking.";
if (!('webkitSpeechRecognition' in window)) {
    msg.innerHTML = "Web Speech API is not supported by this browser. Please upgrade";
} else {
    var mic = new webkitSpeechRecognition();
    mic.continuous = true;
    mic.interimResults = true;

    mic.onstart = function() {
        recognizing = true;
        msg.innerHTML = "Listening";
        mic_img.src = './resources/mic-animate.gif';
    };

    mic.onerror = function(event) {
        if (event.error == 'no-speech') {
            mic_img.src = './resources/mic.gif';
            msg.innerHTML = "No speech was detected.";
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            mic_img.src = './resources/mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                msg.innerHTML = "Permission to use microphone was blocked.";
            } else {
                msg.innerHTML = "Permission to use microphone was denied.";
            }
            ignore_onend = true;
        }
    };

    mic.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        mic_img.src = './resources/mic.gif';
        if (!final_transcript) {
            msg.innerHTML = "Click on the microphone icon and begin speaking.";
            return;
        }
        msg.innerHTML = "Proceed to translate.";
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }
//        alert("In app.js "+final_span.innerHTML);
    };

    mic.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}
var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}
function startDictation(event){
    if (recognizing) {
        mic.stop();
        return;
    }
    final_transcript = '';
    mic.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    mic_img.src = './resources/mic-slash.gif';

    start_timestamp = event.timeStamp;
}

