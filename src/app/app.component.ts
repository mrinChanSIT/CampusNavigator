import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  lat = 40.7427;
  lng = -74.0268;
  mockPathData = {

  }
  startNavigator : boolean = false;
  markerControl = new FormControl(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  markers = [
    {
      name: "Howe Center",
      lat: 40.7452,
      lng: -74.0239,
      // position: new google.maps.LatLng(40.7452, -74.0239),
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Library",
      lat: 40.7448,
      lng: -74.0253,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Castle Point",
      lat: 40.74451952688292, 
      lng: -74.02381387161087,
      map: this.map 
    },
    {
      name: "Wellness Center",
       
      lat: 40.74631850841689, 
      lng: -74.02490677910247,
      map: this.map 
    },
    {
      name: "Police Station",
      lat: 40.74352454914575, 
      lng: -74.02639713189986,
      map: this.map 
    },
    {
      name: "Police Station",
      lat: 40.74352454914575, 
      lng: -74.02639713189986,
      map: this.map 
    },
    {
      name: "UCC Center",
       
      lat: 40.74384925513569,
      lng: -74.02510202827337,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Walker Gym",
      lat: 40.7452,
      lng: -74.0239,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Kiddie hall",
       
      lat: 40.743655760461884,
      lng: -74.026230906516,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Babbio Center",
      lat: 40.7452,
      lng: -74.0239,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Burchard Hall",
       
      lat: 40.742885028160806,
      lng: -74.02734476169775,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Carnigae Hall",
       
      lat: 40.74287201994968,
      lng: -74.02786413154871,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Book Store",
       
      lat: 40.74477932256344,
      lng: -74.02360830338696,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Gateway South",
      lat: 40.743195598583235,
      lng:  -74.02765166205056,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Gateway North",
      lat: 40.74346226521448,
      lng:  -74.02754864655151,
      map: this.map,
      title: "Marker 1"
    }
  ];

  //Coordinates to set the center of the map
  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    scrollwheel: true,
    center: this.coordinates,
    zoom: 15
  };

  //Default Marker
  marker = new google.maps.Marker({
  });

  ds : google.maps.DirectionsService;
  dr : google.maps.DirectionsRenderer;


  ngOnInit() {

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map : null
    })

    navigator.geolocation.getCurrentPosition((position)=>{
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude;
    });
    
  }

  watchPos (){
    let destLat;
    let destlong;
    let selectedDestination = document.getElementById('selectedDestination').innerText;
    selectedDestination = selectedDestination.split('\t')[0];
    this.markers.forEach((dest)=>{
      if (dest.name === selectedDestination){
        destLat = dest.lat;
        destlong = dest.lng;
      }
    })
    
    let id = navigator.geolocation.watchPosition((position)=>{
    if(destLat === position.coords.latitude){
      navigator.geolocation.clearWatch(id);
      alert('location reached');
    }

    this.lat = position.coords.latitude
    this.lng = position.coords.longitude
    this.setMarkerCoOrds(selectedDestination)
    , {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }})
    
    
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    //Adding Click event to default marker
    this.marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: this.marker.getTitle()
      });
      infoWindow.open(this.marker.getMap(), this.marker);
    });

    //Adding default marker to map
    this.marker.setMap(this.map);

  }

  
  setMarkerCoOrds(coordsName){
    this.markers.forEach((marker)=>{
      if (coordsName === marker.name){
        this.putMarker(marker.lat, marker.lng);
      }
    })

  }

  putMarker(lat, lng){

    let dest = {
      lat : lat,
      lng: lng
    }
    this.coordinates = new google.maps.LatLng(lat, lng);
    this.marker = new google.maps.Marker({
    });
    this.setRouteLine(dest);
  }
  setRouteLine(dest){

    this.startNavigator = true;
    let origin = {
      lat : this.lat,
      lng: this.lng
    }
    let req = {
      origin : origin,
      destination: dest,
      travelMode : google.maps.TravelMode.WALKING

    }

    this.ds.route(req, (response, status) =>{
      this.dr.setOptions({
        suppressMarkers: false,
        map: this.map
      });
      if(status === google.maps.DirectionsStatus.OK){
        this.mockPathData = response.routes[0].overview_path.map((path)=>{
          return {lat: path.lat(), lng: path.lng()}
      })
        this.dr.setDirections(response);
      }
      console.log(this.mockPathData)
    });


    
    
  }
  isMenuOpened: boolean = false;

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void {
    this.isMenuOpened = false;
  }

  
}
