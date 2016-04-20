<?php
class LoginController extends AppController {
  public function index() {
  	if ($this->request->is('post')) {
  		return 1;
  	}
  }
}