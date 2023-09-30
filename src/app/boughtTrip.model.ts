import { Wycieczki } from "./wycieczki.model";

export class BoughtTrip{
    constructor(
        public trip:Wycieczki = new Wycieczki(), 
        public tickets:number=0,
        public boughtDate:string="",
        public status:number = 0
        ){} 
}