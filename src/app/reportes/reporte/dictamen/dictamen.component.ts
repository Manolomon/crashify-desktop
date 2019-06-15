import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dictamen',
  templateUrl: './dictamen.component.html',
  styleUrls: ['./dictamen.component.scss']
})
export class DictamenComponent implements OnInit {

  private dictamenForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
