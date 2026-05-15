import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllImages } from './all-images';

describe('AllImages', () => {
  let component: AllImages;
  let fixture: ComponentFixture<AllImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllImages],
    }).compileComponents();

    fixture = TestBed.createComponent(AllImages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
