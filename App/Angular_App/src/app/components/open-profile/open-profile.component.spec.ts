import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenProfileComponent } from './open-profile.component';

describe('OpenProfileComponent', () => {
  let component: OpenProfileComponent;
  let fixture: ComponentFixture<OpenProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
