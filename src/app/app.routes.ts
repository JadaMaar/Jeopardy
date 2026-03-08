import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Jeopardy} from './jeopardy/jeopardy';
import {JeopardyEdit} from './jeopardy-edit/jeopardy-edit';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'jeopardy/:boardId', component: Jeopardy },
  { path: 'edit/:boardId', component: JeopardyEdit },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];
