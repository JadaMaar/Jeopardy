import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeopardyEdit } from './jeopardy-edit';

describe('JeopardyEdit', () => {
  let component: JeopardyEdit;
  let fixture: ComponentFixture<JeopardyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeopardyEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(JeopardyEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
