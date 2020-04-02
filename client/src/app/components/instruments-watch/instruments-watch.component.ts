import {Component, EventEmitter, Input, Output} from '@angular/core';
import { copyToClipboard } from 'src/app/core/components/interaction';

@Component({
  selector: 'app-instruments-watch',
  templateUrl: './instruments-watch.component.html',
  styleUrls: ['./instruments-watch.component.scss']
})
export class InstrumentsWatchComponent {

  @Output() removeInstrument = new EventEmitter();
  @Input() prices = [];
  @Input() updatedAt = null;

  remove(instrument: string) {
    this.removeInstrument.emit(instrument);
  }

  trackWatchRow(item) {
    return !item ? null : item.instrument;
  }

  copyToClipboard = copyToClipboard;
}
