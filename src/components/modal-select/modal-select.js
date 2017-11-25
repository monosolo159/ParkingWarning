import {Directive, Optional, Input, ElementRef} from 'angular2/core';
import {Page, Modal, NavController, ViewController, NavParams} from 'ionic/ionic';


@Page({
  templateUrl:  'build/components/modal-select/modal-template.html'
})
class ModalSelectModal {
  constructor(ViewController : ViewController, params: NavParams) {
    this.viewCtrl = ViewController;    
    this.title = "Select an option";
    this.params = params;
    this.options = this.params.get('options');
    
  }

  close(){
    this.viewCtrl.dismiss();
  }

  itemSelected(){
    this.viewCtrl.dismiss(); 
  }
}


/**
* @name ModalSelect
* @description
* Toggle a menu by placing this directive on any item.
* Note that the menu's id must be either `leftMenu` or `rightMenu`
*
* @usage
 * ```html
 *<button modalSelect>
 *</button>
 *
 * ```
*/
@Directive({
  selector: '[modalSelect]',
  
  properties: [
    'options'
  ],
  
  host: {
    '(click)': 'showModal()'
    //'[hidden]': 'isHidden',
    //'menuToggle': '' //ensures the attr is there for css when using [menuToggle]
  }
})
export class ModalSelect {

  @Input() value: string;
  @Input() ngModel: any;

  constructor(
    nav: NavController,
    
    
    //app: IonicApp,
    elementRef: ElementRef
    //@Optional() viewCtrl: ViewController,
    //@Optional() navbar: Navbar
  ) {
    //this.app = app;
    //this.viewCtrl = viewCtrl;
    //this.withinNavbar = !!navbar;
    this.nav = nav;
    this._elementRef = elementRef;
    
  }

  ngOnInit() {
    if (this.ngModel) {
      this.value = this.ngModel;
    } else {
      this.value = this._elementRef.nativeElement.value;
    }
  }

  set options(opts){
    console.log(1, opts);
    this.internalOps = opts;
  }
   
  showModal() {
    console.log("showing modal!");
    console.log("t", this.internalOps);
    let modal = Modal.create(ModalSelectModal, {options:this.internalOps});
    this.nav.present(modal)
  }

  

}