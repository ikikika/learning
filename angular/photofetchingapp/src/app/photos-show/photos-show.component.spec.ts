import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosShowComponent } from './photos-show.component';

describe('PhotosShowComponent', () => {
  let component: PhotosShowComponent;
  let fixture: ComponentFixture<PhotosShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
