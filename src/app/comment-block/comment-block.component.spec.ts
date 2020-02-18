import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { CommentBlockComponent } from './comment-block.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IComment } from '../interface/IComment';

describe('CommentBlockComponent', () => {
  const apiUrl = environment.apiUrl;
  const commenterEmail = 'commenter@gmail.com';
  let component: CommentBlockComponent;
  let fixture: ComponentFixture<CommentBlockComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentBlockComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);

    component.isLikeButtonLoaded = true;
    component.commentId = 14;
    component.numberOfLikes = 0;
    component.eventId = 6;
  });

  it('should init comment fields', () => {
    const mockComment: IComment = {
      postId: 22,
      id: 14,
      commentDate: '2020-01-01',
      text: 'commentText'
    };

    component.ngOnInit();

    const req = httpMock.expectOne(apiUrl + 'comments/14');
    expect(req.request.method).toEqual('GET');
    expect(component.numberOfLikes).toBe(0);

    req.flush(mockComment);

    expect(component.commentId).toBe(mockComment.id);
    expect(component.text).toBe(mockComment.text);
    expect(component.commentDate).toBe(mockComment.commentDate);
    expect(component).toBeTruthy();
  });

  it('should init commenterName', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(apiUrl + 'comments/14');
    expect(req.request.method).toEqual('GET');
    expect(component.numberOfLikes).toBe(0);

    req.flush({ commenterEmail: commenterEmail });

    const req2 = httpMock.expectOne(apiUrl + 'users/' + commenterEmail);
    expect(req2.request.method).toEqual('GET');
    req2.flush({ firstName: 'Dwayne', lastName: 'Johnson' });

    expect(component.commenterName).toBe('Dwayne Johnson');
  });

  it('should init numberOfLikes', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(apiUrl + 'comments/14');
    expect(req.request.method).toEqual('GET');
    expect(component.numberOfLikes).toBe(0);

    req.flush({ commenterEmail: commenterEmail });

    const req2 = httpMock.expectOne(apiUrl + 'comments/14/likers');
    expect(req2.request.method).toEqual('GET');
    req2.flush([{}, {}]);

    expect(component.numberOfLikes).toBe(2);
  });

  it('should call add-liker and update like related fields', () => {
    component.likeComment();

    const req = httpMock.expectOne(apiUrl + 'comments/14/add-liker');
    expect(req.request.method).toEqual('GET');
    expect(component.isLikeButtonLoaded).toBeFalsy();

    req.flush('success');

    expect(component.numberOfLikes).toBe(1);
    expect(component.isCurrentUserLiked).toBeTruthy();
    expect(component.isLikeButtonLoaded).toBeTruthy();
  });

  it('should call remove-liker and update like related fields', () => {
    component.numberOfLikes = 1;

    component.removeLikeFromComment();

    const req = httpMock.expectOne(apiUrl + 'comments/14/remove-liker');
    expect(req.request.method).toEqual('DELETE');
    expect(component.isLikeButtonLoaded).toBeFalsy();

    req.flush('success');

    expect(component.numberOfLikes).toBe(0);
    expect(component.isCurrentUserLiked).toBeFalsy();
    expect(component.isLikeButtonLoaded).toBeTruthy();
  });
});
