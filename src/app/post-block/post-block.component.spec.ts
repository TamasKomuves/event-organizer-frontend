import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBlockComponent } from './post-block.component';
import { CommentBlockComponent } from '../comment-block/comment-block.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

describe('PostBlockComponent', () => {
  const apiUrl = environment.apiUrl;
  const showCommentsConst = 'post.show_comments';
  const hideCommentsConst = 'post.hide_comments';
  const postId = 17;
  const posterEmail = 'poster@gmail.com';
  let component: PostBlockComponent;
  let fixture: ComponentFixture<PostBlockComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostBlockComponent, CommentBlockComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.get(HttpTestingController);

    component.postId = postId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle comment visibility', () => {
    component.isShowComments = true;
    component.showCommentsText = hideCommentsConst;

    component.toggleCommentVisibility();

    expect(component.isShowComments).toBeFalsy();
    expect(component.showCommentsText).toBe(showCommentsConst);
  });

  it('should add a like to the post', () => {
    component.isLikeButtonLoaded = true;
    component.numberOfLikes = 3;

    component.likePost();

    expect(component.isLikeButtonLoaded).toBeFalsy();
    const req = httpMock.expectOne(apiUrl + 'posts/' + postId + '/add-liker');
    expect(req.request.method).toEqual('GET');
    req.flush({});
    expect(component.isLikeButtonLoaded).toBeTruthy();
    expect(component.numberOfLikes).toBe(4);
    expect(component.isCurrentUserLiked).toBeTruthy();
  });

  it('should remove a like from the post', () => {
    component.isLikeButtonLoaded = true;
    component.numberOfLikes = 3;

    component.removeLikeFromPost();

    expect(component.isLikeButtonLoaded).toBeFalsy();
    const req = httpMock.expectOne(apiUrl + 'posts/' + postId + '/remove-liker');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
    expect(component.isLikeButtonLoaded).toBeTruthy();
    expect(component.numberOfLikes).toBe(2);
    expect(component.isCurrentUserLiked).toBeFalsy();
  });

  it('should call the endpoint of post deletion', () => {
    component.deletePost();
    const req = httpMock.expectOne(apiUrl + 'posts/' + postId + '/delete');
    expect(req.request.method).toBe('DELETE');
  });

  it('should create and save a comment', () => {
    component.commentText = 'commentText';

    component.sendComment();

    const req = httpMock.expectOne(apiUrl + 'comments/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.postId).toBe(component.postId);
    expect(req.request.body.text).toBe(component.commentText);
    req.flush({});
    expect(component.commentText).toBe('');
  });

  it('should set posterName on init', () => {
    component.commentText = 'commentText';

    component.ngOnInit();

    const req = httpMock.expectOne(apiUrl + 'posts/' + postId);
    expect(req.request.method).toBe('GET');
    req.flush({ text: 'postText', date: '2020-01-04', posterEmail: posterEmail });
    expect(component.text).toBe('postText');
    expect(component.date).toBe('2020-01-04');

    const req2 = httpMock.expectOne(apiUrl + 'users/' + posterEmail);
    expect(req.request.method).toBe('GET');
    req2.flush({ firstName: 'Firstname', lastName: 'Lastname' });
    expect(component.posterName).toBe('Firstname Lastname');
  });
});
