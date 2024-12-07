class GestureIt {
    constructor() {
        this.isVideo = false;
        this.model = null;
        this.modelParams = {
            flipHorizontal: true,  
            maxNumBoxes: 20,        
            iouThreshold: 0.5,      
            scoreThreshold: 0.8,    
        };

        this.video = document.getElementById("videoArea");
        this.targetGestureIconElement = document.getElementById("targetGestureIcon");
        this.feedback = document.getElementById("feedback");
        this.targetGestureElement = document.getElementById("targetGesture");
        this.detectedGestureIconElement = document.getElementById("detectedGestureIcon");

        this.correctSound = new Audio('Assets/correctSound.mp3');
        this.incorrectSound = new Audio('Assets/incorrectSound.mp3');

        this.isPaused = true; 
        this.wait = false; 

        this.gestures = ["open", "closed", "point"];
        this.currentGesture = null;
        this.lastGesture = ""; 

        this.init();
    }

    async init() {
        this.model = await handTrack.load(this.modelParams);
        // updatenote.innerText = "Loaded Model!";

        const status = await handTrack.startVideo(this.video);
        if (status) {
            // updatenote.innerText = "Video started. Now tracking";
            this.isVideo = true;
        } else {
            // updatenote.innerText = "Please enable video";
        }
    }

    async runDetection() {
        if (!this.isVideo || this.isPaused) return;

        const predictions = await this.model.detect(this.video);
        this.doit(predictions);

        this.model.renderPredictions(predictions, canvas, canvas.getContext("2d"), this.video);

        if (this.isVideo) requestAnimationFrame(() => this.runDetection());
    }

    startGame() {
        if (!this.isVideo) return; // Ensure video is ready
        this.isPaused = false;
        this.runDetection();
    }

    pauseGame() {
        this.isPaused = true;
    }

    doit(predictions){}
    newRound(){}
}

class Button {
    constructor (parentId) {
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        document.getElementById(parentId).appendChild(this.button);
    }
}

class StartButton extends Button{
    constructor (parentId, gestureIt) {
        super(parentId);

        this.button.setAttribute("id", "startButton");
        this.button.setAttribute("value", "Start");

        this.button.addEventListener ("click", () => gestureIt.startGame());
    }
}

class PauseButton extends Button {
    constructor (parentId, gestureIt) {
        super(parentId);

        this.button.setAttribute("id", "pauseButton");
        this.button.setAttribute("value", "Pause");

        this.button.addEventListener ("click", () => gestureIt.pauseGame());
    }
}