import { IUser } from './../../core/interfaces/iuser';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { PostsService } from '../../core/services/posts.service';
import { IPost } from '../../core/interfaces/ipost';
import { DatePipe } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentsComponent } from '../../shared/ui/comments/comments.component';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe, InfiniteScrollModule, CommentsComponent, PostsComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
  _UsersService = inject(UsersService);
  _PostsService = inject(PostsService);

  userData: IUser = {} as IUser;
  posts: IPost[] = [];

  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  allLoaded: boolean = false;

  ngOnInit(): void {
    this.loadUserData();
    this.loadPosts();
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

  loadPosts() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this._PostsService.getAllPosts(this.page, this.limit).subscribe({
      next: (res) => {
        console.log(res);
        const newPosts = res.posts;
        if (!newPosts || newPosts.length === 0) {
          this.allLoaded = true;
        } else {
          this.posts = [...this.posts, ...newPosts];
          this.page = res.paginationInfo.nextPage || this.page + 1;
          if (this.page > res.paginationInfo.numberOfPages) {
            this.allLoaded = true;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  onScrollDown() {
    this.loadPosts();
  }
}
