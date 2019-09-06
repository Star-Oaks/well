import { Routes, RouterModule } from "@angular/router";
import { NewsComponent } from './news/news.component';
import { OneNewsComponent } from './one-news/one-news.component';
import { NewsResolveService, NewsItemResolveService } from './news/news.service';

const routes: Routes = [
    {
        path: '',
        component: NewsComponent,
        resolve: {
            news: NewsResolveService
        }
    },
    {
        path: ':name',
        component: OneNewsComponent,
        resolve: {
            newsItem: NewsItemResolveService,
        }

    }
]
export const NewsRoutes = RouterModule.forChild(routes)