
class MyService{

    getAleaTab=(IX, IY, IZ)=>{
        let ix

    }
    getAlea=(IX, IY, IZ)=>{
        let inter;
        IX = 171 * ( IX % 177 ) - 2 * ( IX/177 );
        IY = 172 * ( IY % 176 ) - 35 * ( IY/176 );
        IZ = 170 * ( IZ % 178 ) - 63 * ( IZ/178 );

        if ( IX < 0 ) {IX += 30269;}
        if ( IY < 0 ) {IY += 30307;}
        if ( IZ < 0 ) {IZ += 30323;}
        inter = ( ( IX / 30269. ) + ( IY / 30307. ) + ( IZ / 30323. ) ) ;
        return ({
        result:(inter - floor(inter)),
    });
    }

}
export default MyService;
