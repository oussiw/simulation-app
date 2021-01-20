import React, {useState, Component} from "react"
import MyService from "../services/MyService";
import Charts from "./charts";

class TroisCaisses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            outputs:[],
            data:[],
            isChartHidden:true
        }
    }

    componentDidMount() {
        this.setState({
            outputs:MyService.effetuerSimulation3(this.props.nb,this.props.IX, this.props.IY, this.props.IZ)
        })

    }

    createMap =()=>{
        let list = []
        for(let i=0;i<this.state.outputs.length;i++){
            list.push({
                index:this.state.outputs[i].index+1,
                NCP:this.state.outputs[i].NCP,
            })
        }
        return list
    }

    render() {
        return (
            <div className="container">
                <span className="col-md-6 font-weight-bold" style={{fontSize:30}}>Simulation de trois caisses</span>
                <span className="col-md-6"> </span>
                <button className="btn btn-primary" onClick={()=>{
                    this.setState({isChartHidden:false,data:this.createMap()})
                }}>Dessiner graphe</button>
                <br/><br/>
                {!this.state.isChartHidden && <Charts max={3} color={"red"} title={"Simulation de trois caisses"}  data={this.state.data}/>}
                <hr/>
                <hr/>
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th className="text-center">Numero Simulation</th>
                        <th className="text-center">NCE</th>
                        <th className="text-center">NCP</th>
                        <th className="text-center">TATmoy</th>
                        <th className="text-center">TSmoy</th>
                        <th className="text-center">TauC1</th>
                        <th className="text-center">TauC2</th>
                        <th className="text-center">TauC3</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.outputs.map(output=>{

                        return(<tr>
                            <td className="text-center">{output.index+1}</td>
                            <td className="text-center">{output.NCE}</td>
                            <td className="text-center">{output.NCP}</td>
                            <td className="text-center">{output.TATmoy} min</td>
                            <td className="text-center">{output.TSmy} min</td>
                            <td className="text-center">{output.tauxC1.toFixed(2)}</td>
                            <td className="text-center">{output.tauxC2.toFixed(2)}</td>
                            <td className="text-center">{output.tauxC3.toFixed(2)}</td>
                        </tr>);
                    })}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default TroisCaisses;
