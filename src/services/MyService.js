class MyService {

    getAleaTab = (IX1, IY1, IZ1) => {
        let tableau = [];
        let IX = IX1;
        let IY = IY1;
        let IZ = IZ1;
        for (let i = 0; i < 3000; i++) {
            let temp = this.getAlea(IX, IY, IZ);
            tableau.push(temp.result);
            IX = temp.IXModifie;
            IY = temp.IYModifie;
            IZ = temp.IZModifie;
        }
        return tableau;
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
        calendar.push({
            reference: ref,
            type: type,
            date: date
        });
        return calendar;
    }

    selectionnerEvenement = (calendar, H) => {
        let theEvent = calendar[0];
        let atIndex = 0;
        for (let i = 0; i < calendar.length; i++) {
            if ((calendar[i].date - H) < (theEvent.date - H)) {
                theEvent = calendar[i];
                atIndex = i;
            } else if ((calendar[i].date - H) === (theEvent.date - H)) {
                if (calendar[i].type === "A") {
                    theEvent = calendar[i];
                    atIndex = i;
                } else if (calendar[i].type === "FM" && (theEvent.type === "FM" || theEvent.type === "FP")) {
                    theEvent = calendar[i];
                    atIndex = i;
                } else if (calendar[i].type === "FM" && theEvent.type === "FP"){
                    theEvent = calendar[i];
                    atIndex = i;
                }
            }
        }
        H = theEvent.date;
        let tempCalendar;
        if (atIndex === 0) tempCalendar = calendar.slice(1, calendar.length);
        else if (atIndex === calendar.length - 1) tempCalendar = calendar.slice(0, calendar.length - 1);
        else {
            tempCalendar = calendar.slice(0, atIndex).concat(calendar.slice(atIndex + 1, calendar.length))
        }
        return ({selectedEvent: theEvent, calendar: tempCalendar, H: H});
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
    F2 = (alea) => {
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
    fonctionArrivee = (LQ, NCE, NCP, ref, alea1, i, alea_tab, calendar, H, list) => {
        let tempCalendar1 = calendar;
        if (LQ <= 1) {
            NCE++;
            tempCalendar1 = this.planifierEvenement(ref, "FM", H + this.F2(alea1.fm), calendar);
        } else {
            NCP++;
        }
        i++;
        let DA = H + this.F1(this.findAlea(i, alea_tab).a);
        let thisList = [ref, DA];
        list.push(thisList)
        let tempCalendar2 = tempCalendar1;
        if (DA <= 720) {
            tempCalendar2 = this.planifierEvenement(i, "A", DA, tempCalendar1);
        }
        return ({
            LQ: LQ,
            calendar: tempCalendar2,
            NCE: NCE,
            NCP: NCP,
            i: i,
            list: list
        })
    }

    // pour 2 caisses
    finMagasinage2 = (C1, C2, LQ, ref, calendar, alea, file, H, list) => {
        let tempCalendar = calendar
        if (C1 === 0 || C2 === 0) {
            if (C1 === 0) C1 = ref;
            else C2 = ref;
            tempCalendar = this.planifierEvenement(ref, "FP", H + this.F3(alea.fp), calendar);
        } else {
            LQ = LQ + 1;
            file.push(ref);
        }
        let DEQ = H;
        list[ref - 1].push(DEQ);
        return ({
            C1: C1,
            C2: C2,
            LQ: LQ,
            calendar: tempCalendar,
            file: file,
            list: list
        });
    }

    // pour 3 caisses
    finMagasinage3=(C1, C2, C3, LQ, ref, calendar, alea, file, H, list)=>{
        let tempCalendar = calendar;
        if (C1 === 0 || C2 === 0 || C3 === 0) {
            if (C1 === 0) C1 = ref;
            else if (C2 === 0) C2 = ref;
            else C3 = ref;
            tempCalendar = this.planifierEvenement(ref, "FP", H + this.F3(alea.fp), calendar);
        }
        else {
            LQ = LQ + 1;
            file.push(ref);
        }
        let DEQ = H;
        list[ref - 1].push(DEQ);
        return ({
            C1: C1,
            C2: C2,
            C3: C3,
            LQ: LQ,
            calendar: tempCalendar,
            file: file,
            list: list
        });
    }

    // pour 2 caisses
    finPaiement2 = (C1, C2, LQ, ref, calendar, alea, file, H, list) => {
        let tempCalendar = calendar
        if (LQ === 0) {
            console.log("C1: "+C1);
            console.log("C2: "+C2)
            if (C1 === ref) C1 = 0;
            else C2 = 0;
        } else {
            console.log("LQ: "+LQ)
            let J = file[0];
            file.shift();
            LQ = LQ - 1;
            if (C1 === ref) C1 = J;
            else C2 = J;
            let DP = H;
            list[ref - 1].push(DP) // ajouter Date de fin de paiement
            list[J-1].push(H);
            let v = J-1
            tempCalendar = this.planifierEvenement(J, "FP", H + this.F3(alea.fp), calendar);
        }
        return ({
            C1: C1,
            C2: C2,
            LQ: LQ,
            calendar: tempCalendar,
            file: file,
            list: list
        })
    }

    // pour 3 caisses
    finPaiement3 = (C1, C2, C3, LQ, ref, calendar, alea, file, H, list) => {
        let tempCalendar = calendar;
        if (LQ === 0) {
            if (C1 === ref) C1 = 0;
            else if (C2 === ref) C2 = 0;
            else C3 = 0;
        }
        else {
            let J = file[0];
            file.shift();
            LQ = LQ - 1;
            if (C1 === ref) C1 = J;
            else if (C2 === ref) C2 = J;
            else C3 = J;
            let DP = H;
            list[ref - 1].push(DP) // ajouter Date de fin de paiement
            list[J-1].push(H);
            tempCalendar = this.planifierEvenement(J, "FP", H + this.F3(alea.fp), calendar);
        }
        return ({
            C1: C1,
            C2: C2,
            C3: C3,
            LQ: LQ,
            calendar: tempCalendar,
            file: file,
            list: list
        })
    }

    effetuerSimulation = (IX, IY, IZ) => {
        let calendar = []
        let H = 0;
        let file = [];
        let alea_tab = [];
        let i = 1;//ref
        let LQ = 0;
        let NCP = 0;
        let NCE = 0;
        let C1 = 0;
        let C2 = 0;
        let C3 = 0;
        let list = [];
        alea_tab = this.getAleaTab(IX, IY, IZ);
        let alea = this.findAlea(i, alea_tab);
        calendar = this.planifierEvenement(i, "A", this.F1(alea.a), calendar);
        H = this.F1(alea.a);
        // let int = 0;
        while (calendar.length !== 0) {
            let temporary = this.selectionnerEvenement(calendar, H);
            let selectedEvent = temporary.selectedEvent;
            console.log("Event:")
            console.log(selectedEvent);
            calendar = temporary.calendar;
            console.log("Calendar:")
            console.log(calendar);
            H = temporary.H;
            alea = this.findAlea(selectedEvent.reference, alea_tab);
            // console.log("Alea:")
            // console.log(alea)
            let temp;
            switch (selectedEvent.type) {
                case "A":
                    // console.log("A")
                    temp = this.fonctionArrivee(LQ, NCE, NCP, selectedEvent.reference, alea, i, alea_tab, calendar, H, list);
                    LQ = temp.LQ;
                    calendar = temp.calendar;
                    NCE = temp.NCE;
                    NCP = temp.NCP;
                    list = temp.list
                    i = temp.i;
                    break;
                case "FM":
                    // console.log("FM");
                    //temp = this.finMagasinage2(C1, C2, LQ, selectedEvent.reference, calendar, alea, file, H, list);
                    temp = this.finMagasinage3(C1, C2,C3, LQ, selectedEvent.reference, calendar, alea, file, H, list);
                    LQ = temp.LQ;
                    calendar = temp.calendar;
                    C1 = temp.C1;
                    C2 = temp.C2;
                    C3 = temp.C3;
                    file = temp.file;
                    list = temp.list
                    break;
                case "FP":
                    // console.log("FP")
                    //temp = this.finPaiement2(C1, C2, LQ, selectedEvent.reference, calendar, alea, file, H, list);
                    temp = this.finPaiement3(C1, C2, C3, LQ, selectedEvent.reference, calendar, alea, file, H, list);
                    LQ = temp.LQ;
                    calendar = temp.calendar;
                    C1 = temp.C1;
                    C2 = temp.C2;
                    C3 = temp.C3;
                    file = temp.file;
                    list = temp.list;
                    break;
            }
            // int++;
        }
        let TSmy =this.calculerTSmoy(list, NCE);
        let TATmoy = this.fonctionTATmoy(list)

        return ({
            NCE: NCE,
            NCP: NCP,
            TSmy:TSmy,
            TATmoy:TATmoy
        })
    }

    findAlea = (reference_client, aleas_tab) => {
        let alea = {
            a: 0,
            fm: 0,
            fp: 0
        };
        let indice_client = 0;
        for (let i = 0; i < aleas_tab.length; i++) {
            if (i % 3 === 0) {
                indice_client += 1;
            }
            if (indice_client === reference_client) {
                if (i % 3 === 0) alea.a = aleas_tab[i];
                else if (i % 3 === 1) alea.fm = aleas_tab[i];
                else if (i % 3 === 2) {
                    alea.fp = aleas_tab[i];
                    break;
                }
            }
        }
        return alea;
    }

    calculerTSmoy = (list, NCE) => {
        let s = 15;
        let cpt = 0
        list.map(e => {
            if (!isNaN(e[3]) && !isNaN(e[2])) {
                //console.log(e)
                s = s + (e[3] - e[1])
                cpt++;
            }
        })
        return Math.floor(s / cpt);
        //console.log("Temps de sejour moyen " + Math.floor(s / cpt) + " min");
        //return Math.floor(s / 6);
    }

    fonctionTATmoy = (list) => {
        let s = 0;
        let cpt = 0;
        list.map(e=>{
            // console.log(e)
            if(!isNaN(e[2]) && !isNaN(e[4])){
                // console.log("e "+e)
                s = s + (e[4]-e[2])
                cpt++;
            }
        })
        return Math.floor(s/cpt);
        //console.log("Temps d'attente moyen "+ Math.floor(s/cpt))
    }

    fonctionTauC1 =()=>{

    }

}

export default new MyService();
