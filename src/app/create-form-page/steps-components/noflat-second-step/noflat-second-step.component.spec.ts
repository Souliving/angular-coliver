import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoflatSecondThirdStepsComponent } from './noflat-second-step.component';

describe('NoflatSecondThirdStepsComponent', () => {
  let component: NoflatSecondThirdStepsComponent;
  let fixture: ComponentFixture<NoflatSecondThirdStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoflatSecondThirdStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoflatSecondThirdStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
