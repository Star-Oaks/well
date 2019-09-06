import { Routes, RouterModule } from '@angular/router';
import { EncyclopediaComponent } from './encyclopedia/encyclopedia.component';
import { ArticleComponent } from './article/article.component';
import { EncyclopediaResolveService, ArticleResolveService } from './encyclopedia.service';

const routes: Routes = [
    {
        path: '',
        component: EncyclopediaComponent,
        resolve: {
            encyclopedia: EncyclopediaResolveService
        }
    },
    {
        path: ':name',
        component: ArticleComponent,
        resolve: {
            article: ArticleResolveService,
        }
    }

] 
export const EncyclopediaRoutes = RouterModule.forChild(routes)