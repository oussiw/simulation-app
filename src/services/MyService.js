class MyService {
    calendar={
        events:[],
        H:0,
        index:0
    };
    getAleaTab = (IX, IY, IZ) => {
        let ix = IX;
        let iy = IY;
        let iz = IZ;
        let aleas = [];
        for (let i = 0; i < 100; i++) {
            aleas.push(this.getAlea(ix, iy, iz).result);
            ix = this.getAlea(ix, iy, iz).IXModifie;
            iy = this.getAlea(ix, iy, iz).IYModifie;
            iz = this.getAlea(ix, iy, iz).IZModifie;
        }
        return aleas;
    }

    getAlea = (IX, IY, IZ) => {
        let inter;
        IX = 171 * (IX % 177) - 2 * (IX / 177);
        IY = 172 * (IY % 176) - 35 * (IY / 176);
        IZ = 170 * (IZ % 178) - 63 * (IZ / 178);

        if (IX < 0) {
            IX += 30269;
        }
        if (IY < 0) {
            IY += 30307;
        }
        if (IZ < 0) {
            IZ += 30323;
        }
        inter = ((IX / 30269) + (IY / 30307) + (IZ / 30323));
        return ({
            result: (inter - Math.floor(inter)).toFixed(4),
            IXModifie: IX,
            IYModifie: IY,
            IZModifie: IZ
        });
    }

    planifier_evenement = (ref, type, alea) => {
        if(this.calendar.events.length===0){
            this.calendar.H = this.selectionner_evenement(type,alea);
            this.calendar.events.push({reference: ref, type: type, date: this.selectionner_evenement(type,alea)});
        }
        else{
            this.calendar.H += this.selectionner_evenement(type,alea);
            this.calendar.events.push({reference: ref, type: type, date: this.selectionner_evenement(type,alea)});
        }

    }
    selectionner_evenement = (type, alea) => {
        switch (type) {
            case "A":
                return this.F1(alea);
            case "FM":
                return this.F2(alea);
            case "FP":
                return this.F3(alea);
        }
    }

    // selectionner_evenement = (ref, type, alea) => {
    //     switch (type) {
    //         case "A":
    //
    //             break;
    //         case "FM":
    //
    //             break;
    //         case "FP":
    //
    //             break;
    //     }
    // }

    // temps d'arrivée
    F1 = (alea) => {
        if (alea >= 0 && alea < 0.3) return 1;
        if (alea >= 0.3 && alea <= 0.8) return 2;
        if (alea > 0.8 && alea <= 0.9) return 3;
        if (alea > 0.9 && alea <= 0.95) return 4;
        if (alea > 0.95 && alea <= 0.98) return 5;
        if (alea > 0.98 && alea <= 1) return 6;
    }

    // temps de magasinage
    F2(alea) {
        if (alea >= 0 && alea < 0.1) return 2;
        if (alea >= 0.1 && alea < 0.3) return 4;
        if (alea >= 0.3 && alea <= 0.7) return 6;
        if (alea > 0.7 && alea <= 0.9) return 8;
        if (alea > 0.9 && alea <= 1) return 10;
    }

    // temps passé à la caisse
    F3 = (alea) => {
        if (alea >= 0 && alea < 0.2) return 1;
        if (alea >= 0.2 && alea <= 0.6) return 2;
        if (alea > 0.6 && alea <= 0.85) return 3;
        if (alea > 0.85 && alea <= 1) return 4;
    }

    arrivee=()=>{

    }

    fin_magasinage=()=>{

    }

    fin_paiement=()=>{

    }
// arrivée
    var H = 0;
    var LQ = 0;
    var NCE = 0;
    var NCP = 0; 
    function fonctionArrivee(ref){
    
    var i = 1; 
    //Traitement de l’arrivée sélectionnée dans le calendrier
    if (LQ <= 1) {
        //client entre et commence magasinage
        NCE++;
        //planifier un événement Fin Magasinage dans le calendrier *)
        planifier_evt(ref,"FM", H+F2(alea));
    }
    else {
        //client perdu 
        NCP++;
    }
    //arrivée client suivant
    i++; 
    DA = H + F1(alea);
    if ( DA[i] <= 720) { //l’arrivée se fait à temps
        //planifier un événement arrivée dans le calendrier
        planifier_evt(i,"A",DA);
    }
}


// pour 2 caisses
Fin-magasinage2 ( ref ) {
    
    if(C1 == 0 || C2== 0)
    {
      if(C1 == 0) C2 = ref;
      else C2 = ref;
      Planifier-evt ( ref , "FP" , H + F3(alea) );

    }
    else {
       LQ = LQ + 1;
       Insererfile (ref);
    }
    
}

// pour 3 caisses

Fin-magasinage3 ( ref ) {
    
    if(C1 == 0 || C2 == 0 || C3 ==0)
    {
      if(C1 == 0) C1 = ref;
      else if (C2 == 0) C2 = ref;
      else C3 = ref;
      Planifier-evt ( ref , "FP" , H + F3(alea) );

    }
    else {
       LQ = LQ + 1;
       Insererfile (ref);
    }
    
}
// pour 2 caisses
 Fin-paiement2(ref) {
   int J;
   if (LQ = 0) {
     if(C1 == ref) C1 =0;
     else C2=0;
   }
   else {
     J= file[0];
     Supprimerfile(J);
     LQ = LQ -1;
     if(C1 == ref) C1 = J;
     else C2 = J;
     Planifier-evt ( J , "FP" , H + F3(alea) )  ;   
   }
 }



 
// pour 3 caisses

  Fin-paiement3(ref) {
   var J;
   if (LQ = 0) {
     if(C1 == ref) C1 =0;
     else if(C2 == ref) C2=0;
     else C3 = 0;
   }
   eles {
     J= file[0];
     Supprimerfile(J);
     LQ = LQ -1;
     if(C1 == ref) C1 = J;
     else if(C2 == ref) C2 = J;
     else C3 = J;
     Planifier-evt ( J , "FP" , H + F3(alea) ) ;   
   }
 }

}

export default new MyService();
