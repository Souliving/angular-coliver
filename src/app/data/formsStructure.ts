export interface AdShortForm {
    id: number,
    name: string,
    age: number,
    formId: number,
    userId: number,
    photoId: number,
    properties: Properties,
    city: City,
    district: District,
    metro: Subway[],
    onlineDateTime: Date,
    budget: number,
    description: string,
    dateMove: Date,
    photoUrl?: string;
}

export interface AdForm extends AdShortForm {
    userId: number,
    homeType: HomeType,
    socialMediaIds: [],
    rating: number,
    reviews: []
}

export interface NewForm {
  userId: number,
  description: string,
  homeTypesIds: [],
  rating: number,
  reviews: [],
  photoId: number,
  properties: NewFormProperties,
  cityId: number,
  metroIds: number[],
  budget: number,
  dateMove: Date,
  onlineDateTime: Date
}

export interface NewFormProperties{
  smoking: boolean,
  alcohol: boolean,
  petFriendly: boolean,
  isClean: boolean,
  homeOwnerId: number
}
export interface Properties extends NewFormProperties{
  id: number,
}

export interface Subway{
    id: number,
    name: string,
    cityId: number
}

  export interface City{
    id: number,
    name: string
  }

  export interface District{
    id: number,
    name: string,
    cityId: number
  }

  export interface HomeType{
    id: number,
    name: string
  }
