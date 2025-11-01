import { UsersService } from './../../core/services/users.service';
import { PostsService } from './../../core/services/posts.service';
import { Component, inject, OnInit } from '@angular/core';
import { IPost } from '../../core/interfaces/ipost';
import { DatePipe } from '@angular/common';
import { CommentsComponent } from '../../shared/ui/comments/comments.component';
import { PostsComponent } from '../posts/posts.component';
import { IUser } from '../../core/interfaces/iuser';

@Component({
  selector: 'app-myposts',
  standalone: true,
  imports: [DatePipe, CommentsComponent, PostsComponent],
  templateUrl: './myposts.component.html',
  styleUrl: './myposts.component.scss',
})
export class MypostsComponent implements OnInit {
  _PostsService = inject(PostsService);
  posts: IPost[] = [];

  _UsersService = inject(UsersService);
  userData!: IUser;
  selectedPostId: string = '';

  ngOnInit(): void {
    this.loadUserData();
    this.showMyPosts();
  }
  loadUserData() {
    this._UsersService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res.user;
      },
      error: (err) => console.log(err),
    });
  }

  showMyPosts() {
    this._PostsService.getMyPosts().subscribe({
      next: (res) => {
        this.posts = res.posts;
        console.log(res);
      },
      error: (err) => {
        console.error;
      },
    });
  }

  deletePost(id: string) {
    this._PostsService.deletePost(id).subscribe({
      next: (res) => {
        console.log(res);
        this.showMyPosts();
      },
      error: (err) => {},
    });
  }
}
