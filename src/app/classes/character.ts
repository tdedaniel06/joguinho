export class Character {

  name : string;
  id : number;
  atk : number;
  int : number;
  vida : number;

  constructor(name: string, id: number, atk: number, int: number, vida: number){
    this.name = name;
    this.id = id;
    this.atk = atk;
    this.int = int;
    this.vida = vida;
  }
}
