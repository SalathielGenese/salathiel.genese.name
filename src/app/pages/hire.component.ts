import {Component, DestroyRef, effect, Inject, OnInit, Signal} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {I18nService} from "../services/i18n.service";
import {Meta} from "@angular/platform-browser";
import {ALTERNATES, LANGUAGE_TAG} from "../token";
import {LANGUAGES} from "../../constant";
import {routes} from "../routes";

@Component({
  selector: 'section[path="/hire"]',
  template: `
      <article class="px-center md:pt-56 pt-24 pb-24">
          <header class="font-serif font-bold text-4xl mb-16">
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
                  <p class="transition-all opacity-0 pb-2" [ngClass]="{'opacity-100': outcome}">
                      <small translate="pages.hire.forms.hire.success"
                             *ngIf="'SUCCESS' === outcome"
                             class="text-green-600"></small>
                      <small translate="pages.hire.forms.hire.failure"
                             *ngIf="'ERROR' === outcome"
                             class="text-brown"></small>
                  </p>
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
  protected outcome?: 'SUCCESS' | 'ERROR';

  constructor(meta: Meta,
              destroyRef: DestroyRef,
              i18nService: I18nService,
              private readonly fb: FormBuilder,
              private readonly http: HttpClient,
              @Inject(LANGUAGE_TAG) languageTag: Signal<string>,
              @Inject(ALTERNATES) alternates: Record<string, string>[]) {
    let alternate: typeof alternates[0];
    const description = i18nService.fetch('pages.hire.description');
    effect(() => meta.updateTag({property: 'og:description', content: description()!}));
    destroyRef.onDestroy(() => alternates.splice(alternates.indexOf(alternate), 1));
    setTimeout(() => alternates.push(alternate = LANGUAGES
        .filter(({tag}) => tag !== languageTag())
        .reduce((_, {tag}) => ({..._, [tag]: '/' + routes.hire(tag)}), {})));
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
    this.http.post(`@api/hires`, this.form.value)
        .subscribe({
          next: () => {
            this.#updateOutcome('SUCCESS');
            Object.assign(this.touched, {
              contactPhoneNumber: false,
              contactEmail: false,
              contactName: false,
              proposal: false,
              company: false,
            });
            this.form.reset({
              contactPhoneNumber: null,
              contactEmail: null,
              contactName: null,
              proposal: null,
              company: null,
            });
            this.form.enable();
          },
          error: err => {
            this.#updateOutcome('ERROR');
            console.error(err);
          },
        });
  }

  #updateOutcome(outcome: 'SUCCESS' | 'ERROR') {
    setTimeout(() => this.outcome = undefined, 5_000);
    this.outcome = outcome;
  }
}
