import {Component, Inject, OnInit, Signal} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {LANGUAGE_TAG} from "../token";

@Component({
  selector: 'section[path="/hire"]',
  template: `
      <header class="sm:min-h-[5.70rem] overflow-y-hidden drop-shadow-2xl
                       min-h-[4.70rem] md:h-[33.33vh] h-[50vh] relative">
          <picture class="contents">
              <source srcset="/assets/images/hire/jj-ying-7JX0-bfiuxQ-unsplash-3905.jpg"
                      media="(min-width: 3905px)">
              <source srcset="/assets/images/hire/jj-ying-7JX0-bfiuxQ-unsplash-2400.jpg"
                      media="(min-width: 2400px)">
              <source srcset="/assets/images/hire/jj-ying-7JX0-bfiuxQ-unsplash-1920.jpg"
                      media="(min-width: 1920px)">
              <source srcset="/assets/images/hire/jj-ying-7JX0-bfiuxQ-unsplash-640.jpg"
                      media="(min-width: 640px)">
              <img class="pointer-events-none object-cover object-bottom min-w-full absolute left-0 h-full"
                   src="/assets/images/hire/jj-ying-7JX0-bfiuxQ-unsplash-640.jpg"
                   [alt]="'alt.hire' | translate">
          </picture>
      </header>
      <article class="md:min-h-[66.67vh] min-h-[50vh] px-center md:py-64 py-24">
          <header class="font-serif font-bold text-6xl mb-7">
              <h1 translate="pages.hire.title"></h1>
          </header>

          <form [formGroup]="form" class="sm:max-w-[50%]" (submit)="submit()">
              <label class="flex-col flex my-2">
                  <span translate="pages.hire.forms.hire.company.label"></span>
                  <input [placeholder]="'pages.hire.forms.hire.company.placeholder' | translate"
                         class="bg-white/30 border py-0.5 px-1"
                         (input)="touched.company = true"
                         formControlName="company"
                         type="text">
                  <small [translate-context]="form.controls.company.errors?.['maxlength'] ?? {}"
                         *ngIf="touched.company && form.controls.company.errors?.['maxlength']"
                         translate="@validation.maxLength"
                         class="text-brown italic"
                  ></small>
              </label>
              <label class="flex-col flex my-2">
                  <span translate="pages.hire.forms.hire.contactName.label"></span>
                  <input [placeholder]="'pages.hire.forms.hire.contactName.placeholder' | translate"
                         class="bg-white/30 border py-0.5 px-1"
                         (input)="touched.contactName = true"
                         formControlName="contactName"
                         type="text">
                  <small *ngIf="touched.contactName && form.controls.contactName.errors?.['maxlength']"
                         [translate-context]="form.controls.contactName.errors?.['maxlength'] ?? {}"
                         translate="@validation.maxLength"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.contactName && form.controls.contactName.errors?.['required']"
                         [translate-context]="form.controls.contactName.errors?.['required'] ?? {}"
                         translate="@validation.required"
                         class="text-brown italic"
                  ></small>
              </label>
              <label class="flex-col flex my-2">
                  <span translate="pages.hire.forms.hire.contactEmail.label"></span>
                  <input [placeholder]="'pages.hire.forms.hire.contactEmail.placeholder' | translate"
                         class="bg-white/30 border py-0.5 px-1"
                         (input)="touched.contactEmail = true"
                         formControlName="contactEmail"
                         type="text">
                  <small *ngIf="touched.contactEmail && form.controls.contactEmail.errors?.['maxlength']"
                         [translate-context]="form.controls.contactEmail.errors?.['maxlength'] ?? {}"
                         translate="@validation.maxLength"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.contactEmail && form.controls.contactEmail.errors?.['required']"
                         [translate-context]="form.controls.contactEmail.errors?.['required'] ?? {}"
                         translate="@validation.required"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.contactEmail && form.controls.contactEmail.errors?.['email']"
                         [translate-context]="form.controls.contactEmail.errors?.['email'] ?? {}"
                         translate="@validation.email"
                         class="text-brown italic"
                  ></small>
              </label>
              <label class="flex-col flex my-2">
                  <span translate="pages.hire.forms.hire.contactPhoneNumber.label"></span>
                  <input [placeholder]="'pages.hire.forms.hire.contactPhoneNumber.placeholder' | translate"
                         (input)="touched.contactPhoneNumber = true"
                         class="bg-white/30 border py-0.5 px-1"
                         formControlName="contactPhoneNumber"
                         type="tel">
                  <small *ngIf="touched.contactPhoneNumber && form.controls.contactPhoneNumber.errors?.['maxlength']"
                         [translate-context]="form.controls.contactPhoneNumber.errors?.['maxlength'] ?? {}"
                         translate="@validation.maxLength"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.contactPhoneNumber && form.controls.contactPhoneNumber.errors?.['required']"
                         [translate-context]="form.controls.contactPhoneNumber.errors?.['required'] ?? {}"
                         translate="@validation.required"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.contactPhoneNumber && form.controls.contactPhoneNumber.errors?.['pattern']"
                         [translate-context]="form.controls.contactPhoneNumber.errors?.['pattern'] ?? {}"
                         translate="@validation.pattern"
                         class="text-brown italic"
                  ></small>
              </label>
              <label class="flex-col flex my-2">
                  <span translate="pages.hire.forms.hire.proposal.label"></span>
                  <textarea [placeholder]="'pages.hire.forms.hire.proposal.placeholder' | translate"
                            class="bg-white/30 border py-0.5 px-1"
                            (input)="touched.proposal = true"
                            formControlName="proposal"
                            rows="7"></textarea>
                  <p *ngIf="!form.controls.proposal.errors" class="text-right text-sm italic">
                      {{ form.value.proposal?.length }} / {{ MAX_PROPOSAL_LENGTH }}
                  </p>
                  <small *ngIf="touched.proposal && form.controls.proposal.errors?.['maxlength']"
                         [translate-context]="form.controls.proposal.errors?.['maxlength'] ?? {}"
                         translate="@validation.maxLength"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.proposal && form.controls.proposal.errors?.['minlength']"
                         [translate-context]="form.controls.proposal.errors?.['minlength'] ?? {}"
                         translate="@validation.minLength"
                         class="text-brown italic"
                  ></small>
                  <small *ngIf="touched.proposal && form.controls.proposal.errors?.['required']"
                         [translate-context]="form.controls.proposal.errors?.['required'] ?? {}"
                         translate="@validation.required"
                         class="text-brown italic"
                  ></small>
              </label>

              <div class="text-right mt-12">
                  <button class="disabled:bg-grey-300 transition-all ring-white text-white
                                 cursor-pointer bg-brown rounded border shadow py-1 px-2"
                          translate="pages.hire.forms.hire.submit.label"
                          [disabled]="form.invalid || form.disabled"
                          type="submit"></button>
              </div>
          </form>
      </article>
  `,
})
export class HireComponent implements OnInit {
  protected readonly touched = {} as Partial<Record<
      'contactPhoneNumber' | 'contactEmail' | 'contactName' | 'proposal' | 'company', boolean
  >>;
  protected form!: FormGroup<{
    contactPhoneNumber: FormControl<string | null>;
    contactEmail: FormControl<string | null>;
    contactName: FormControl<string | null>;
    proposal: FormControl<string | null>;
    company: FormControl<string | null>;
  }>;
  protected readonly MAX_PROPOSAL_LENGTH = 3_000;

  constructor(private readonly fb: FormBuilder,
              private readonly http: HttpClient,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      company: [null as any, Validators.maxLength(50)],
      contactName: [null as any, [Validators.required, Validators.maxLength(50)]],
      contactEmail: [null as any, [Validators.email, Validators.required, Validators.maxLength(99)]],
      proposal: [null as any, [Validators.required, Validators.minLength(100), Validators.maxLength(this.MAX_PROPOSAL_LENGTH)]],
      contactPhoneNumber: [null as any, [Validators.required, Validators.maxLength(19), Validators.pattern(/^\+\d{2,3}[ -](\d{1,3}[ -]?){5}$/)]],
    });
  }

  submit() {
    this.form.disable();
    this.http.post(`@api/${this.languageTag()}/hires`, this.form.value)
        .subscribe({
          error: console.error,
          next: () => {
            this.form.setValue({
              contactPhoneNumber: null,
              contactEmail: null,
              contactName: null,
              proposal: null,
              company: null,
            });
            this.form.enable();
          }
        });
  }
}
