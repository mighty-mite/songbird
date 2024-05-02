import {
  game,
  score,
  nav,
  questionBirdImg,
  questionBirdName,
  questionPlayBtn,
  audioRange,
  audioTimeStart,
  audioTimeFinish,
  answerBirdsList,
  dots,
  answerBirdsNames,
  instructions,
  infoImg,
  infoName,
  infoNameLatin,
  infoPlayBtn,
  infoAudioRange,
  description,
  nextBtn,
  start,
  startPage,
  info,
  answers,
  results,
  resultScore,
  nextGame,
  volume,
} from "./elements.js";
import { Data } from "./Data.js";

export class Game {
  constructor(data, score = 0) {
    this.data = data;
    this.score = score;
    this.maxScore = 5;
    this.clicks = 0;
    this.stage = 0;
    this.questionAudio = new Audio();
    this.answerAudio = new Audio();
    this.wrongAnswerAudio = new Audio();
    this.rightAnswerAudio = new Audio();

    this.isRightAnswer = false;
    this.answers = new Data(this.data).init();

    this.isQuestionPlaying = false;
    this.isAnswerPlaying = false;

    this.isRightSoundPlaying = false;
    this.isWrongSoundPlaying = false;
  }

  handleAnswerSounds() {
    if (!this.isWrongSoundPlaying) {
      this.isWrongSoundPlaying = true;
      this.wrongAnswerAudio.play();
    } else {
      this.isWrongSoundPlaying = false;
      this.wrongAnswerAudio.pause();
      this.wrongAnswerAudio.currentTime = 0;
    }

    if (!this.isRightSoundPlaying) {
      this.isRightSoundPlaying = true;
      this.rightAnswerAudio.play();
    } else {
      this.isRightSoundPlaying = false;
      this.rightAnswerAudio.pause();
      this.rightAnswerAudio.currentTime = 0;
    }
  }

  init() {
    nextBtn.setAttribute("disabled", "true");
    nextBtn.classList.add("inactive");

    this.renderQuestions();

    this.questionAudio.src = `${this.answers[this.stage].audio}`;

    questionPlayBtn.addEventListener(
      "click",
      this.handleAudioQuestion.bind(this)
    );

    infoPlayBtn.addEventListener("click", this.handleChosenAudio.bind(this));

    this.wrongAnswerAudio.src = "./assets/wrong.mp3";
    this.rightAnswerAudio.src = "./assets/right.mp3";

    this.questionAudio.addEventListener(
      "timeupdate",
      this.handleProgressQuestion
    );
    this.answerAudio.addEventListener("timeupdate", this.handleProgressAnswer);

    Array.from(answerBirdsList.children).forEach((answer) => {
      answer.addEventListener("click", this.showBirdInfo.bind(this));
    });

    nextBtn.addEventListener("click", this.loadNextRound.bind(this));
    document.body.addEventListener("click", () => {
      if (this.stage > 5) {
        game.classList.add("hidden");
        results.classList.remove("hidden");
        resultScore.innerHTML = this.score;
        return;
      }
    });

    volume.addEventListener("input", this.handleVolume.bind(this));

    nextGame.addEventListener("click", this.initNewGame.bind(this));

    this.rightAnswerAudio.addEventListener(
      "ended",
      this.handleRightSoundEnding.bind(this)
    );
    this.wrongAnswerAudio.addEventListener(
      "ended",
      this.handleWrongSoundEnding.bind(this)
    );
  }

  handleRightSoundEnding() {
    this.isRightSoundPlaying = false;
  }

  handleWrongSoundEnding() {
    this.isWrongSoundPlaying = false;
  }

  handleProgressQuestion() {
    const percent = (this.currentTime / this.duration) * 100;
    audioRange.value = percent;
  }

  handleProgressAnswer() {
    const percent = (this.currentTime / this.duration) * 100;
    infoAudioRange.value = percent;
  }

  showBirdInfo(e) {
    this.toggleInstructions();

    infoPlayBtn.src = "./assets/play.svg";

    if (this.isAnswerPlaying) {
      this.answerAudio.pause();
      this.answerAudio.currentTime = 0;
      this.isAnswerPlaying = false;
    }

    //  show info
    let chosenBird = this.data[this.stage][e.currentTarget.dataset.order];
    infoName.innerHTML = chosenBird.name;
    infoNameLatin.innerHTML = chosenBird.species;
    infoImg.src = chosenBird.image;
    infoAudioRange.src = chosenBird.audio;
    description.innerHTML = chosenBird.description;

    infoPlayBtn.dataset.music = e.currentTarget.dataset.order;

    //  check if user chose the right answer

    if (
      e.currentTarget.firstChild.classList.contains("right") ||
      e.currentTarget.firstChild.classList.contains("error")
    ) {
      return;
    }

    if (this.answers[this.stage].id == e.currentTarget.id) {
      if (!e.currentTarget.firstChild.classList.contains("right")) {
        questionBirdName.innerHTML = e.currentTarget.lastChild.innerHTML;
        this.isRightAnswer = true;
        e.currentTarget.firstChild.classList.add("right");
        this.questionAudio.pause();
        this.questionAudio.currentTime = 0;
        questionPlayBtn.src = "./assets/play.svg";

        this.score += this.maxScore;
        score.innerHTML = this.score;

        this.isRightSoundPlaying = true;
        this.rightAnswerAudio.currentTime = 0;
        this.rightAnswerAudio.play();
      } else {
        return;
      }
    } else {
      e.currentTarget.firstChild.classList.add("error");

      this.isWrongSoundPlaying = true;
      this.wrongAnswerAudio.currentTime = 0;
      this.wrongAnswerAudio.play();

      if (this.maxScore === 0) {
        this.score += this.maxScore;
        score.innerHTML = this.score;
        return;
      }
      this.maxScore--;
    }

    this.activateNextBtn();
  }

  toggleInstructions() {
    if (info.classList.contains("hidden")) {
      instructions.classList.add("hidden");
      info.classList.remove("hidden");
    } else {
      info.classList.remove("hidden");
      instructions.classList.add("hidden");
    }
  }

  activateNextBtn() {
    if (this.isRightAnswer) {
      nextBtn.removeAttribute("disabled");
      nextBtn.classList.remove("inactive");
    }
  }

  handleChosenAudio(e) {
    this.answerAudio.src =
      this.data[this.stage][e.currentTarget.dataset.music].audio;

    if (!this.isAnswerPlaying) {
      this.isAnswerPlaying = true;
      this.answerAudio.play();
      this.toggleAnswerPlayButton();
    } else {
      this.isAnswerPlaying = false;
      this.answerAudio.pause();
      this.toggleAnswerPlayButton();
    }
  }

  loadNextRound() {
    infoPlayBtn.src = "./assets/play.svg";
    questionPlayBtn.src = "./assets/play.svg";

    if (this.isAnswerPlaying) {
      this.answerAudio.pause();
      this.answerAudio.currentTime = 0;
      this.isAnswerPlaying = false;
    }

    questionBirdName.innerHTML = "*****";
    this.stage++;
    this.clicks = 0;
    this.maxScore = 5;
    this.isRightAnswer = false;

    instructions.classList.remove("hidden");
    info.classList.add("hidden");

    answers.forEach((bird) => {
      bird.firstChild.classList.remove("error");
      bird.firstChild.classList.remove("right");
    });

    // next round

    nextBtn.setAttribute("disabled", "true");
    nextBtn.classList.add("inactive");

    this.renderQuestions();

    this.questionAudio.src = `${this.answers[this.stage].audio}`;

    this.handleNav();
  }

  renderQuestions() {
    answerBirdsNames.forEach((bird, i) => {
      bird.innerHTML = `${this.data[this.stage][i].name}`;
      bird.parentElement.id = `${this.data[this.stage][i].id}`;
      bird.parentElement.dataset.order = i;
    });
  }

  initNewGame() {
    this.score = 0;
    this.stage = 0;
    this.isRightAnswer = false;
    score.innerHTML = 0;

    this.data.forEach((block) => {
      block.sort(() => Math.random() - 0.5);
    });

    this.answers = new Data(this.data).init();

    this.questionAudio.src = `${this.answers[this.stage].audio}`;

    Array.from(document.querySelectorAll(".nav-item")).forEach((navItem, i) => {
      if (i === 0) {
        navItem.classList.add("current");
      } else {
        navItem.classList.remove("current");
      }
    });
    game.classList.remove("hidden");
    results.classList.add("hidden");
    resultScore.innerHTML = this.score;
    this.renderQuestions();
  }

  handleNav() {
    let navCurrentQuestion = document.querySelector(
      `.nav :nth-child(${this.stage + 1})`
    );
    navCurrentQuestion.classList.add("current");
    let navPreviousQuestion = document.querySelector(
      `.nav :nth-child(${this.stage})`
    );
    if (navPreviousQuestion) navPreviousQuestion.classList.remove("current");
  }

  handleVolume(e) {
    this.questionAudio.volume = e.currentTarget.value / 100;
    this.answerAudio.volume = e.currentTarget.value / 100;
  }

  handleAudioQuestion() {
    if (!this.isQuestionPlaying) {
      this.isQuestionPlaying = true;
      this.questionAudio.play();
      this.toggleQuestionPlayButton();
    } else {
      this.isQuestionPlaying = false;
      this.questionAudio.pause();
      this.toggleQuestionPlayButton();
    }
  }

  toggleQuestionPlayButton() {
    if (!this.isQuestionPlaying) {
      questionPlayBtn.src = "./assets/play.svg";
    } else {
      questionPlayBtn.src = "./assets/pause.svg";
    }
  }

  toggleAnswerPlayButton() {
    if (!this.isAnswerPlaying) {
      infoPlayBtn.src = "./assets/play.svg";
    } else {
      infoPlayBtn.src = "./assets/pause.svg";
    }
  }
}
