/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SongAddComponent } from './song-add.component';

describe('SongAddComponent', () => {
  let component: SongAddComponent;
  let fixture: ComponentFixture<SongAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
