import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'validation-summary',
    templateUrl: './validation-summary.component.html',
    styleUrls: ['./validation-summary.component.scss']
})
export class ValidationSummaryComponent implements OnInit {

    @Input() messages: string[];
    constructor() { }

    ngOnInit() {
    }

}
