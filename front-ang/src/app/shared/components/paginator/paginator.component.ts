import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`Первая страница`;
  itemsPerPageLabel = $localize`Элементов на странице:`;
  lastPageLabel = $localize`Последняя страница`;
  nextPageLabel = $localize`Следующая страница`;
  previousPageLabel = $localize`Предыдущая страница`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const startIndex = page * pageSize + 1;
    const endIndex = Math.min((page + 1) * pageSize, length);
    return `${startIndex} – ${endIndex} из ${length}`;
  }
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MyCustomPaginatorIntl,
    },
  ],
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
