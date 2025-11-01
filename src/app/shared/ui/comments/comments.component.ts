import { CommentsService } from './../../../core/services/comments.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IComment } from '../../../core/interfaces/icomment';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { IUser } from '../../../core/interfaces/iuser';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  private readonly _commentService = inject(CommentsService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _UsersService = inject(UsersService);
  @Input({ required: true }) postId!: string;

  commentForm!: FormGroup;

  selectedCommentId: string = '';
  comments: IComment[] = [];
  ngOnInit(): void {
    this.commentForm = this._FormBuilder.group({
      content: [null],
      post: [this.postId],
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getComments();
    this.loadUserData();
  }
  userData!: IUser;
  loadUserData() {
    this._UsersService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res.user;
      },
      error: (err) => console.log(err),
    });
  }
  getComments() {
    this._commentService.getPostsComments(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.comments = res.comments.reverse();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //
  isLoading = false;
  submitComment() {
    this.isLoading = true;
    this._commentService.createComment(this.commentForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.comments = res.comments.reverse();
        this.commentForm.get('content')?.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  deleteComment(id: string) {
    this._commentService.deleteComment(id).subscribe({
      next: (res) => {
        this.getComments();
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // edit Comment

  editingCommentId: string | null = null;
  editContent: string = '';

  startEdit(comment: any) {
    this.editingCommentId = comment._id;
    this.editContent = comment.content;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editContent = '';
  }

  saveEdit(commentId: string) {
    const updatedComment = { content: this.editContent };

    this._commentService.updateComment(commentId, updatedComment).subscribe({
      next: (res) => {
        this.cancelEdit();
        this.getComments();
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
