import { Component, Input, } from '@angular/core';
import { en, faker } from "@faker-js/faker"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'harf_esleme';
  randomText = ""

  totalCorrect = 0;
  totalIncorrect = 0


  generateRandomText() {
    for (let i = 0; i < 7; i++) {
      let randomWord = faker.commerce.department()
      this.randomText += randomWord + " "
    }
    return (this.randomText)
  }

  text = this.generateRandomText().trim()
  enteredText = ""
  


  entered(value: string) {
    this.enteredText = value;
    this.countCorrect();
  }

  isCorrect(letter: string, entered: string) {
    if (!entered) {
      return "nothing"
    } else if (letter === entered) {
      return "correct"
    } else {
      return "incorrect"
    }
  }


  countCorrect() {
    this.totalCorrect = 0;
    this.totalIncorrect = 0;
    for (let i = 0; i < this.text.length; i++) {
      if (this.text[i] === this.enteredText[i]) {
        this.totalCorrect++;
      } else {
        this.totalIncorrect++;
      }
    }
  }

  refreshPage() {
    window.location.reload();
  }


  timeToString(time:number) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
  
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
  
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
  
    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);
  
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    console.log(`${formattedMM}:${formattedSS}:${formattedMS}`)
}


seconds = 0; 
tens = 0; 
Interval:any;

secondScreen:string ="00"
tensScreen:string ="00"

start() {
  clearInterval(this.Interval);
  this.Interval = setInterval(() => this.startTimer(), 10)
}




startTimer () {
  this.tens++; 
  
  if(this.tens <= 9){
    this.tensScreen = "0" + this.tens;
  }
  
  if (this.tens > 9){
    this.tensScreen = `${this.tens}`;
    
  } 
  
  if (this.tens > 99) {
    this.seconds++;
    this.secondScreen = "0" + this.seconds;
    this.tens = 0;
    this.tensScreen = "0" + 0;
  }
  
  if (this.seconds > 9){
    this.secondScreen = `${this.seconds}`;
  }

}

stop() {
  clearInterval(this.Interval)
}

stopWatch(event: KeyboardEvent) {
  if (this.enteredText.length === this.text.length) {
    event.preventDefault();
    this.stop()
  }
}

}
