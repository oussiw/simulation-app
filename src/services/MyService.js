
class MyService{

    getAleaTab=(IX, IY, IZ)=>{
        let ix = IX;
        let iy = IY;
        let iz = IZ;
        let aleas = [];
        for(let i=0;i<100;i++){
            aleas.push(this.getAlea(ix,iy,iz).result);
            ix = this.getAlea(ix,iy,iz).IXModifie;
            iy = this.getAlea(ix,iy,iz).IYModifie;
            iz = this.getAlea(ix,iy,iz).IZModifie;
        }
        return aleas;
    }
    getAlea=(IX, IY, IZ)=>{
        let inter;
        IX = 171 * ( IX % 177 ) - 2 * ( IX/177 );
        IY = 172 * ( IY % 176 ) - 35 * ( IY/176 );
        IZ = 170 * ( IZ % 178 ) - 63 * ( IZ/178 );

        if ( IX < 0 ) {IX += 30269;}
        if ( IY < 0 ) {IY += 30307;}
        if ( IZ < 0 ) {IZ += 30323;}
        inter = ( ( IX / 30269) + ( IY / 30307) + ( IZ / 30323) );
        return ({
            result:(inter - Math.floor(inter)).toFixed(4),
            IXModifie: IX,
            IYModifie: IY,
            IZModifie: IZ
        });
    }

}
export default new MyService();
