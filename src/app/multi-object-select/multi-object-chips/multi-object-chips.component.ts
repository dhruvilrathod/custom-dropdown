import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SelectionChip } from '../interfaces/multi-object-selection.interface';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-multi-object-chips',
  templateUrl: './multi-object-chips.component.html',
  styleUrls: ['./multi-object-chips.component.scss']
})
export class MultiObjectSelectionChipComponent implements OnInit, OnChanges {

  @ViewChild('chipsContainer') chipsContainer!: ElementRef<HTMLUListElement>;

  @Input('chipData') chipData: SelectionChip[] = [];
  @Input('selectedChipIds') selectedChipIds: (string | number)[] = [];

  @Output() focusSearch: EventEmitter<any> = new EventEmitter<any>();

  @Output('selectedChipIdsChange') selectedChipIdsChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();
  @Output('onRemove') onRemove: EventEmitter<any> = new EventEmitter();
  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  @Output('onRightClick') onRightClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  public sectionClicked(e: Event) {
    if(this.chipsContainer.nativeElement === e.target) {
      this.focusSearch.emit();
    }
  }
}
