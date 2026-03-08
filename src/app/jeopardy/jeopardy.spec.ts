import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jeopardy } from './jeopardy';

describe('Jeopardy', () => {
  let component: Jeopardy;
  let fixture: ComponentFixture<Jeopardy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jeopardy],
    }).compileComponents();

    fixture = TestBed.createComponent(Jeopardy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
