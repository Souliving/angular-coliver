import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondThirdStepsComponent } from './second-step.component';

describe('SecondThirdStepsComponent', () => {
  let component: SecondThirdStepsComponent;
  let fixture: ComponentFixture<SecondThirdStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondThirdStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondThirdStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
