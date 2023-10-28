import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  title = 'ringoffire';

  constructor() {
    const aCollection = collection(this.firestore, 'games');
    console.log('Collection is:', aCollection);
    
    this.items$ = collectionData(aCollection);
  }
}
