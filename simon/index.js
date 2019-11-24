class Simon {
    constructor() {
        this.notePool = ["C2", "D2", "E2", "F2"];
        this.notes = [];
        this.sequence = [];
        this.turnCount = 0;
        this.playerSequenceIndex = 0;
        this.score = 0;
        this.isGameStarted = false;
        this.playerCanPlay = false;
        this.sequenceIndex = 0;
        this.synth = new Tone.FMSynth().toMaster();
        this.updateTurnDisplay();
        this.updateOverDisplay(false);

        var _this = this;

        document.querySelectorAll(".note").forEach( function (note) {
            note.addEventListener("click", function (event) {
                if (_this.playerCanPlay && _this.isGameStarted) {
                    if (!_this.isNoteCorrect(note.dataset.note)) {
                        _this.endGame();
                        return;
                    }


                    _this.playerSequenceIndex += 1;
                    _this.changeScore(_this.score + 1);

                    if (_this.playerSequenceIndex == _this.sequence.length) {
                        setTimeout(function() {
                            _this.startNewTurn();
                        }, 1000)
                    }

                    _this.playNote(note, note.dataset.note);
                }
            })
        });

        document.querySelectorAll(".note").forEach(function (note, index) {
            _this.notes[index] = {
                noteElt: note,
                noteCode: note.dataset.note,
            };
        });
    }

    startGame() {
        if (!this.isGameStarted) {
            this.resetGame();
            this.isGameStarted = true;
            this.startNewTurn();
        }
    }
    
    addNoteToSequence() {
        var randomNote = this.notePool[Math.floor(Math.random() * Math.floor(this.notes.length))];
        this.sequence.push(randomNote);
    }
    
    isNoteCorrect(note) {
        return this.sequence[this.playerSequenceIndex] === note;
    }

    playNote(noteElt, noteCode) {
        noteElt.classList.add("played");
        this.synth.triggerAttackRelease(noteCode, "6n");
        setTimeout(function() {
            noteElt.classList.remove("played")
        }, 500);
    };
    
    playNoteSequence() {
        var interval;
        this.playerCanPlay = false;
        this.updateTurnDisplay();
        var _this = this;


        interval = setInterval( function() {
            var note = _this.getNoteElt(_this.sequence[_this.sequenceIndex]);
            _this.playNote(note.noteElt, note.noteCode);
            _this.sequenceIndex += 1;

            if (_this.sequenceIndex >= _this.sequence.length) {
                clearInterval(interval);
                setTimeout(function() {
                    _this.playerCanPlay = true;
                    _this.updateTurnDisplay();
                }, 1000)
            }

        }, _this.getSpeed());

        _this.changeSequenceIndex(0);
    };
    
    updateTurnCounter(value) {
        document.querySelector(".turn-count > .value").innerHTML = value;
    }
    
    updateScore(value) {
        document.querySelector(".score > .value").innerHTML = value;
    }
    
    updateTurnDisplay() {
        document.querySelector(".turn").style.display = this.playerCanPlay ? 'block' : 'none';
    }
    
    updateOverDisplay(isOver) {
        document.querySelector(".game-over").style.display = isOver ? 'block' : 'none';
    }
    
    getNoteElt(noteCode) {
        return this.notes[this.notes.findIndex(function(note) {
          return note.noteCode === noteCode;
        })];
    }

    changeSequenceIndex(index) {
        this.sequenceIndex = index;
    }

    changeTurnCount(turnCount) {
        this.turnCount = turnCount;
        this.updateTurnCounter(turnCount);
    }

    changeScore(score) {
        this.score = score;
        this.updateScore(score);
    }

    startNewTurn() {
        this.addNoteToSequence();
        this.playNoteSequence();
        this.changeTurnCount(this.turnCount += 1);
        this.playerSequenceIndex = 0;
    }

    endGame() {
        this.playerCanPlay = false;
        this.isGameStarted = false;
        this.updateOverDisplay(true);
        this.updateTurnDisplay();
    }

    resetGame() {
        this.sequence = [];
        this.playerSequenceIndex = 0;
        this.isGameStarted = false;
        this.playerCanPlay = false;
        this.updateTurnDisplay();
        this.sequenceIndex = 0;
        this.changeTurnCount(0);
        this.changeScore(0);
        this.updateOverDisplay(false);
    }

    getSpeed() {
        var speed = 1000;
        if (this.turnCount <= 8) {
            return speed + (speed * ((8 - this.turnCount) * 0.1));
        } else {
            return speed;
        }
    }
}

var init = function () {
    var simon = new Simon();
    document.querySelector(".start").addEventListener("click", () => {
        simon.startGame();
    });
    document.querySelector(".reset").addEventListener("click", () => {
        simon.resetGame();
    });
};

document.addEventListener("DOMContentLoaded", init);