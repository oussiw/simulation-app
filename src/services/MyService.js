import '../indicators.js';

class MyService {
    getAleaTab = () => {
        for (let i = 0; i < 99; i++) {
            //global.C1 = global.C1+1
            //global.aleatab.tableau.push("Alea Tab")
            //console.log("Hello Calendar "+global.aleatab.tableau)
            global.aleatab.tableau.push(this.getAlea());
        }
    }

    getAlea = () => {
        let inter;
        let IX = 171 * (global.IX % 177) - 2 * (global.IX / 177);
        let IY = 172 * (global.IY % 176) - 35 * (global.IY / 176);
        let IZ = 170 * (global.IZ % 178) - 63 * (global.IZ / 178);

        if (IX < 0) {
            IX += 30269;
        }
        if (IY < 0) {
            IY += 30307;
        }
        if (IZ < 0) {
            IZ += 30323;
        }
        global.IX = IX;
        global.IY = IY;
        global.IZ = IZ;
        inter = ((IX / 30269) + (IY / 30307) + (IZ / 30323));
        return (inter - Math.floor(inter)).toFixed(4);
    }

    planifierEvenement = (ref, type, date) => {
        global.calendar.events.push({
            reference: ref,
            type: type,
            date: date
        });
    }

    // getDateByType = (type, alea) => {
    //     switch (type) {
    //         case "A":
    //             return this.F1(alea);
    //         case "FM":
    //             return this.F2(alea);
    //         case "FP":
    //             return this.F3(alea);
    //     }
    // }

    selectionnerEvenement = ()=>{
        let theEvent = global.calendar.events[0];
        let atIndex=0;
        for(let i=0;i< global.calendar.events.length;i++){
            if(( global.calendar.events[i].date - global.calendar.H) < (theEvent.date - global.calendar.H)){
                theEvent = global.calendar.events[i];
            }
            else if((global.calendar.events[i].date - global.calendar.H) === (theEvent.date - global.calendar.H)){
                if(global.calendar.events[i].type==="A"){
                    theEvent = global.calendar.events[i];
                }
                else if(global.calendar.events[i].type==="FM" && theEvent.type==="FP"){
                    theEvent = global.calendar.events[i];
                }
            }
        }
        global.calendar.H = theEvent.date;
        global.calendar.events.splice(atIndex,1);
        return theEvent
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
        if (global.LQ <= 1) {
            global.NCE++;
            this.planifierEvenement(ref, "FM", global.calendar.H + this.F2(alea.fm));
        }
        else { global.NCP++;}
        global.i++;
        let DA = global.calendar.H + this.F1(alea.a);
        if (DA[global.i] <= 720) {
            this.planifierEvenement(global.i, "A", DA);
        }
    }

    // pour 2 caisses
    finMagasinage2 =(C1,C2,LQ,ref,calendar,alea,file)=>{
        let tempCalendar = calendar
        if (C1 === 0 || C2 === 0) {
            if (C1 === 0) C2 = ref;
            else C2 = ref;
            tempCalendar = this.planifierEvenement(ref, "FP",calendar.H + this.F3(alea.fp),calendar);
        } else {
            LQ = LQ + 1;
            file.push(ref);
            //this.insererfile(ref,file);//retourner la file push
        }
        return ({
            C1:C1,
            C2:C2,
            LQ:LQ,
            calendar:tempCalendar,
            file:file
        });
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
        if (global.LQ === 0) {
            if (global.C1 === ref) global.C1 = 0;
            else global.C2 = 0;
        }
        else {
            let J = global.file[0];
            global.file.shift(); // supprimer element
            global.LQ = global.LQ - 1;
            if (global.C1 === ref) global.C1 = J;
            else global.C2 = J;
            this.planifierEvenement(J, "FP", global.calendar.H + this.F3(alea));
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
    effetuerSimulation = (nb_simulation, IX, IY, IZ) => {
        console.log(this.getAleaTab(IX,IY,IZ))
        //global.aleatab.tableau = this.getAleaTab(IX,IY,IZ)
        console.log("Change here "+global.aleatab.tableau)
        let alea = this.findAlea(global.i);
        this.planifierEvenement(global.i,"A",this.F1(alea.a));
        global.calendar.H = this.F1(alea.a);

        while (global.calendar.events.length!==0){
            let selectedEvent = this.selectionnerEvenement();;
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
        }

        return ({
            NCE:global.NCE,
            NCP:global.NCP,
            i:global.i,
            LQ:global.LQ,
            C1:global.C1,
            C2:global.C2,
            file:global.file
        })
    }

    findAlea =(reference_client)=>{
        let alea = {a:0,fm:0,fp:0};
        let indice_client = 0;
        console.log("Tableau "+global.aleatab.nothing)
        let length = global.aleatab.tableau.length
        for(let i=0; i < length; i++){
            if(i%3===0){
                indice_client = 1;
            }
            if(indice_client === reference_client){
                if(i%3===0) alea.a = global.aleatab.tableau[i];
                else if(i%3===1) alea.fm = global.aleatab.tableau[i];
                else if(i%3===2) {
                    alea.fp = global.aleatab.tableau[i];
                    break;
                }
            }
        }
        return alea;
    }

}

export default new MyService();
