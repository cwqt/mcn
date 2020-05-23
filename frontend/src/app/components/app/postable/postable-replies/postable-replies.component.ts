import { Component, OnInit } from '@angular/core';
import { PostableService } from 'src/app/services/postable.service';

@Component({
  selector: 'app-postable-replies',
  templateUrl: './postable-replies.component.html',
  styleUrls: ['./postable-replies.component.scss']
})
export class PostableRepliesComponent implements OnInit {

  loading:boolean = false;
  error:string = "";
  replies:any[] = [];

  constructor(private postableService:PostableService) { }

  ngOnInit(): void {
  }

  getReplies() {
    // this.postableService.getReplies
  }

}
