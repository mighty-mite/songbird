import { Game } from "./Game.js";
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
} from "./elements.js";
import data from "./birds.js";

start.addEventListener("click", () => {
  startPage.classList.add("hidden");
  game.classList.remove("hidden");
});

data.forEach((block) => {
  block.sort(() => Math.random() - 0.5);
});

new Game(data).init();
