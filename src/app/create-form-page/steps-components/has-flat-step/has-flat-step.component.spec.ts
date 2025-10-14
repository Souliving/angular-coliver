import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasFlatStepComponent } from './has-flat-step.component';

describe('HasFlatStepComponent', () => {
  let component: HasFlatStepComponent;
  let fixture: ComponentFixture<HasFlatStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HasFlatStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HasFlatStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
