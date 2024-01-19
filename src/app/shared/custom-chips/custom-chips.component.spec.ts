import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChipsComponent } from './custom-chips.component';
import { TreeNode } from '../utility/tree/TreeNode';
import { chipData } from 'src/app/multi-object-select/test-data/test-data';
import { generateMockTreeNodes } from '../utility/tree/TreeUtility.spec';

describe('CustomChipsComponent', () => {
    let component: CustomChipsComponent;
    let fixture: ComponentFixture<CustomChipsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomChipsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomChipsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset active chip and emit focus search event', () => {
       
        spyOn(component, 'resetActiveChip');
        spyOn(component.focusSearch, 'emit');

       
        component.ngOnDestroy();

       
        expect(component.resetActiveChip).toHaveBeenCalled();
        expect(component.focusSearch.emit).toHaveBeenCalled();
    });

    it('should call resetActiveChip even if focusSearch emit is not defined', () => {
       
        spyOn(component, 'resetActiveChip');

       
        component.ngOnDestroy();

       
        expect(component.resetActiveChip).toHaveBeenCalled();
    });

    it('should reset active chip and emit focus search event if clicked on chipsContainer', () => {
       
        spyOn(component, 'resetActiveChip');
        spyOn(component.focusSearch, 'emit');
        const event = {
            target: component.chipsContainer.nativeElement,
        } as any;

       
        component.sectionClicked(event);

       
        expect(component.resetActiveChip).toHaveBeenCalled();
        expect(component.focusSearch.emit).toHaveBeenCalled();
    });

    it('should not reset active chip or emit focus search event if clicked outside chipsContainer', () => {
       
        spyOn(component, 'resetActiveChip');
        spyOn(component.focusSearch, 'emit');
        const event = {
            target: document.createElement('div'),
        } as any;

       
        component.sectionClicked(event);

       
        expect(component.resetActiveChip).not.toHaveBeenCalled();
        expect(component.focusSearch.emit).not.toHaveBeenCalled();
    });

    it('should activate the selected chip and emit onChipClick event', () => {
       
        spyOn(component.onChipClick, 'emit');
        const chip = { dataUniqueFieldValue: 'uniqueId1', isCurrentNodeActive: false };

       
        component.activateChip(chip as any);

       
        expect(chip.isCurrentNodeActive).toBe(true);
        expect(component['_isAnyChipActive']).toBe(true);
        expect(component.onChipClick.emit).toHaveBeenCalled();
    });

    it('should deactivate the previously active chip and activate the selected chip', () => {
       
        spyOn(component.onChipClick, 'emit');
        const activeChip = { dataUniqueFieldValue: 'uniqueId1', isCurrentNodeActive: true };
        const chip = { dataUniqueFieldValue: 'uniqueId2', isCurrentNodeActive: false };
        component.chipData = [activeChip as any, chip as any];

       
        component.activateChip(chip as any);

       
        expect(activeChip.isCurrentNodeActive).toBe(false);
        expect(chip.isCurrentNodeActive).toBe(true);
        expect(component['_isAnyChipActive']).toBe(true);
        expect(component.onChipClick.emit).toHaveBeenCalled();
    });

    it('should activate the chip and emit onChipContextMenu event when opening the context menu', () => {
       
        spyOn(component, 'activateChip');
        spyOn(component.onChipContextMenu, 'emit');
        const eventMock = { preventDefault: jasmine.createSpy('preventDefault') };
        const chip = { dataUniqueFieldValue: 'uniqueId1', isCurrentNodeActive: false };

       
        component.openContextMenu(eventMock as any, chip as any);

       
        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(component.activateChip).toHaveBeenCalled();
        expect(component.onChipContextMenu.emit).toHaveBeenCalled();
    });

    it('should emit onChipRemove event and reset the active chip when removeChip is called with reset true', () => {
       
        spyOn(component.onChipRemove, 'emit');
        spyOn(component, 'resetActiveChip');
        const chip = { dataUniqueFieldValue: 'uniqueId1', isCurrentNodeActive: true };

       
        component.removeChip(chip as any);

       
        expect(component.onChipRemove.emit).toHaveBeenCalled();
        expect(component.resetActiveChip).toHaveBeenCalled();
    });

    it('should emit onChipRemove event and not reset the active chip when removeChip is called with reset false', () => {
       
        spyOn(component.onChipRemove, 'emit');
        spyOn(component, 'resetActiveChip');
        const chip = { dataUniqueFieldValue: 'uniqueId1', isCurrentNodeActive: true };

       
        component.removeChip(chip as any, false);

       
        expect(component.onChipRemove.emit).toHaveBeenCalled();
        expect(component.resetActiveChip).not.toHaveBeenCalled();
    });

    it('should handle ArrowLeft key press when _isAnyChipActive is true and _currentChipActiveIndex > 0', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(5)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component['_currentChipActiveIndex'] = 1;
        const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

       
        component['_registerListeners']();
        document.dispatchEvent(event);

       
        expect(component.chipData[0].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(1);
    });

    it('should handle ArrowLeft key press within chipData array bounds', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(5)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component.chipData[2].isCurrentNodeActive = true;
        component['_currentChipActiveIndex'] = 2;
        const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

       
        component['_registerListeners']();
        document.dispatchEvent(event);

       
        expect(component.chipData[2].isCurrentNodeActive).toBe(false);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
    });

    it('should handle ArrowRight key press within chipData array bounds', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(5)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component.chipData[2].isCurrentNodeActive = true;
        component['_currentChipActiveIndex'] = 2;
        const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });

       
        component['_registerListeners']();
        document.dispatchEvent(event);

       
        expect(component.chipData[2].isCurrentNodeActive).toBe(false);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(4);
    });

    it('should emit onChipClick event when Enter, NumpadEnter, or Space key is pressed', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(5)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component['_currentChipActiveIndex'] = 2;
        const eventEnter = new KeyboardEvent('keydown', { code: 'Enter' });
        const eventNumpadEnter = new KeyboardEvent('keydown', { code: 'NumpadEnter' });
        const eventSpace = new KeyboardEvent('keydown', { code: 'Space' });

        spyOn(component.onChipClick, "emit");

       
        component['_registerListeners']();
        document.dispatchEvent(eventEnter);
        document.dispatchEvent(eventNumpadEnter);
        document.dispatchEvent(eventSpace);

       
        expect(component.onChipClick.emit).toHaveBeenCalled();
    });

    it('should remove current chip on Backspace or Delete key press and set active chip to the previous one if available', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(5)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component['_currentChipActiveIndex'] = 2;
        const eventBackspace = new KeyboardEvent('keydown', { code: 'Backspace' });
        const eventDelete = new KeyboardEvent('keydown', { code: 'Delete' });

        spyOn(component, "removeChip");
       
        component['_registerListeners']();
        document.dispatchEvent(eventBackspace);

       
        expect(component.removeChip).toHaveBeenCalledWith(component.chipData[2], false);
        expect(component.chipData[2].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);

       
        document.dispatchEvent(eventDelete);

       
        expect(component.removeChip).toHaveBeenCalledWith(component.chipData[1], false);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[0].isCurrentNodeActive).toBe(true);
    });

    it('should set active chip to the next one if Backspace or Delete key is pressed on the first chip', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(3)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component['_currentChipActiveIndex'] = 0;
        const eventBackspace = new KeyboardEvent('keydown', { code: 'Backspace' });
        const eventDelete = new KeyboardEvent('keydown', { code: 'Delete' });
        spyOn(component, "removeChip");

       
        component['_registerListeners']();
        document.dispatchEvent(eventBackspace);

       
        expect(component.removeChip).toHaveBeenCalledWith(component.chipData[0], false);
        expect(component.chipData[0].isCurrentNodeActive).toBe(true);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);

       
        document.dispatchEvent(eventDelete);

       
        expect(component.removeChip).toHaveBeenCalled();
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[2].isCurrentNodeActive).toBe(false);
    });

    it('should not set active chip if Backspace or Delete key is pressed on the last chip', () => {
       
        const nodes: TreeNode[] = [...generateMockTreeNodes(3)];
        component.chipData = nodes;
        component['_isAnyChipActive'] = true;
        component['_currentChipActiveIndex'] = 2;
        const eventBackspace = new KeyboardEvent('keydown', { code: 'Backspace' });
        const eventDelete = new KeyboardEvent('keydown', { code: 'Delete' });
        spyOn(component, "removeChip");

       
        component['_registerListeners']();
        document.dispatchEvent(eventBackspace);

       
        expect(component.removeChip).toHaveBeenCalledWith(component.chipData[2], false);
        expect(component.chipData[2].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);

       
        document.dispatchEvent(eventDelete);

       
        expect(component.removeChip).toHaveBeenCalledWith(component.chipData[1], false);
        expect(component.chipData[1].isCurrentNodeActive).toBe(false);
        expect(component['_currentChipActiveIndex']).toBe(0);
        expect(component.chipData[0].isCurrentNodeActive).toBe(true);
    });

});