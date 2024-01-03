import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TreeNode } from '../utility/tree/TreeNode';
import { DropdownTree } from '../utility/tree/DropdownTree';

@Component({
	selector: 'app-custom-chips',
	templateUrl: './custom-chips.component.html',
	styleUrls: ['./custom-chips.component.scss']
})
export class CustomChipsComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('chipsContainer') chipsContainer!: ElementRef<HTMLUListElement>;
	@ViewChild('chip') chip!: ElementRef<HTMLLIElement>;

	@Input('chipData') chipData: TreeNode[] = [];

	@Output('focusSearch') focusSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('onChipRemove') onChipRemove: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
	@Output('onChipClick') onChipClick: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
	@Output('onChipContextMenu') onChipContextMenu: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();


	private _currentChipActiveIndex: number = -1;
	private _isAnyChipActive: boolean = false;


	constructor() { }

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

	public activateChip(chip: TreeNode) {

		for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
			if (this.chipData[i].isCurrentNodeActive) {
				this.chipData[i].isCurrentNodeActive = false;
			}
			if (this.chipData[i].dataUniqueFieldValue === chip.dataUniqueFieldValue) {
				this._currentChipActiveIndex = i;
			}
		}

		chip.isCurrentNodeActive = true;
		this._isAnyChipActive = true;
		this.onChipClick.emit(chip);
	}

	public openContextMenu(e: Event, chip: TreeNode) {
		e.preventDefault();
		this.activateChip(chip);
		this.onChipContextMenu.emit(chip);
	}

	public resetActiveChip(): void {
		for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
			if (this.chipData[i].isCurrentNodeActive) {
				this.chipData[i].isCurrentNodeActive = false;
			}
		}
		this._currentChipActiveIndex = -1;
		this._isAnyChipActive = false;
	}

	public removeChip(chip: TreeNode, reset: boolean = true) {
		this.onChipRemove.emit(chip);
		reset && this.resetActiveChip();
	}

	private _registerListeners(): void {

		document.addEventListener("keydown", (e: KeyboardEvent) => {

			if (this.chipData.length > 0 && this._isAnyChipActive && this._currentChipActiveIndex > -1) {
				if (((e.code === "ArrowLeft" && this._currentChipActiveIndex > 0) || (e.code === "ArrowRight" && this._currentChipActiveIndex < this.chipData.length - 1))) {
					for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
						if (this.chipData[i].isCurrentNodeActive) {
							this.chipData[i].isCurrentNodeActive = false;
							if (e.code === "ArrowLeft") {
								this.chipData[i - 1].isCurrentNodeActive = true;
								this._currentChipActiveIndex = i - 1;
							}
							else if (e.code === "ArrowRight") {
								this.chipData[i + 1].isCurrentNodeActive = true;
								this._currentChipActiveIndex = i + 1;
							}
							break;
						}
					}
				}
				else if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Space") {
					this.onChipClick.emit(this.chipData[this._currentChipActiveIndex]);
				}
				else if (e.code === "Backspace" || e.code === "Delete") {
					console.log(this.chipData, this._currentChipActiveIndex);

					this.chipData[this._currentChipActiveIndex].isCurrentNodeActive = false;
					this.removeChip(this.chipData[this._currentChipActiveIndex], false);

					if (this._currentChipActiveIndex - 1 >= 0) {
						console.log('if');

						this._currentChipActiveIndex--;
						this.chipData[this._currentChipActiveIndex].isCurrentNodeActive = true;
					}
					else if (this.chipData[this._currentChipActiveIndex] && this._currentChipActiveIndex + 1 <= this.chipData.length) {
						console.log('esle', this.chipData[this._currentChipActiveIndex], this._currentChipActiveIndex);

						this.chipData[this._currentChipActiveIndex].isCurrentNodeActive = true;
					}
				}
			}
		});
	}

}
