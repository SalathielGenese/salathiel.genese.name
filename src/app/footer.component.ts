import {Component} from "@angular/core";
import {faBook} from "@fortawesome/free-solid-svg-icons/faBook";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

@Component({
    host: {'[class]': `'text-grey-400 min-h-[50vh] bg-grey-800 lg:grid-cols-2 grid-cols-1 gap-8 grid py-16'`},
    selector: 'footer[sg-footer]',
    template: `
        <div>
            <h4 sgHeader>Data Privacy</h4>
            <p>I collect no particular data of yours save through Google Analytics to understand my audience.</p>

            <h4 sgHeader class="mt-8">Credits</h4>
            <p>Made with &hearts; and:</p>
            <ul class="ml-[1.05rem] list-disc">
                <li>Git</li>
                <li>GitHub</li>
                <li>Angular</li>
                <li>Firebase</li>
                <li>TailwindCSS</li>
                <li>Font Awesome</li>
                <li>Google Cloud Platform Run</li>
                <li>Google Cloud Platform Build</li>
            </ul>
        </div>
        
        <form>
            <h4 sgHeader>Contact</h4>
            
            <label class="form-field">
                <span>EMAIL</span>
                <small>How do I reach you out?</small>
                <input type="email">
                <del>req...</del>
            </label>
            <label class="form-field">
                <span>NAME</span>
                <small>How should I call to you?</small>
                <input type="text">
                <del>Too shorts</del>
            </label>
            <label class="form-field">
                <span>MESSAGE</span>
                <small>I'm all ears, sir/ma'am</small>
                <textarea cols="10"></textarea>
                <del>Requi...</del>
            </label>
            
            <div>
                <button type="submit">
                    <fa-icon [icon]="faPaperPlane"></fa-icon>
                    <span>send</span>
                </button>
            </div>
        </form>
    `,
})
export class FooterComponent {
    readonly faPaperPlane = faPaperPlane;
}
