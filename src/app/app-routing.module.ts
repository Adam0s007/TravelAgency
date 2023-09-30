import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddTourComponent } from "./add-tour/add-tour.component";
import { AdminViewComponent } from "./admin-view/admin-view.component";
import { AuthGuard } from "./guards/auth.guard";
import { BasketComponent } from "./basket/basket.component";
import { HistoryComponent } from "./history/history.component";
import { HomeComponent } from "./home/home.component";
import { LoggedUserGuard } from "./guards/logged-user.guard";
import { LoginComponent } from "./login/login.component";
import { ModifyTripComponent } from "./modify-trip/modify-trip.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RegisterComponent } from "./register/register.component";
import { TourDetailsComponent } from "./tour-details/tour-details.component";
import { ToursComponent } from "./tours/tours.component";
import { TripManagerComponent } from "./trip-manager/trip-manager.component";
import { TripManagerGuard } from "./guards/trip-manager.guard";
import { ClientGuard } from "./guards/client.guard";
import { AdminViewGuard } from "./guards/admin-view.guard";

const routes: Routes = [
  {path: '', redirectTo: 'home',pathMatch: 'full'},
  {path: 'home', component:HomeComponent},
  {path: 'tours', component:ToursComponent},
  {path:'tours/:id',component:TourDetailsComponent, canActivate: [AuthGuard]},
  {path:'trip-manager',component:TripManagerComponent, canActivate: [TripManagerGuard]},
  {path:'trip-manager/add-tour', component:AddTourComponent, canActivate: [TripManagerGuard]},
  {path: 'trip-manager/modify-trip',component:ModifyTripComponent, canActivate: [TripManagerGuard]},
  {path:'basket', component:BasketComponent, canActivate: [ClientGuard]},
  {path:'history', component:HistoryComponent, canActivate: [ClientGuard]},
  {path:'login',component:LoginComponent,canActivate: [LoggedUserGuard]},
  {path:'register',component:RegisterComponent,canActivate: [LoggedUserGuard]},
  {path:'admin-view',component:AdminViewComponent, canActivate: [AdminViewGuard]},
 
  {path:'not-found', component:NotFoundComponent},
  {path:'**', redirectTo:'/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
