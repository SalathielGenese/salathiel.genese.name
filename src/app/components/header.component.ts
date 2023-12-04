import {Component, ElementRef, HostBinding} from "@angular/core";

@Component({
    selector: 'h1[sgHeader], h2[sgHeader], h3[sgHeader], h4[sgHeader], h5[sgHeader], h6[sgHeader]',
    host: {
        '[class]': `"after:h-[var(--after-height)] after:bg-grey-400 after:content-[''] after:bottom-4 " +
                    "after:absolute after:left-0 after:block after:w-8 font-bold relative pb-6"`,
        '[style]': `{'--after-height': '0px'}`
    },
    template: '<ng-content></ng-content>',
})
export class HeaderComponent {
    @HostBinding('style.--after-height.px') readonly afterHeight: number;
    @HostBinding('class.text-3xl') readonly textSizeH1 = false;
    @HostBinding('class.text-2xl') readonly textSizeH2 = false;
    @HostBinding('class.text-xl') readonly textSizeH3 = false;
    @HostBinding('class.text-lg') readonly textSizeH4 = false;
    @HostBinding('class.text-sm') readonly textSizeH6 = false;
    @HostBinding('class.uppercase') readonly uppercase = false;

    constructor(elementRef: ElementRef) {
        const level = +elementRef.nativeElement.tagName[1] as 1 | 2 | 3 | 4 | 5 | 6;
        Reflect.set(this, `textSizeH${level}`, true);
        Reflect.set(this, 'uppercase', level < 4);
        this.afterHeight = 7 - level;
    }
}
