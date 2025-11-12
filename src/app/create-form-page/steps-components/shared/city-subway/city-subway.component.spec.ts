import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySubwayComponent } from './city-subway.component';

describe('CitySubwayComponent', () => {
  let component: CitySubwayComponent;
  let fixture: ComponentFixture<CitySubwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySubwayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitySubwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
