import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ParkingStateComponent } from './pages/parking-state/parking-state.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardContainerComponent } from './pages/dashboard-container/dashboard-contaiiner.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { soloPublicoGuard } from './guards/solo-publico.guard';
import { soloAdminGuard } from './guards/solo-admin.guard';
import { soloLoggedGuard } from './guards/solo-logged.guard';
import { RegisterComponent } from './pages/register/register.component';
import { RatesComponent } from './pages/rates/rates.component';


export const routes: Routes = [
    {
        path: "",
        component: DashboardContainerComponent,
        canActivate: [soloLoggedGuard],
        children:[
            {
                path: "parking-state",
                component: ParkingStateComponent
            },
            {
                path: "rates",
                component: RatesComponent
            },
            {
                path: "reports",
                component: ReportsComponent,
                canActivate: [soloAdminGuard]
            },
        ]
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [soloPublicoGuard]
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [soloPublicoGuard]
    },
    {
        path: "not-found",
        component: NotFoundComponent
    },
    {
        path: "**",
        redirectTo: "not-found",
        pathMatch: "full"
    }
];
