import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IComment } from 'src/app/interface/IComment';
import { IPost } from 'src/app/interface/IPost';

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getPostComments(postId: number) {
    const url = 'posts/' + postId + '/comments';
    return this.getMethod<Array<IComment>>(url);
  }

  getPostById(postId: number) {
    const url = 'posts/' + postId;
    return this.getMethod<IPost>(url);
  }

  getPostLikers(postId: number) {
    const url = 'posts/' + postId + '/likers';
    return this.getMethod(url);
  }

  createPost(post: IPost) {
    const url = 'posts/create';
    return this.postMethod(url, post);
  }

  createLikesPost(postId: number) {
    const url = 'posts/' + postId + '/add-liker';
    return this.getMethod(url);
  }

  isLikedPost(postId: number, email: string) {
    const url = 'posts/' + postId + '/likers/' + email;
    return this.getMethod(url);
  }

  removeLikesPost(postId: number) {
    const url = 'posts/' + postId + '/remove-liker';
    return this.deleteMethod(url);
  }

  deletePost(postId: number) {
    const url = 'posts/' + postId + '/delete';
    return this.deleteMethod(url);
  }
}
