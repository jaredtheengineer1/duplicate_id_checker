import {
  Injectable,
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  output,
  inject,
} from "@angular/core";
import { findDuplicateIds } from "./core";

@Injectable({ providedIn: "root" })
export class DuplicateIdChecker {
  check(root: Element | Document = document) {
    return findDuplicateIds(root as Document);
  }
}

@Directive({
  selector: "[duplicateIdCheck]",
  standalone: true,
})
export class DuplicateIdCheckDirective implements OnInit, OnDestroy {
  duplicatesFound = output<any[]>();
  private el = inject(ElementRef);
  private observer?: MutationObserver;

  ngOnInit() {
    const check = () => {
      const duplicates = findDuplicateIds(this.el.nativeElement);
      if (duplicates.length > 0) {
        this.duplicatesFound.emit(duplicates);
      }
    };
    check();
    this.observer = new MutationObserver(check);
    this.observer.observe(this.el.nativeElement, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }
  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
