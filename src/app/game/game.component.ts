import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game: Game;
  firestore: Firestore = inject(Firestore);
  unsubGame;
  gameId: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log(this.gameId);
      this.unsubGame = onSnapshot(this.getSingleGameRef('games', this.gameId), (list: any) => {
        this.game.currentPlayer = list.data().currentPlayer;
        this.game.playedCards = list.data().playedCards;
        this.game.stack = list.data().stack;
        this.game.players = list.data().players;
        this.game.currentCard = list.data().currentCard;
        this.game.pickCardAnimation = list.data().pickCardAnimation;
        console.log(list.data());
      });
    });
  }

  ngOnDestroy() {
    this.unsubGame();
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  async saveGame() {
    await updateDoc(this.getSingleGameRef('games', this.gameId), this.game.toJson());
  }
}