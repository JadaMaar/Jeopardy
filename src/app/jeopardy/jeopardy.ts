import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import Quill from 'quill';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-jeopardy',
  imports: [
    NgForOf,
    QuillEditorComponent,
    FormsModule,
    NgStyle,
  ],
  templateUrl: './jeopardy.html',
  styleUrl: './jeopardy.css',
})
export class Jeopardy implements OnInit {
  quillEditor!: Quill;
  boardId?: string;
  board: any = {name: "My first Jeopardy", categories: []}
  protected maxQuestions?: number ;
  rowIndexes?: number[];

  selectedQuestion: any = null;
  players: {
    id: string;
    name: string;
    score: number;
  }[] = [];

  currentQuestionValue = 0; // set this when a question is opened

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      if (this.selectedQuestion) {
        this.quillEditor.setContents(this.selectedQuestion.answer);
        this.selectedQuestion.used = true;
      }
      event.preventDefault(); // Prevent scrolling
    }
    if (event.code === 'Escape') {
      this.closeQuestion()
      event.preventDefault(); // Prevent scrolling
    }
  }


  closeQuestion() {
    this.selectedQuestion = null;
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId')!;
    console.log(this.boardId)
    const localStorageBoards = localStorage.getItem("boards");
    if (localStorageBoards) {
      const boards = JSON.parse(localStorageBoards);
      for (const board of boards) {
        if (board.id == this.boardId) {
          this.board = board;
          break;
        }
      }
      console.log(this.board)
    }

    this.maxQuestions = Math.max(
      ...this.board.categories.map((c: any) => c.questions.length)
    );
    this.rowIndexes = Array.from({ length: this.maxQuestions }, (_, i) => i);
  }

  public selectQuestion(categoryIndex: number, questionIndex: number) {
    // this.router.navigate(['/question', this.boardId, categoryIndex, questionIndex]);
    this.selectedQuestion = this.board.categories[categoryIndex].questions[questionIndex];
    this.currentQuestionValue = this.selectedQuestion?.value ?? 0;
    // this.selectedQuestion.used = true;
  }

  exitQuestion() {
    this.selectedQuestion = null;
  }

  onEditorCreated(editor: Quill) {
    this.quillEditor = editor;
    this.loadContent();
  }

  loadContent() {
    this.quillEditor.setContents(this.selectedQuestion.question);
    console.log(this.selectedQuestion.question)
  }

  exitBoard() {
    this.router.navigate(['/']);
  }

  // player handling
  addPlayer() {
    this.players = [
      ...this.players,
      {
        id: crypto.randomUUID(),
        name: `Team ${this.players.length + 1}`,
        score: 0
      }
    ];
  }

  removePlayer(id: string) {
    this.players = this.players.filter(p => p.id !== id);
  }

  addScore(p: any) {
    p.score += this.currentQuestionValue;
  }

  subtractScore(p: any) {
    p.score -= this.currentQuestionValue;
  }

  setScore(p: any, value: string) {
    const n = Number(value);
    if (!Number.isNaN(n)) p.score = n;
  }
}
