class friend{
    
    constructor(_name, _number){
        this.name = _name;
        this.number = _number;
    };

    report() {
        console.log(this.name, this.number);
    }
}
