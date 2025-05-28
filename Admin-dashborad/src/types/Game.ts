export interface Platform {
    id: number,
    name: string,
    slug: string
}

export interface ScreenShots {
    id: number,
    image: string
} 

export interface Genre {
    id: number,
    name:string,
    image_background: string
}
export interface Games {
    id: number,
    rawgId: string,
    name: string,
    background_image: string,
    parent_platforms: { platform: Platform }[],
    metacritic: number,
    rating: number; 
    updated: string; 
    short_screenshots: ScreenShots[]; 
    genres: Genre[];  
    released: string; 

    price?: number;
    rentalPrice?: number;
    stock?: number;
    availableForRent?: boolean;
}

export interface GameFromDB {
    rawgId: number;
    price: number;
    rentalPrice: number;
    stock: number;
    availableForRent: boolean;
    _id?: string;
  }
  

export interface GameDataForm {
  _id: string;
  rawgId: number;
  name: string;
  price: number;
  rentalPrice: number;
  stock: number;
  availableForRent: boolean;
};
