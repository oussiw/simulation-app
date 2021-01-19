import '../indicators.js';

class MyService {

    calendar = [];
    H = 0;
    alea_tab= [];
    file = [];
    i = 1;
    LQ = 0;
    NCP = 0;
    NCE = 0;
    C1 = 0;
    C2 = 0;
    IX = 0;
    IY = 0;
    IZ = 0;

    getAleaTab = () => {
        for (let i = 0; i < 3; i++) {
            this.alea_tab.push(this.getAlea());
        }
    }

    getAlea = () => {
        let inter;
        let IX = 171 * (this.IX % 177) - 2 * (this.IX / 177);
        let IY = 172 * (this.IY % 176) - 35 * (this.IY / 176);
        let IZ = 170 * (this.IZ % 178) - 63 * (this.IZ / 178);
        if (IX < 0) {
            IX += 30269;
        }
        if (IY < 0) {
            IY += 30307;
        }
        if (IZ < 0) {
            IZ += 30323;
        }
        this.IX = IX;
        this.IY = IY;
        this.IZ = IZ;
        inter = ((IX / 30269) + (IY / 30307) + (IZ / 30323));
        return (inter - Math.floor(inter)).toFixed(4);
    }

    planifierEvenement = (ref, type, date) => {
        this.calendar.push({
            reference: ref,
            type: type,
            date: date
        });
    }

    selectionnerEvenement = ()=>{
        let theEvent = this.calendar[0];
        let atIndex=0;
        for(let i=0;i< this.calendar.length;i++){
            if(( this.calendar[i].date - this.H) < (theEvent.date - this.H)){
                theEvent = this.calendar[i];
            }
            else if((this.calendar[i].date - this.H) === (theEvent.date - this.H)){
                if(this.calendar[i].type==="A"){
                    theEvent = this.calendar[i];
                }
                else if(this.calendar[i].type==="FM" && theEvent.type==="FP"){
                    theEvent = this.calendar[i];
                }
            }
        }
        this.H = theEvent.date;
        this.calendar.splice(atIndex,1);
        return theEvent;
    }

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
    F2 = (alea)=>{
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


    // arrivée
    fonctionArrivee=(ref,alea)=>{
        if (this.LQ <= 1) {
            this.NCE++;
            this.planifierEvenement(ref, "FM", this.H + this.F2(alea.fm));
        }
        else { this.NCP++;}
        this.i++;
        console.log(this.H)
        let DA = this.H + this.F1(alea.a);
        if (DA <= 720) {
            this.planifierEvenement( this.i, "A", DA);
        }
    }

    // pour 2 caisses
    finMagasinage2 =(ref,alea)=>{
        if (this.C1 === 0 || this.C2 === 0) {
            if (this.C1 === 0) this.C2 = ref;
            else this.C2 = ref;
            this.planifierEvenement(ref, "FP",this.H + this.F3(alea.fp));
        } else {
            this.LQ = this.LQ + 1;
            this.file.push(ref);
        }
    }

    // pour 3 caisses
    // finMagasinage3=(ref,C1,C2,C3,LQ)=>{
    //     if (C1 == 0 || C2 == 0 || C3 == 0) {
    //         if (C1 == 0) C1 = ref;
    //         else if (C2 == 0) C2 = ref;
    //         else C3 = ref;
    //         this.planifierEvenement(ref, "FP", H + F3(alea));
    //
    //     } else {
    //         LQ = LQ + 1;
    //         this.insererfile(ref);
    //     }
    //
    // }

    // pour 2 caisses
    finPaiement2 = (ref,alea) => {
        if (this.LQ === 0) {
            if (this.C1 === ref) this.C1 = 0;
            else this.C2 = 0;
        }
        else {
            let J = this.file[0];
            this.file.shift(); // supprimer element
            this.LQ = this.LQ - 1;
            if (this.C1 === ref) this.C1 = J;
            else this.C2 = J;
            this.planifierEvenement(J, "FP", this.H + this.F3(alea));
        }
    }

    // pour 3 caisses
    // finPaiement3=(ref,LQ,C1,C2,C3,H)=>{
    //     var J;
    //     if (LQ = 0) {
    //         if (C1 == ref) C1 = 0;
    //         else if (C2 == ref) C2 = 0;
    //         else C3 = 0;
    //     }
    //     else {
    //         J = file[0];
    //         this.Supprimerfile(J);
    //         LQ = LQ - 1;
    //         if (C1 == ref) C1 = J;
    //         else if (C2 == ref) C2 = J;
    //         else C3 = J;
    //         this.planifierEvenement(J, "FP", H + this.F3(alea));
    //     }
    // }
    effetuerSimulation = (IX, IY, IZ) => {
        this.IX = IX;
        this.IY = IY;
        this.IZ = IZ;
        this.getAleaTab()
        let alea = this.findAlea(this.i);
        console.log(this.alea_tab)
        this.planifierEvenement(1,"A",this.F1(alea.a));
        this.H = this.F1(alea.a);
        let int = 0;

        console.log(this.calendar)
        console.log("Calendar")

        while (this.calendar.length!==0 && int <10){
            let selectedEvent = this.selectionnerEvenement();
            alea = this.findAlea(selectedEvent.reference);
            switch (selectedEvent.type) {
                case "A":
                    this.fonctionArrivee(selectedEvent.reference,alea);
                    break;
                case "FM":
                    this.finMagasinage2(selectedEvent.reference,alea);
                    break;
                case "FP":
                    this.finPaiement2(selectedEvent.reference,alea);
                    break;
            }
            // console.log({
            //     NCE:this.NCE,
            //     NCP:this.NCP,
            //     i:this.i,
            //     LQ:this.LQ,
            //     C1:this.C1,
            //     C2:this.C2,
            //     file:this.file
            // })
            int++;
        }
        return ({
            NCE:this.NCE,
            NCP:this.NCP,
            i:this.i,
            LQ:this.LQ,
            C1:this.C1,
            C2:this.C2,
            file:this.file
        })
    }

    findAlea =(reference_client)=>{
        let alea = {a:0,fm:0,fp:0};
        let indice_client = 0;
        for(let i=0; i < this.alea_tab.length; i++){
            if(i%3===0){
                indice_client = 1;
            }
            if(indice_client === reference_client){
                if(i%3===0) alea.a = this.alea_tab[i];
                else if(i%3===1) alea.fm = this.alea_tab[i];
                else if(i%3===2) {
                    alea.fp = this.alea_tab[i];
                    break;
                }
            }
        }
        return alea;
    }

}

export default new MyService();
