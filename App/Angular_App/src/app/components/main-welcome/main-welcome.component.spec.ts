import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWelcomeComponent } from './main-welcome.component';

describe('MainWelcomeComponent', () => {
  let component: MainWelcomeComponent;
  let fixture: ComponentFixture<MainWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
