import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCommentsComponent } from './open-comments.component';

describe('OpenCommentsComponent', () => {
  let component: OpenCommentsComponent;
  let fixture: ComponentFixture<OpenCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
