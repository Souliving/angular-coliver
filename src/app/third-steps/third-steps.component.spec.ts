import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdStepsComponent } from './third-steps.component';

describe('ThirdStepsComponent', () => {
  let component: ThirdStepsComponent;
  let fixture: ComponentFixture<ThirdStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
