import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { PostsService } from './../../core/services/posts.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent {
  fileName: string = '';
  savedFile!: File;
  content!: string;
  @Input() postId = '';
  @Output() postSaved = new EventEmitter<void>();

  _PostsService = inject(PostsService);

  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.savedFile = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('body', this.content);
    if (this.savedFile) {
      formData.append('image', this.savedFile);
    }

    const request$ = this.postId
      ? this._PostsService.updatePost(this.postId, formData)
      : this._PostsService.createPost(formData);

    request$.subscribe({
      next: (res) => {
        console.log('Post saved:', res);
        this.closeBtn.nativeElement.click(); // auto-close modal
        this.postSaved.emit(); // notify parent (MypostsComponent)
        this.resetForm();
      },
      error: (err) => console.log(err),
    });
  }

  resetForm() {
    this.fileName = '';
    this.content = '';
    this.savedFile = undefined as any;
    this.postId = '';
  }
}
