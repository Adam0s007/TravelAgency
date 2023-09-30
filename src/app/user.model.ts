export interface Roles {
  banned: boolean;
  guest: boolean;
    client: boolean;
    manager: boolean;
    admin: boolean;

  }

export interface Info{
    boughtTours:[],
    myTrips: [],
    myTripsCounter: {},
    myBasketInfo: {
        "total":0,
        "quantity":0  
     },
     reservationCounter:0,
     rateList:{}

}

  
  export class User {
    email: string;
    roles: Roles;
    uid: string;
    info:Info;

    constructor(userData: any) {
      this.email = userData.email;
      this.uid = userData.uid;
      if (userData.roles != null) {
        this.roles = userData.roles;
      } else
        this.roles = {
          client: true,
          guest: true,
          manager: false,
          admin: false,
          banned: false,
        };
     if(userData.info != null){
        this.info = userData.info;
     } else{
        this.info = {
            boughtTours:[],
            myTrips: [],
            myTripsCounter: {},
            myBasketInfo: {
                "total":0,
                "quantity":0  
             },
            reservationCounter:0,
            rateList:{}
        }
     }
    }
  }