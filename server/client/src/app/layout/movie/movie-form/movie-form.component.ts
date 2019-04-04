import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieModel, MovieService } from 'src/app/core';

@Component({
  selector: 'app-cinema-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {

  step = 0;
  id: string;
  mainLabel = 'Новый фильм';
  model: MovieModel;
  form: FormGroup;

  @ViewChild('filePDF') input: ElementRef;
  file: File;
  filePreview = '';

  constructor(private service: MovieService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.model = new MovieModel();
    this.createForm();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(movie => {
          this.model = movie;
          this.model.premiereDate = new Date(this.model.premiereDate);
          this.mainLabel = 'Редактирование данных фильма';
          this.form.controls['name'].setValue(this.model.name);
          this.form.controls['originalName'].setValue(this.model.originalName);
          this.form.controls['country'].setValue(this.model.country);
          this.form.controls['yearMovie'].setValue(this.model.yearMovie);
          this.form.controls['studio'].setValue(this.model.studio);
          this.form.controls['director'].setValue(this.model.director);
          this.form.controls['genre'].setValue(this.model.genre);
          this.form.controls['language'].setValue(this.model.language);
          this.form.controls['premiereDate'].setValue(this.model.premiereDate);
          this.form.controls['recomAge'].setValue(this.model.recomAge);
          this.form.controls['formatVideo'].setValue(this.model.formatVideo);
          this.form.controls['formatAudio'].setValue(this.model.formatAudio);
          this.form.controls['regNum'].setValue(this.model.regNum);
          this.form.controls['comment'].setValue(this.model.comment);
          this.form.controls['actor'].setValue(this.model.actor);
          this.form.controls['fileSrc'].setValue(null);
        });
      }
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.file = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.filePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  triggerClick() {
    this.input.nativeElement.click();
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      originalName: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      yearMovie: new FormControl(new Date().getFullYear(), Validators.required),
      studio: new FormControl(null, Validators.required),
      director: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      language: new FormControl(null, Validators.required),
      premiereDate: new FormControl(null, Validators.required),
      recomAge: new FormControl(null, Validators.required),
      formatVideo: new FormControl(null),
      formatAudio: new FormControl(null),
      regNum: new FormControl(null, Validators.required),
      comment: new FormControl(null),
      actor: new FormControl(null),
      fileSrc: new FormControl(null)
    });
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/movie']);
    }
  }

  backToForm() {
    this.mainLabel = 'Редактирование данных фильма';
    this.step = 0;
  }

  onSubmit() {
    this.model = this.form.value;
    this.model._id = this.id;
    this.mainLabel = 'Подтверждение перед сохранением';
    this.step = 1;
    this.model.file = this.file;
  }

  save() {
    this.service.createMovie(this.model).subscribe(res => {
      alert('Все данные успешно сохранены!');
      this.router.navigate(['/movie']);
    },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        console.log(error.error.message)
      });
  }
}
