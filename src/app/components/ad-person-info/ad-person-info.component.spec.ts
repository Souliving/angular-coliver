import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPersonInfoComponent } from './ad-person-info.component';

describe('AdPersonInfoComponent', () => {
  let component: AdPersonInfoComponent;
  let fixture: ComponentFixture<AdPersonInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdPersonInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdPersonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
