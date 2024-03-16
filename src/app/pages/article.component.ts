import {Component} from "@angular/core";

@Component({
  selector: 'section[path="/blog/:slug"]',
  template: `
      <article class="px-center md:pt-56 pt-36 pb-36">
          <header class="font-serif font-bold text-6xl mb-7">
<!--              <h1 translate="pages.blog.title"></h1>-->
              <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit</h1>
          </header>

          <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi at, debitis et facere, fugiat id in ipsa
              ipsum laudantium molestiae natus nihil numquam pariatur quod sapiente similique voluptatum. Omnis, quidem.
          </div>
      </article>
  `,
})
export class ArticleComponent {
}
