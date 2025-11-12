import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingDateComponent } from './moving-date.component';

describe('MovingDateComponent', () => {
  let component: MovingDateComponent;
  let fixture: ComponentFixture<MovingDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovingDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
