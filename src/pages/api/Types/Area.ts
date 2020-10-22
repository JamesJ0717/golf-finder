class Area {
  constructor(zip: Number, lat: Number, lng: Number, city: string, state: string) {
    this.zip = zip;
    this.lat = lat;
    this.lng = lng;
    this.city = city;
    this.state = state;
  }

  zip: Number;
  lat: Number;
  lng: Number;
  city: string;
  state: string;
}

export default Area;
