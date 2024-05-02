import { randomInteger } from "./utils.js";

export class Data {
  constructor(data) {
    this.data = data;
  }

  init() {
    let answers = [];
    this.data.forEach((arr) => {
      const randomIndex = randomInteger(0, arr.length - 1);
      answers.push(arr[randomIndex]);
    });
    return answers;
  }
}
