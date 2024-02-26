import {Component, DestroyRef, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from "@angular/core";
import {faAward} from "@fortawesome/free-solid-svg-icons/faAward";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'section[path="/"]',
  template: `
      <article class="px-[clamp(max(calc((100vw-var(--max-width))/2),2rem),2rem,2rem)] justify-items-center grid
                            place-items-center min-h-screen snap-always snap-center">
          <header class="text-center flex-col flex">
              <h1 class="font-handwriting font-bold text-black text-3xl mb-8">Salathiel</h1>
              <h2 translate="pages.home.sections.landing.jobTitle" class="font-bold"></h2>
              <h3 translate="pages.home.sections.landing.crafts" class="text-grey-500 my-2"></h3>
              <small translate="pages.home.sections.landing.experience" class="text-grey-500"></small>
          </header>
      </article>
      <article class="px-[clamp(max(calc((100vw-var(--max-width))/2),2rem),2rem,2rem)] justify-items-center grid
                            place-items-center min-h-screen snap-always snap-center sm:pt-[5.70rem] pt-[4.70rem]">
          <div class="text-center flex-col flex">
              <h2 class="font-handwriting font-bold text-4xl mb-8"
                  translate="pages.home.sections.certified.title"
              ></h2>
              <div class="max-w-screen-md">
                  <p class="place-items-center overflow-hidden text-grey-400 border-white bg-grey-800
                            inline-flex rounded border-2 shadow m-1"
                     *ngFor="let certification of certifications">
                      <fa-icon [icon]="icons.faAward" class="m-1"></fa-icon>
                      <span class="whitespace-nowrap p-1">{{ certification.name }}</span>
                      <small class="whitespace-nowrap border-grey-600 bg-grey-700 border-l p-1">
                          {{ certification.date }}
                      </small>
                  </p>
              </div>
          </div>
      </article>
      <article class="px-[clamp(max(calc((100vw-var(--max-width))/2),2rem),2rem,2rem)] place-content-center min-h-screen
                      snap-always snap-center sm:pt-[5.70rem] pt-[4.70rem] flex-col flex">
          <div class="place-items-stretch grid-cols-4 sm:pb-8 gap-4 pb-2 grid">
              <label [ngClass]="{'bg-brown': craft === activeCraft, 'bg-grey-200': craft !== activeCraft}"
                     class="cursor-pointer transition-all aspect-square rounded h-1"
                     (click)="setActiveCraft(craft)"
                     *ngFor="let craft of crafts"></label>
          </div>
          <div class="overflow-x-scroll snap-mandatory no-scrollbar relative w-full snap-x" #craftsRef>
              <div class="w-[400%]">
                  <figure class="sm:grid-cols-4 inline-grid grid-cols-1 snap-always snap-start gap-4 w-1/4">
                      <header class="sm:col-span-1 md:col-span-2 max-sm:mb-8">
                          <h3 class="font-handwriting font-bold text-black text-4xl">Cloud</h3>
                          <small class="mb-8 mt-4">
                              Google Cloud Platform (GCP) · Amazon Web Service (AWS) · Private Cloud · Cloud Native ·
                              Kubernetes · Terraform · Docker
                          </small>
                      </header>
                      <figcaption class="sm:col-span-3 md:col-span-2 sm:mt-10">
                          <ul class="list-disc pl-5">
                              <li *ngFor="let value of (('pages.home.sections.crafts.cloud.values' | translate) ?? '').split('\f')">
                                  {{ value }}
                              </li>
                          </ul>
                      </figcaption>
                  </figure>
                  <figure class="sm:grid-cols-4 inline-grid grid-cols-1 snap-always snap-start gap-4 w-1/4">
                      <header class="sm:col-span-1 md:col-span-2 max-sm:mb-8">
                          <h3 class="font-handwriting font-bold text-black text-4xl">Data</h3>
                          <small class="mb-8 mt-4">
                              Apache Flink · Apache Druid · Apache Kafka · Rabbit MQ · Influx DB · Grafana
                          </small>
                      </header>
                      <figcaption class="sm:col-span-3 md:col-span-2 sm:mt-10">
                          <ul class="list-disc pl-5">
                              <li *ngFor="let value of (('pages.home.sections.crafts.data.values' | translate) ?? '').split('\f')">
                                  {{ value }}
                              </li>
                          </ul>
                      </figcaption>
                  </figure>
                  <figure class="sm:grid-cols-4 inline-grid grid-cols-1 snap-always snap-start gap-4 w-1/4">
                      <header class="sm:col-span-1 md:col-span-2 max-sm:mb-8">
                          <h3 class="font-handwriting font-bold text-black text-4xl">DevOps</h3>
                          <small class="mb-8 mt-4">
                              Linters · Sonar Qube · CI/CD · Jenkins · Cloud Build · GitHub Actions · Docker ·
                              Kubernetes · Helm · Terraform
                          </small>
                      </header>
                      <figcaption class="sm:col-span-3 md:col-span-2 sm:mt-10">
                          <p translate="pages.home.sections.crafts.devops.intro"></p>
                          <ul class="list-disc pl-5">
                              <li *ngFor="let value of (('pages.home.sections.crafts.devops.values' | translate) ?? '').split('\f')">
                                  {{ value }}
                              </li>
                          </ul>
                      </figcaption>
                  </figure>
                  <figure class="sm:grid-cols-4 inline-grid grid-cols-1 snap-always snap-start gap-4 w-1/4">
                      <header class="sm:col-span-1 md:col-span-2 max-sm:mb-8">
                          <h3 class="font-handwriting font-bold text-black text-4xl">Full-Stack</h3>
                          <small class="mb-8 mt-4">
                              Java · JavaScript · Python · Spring Framework · Quarkus · Angular · React · Vue · Flask ·
                              NodeJS · Maven · Gradle · PiP · NPM · Yarn · PnP
                          </small>
                      </header>
                      <figcaption class="sm:col-span-3 md:col-span-2 sm:mt-10">
                          <p translate="pages.home.sections.crafts.full-stack.intro"></p>
                          <ul class="list-disc pl-5">
                              <li *ngFor="let value of (('pages.home.sections.crafts.full-stack.values' | translate) ?? '').split('\f')">
                                  {{ value }}
                              </li>
                          </ul>
                      </figcaption>
                  </figure>
              </div>
          </div>
      </article>
  `,
})
export class HomeComponent implements OnInit {
  @ViewChild('craftsRef')
  protected craftsRef?: ElementRef<HTMLDivElement>;

  protected readonly crafts = ['cloud', 'data', 'devops', 'full-stack'];
  protected readonly certifications: {
    date: `${number}${number}${number}${number}-${number}${number}`;
    name: string;
  }[] = [
    {name: 'Certified Kubernetes Administrator', date: '2024-02'},
    {name: 'Hashicorp Terraform', date: '2024-01'},
    {name: 'Spring Application Developer', date: '2022-08'},
    {name: 'Oracle Certified Professional · Java', date: '2021-04'},
    {name: 'Redis Data Structures', date: '2021-03'},
    {name: 'Redis Security', date: '2021-03'},
    {name: 'Redis Stream', date: '2021-03'},
    {name: 'Redis Search', date: '2021-03'},
    {name: 'GCP Big Data & ML', date: '2021-01'},
  ];
  protected readonly icons = {
    faAward,
  };
  protected readonly FORM_FEED = '\f';
  protected activeCraft = 'cloud';

  #activeCraftHandler?: any;

  constructor(destroyRef: DestroyRef,
              @Inject(PLATFORM_ID) private readonly platformId: object) {
    destroyRef.onDestroy(() => {
      clearInterval(this.#activeCraftHandler);
      clearTimeout(this.#activeCraftHandler);
    });
  }

  ngOnInit() {
    this.#animateCrafts();
  }

  protected setActiveCraft(craft: string) {
    clearInterval(this.#activeCraftHandler);

    if (craft !== this.activeCraft) {
      const nextIndex = this.crafts.indexOf(craft);
      this.activeCraft = craft;

      if (0 === nextIndex) {
        this.craftsRef!.nativeElement.scrollLeft = 0;
      } else {
        this.craftsRef!.nativeElement.scrollLeft = nextIndex * this.craftsRef!.nativeElement.clientWidth;
      }
    }

    this.#activeCraftHandler = setTimeout(() => this.#animateCrafts(), 7_500);
  }

  #animateCrafts() {
    if (isPlatformBrowser(this.platformId)) {
      this.#activeCraftHandler = setInterval(() => {
        const currentIndex = this.crafts.indexOf(this.activeCraft);
        const nextIndex = (1 + currentIndex) % this.crafts.length;
        this.activeCraft = this.crafts[nextIndex];

        if (nextIndex) {
          this.craftsRef?.nativeElement.scrollBy({left: 100});
        } else if (this.craftsRef) {
          this.craftsRef.nativeElement.scrollLeft = 0;
        }
      }, 2_500);
    }
  }
}
