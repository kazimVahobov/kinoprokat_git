import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {UserModel, UserService} from 'src/app/core';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './profile-avatar-edit.component.html',
  styleUrls: ['./profile-avatar-edit.component.scss']
})
export class ProfileAvatarEditComponent implements OnInit {

  @ViewChild('input') input: ElementRef;
  image: File;
  imagePreview = '';
  model: UserModel;
  userForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private userService: UserService) {
  }


  ngOnInit() {
    this.model = new UserModel();
    this.userForm = new FormGroup({
      srcImage: new FormControl(null, Validators.required)
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };

    reader.readAsDataURL(file);
  }

  triggerClick() {
    this.input.nativeElement.click();
  }

  onSubmit() {
    this.model._id = this.currentUser._id;
    this.userService.createImage(this.currentUser._id, this.image).subscribe(res => {
      alert('Аватар успешно сохранено');
      this.userService.editUser();
    });
  }

  reset() {
    this.imagePreview = '';
  }
}
