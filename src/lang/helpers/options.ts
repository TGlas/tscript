export class Options{
    public checkstyle:boolean = false;
    public maxstacksize:number = 10000;

    public constructor(){}
}

export const defaultOptions = new Options();