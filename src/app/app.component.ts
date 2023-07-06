import { Component, OnInit } from '@angular/core';
import { Post } from './models/post.model';
import { PostService } from './post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  post: Post = {} as Post;
  allPost: Post[] = [];
  currentPost: Post = {} as Post;
  isEdit: boolean = false;
  searchObj!: Post;

  constructor(private _postService: PostService,private _snackBar: MatSnackBar){

  }

  ngOnInit(): void {
    this.getAll();
  }

  submit(): void{
    this._postService.createPost(this.post).subscribe(
      (response)=>{
        this.post = {} as Post;
        this.getAll();
        this.openSnackBar("Post Created.")
      },
      err=> this.openSnackBar("Failed to create a post.",true)
    )
  }

  getAll():void{
    this._postService.getAllPost().subscribe(
      (items) => {
        this.allPost = items
       }
    )
  }

  search(): void{
    if(this.searchObj.id){
      this._postService.getPost(this.searchObj.id).subscribe(
        repsonse => this.currentPost = repsonse
        ,
        err => this.openSnackBar("No Post found.",true)
      )
    }
  }

  update(): void{
    if(this.post.id){
      this._postService.updatePost(this.post.id,this.post).subscribe(
        (item) => {
          this.isEdit = false;
          this.post = {} as Post;
          this.getAll()
          this.openSnackBar("Post Updated")
        },
        err => this.openSnackBar("Failed to update.",true)
      )
    }
  }

  delete(post: Post): void{
    if(post.id){
      this._postService.deletePost(post.id).subscribe(
        (item) => {
          this.openSnackBar('Post Deleted');
          this.getAll()
        },
        err => this.openSnackBar("Failed to delete.",true)
      )
    }
  }


  edit(post: Post): void{
    this.post = post;
    this.isEdit = true;
    this.openSnackBar("Please use a above Form to edit the post")
  }

  openSnackBar(message: string, isError: boolean = false): void{
    this._snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? 'text-red-600' : 'text-green-500'
  });
  }

  displayFn(post: Post): string {
    return post && post.postName ? post.postName : '';
  }

}
