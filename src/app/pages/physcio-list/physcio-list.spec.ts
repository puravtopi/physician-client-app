import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhyscioList } from './physcio-list';

describe('PhyscioList', () => {
  let component: PhyscioList;
  let fixture: ComponentFixture<PhyscioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhyscioList],
    }).compileComponents();

    fixture = TestBed.createComponent(PhyscioList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
