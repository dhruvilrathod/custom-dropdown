import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChipChangeTrigger, SelectionChip } from '../interfaces/multi-object-selection.interface';

@Component({
  selector: 'app-multi-object-chips',
  templateUrl: './multi-object-chips.component.html',
  styleUrls: ['./multi-object-chips.component.scss']
})
export class MultiObjectSelectionChipComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chipsContainer') chipsContainer!: ElementRef<HTMLUListElement>;
  @ViewChild('chip') chip!: ElementRef<HTMLLIElement>;

  @Input('chipData') chipData: SelectionChip[] = [];

  @Output('focusSearch') focusSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('onChipRemove') onChipRemove: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>();
  @Output('onChipClick') onChipClick: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>();
  @Output('onChipContextMenu') onChipContextMenu: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>();


  private _currentChipActiveIndex: number = -1;
  private _isAnyChipActive: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._registerListeners();
  }

  ngOnDestroy(): void {
    this.resetActiveChip();
    this.focusSearch.emit();  
  }

  public sectionClicked(e: Event) {
    if (this.chipsContainer.nativeElement === e.target) {
      this.resetActiveChip();
      this.focusSearch.emit();
    }
  }

  public activateChip(chip: SelectionChip) {

    for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
      if (this.chipData[i].isActive) {
        this.chipData[i].isActive = false;
      }
      if(this.chipData[i].dataUniqueFieldValue === chip.dataUniqueFieldValue) {
        this._currentChipActiveIndex = i;
      }
    }

    chip.isActive = true;
    this._isAnyChipActive = true;
    this.onChipClick.emit({ data: chip });
  }

  public openContextMenu(e: Event, chip: SelectionChip) {
    console.log('context menucalled ::', chip);
    e.preventDefault();
    this.activateChip(chip);
    this.onChipContextMenu.emit({ data: chip })
  }

  public resetActiveChip(): void {
    for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
      if (this.chipData[i].isActive) {
        this.chipData[i].isActive = false;
      }
    }
    this._currentChipActiveIndex = -1;
    this._isAnyChipActive = false;
  }

  public removeChip(chip: SelectionChip, reset: boolean = true) {
    this.onChipRemove.emit({data: chip});
    reset && this.resetActiveChip();
  }

  private _registerListeners(): void {    

    document.addEventListener("keydown", (e: KeyboardEvent) => {

      if(this.chipData.length > 0 && this._isAnyChipActive && this._currentChipActiveIndex > -1) {
        if(((e.code === "ArrowLeft" && this._currentChipActiveIndex > 0) || (e.code === "ArrowRight" && this._currentChipActiveIndex < this.chipData.length - 1))) {
          for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
            if (this.chipData[i].isActive) {
              this.chipData[i].isActive = false;
              if(e.code === "ArrowLeft") {
                this.chipData[i-1].isActive = true;
                this._currentChipActiveIndex = i - 1;
              } 
              else if(e.code === "ArrowRight"){
                this.chipData[i+1].isActive = true;
                this._currentChipActiveIndex = i + 1;
              }
              break;
            }
          }
        }
        else if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Space") {
          this.onChipClick.emit({data: this.chipData[this._currentChipActiveIndex]});
        }
        else if(e.code === "Backspace" || e.code === "Delete") {
          console.log(this.chipData, this._currentChipActiveIndex);

          this.chipData[this._currentChipActiveIndex].isActive = false;
          this.removeChip(this.chipData[this._currentChipActiveIndex], false);
          
          if(this._currentChipActiveIndex - 1 >= 0) {
            console.log('if');
            
            this._currentChipActiveIndex--;
            this.chipData[this._currentChipActiveIndex].isActive = true;
          }
          else if(this._currentChipActiveIndex + 1 <= this.chipData.length) {
            console.log('esle',this.chipData[this._currentChipActiveIndex], this._currentChipActiveIndex);
            
            this.chipData[this._currentChipActiveIndex].isActive = true;
          }
        }
      }
    });
  }

}
