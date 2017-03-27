import { Component, OnInit, ViewChild, OnChanges, 
         ViewChildren, QueryList, ElementRef, AfterViewInit,
         HostListener, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent implements OnInit, AfterViewInit {

    // parameters
    @Input() defaultSize: number = 4;
    @Input() lastGroupPolicy: string = 'display-remaining';
    @Input() alignmentType: string = 'align-center';
    @Input() relativeSizes: boolean = false;

    // handlers
    @ViewChild('frame') private frameHandler: ElementRef;
    @ViewChildren('slide') slidesHandler: QueryList<any>;

    // events
    @HostListener('window:resize', ['$event']) onResize(event) {
        this.updateCarousel();
    }

    // state
    firstActive: number = 0;
    lastActive: number = null;
    isInitialized: boolean = false;
    setupAnimations: boolean = false;
    currentGroupSize = null;

    // data
    static readonly baseUrl = './assets/';
    randomIndex: number[] = [];
    data: any[] = [
            {
                title: 'Lakes in Spain',
                images: [
                    'Aiguestortes_i_Estany_de_Sant_Maurici-Spain.png',
                    'Estany_de_Banyoles-Spain.png',
                    'Panta_de_Sau-Spain.png'
                ]
            },
            {
                title: 'Lakes in United States of America',
                images: [
                    'Bear_Rock_Lakes-US.png',
                    'Lake_Sonoma-US.png'
                ]
            },
            {
                title: 'Lakes in Portugal',
                images: [
                'Lagoa_das_Sete_Cidades-Portugal.png',
                'Lagoa_do_Fogo-Portugal.png'
                ]
            },
            {
                title: 'Lakes in Guatemala',
                images: ['Lake_Atitlan-Guatemala.png']
            },
            {
                title: 'Lakes in Slovenia',
                images: ['Lake_Bled-Slovenia.png']
            },
            {
                title: 'Lakes in New Zealand',
                images: ['Lake_Mapourika-New_Zealand.png']
            },
            {
                title: 'Lakes in Estonia',
                images: [
                'Mahuste_Lake-Estonia.png',
                'Sinine_rabajarv-Estonia.png',
                'Vanamoisa_Estonia.png'
                ]
            },
            {
                title: 'Lakes in Canada',
                images: ['Peyto_lake-Canada.png']
            },
            {
                title: 'Lakes in United Kingdom',
                images: ['Windermere-England.png']
            }
    ];

    constructor(private _changeDetectionRef : ChangeDetectorRef) { }

    ngOnInit() {
        let r: number = null;
        for(let i = 0; i < this.data.length; i++){
            r = this.getRandomInt(0,this.data[i].images.length - 1);
            this.randomIndex.push(r);
        }
    }

    ngOnChanges(){
        if(this.isInitialized){
            // Timeout so that (ng)Classes have effect before update (from runtime relativeSizes changes)
            setTimeout(() => { this.updateCarousel(); }, 100);
        }
    }

    ngAfterViewInit() {
        this.updateCarousel();
        this.setupAnimations = true;
        this.isInitialized = true;
        this._changeDetectionRef.detectChanges();
    }

    shift(n: number){
        this.firstActive = Math.max(Math.min(this.firstActive + n * this.currentGroupSize, this.data.length - 1), 0);
        this.updateCarousel();
    }

    updateCarousel(){
        let slides = this.slidesHandler.toArray();
        let currentFrameWidth = this.frameHandler.nativeElement.offsetWidth;
        let currentElementWidth = slides[0].nativeElement.offsetWidth;
        this.currentGroupSize = Math.min(this.defaultSize, Math.floor(currentFrameWidth / currentElementWidth));
        this.lastActive = Math.min(this.firstActive + this.currentGroupSize - 1, slides.length - 1);

        // fill-in incomplete last group with previous elements
        if (this.lastGroupPolicy === 'display-previous') {
            this.firstActive = Math.max(this.lastActive - (this.currentGroupSize - 1), 0);
        }

        // make elements before currentGroup overflow to the left of the frame
        for(let i = 0; i < this.firstActive; i++){
            slides[i].nativeElement.style.marginLeft = -currentElementWidth + 'px';
        }
        
        // restore margin of other elements (left aligned, by design)
        for(let i = this.firstActive; i < slides.length; i++){
            slides[i].nativeElement.style.marginLeft = "0px";
        }

        // if element after group fits partially in frame, make it overflow to the right of the frame
        let remainingSpace = Math.floor(currentFrameWidth - ((this.lastActive - this.firstActive + 1) * currentElementWidth));
        if(remainingSpace > 0 && this.lastActive < slides.length - 1){
            slides[this.lastActive+1].nativeElement.style.marginLeft = remainingSpace + 'px';
        }

        // other alignment options
        if (this.alignmentType === 'align-center' || (this.alignmentType === 'align-distribute' && this.firstActive === this.lastActive)) {
            slides[this.firstActive].nativeElement.style.marginLeft = Math.floor(remainingSpace / 2) + 'px';
        } else if (this.alignmentType === 'align-right') {
            slides[this.firstActive].nativeElement.style.marginLeft = remainingSpace + 'px';
        } else if (this.alignmentType === 'align-distribute') {
            for(let i = this.firstActive + 1; i <= this.lastActive ; i++) {
                slides[i].nativeElement.style.marginLeft = Math.floor(remainingSpace / (this.lastActive - this.firstActive)) + 'px';
            }
        }

        if(this.setupAnimations){
            for(let i = 0; i < slides.length; i++){
                slides[i].nativeElement.style.transition = "margin 0.75s ease-in-out";
            }
            this.setupAnimations = false;
        }
    }

    // Utils
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    buildUrl(path: string){
        return CarouselComponent.baseUrl + path;
    }

}
