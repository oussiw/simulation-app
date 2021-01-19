import './App.css';
import {useState} from "react"
import DeuxCaisses from "./components/DeuxCaisses";
import TroisCaisses from "./components/TroisCaisses";
import MyService from "./services/MyService";

function App() {

  const [deuxCaissesHidden,setDeuxCaissesHidden] = useState(true)
  const [troisCaissesHidden,setTroisCaissesHidden] = useState(true)

  return (
    <div className="container">
      <h3>Simulation - App</h3><hr/>
      <button className="btn btn-outline-dark col-md-3"
              onClick={()=>{setDeuxCaissesHidden(!deuxCaissesHidden);
                            console.log(MyService.effetuerSimulation(1,240,240,240))}
              }>Simuler deux caisses</button>
      <span className="col-md-1"></span>
      <button className="btn btn-outline-dark col-md-3"
              onClick={()=>setTroisCaissesHidden(!troisCaissesHidden)}>Simuler trois caisses</button><br/><hr/>
      {!deuxCaissesHidden && <DeuxCaisses/>}
      {!troisCaissesHidden && <TroisCaisses/>}
    </div>
  );
}

export default App;
