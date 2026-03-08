import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { saveAs } from 'file-saver';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    FormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  boards: any = [];
  showBoardModal = false;
  newBoardName = '';

  openNewBoardModal() {
    this.showBoardModal = true;
    this.newBoardName = ''; // reset
  }

  closeModal() {
    this.showBoardModal = false;
  }

  createNewBoard() {
    if (this.newBoardName.trim()) {
      // Call your service to create the board with the name
      this.createBoard(this.newBoardName.trim())
      this.closeModal();
    } else {
      // Optional: show validation message
      alert('Please enter a board name');
    }
  }

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBoards()
  }

  loadBoards() {
    const localStorageBoards = localStorage.getItem("boards");
    if (localStorageBoards) {
      this.boards = JSON.parse(localStorageBoards);
    }
  }




  playBoard(board: any) {
    // localStorage.setItem('board', JSON.stringify(board))
    this.router.navigate(['/jeopardy', board.id]);
  }

  editBoard(board: any) {
    // localStorage.setItem('board', JSON.stringify(board))
    this.router.navigate(['/edit', board.id]);
  }

  createBoard(name: string) {
    const nextId = this.generateId()//Math.max(...this.boards.map((board: any) => board.id)) + 1;
    const newBoard = {
        "id": nextId,
        "name": name,
        "categories": [
          {
            "name": "Category 1", "questions": [
              {"value": 100, "question": {"ops":[{"insert":"Who killed Cayde-6?\n"}]}, "answer": {"ops": [{ "insert": "Uldren Sov\n" }]}},
              {"value": 200},
              {"value": 300},
              {"value": 400},
              {"value": 500}
            ]
          },
          {
            "name": "Category 2", "questions": [
              {"value": 100},
              {"value": 200},
              {"value": 300},
              {"value": 400},
              {"value": 500}
            ]
          },
          {
            "name": "Category 3", "questions": [
              {"value": 100},
              {"value": 200},
              {"value": 300},
              {"value": 400},
              {"value": 500}
            ]
          },
          {
            "name": "Category 4", "questions": [
              {"value": 100},
              {"value": 200},
              {"value": 300},
              {"value": 400},
              {"value": 500}
            ]
          },
          {
            "name": "Category 5", "questions": [
              {"value": 100},
              {"value": 200},
              {"value": 300},
              {"value": 400},
              {"value": 500}
            ]
          },
          ]
      }
    this.boards.push(newBoard);
    // localStorage.setItem('board', JSON.stringify(newBoard))
    localStorage.setItem('boards', JSON.stringify(this.boards))
    this.router.navigate(['/edit', nextId]);
  }

  deleteBoard(boardToDelete: any) {
    if (!confirm(`Delete "${boardToDelete.name}"?`)) return;

    this.boards = this.boards.filter((b: any) => b !== boardToDelete);
    localStorage.setItem('boards', JSON.stringify(this.boards));
  }

  exportBoards() {
    const blob = new Blob(
      [JSON.stringify(this.boards, null, 2)],
      { type: 'application/json;charset=utf-8' }
    );

    saveAs(blob, 'jeopardy-boards.json');
  }

  importBoards(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (!Array.isArray(imported)) return;

        const newBoards: any[] = [];
        const existingIds = new Set(this.boards.map((b: { id: any; }) => b.id));

        for (const board of imported) {
          if (!board.id) board.id = this.generateId();
          while (existingIds.has(board.id)) {
            board.id = this.generateId();
          }
          existingIds.add(board.id);
          newBoards.push(board);
        }

        this.boards = [...this.boards, ...newBoards];

        localStorage.setItem('boards', JSON.stringify(this.boards));
        this.cd.detectChanges();

      } catch (e) {
        console.error('Invalid board file', e);
      }

      // allow re-importing same file later
      input.value = '';
    };

    reader.readAsText(file);
  }

  generateId(): string {
    return crypto.randomUUID();
  }

}
