import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdHouseInfoComponent } from './ad-house-info.component';

describe('AdHouseInfoComponent', () => {
  let component: AdHouseInfoComponent;
  let fixture: ComponentFixture<AdHouseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdHouseInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdHouseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
