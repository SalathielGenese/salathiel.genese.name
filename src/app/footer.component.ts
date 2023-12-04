import {Component} from "@angular/core";
import {faBook} from "@fortawesome/free-solid-svg-icons/faBook";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

@Component({
    host: {'[class]': `'text-grey-400 min-h-[50vh] bg-grey-800 sm:grid-cols-2 grid-cols-1 gap-4 grid'`},
    selector: 'footer[sg-footer]',
    template: `
        <div>
            <h4 sgHeader>Credits</h4>
            
            <p>Made with &hearts; and:</p>
            <ul class="list-disc ml-5">
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
            
            <label>
                <span>EMAIL</span>
                <small>How do I reach you out?</small>
                <input type="email">
                <del>req...</del>
            </label>
            <label>
                <span>NAME</span>
                <small>How should I call to you?</small>
                <input type="text">
                <del>Too shorts</del>
            </label>
            <label>
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
