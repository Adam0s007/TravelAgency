import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TripItemComponent } from './tours/trip-item/trip-item.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReservationComponent } from './tours/trip-item/reservation/reservation.component';
import { ToursReservedComponent } from './tours/tours-reserved/tours-reserved.component';
import { RemoveItemComponent } from './tours/trip-item/remove-item/remove-item.component';
import { AddTourComponent } from './add-tour/add-tour.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RateTripComponent } from './tours/trip-item/rate-trip/rate-trip.component';
import { FilterPipe } from './filter.pipe';
import { BasketComponent } from './basket/basket.component';
import { ShortenPipe } from './tours/trip-item/shorten.pipe';
import { FilterTripsComponent } from './filter-trips/filter-trips.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HistoryComponent } from './history/history.component';
import { ToursComponent } from './tours/tours.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { PostsComponent } from './tour-details/posts/posts.component';
import { FilterHistoryPipe } from './history/filter-history.pipe';
import { FilterHistoryComponent } from './history/filter-history/filter-history.component';
import {AngularFireModule} from  '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { TripManagerComponent } from './trip-manager/trip-manager.component';
import { ModifyTripComponent } from './modify-trip/modify-trip.component';
import { IteratingObjectPipe } from './admin-view/iterating-object.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TripItemComponent,
    ReservationComponent,
    ToursReservedComponent,
    RemoveItemComponent,
    AddTourComponent,
    RateTripComponent,
    FilterPipe,
    BasketComponent,
    ShortenPipe,
    FilterTripsComponent,
    HomeComponent,
    NotFoundComponent,
    HistoryComponent,
    ToursComponent,
    TourDetailsComponent,
    PostsComponent,
    FilterHistoryPipe,
    FilterHistoryComponent,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
    AdminViewComponent,
    TripManagerComponent,
    ModifyTripComponent,
    IteratingObjectPipe,
    
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
