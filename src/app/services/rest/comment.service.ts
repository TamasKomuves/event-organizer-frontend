import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { HttpClient } from '@angular/common/http';
import { IComment } from 'src/app/interface/IComment';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseRestService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getCommentById(commentId: number) {
    const url = 'comments/' + commentId;
    return this.getMethod<IComment>(url);
  }

  getCommentLikes(commentId: number) {
    const url = 'comments/' + commentId + '/likers';
    return this.getMethod(url);
  }

  createComment(comment: IComment) {
    const url = 'comments/create';
    return this.postMethod(url, comment);
  }

  addLiker(commentId: number) {
    const url = 'comments/' + commentId + '/add-liker';
    return this.getMethod(url);
  }

  isLikedComment(commentId: number, email: string) {
    const url = 'comments/' + commentId + '/likers/' + email;
    return this.getMethod(url);
  }

  removeLikesComment(commentId: number) {
    const url = 'comments/' + commentId + '/remove-liker';
    return this.deleteMethod(url);
  }

  deleteComment(commentId: number) {
    const url = 'comments/' + commentId + '/delete';
    return this.deleteMethod(url);
  }
}
