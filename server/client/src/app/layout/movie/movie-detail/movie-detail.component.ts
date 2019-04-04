import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieModel, MovieService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  @ViewChild('grpuView') grpuView: ModalDirective;
  id: string;
  model: MovieModel;
  pdfSrc: string;
  constructor(private service: MovieService,
    private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.model = new MovieModel();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(data => {
          this.model = data;
          this.pdfSrc = `${environment.apiUrl}/${this.model.fileSrc}`;
        }
        );
      }
    });
  }

  grpuViewModel(){
    this.grpuView.show();
  }
}
