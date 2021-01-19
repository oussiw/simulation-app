class MyService {

    getAleaTab = (IX, IY, IZ) => {
        let ix = IX;
        let iy = IY;
        let iz = IZ;
        let aleas = [];
        for (let i = 0; i < 99; i++) {
            let temp = this.getAlea(ix, iy, iz);
            aleas.push(temp.result);
            ix = temp.IXModifie;
            iy = temp.IYModifie;
            iz = temp.IZModifie;
        }
        return aleas;
    }

    getAlea = (IX1, IY1, IZ1) => {
        let inter;
        let IX = 171 * (IX1 % 177) - 2 * (IX1 / 177);
        let IY = 172 * (IY1 % 176) - 35 * (IY1 / 176);
        let IZ = 170 * (IZ1 % 178) - 63 * (IZ1 / 178);

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

    planifierEvenement = (ref, type, date, calendar) => {
        calendar.events.push({
            reference: ref,
            type: type,
            date: date
        });
        return calendar;
    }

    getDateByType = (type, alea) => {
        switch (type) {
            case "A":
                return this.F1(alea);
            case "FM":
                return this.F2(alea);
            case "FP":
                return this.F3(alea);
        }
    }

    selectionnerEvenement = (calendar)=>{
        let theEvent = calendar.events[0];
        let atIndex=0;
        for(let i=0;i<calendar.events.length;i++){
            if((calendar.events[i].date - calendar.H) < (theEvent.date - calendar.H)){
                theEvent = calendar.events[i];
            }
            else if((calendar.events[i].date - calendar.H) === (theEvent.date - calendar.H)){
                if(calendar.events[i].type==="A"){
                    theEvent = calendar.events[i];
                }
                else if(calendar.events[i].type==="FM" && theEvent.type==="FP"){
                    theEvent = calendar.events[i];
                }
            }
        }
        calendar.H = theEvent.date;
        calendar.events.splice(atIndex,1);
        return ({event:theEvent,calendar:calendar});
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
    fonctionArrivee=(LQ,NCE,NCP,ref,i,calendar,alea)=>{
        let tempCalendar = calendar;
        if (LQ <= 1) {
            NCE++;
            tempCalendar =this.planifierEvenement(ref, "FM", calendar.H + this.F2(alea.fm), tempCalendar);
        }
        else { NCP++;}
        i++;
        let DA = calendar.H + this.F1(alea.a);
        let tempCalendar1 = tempCalendar;
        if (DA[i] <= 720) {
            tempCalendar1 = this.planifierEvenement(i, "A", DA, tempCalendar);
        }
        return({
            NCE:NCE,
            NCP:NCP,
            calendar:tempCalendar1,
            i:i}
        );
    }

    // pour 2 caisses
    finMagasinage2 =(C1,C2,LQ,ref,calendar,alea,file)=>{
        let tempCalendar = calendar
        if (C1 == 0 || C2 == 0) {
            if (C1 == 0) C2 = ref;
            else C2 = ref;
            tempCalendar = this.planifierEvenement(ref, "FP",calendar.H + this.F3(alea.fp),calendar);
        } else {
            LQ = LQ + 1;
            this.insererfile(ref,file);//retourner la file
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
    finPaiement2 = (LQ,C1,C2,ref,calendar,file,alea) => {
        if (LQ === 0) {
            if (C1 === ref) C1 = 0;
            else C2 = 0;
        }
        else {
            let J = file[0];
            this.supprimerfile(J,file);
            LQ = LQ - 1;
            if (C1 === ref) C1 = J;
            else C2 = J;
            this.planifierEvenement(J, "FP", calendar.H + this.F3(alea),calendar);
        }
        return ({
            C1:C1,
            C2:C2,
            LQ:LQ,
            file:file,
            calendar:calendar
        })
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

    effetuerSimulation = (nb_simulation, IX, IY, IZ, nb_caisses) => {
        let calendar = {
            events: [],
            H: 0
        }
        let file = [];
        let i = 1;
        let LQ = 0;
        let NCP = 0;
        let NCE = 0;
        let C1 = 0;
        let C2 = 0;

        let alea_tab = this.getAleaTab(IX,IY,IZ)
        let alea = this.findAlea(i,alea_tab);
        let tempCalendar = this.planifierEvenement(i,"A",this.F1(alea.a))
        calendar = tempCalendar;
        while (calendar.events.length!==0){
            let temporary = this.selectionnerEvenement(calendar);
            calendar = temporary.calendar;
            let selectedEvent = temporary.event;
            alea = this.findAlea(selectedEvent.reference,alea_tab);
            let temp;
            switch (selectedEvent.type) {
                case "A":
                    temp= this.fonctionArrivee(LQ,NCE,NCP,selectedEvent.reference,i,calendar,alea);
                    i = temp.i;
                    NCP = temp.NCP;
                    NCE = temp.NCE;
                    calendar = temp.calendar;
                    break;
                case "FM":
                    temp = this.finMagasinage2(C1,C2,LQ,selectedEvent.reference,calendar,alea);
                    C1 = temp.C1;
                    C2 = temp.C2;
                    LQ = temp.LQ;
                    file = temp.file;
                    calendar = temp.calendar;
                    break;
                case "FP":
                    temp = this.finPaiement2();
                    C1 = temp.C1;
                    C2 = temp.C2;
                    LQ = temp.LQ;
                    file = temp.file;
                    calendar = temp.calendar;
                    break;
            }
        }
    }

    findAlea =(reference_client,aleas_tab)=>{
        let alea = {a:0,fm:0,fp:0};
        let indice_client = 0;
        for(let i=0; i < aleas_tab.length; i++){
            if(i%3===0){
                indice_client = 1;
            }
            if(indice_client === reference_client){
                if(i%3===0) alea.a = aleas_tab[i];
                else if(i%3===1) alea.fm = aleas_tab[i];
                else if(i%3===2) {
                    alea.fp = aleas_tab[i];
                    break;
                }
            }
        }
        return alea;
    }

}

export default new MyService();
