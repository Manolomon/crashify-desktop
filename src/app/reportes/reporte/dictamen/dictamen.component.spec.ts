import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenComponent } from './dictamen.component';

describe('DictamenComponent', () => {
  let component: DictamenComponent;
  let fixture: ComponentFixture<DictamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
