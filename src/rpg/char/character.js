class Character {
    constructor({name, job, hp, str, dex, int, stlth, spd} = thisCharacter){
        this.name = name;
        this.job = job;     // Class
        this.lvl = 1;
        this.hp = hp;
        this.str = str;
        this.dex = dex;
        this.int = int;     // Javascript isn't typed lul
        this.stlth = stlth;
        this.spd = spd;
        const inv = new Inventory();
    }

    levelUp(){}
    equip(){}
    unequip(){}
}