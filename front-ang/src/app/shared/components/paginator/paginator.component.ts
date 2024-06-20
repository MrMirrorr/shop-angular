import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() pageSizeOptions!: number[];
  @Input() length!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Output() pageChange = new EventEmitter<PageEvent>();

  handlePageEvent(e: PageEvent) {
    this.pageChange.emit(e);
  }
}
