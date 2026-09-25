# Barcode Scanner
Created a minimal barcode scanner using the library here: [https://github.com/Sec-ant/barcode-detector](https://github.com/Sec-ant/barcode-detector). This may be useful as a form of input, and might have some advantages over typing into a text box. 


# AI Prompts Used (with gpt-5.6-luna)

1. i'd like to setup a demo page that makes use of https://github.com/Sec-ant/barcode-detector . the demo should open the webcam and capture the number of a barcod evia the webcam image.

2. let's add a workflow for github pages that allows us to run the build process during deployment.

3. on mobile, the webcam image appears mirrored, and that's a problem to fix

4. remove 90% of the text and leave only the essentials for functionality. then restyle the scanner using design.md

5. the scanner should not animate initially. instead we should only show a start button that enables the camera. then once the camera is started, we can show the full scanner animating

6. we don't need to say "OFF" and "CAMERA OFF". that's repetitive. also once a value is detected. the camera should turn off again.

7. when a value is detected, we can capture the successful camera frame and persist it in the camera area, like a freeze frame. in this way the context of the detection remains 