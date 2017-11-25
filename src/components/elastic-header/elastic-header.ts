import { Directive } from '@angular/core';

/*
  Generated class for the ElasticHeader directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[elastic-header]' // Attribute selector
})
export class ElasticHeader {

  constructor() {
    console.log('Hello ElasticHeader Directive');
  }

}
