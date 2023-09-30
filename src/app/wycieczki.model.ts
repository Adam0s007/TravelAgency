export class Wycieczki{
    constructor(
        public name:string='', 
        public destination: string='',
        public startDate:string='',
        public endDate= "",
        public unitPrice= 0,
        public maxPeople =0,
        public description= "",
        public picture="",
        public forSlider:[]=[]
        ){} 
}