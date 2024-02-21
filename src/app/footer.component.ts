import {Component} from "@angular/core";
import {faLinkedinIn} from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import {faFacebook} from "@fortawesome/free-brands-svg-icons/faFacebook";
import {faTwitter} from "@fortawesome/free-brands-svg-icons/faTwitter";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import {faTiktok} from "@fortawesome/free-brands-svg-icons/faTiktok";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";

@Component({
  host: {'[class]': `'justify-items-center place-items-center snap-always snap-center bg-grey-800 min-h-[50vh] grid p-8'`},
  selector: 'footer[sg-footer]',
  template: `
      <div>
          <p class="text-center">
              <strong class="text-grey-600 font-extrabold">
                  © 2024
              </strong>
          </p>

          <ul class="text-grey-400 text-center block my-8">
              <li *ngFor="let social of socials" class="contents">
                  <a class="m-1 p-3" [href]="social.uri" target="_blank">
                      <fa-icon [icon]="social.icon" size="xl"></fa-icon>
                  </a>
              </li>
          </ul>
      </div>
  `,
})
export class FooterComponent {
  protected readonly socials: { icon: IconDefinition, uri: string }[] = [
    {icon: faGithub, uri: 'https://github.com/SalathielGenese'},
    {icon: faLinkedinIn, uri: 'https://www.linkedin.com/in/salathielgenese'},
    {icon: faTwitter, uri: 'https://x.com/@SalathielGenese'},
    {icon: faTiktok, uri: 'https://www.tiktok.com/@salathielgenese'},
    {icon: faFacebook, uri: 'https://www.facebook.com/SalathielGenese'},
  ];
}
