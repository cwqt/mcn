import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IPostModel, IPost } from '../../../../../../../../backend/lib/models/Post.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostFormComponent implements OnInit {
  @Output() addPost:EventEmitter<IPostModel> = new EventEmitter();
  @Input() user:any;

  loading:boolean = false;
  success:boolean = false;
  createPostForm:FormGroup;
  emojiPickerVisible:boolean = false;

  CHARACTER_LIMIT = 280;

  constructor(private userService:UserService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.createPostForm = this.fb.group({
      content: ["", [ Validators.required, Validators.minLength(1), Validators.maxLength(140) ]],
    });
  }

  createPost() {
    this.loading = true;
    setTimeout(() => {

      this.userService.createPost(this.createPostForm.value).subscribe(
        res => {
          this.addPost.emit(res as IPostModel);
          this.success = true;
          this.createPostForm.reset();
        },
        err => {
          console.log(err)
          this.success = false;
        } 
      ).add(() => { this.loading = false});   
  

    }, 3000)
  }

  get content() {
    return this.createPostForm.value.content;
  }

  toggleEmojiPicker() {    
    this.emojiPickerVisible = !this.emojiPickerVisible;
    console.log(this.emojiPickerVisible)
  }

  addEmoji(event:any){
  }
}
