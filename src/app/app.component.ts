import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

export class Position {
  public x = 0;
  public y = 0;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('range') range: ElementRef;
  @ViewChild('file') file: ElementRef;
  @ViewChild('img') imgEl: ElementRef;
  public context: CanvasRenderingContext2D;
  public fileReader: FileReader = new FileReader();
  public image = '';
  private isMove: boolean;
  private position = new Position();
  private direction = new Position();

  public ngOnInit(): void {
    this.canvas.nativeElement.style.display = 'none';
    this.range.nativeElement.style.display = 'none';
  }

  public ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
  }

  public start(ev): void {
    this.isMove = true;
    this.direction.x = ev.clientX;
    this.direction.y = ev.clientY;
  }

  public move(ev): void {
    if (this.isMove) {
      this.position.x = this.position.x - this.direction.x + ev.clientX;
      this.direction.x = ev.clientX;
      this.position.y = this.position.y - this.direction.y + ev.clientY;
      this.direction.y = ev.clientY;
    }
  }

  public end(): void {
    this.isMove = false;
  }

  public uploadImage(): void {
    if (this.file.nativeElement.files && this.file.nativeElement.files[0]) {
      this.fileReader.addEventListener('load', (event) => {
        this.image = event.target['result'];
        this.canvas.nativeElement.style.display = 'block';
        this.range.nativeElement.style.display = 'block';
        this.imgEl.nativeElement.style.display = 'none';
        this.drawImage();
      });
      this.fileReader.readAsDataURL(this.file.nativeElement.files[0]);
    }
  }

  public drawImage(): void {
    const scale = this.range.nativeElement.value;
    const img = this.imgEl.nativeElement;
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.drawImage(img, this.position.x, this.position.y,
      this.imgEl.nativeElement.width / 100 * scale, this.imgEl.nativeElement.height / 100 * scale);
    setTimeout(() => {
      this.drawImage();
    }, 100);
  }

  public download(e): void {
    const image = this.canvas.nativeElement.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    e.target.setAttribute('href', image);
  }
}
