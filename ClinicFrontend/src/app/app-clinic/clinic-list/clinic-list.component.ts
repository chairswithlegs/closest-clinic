//Ng CORE
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Ng MATERIAL
import { PageEvent } from '@angular/material/paginator';

//RXJS
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

//COMPONENTS AND DIRECTIVES
import { ClinicMapComponent } from '../clinic-map/clinic-map.component';

//SERVICES
import { ClinicService } from '../../app-api/clinic.service';

//TYPES
import { Clinic } from '../../app-api/clinic';
import { Coords } from '../../app-api/coords';


@Component({
	selector: 'app-clinic-list',
	templateUrl: './clinic-list.component.html',
	styleUrls: ['./clinic-list.component.css']
})
export class ClinicListComponent implements OnInit, OnDestroy {
	clinics: Clinic[];
	mapCenter: Coords = { lat: 43.5, lng: -70.4 };
	
	//Used to display list
	resultsPerPage = 7;
	pageStart = 0;
	pageEnd = this.resultsPerPage;
	
	//Used to manage the api subscription lifetime (see ngOnInit and ngOnDestroy)
	private clinicsSubscription: Subscription;
	
	constructor(private clinicService: ClinicService, private router: Router) {}
	
	ngOnInit() {
		//Subscribe to the clinic service. Alert the user if the api can't be reached.
		this.clinicsSubscription = this.clinicService.clinicsObservable
		.subscribe((clinics) => this.clinics = clinics);
	}
	
	ngOnDestroy() {
		//Mitigate memory leaks by unsubscribing
		this.clinicsSubscription.unsubscribe();
	}
	
	//Update list in response to Paginator events
	updatePageRange(pageEvent: PageEvent) {
		this.pageStart = pageEvent.pageIndex * this.resultsPerPage;
		this.pageEnd = this.pageStart + this.resultsPerPage;
	}
	
	//Callback used by the template for marker clicks
	onClinicClick(clinic: Clinic) {
		this.router.navigateByUrl(`clinics/${clinic.id.toString()}`);
	}
}
