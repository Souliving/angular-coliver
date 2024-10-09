import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoflatThirdStepComponent } from './noflat-third-step.component';

describe('NoflatThirdStepComponent', () => {
  let component: NoflatThirdStepComponent;
  let fixture: ComponentFixture<NoflatThirdStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoflatThirdStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoflatThirdStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
