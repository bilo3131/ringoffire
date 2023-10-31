import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async newGame() {
    let game = new Game();
    await addDoc(collection(this.firestore, 'games'), game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}
