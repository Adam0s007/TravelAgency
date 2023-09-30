export class Filter{
    constructor(
        public filteredName = '',
        public filteredDestination = '',
        public filteredMinPrice:number|null = null,
        public filteredMaxPrice:number|null = null,
        public filteredStartDate:string = '',
        public filteredEndDate:string = '',
        public filteredRate:number|null= null,
        public checkingVacancies = false,
        public stars:Array<number> = [],
        public locations:Array<string> = [],
        public flagsStatus:Array<boolean> = []
        ){} 
}