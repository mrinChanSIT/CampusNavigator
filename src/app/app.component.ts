import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from "@angular/core";
// import { stat } from "fs";

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
      name: "UCC Center",
      lat: 40.7452,
      lng: -74.0239,
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
      lat: 40.7452,
      lng: -74.0239,
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
      lat: 40.7452,
      lng: -74.0239,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Carnigae Hall",
      lat: 40.7452,
      lng: -74.0239,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Gateway South",
      lat: 40.7452,
      lng: -74.0239,
      map: this.map,
      title: "Marker 1"
    },
    {
      name: "Gateway North",
      lat: 40.7452,
      lng: -74.0239,
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
    position: this.coordinates,
    map: this.map,
    title: "Hello World!"
  });

  ds : google.maps.DirectionsService;
  dr : google.maps.DirectionsRenderer;


  ngOnInit() {

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map : null
    })

    console.log('inside oniniit')
    if(navigator.geolocation){
      console.log('locl  supported')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log(`lat: ${position.coords.latitude}, lng: ${position.coords.longitude}`);
    });
  }

  watchPos (){
    let destLat = 0;
    let destlong = 0;
    let id = navigator.geolocation.watchPosition((position)=>{
    console.log(`lat: ${position.coords.latitude}, lng: ${position.coords.longitude}`);
    if(destLat === position.coords.latitude){
      navigator.geolocation.clearWatch(id);
      alert('location reached');
    }

    }, (err)=>{
      console.log(err)
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
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

    //Adding other markers
    // this.loadAllMarkers();
  }

  
  setMarkerCoOrds(coordsName){
    console.log(coordsName);
    this.markers.forEach((marker)=>{
      if (coordsName === marker.name){
        console.log('marked here', marker.name)
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
      position: this.coordinates,
      map: this.map,
      title: "Hello World!"
    });
    this.setRouteLine(dest);
  }

  setRouteLine(dest){
    let origin = {
      lat : this.lat,
      lng: this.lng
    }
    let req = {
      origin : origin,
      destination: dest,
      travelMode : google.maps.TravelMode.TRANSIT

    }

    this.ds.route(req, (response, status) =>{
      this.dr.setOptions({
        suppressMarkers: false,
        map: this.map
      });
      if(status === google.maps.DirectionsStatus.OK){
        this.dr.setDirections(response);
      }
    });

    
  }
  
  
}
