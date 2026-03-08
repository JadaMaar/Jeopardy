import {AfterViewInit, Component, OnInit, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import {FormsModule} from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    QuillEditorComponent,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Jeopardy');
  content = '';
  quillEditor!: Quill; // store the editor instance

  onEditorCreated(editor: Quill) {
    console.log('Quill editor ready', editor);
    this.quillEditor = editor;
    this.loadContent();
  }

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image', 'video']
    ]
  };
  editing = true;


  toggleEdit() {
    this.editing = !this.editing;
  }

  saveContent() {
    const delta = this.quillEditor.getContents(); // get the Delta JSON
    localStorage.setItem('card', JSON.stringify(delta));
  }

  loadContent() {
    const saved = localStorage.getItem('card');
    if (saved) {
      this.quillEditor.setContents(JSON.parse(saved));
    }
  }
}
