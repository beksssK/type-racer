(function () {
    let tempText = 'Take a look inside your heart, is there any room for me? I won\'t have to hold my breath \'til you get down on one knee because you only want to hold me when I\'m looking good enough. Did you ever feel me?'
    class TextWriter {
        startTime;
        leftText;
        typingFinished = false;
        writtenWords = '';
        futureSymbolsElement = document.getElementById('text-box__future-symbols');
        writtenWordsElement = document.getElementById('text-box__written-words');
        leftTextElement = document.getElementById('text-box__left');
        timerStatus = document.getElementById('timer__time');
        futureSymbols;
        neededWord;
        errorIndex;
        caretElement;
        writtenSymbols = {
            wrong: {
                element: document.getElementById('text-box__written-symbols--wrong')
            },
            right: {
                element: document.getElementById('text-box__written-symbols--right')
            },
        }
        typingBlock = document.getElementById('typing');
        constructor(text, input) {
            this.text = text.split(' ');
            this.input = input;
            this.input.addEventListener('input', this.onInput.bind(this))
        }
        onInput(e){
            let value = e.target.value;
            let trimmedValue = value.replace(/\s/g, '')
            if (e.data === ' ' && trimmedValue === this.neededWord) {
                this.setWrittenWords(this.neededWord);
                this.resetSymbols();
                this.setNextLeftText();
                e.target.value = '';
                return;
            }
            const checkLength = Math.min(this.neededWord.length, value.length);
            for(let i = 0; i < checkLength; i++) {
                if(value[i] === this.neededWord[i]) {
                    this.errorIndex = undefined;
                    this.setWrittenSymbols('', 'wrong');
                    this.setWrittenSymbols(this.neededWord.slice(0, i + 1), 'right');
                } else {
                    this.errorIndex = i;
                    this.setWrittenSymbols(this.neededWord.slice(this.errorIndex, value.length), 'wrong');
                    break;
                }
            }
            this.input.style.background = this.errorIndex !== undefined ? '#d57878' : '#fff';
            this.setFirstSymbols(this.neededWord.slice(value.length, this.neededWord.length))
            if(this.errorIndex === undefined && this.futureSymbols.length < 1 && !this.leftText.length) {
                this.finish();
            }
            if(!value.length) {
                this.resetSymbols();
            }
        }
        finish() {
            this.typingFinished = true;
            this.typingBlock.style.display = 'none'
            let currentTime = new Date();
            let difference = currentTime - this.startTime;
            let doneMinutes = this.getMinutes(difference);
            let doneSeconds = this.getSeconds(difference);
            this.timerStatus.innerText = `Finished in ${this.concatZero(doneMinutes)}m ${this.concatZero(doneSeconds)}s`;
        }
        resetSymbols() {
            this.setWrittenSymbols('', 'right');
            this.input.style.background = '#fff';
            this.setWrittenSymbols('', 'wrong');
        }
        setNeededWord(word) {
            this.neededWord = word;
            this.futureSymbolsElement.innerText = this.neededWord;
            this.futureSymbolsElement.prepend(this.caretElement);
        }
        setFirstSymbols(symbols) {
            this.futureSymbols = symbols;
            this.futureSymbolsElement.innerText = this.futureSymbols;
            this.futureSymbolsElement.prepend(this.caretElement);
        }
        setWrittenWords(words) {
            this.writtenWords = this.writtenWords + words + ' ';
            this.writtenWordsElement.innerText = this.writtenWords;
        }
        setWrittenSymbols(symbols, symbolType) {
            this.writtenSymbols[symbolType].element.innerText = symbols;
        }
        setNextLeftText() {
            this.setNeededWord(this.leftText.splice(0, 1).join(''));
            this.leftTextElement.innerText = this.leftText.join(' ');
        }
        concatZero = (t) => (t > 9) ? t : '0' + t;
        getMinutes = (timeDifference) => Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        getSeconds = (timeDifference) => Math.floor((timeDifference % (1000 * 60)) / 1000);
        startTimer() {
            let wpmElement = document.getElementById('wpm');
            let progressElement = document.getElementById('current-progress');
            this.startTime = new Date();
            const countdownMinutes = 2;
            const endTime = new Date();
            endTime.setMinutes(endTime.getMinutes() + countdownMinutes);
            let intCounter = 0;
            const timer = setInterval(() => {
                intCounter++;
                let currentTime = new Date();
                let elapsedTimeSeconds = (currentTime.getTime() - this.startTime.getTime())/1000;
                let wpm = Math.round((this.writtenWords.split(' ').length / elapsedTimeSeconds) * 60);
                if(!(intCounter % 3)) {
                    let percentage = this.writtenWords.split(' ').length * 100/this.text.length;
                    wpmElement.innerText = `WMP: ${wpm}`
                    progressElement.style.left = `calc(${percentage}% - 40px)`
                }
                const timeDifference = endTime - currentTime;
                const remainingMinutes = this.getMinutes(timeDifference);
                const remainingSeconds = this.getSeconds(timeDifference);
                if (this.typingFinished) {
                    clearInterval(timer);
                    wpmElement.innerText = `WMP: ${wpm}`
                    return;
                }
                this.timerStatus.innerText = `${this.concatZero(remainingMinutes)}:${this.concatZero(remainingSeconds)}`
                if (timeDifference < 0) {
                    clearInterval(timer);
                    this.timerStatus.innerText = 'Time is up';
                }
            }, 1000);
        }
        init() {
            this.startTimer();
            this.typingBlock.style.display = 'block';
            this.caretElement = document.createElement('span');
            this.caretElement.id = 'caret';
            this.input.focus();
            this.leftText = [...this.text];
            this.setNeededWord(this.leftText.splice(0, 1).join(''));
            this.leftTextElement.innerText = this.leftText.join(' ');
        }
    }
    window.addEventListener('DOMContentLoaded',function () {
        let input = document.getElementById('text_input');
        let startBtn = document.getElementById('start-btn');
        const textWriter = new TextWriter(tempText, input);
        startBtn.addEventListener('click', function () {
            textWriter.init();
            startBtn.disabled = true;
        })
    });
})();