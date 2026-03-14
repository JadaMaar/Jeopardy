import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import {FormsModule} from '@angular/forms';
import Quill from 'quill';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-jeopardy-edit',
  imports: [
    NgForOf,
    QuillEditorComponent,
    FormsModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './jeopardy-edit.html',
  styleUrl: './jeopardy-edit.css',
})
export class JeopardyEdit implements OnInit {
  @ViewChild('questionEditor') questionEditorComponent!: QuillEditorComponent;
  @ViewChild('answerEditor') answerEditorComponent!: QuillEditorComponent;
  questionContent = ''
  answerContent = ''
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image', 'video']
    ],
    blotFormatter: {
      // optional: override default options
      resize: {
        handleStyle: {
          backgroundColor: '#1e3a8a',
          border: '2px solid white',
          width: '12px',
          height: '12px'
        }
      }
    }
  };

  boardId?: string;
  board: any = {name: "My first Jeopardy", categories: []}
  protected maxQuestions?: number ;
  rowIndexes?: number[];

  selectedQuestion: any = null;
  quillQuestionEditor!: Quill; // store the editor instance
  quillAnswerEditor!: Quill; // store the editor instance
  dragging = false;

  onDragEnd() {
    // small delay so the click event finishes
    setTimeout(() => this.dragging = false, 0);
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
    }

    this.maxQuestions = Math.max(
      ...this.board.categories.map((c: any) => c.questions.length)
    );
    this.rowIndexes = Array.from({ length: this.maxQuestions }, (_, i) => i);

    // initialize the preview value for each cell
    for (const c of this.board.categories) {
      for (const q of c.questions) {
        q._previewContent = this.getPreviewContent(q);
      }
    }
  }

  public selectQuestion(categoryIndex: number, questionIndex: number) {
    // this.router.navigate(['/question', this.boardId, categoryIndex, questionIndex]);
    if (this.dragging) return;
    this.selectedQuestion = this.board.categories[categoryIndex].questions[questionIndex];
  }

  exitQuestion() {
    this.selectedQuestion = null;
  }

  onQuestionEditorCreated(editor: Quill) {
    console.log('Quill question editor ready', editor);
    this.quillQuestionEditor = editor;

    setTimeout(() => {
      const question = this.selectedQuestion.question;
      const delta = typeof question === 'string' ? JSON.parse(question) : question;

      if (delta) {
        this.quillQuestionEditor.setContents(delta);
      } else {
        this.quillQuestionEditor.setContents([]);
      }
    }, 0);
  }

  onAnswerEditorCreated(editor: Quill) {
    this.quillAnswerEditor = editor;

    setTimeout(() => {
      const answer = this.selectedQuestion.answer;
      const delta = typeof answer === 'string' ? JSON.parse(answer) : answer;

      if (delta) {
        this.quillAnswerEditor.setContents(delta);
      } else {
        this.quillAnswerEditor.setContents([]);
      }
    }, 0);
  }

  saveQuestion() {
    this.selectedQuestion.question = this.quillQuestionEditor.getContents();
    this.selectedQuestion.answer = this.quillAnswerEditor.getContents();
    this.exitQuestion()
  }

  drop(event: CdkDragDrop<any>) {
    const a = event.item.data;                 // dragged cell

    const target = event.dropPoint
      ? this.getCellFromPoint(event.dropPoint.x, event.dropPoint.y)
      : null;

    console.log(target)

    if (!target) return;

    const q1 = this.board.categories[a.catIndex].questions[a.rowIndex];
    const q2 = this.board.categories[target.catIndex].questions[target.rowIndex];

    const tmpValue = q1.value;
    q1.value = q2.value;
    q2.value = tmpValue;

    this.board.categories[a.catIndex].questions[a.rowIndex] = q2;
    this.board.categories[target.catIndex].questions[target.rowIndex] = q1;
  }

  getCellFromPoint(x: number, y: number) {
    const el = document.elementFromPoint(x, y)?.closest('.cell');
    if (!el) return null;

    return {
      catIndex: Number(el.getAttribute('data-cat')),
      rowIndex: Number(el.getAttribute('data-row'))
    };
  }

  getPreviewContent(q: any) {
    const raw = q?.question ?? q?.value;
    if (!raw) return '';

    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return raw;
    }
  }

  showAnswer(q: any) {
    if (!q) return;
    const answer = q.answer ?? q.value ?? '';
    q._previewContent = this.parseDelta(answer);
  }

  showQuestion(q: any) {
    if (!q) return;
    q._previewContent = this.getPreviewContent(q);
  }

  parseDelta(raw: any) {
    if (!raw) return '';
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return raw; // fallback if plain text
    }
  }

  saveAndExit() {
    // Persist to localStorage
    const localStorageBoards = localStorage.getItem("boards");
    if (localStorageBoards) {
      const boards = JSON.parse(localStorageBoards);
      for (let i = 0; i < boards.length; i++) {
        if (boards[i].id == this.boardId) {
          boards[i] = this.board;
          break;
        }
      }
      localStorage.setItem('boards', JSON.stringify(boards))
    }

    // Navigate home
    this.exit();
  }

  exit() {
    this.router.navigate(['/']);
  }

}
