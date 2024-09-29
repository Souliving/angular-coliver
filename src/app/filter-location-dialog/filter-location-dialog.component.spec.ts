import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLocationDialogComponent } from './filter-location-dialog.component';

describe('FilterLocationDialogComponent', () => {
  let component: FilterLocationDialogComponent;
  let fixture: ComponentFixture<FilterLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterLocationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
