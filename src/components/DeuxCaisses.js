import React, {useState, Component} from "react"
import MyService from "../services/MyService";

class DeuxCaisses extends Component {

    constructor(props) {
        super(props);
        this.state = {
           outputs:[]
        }
    }

    componentDidMount() {
        this.setState({
            outputs:MyService.effetuerSimulation2(2,240, 240, 240)
        })

    }

    render() {
        return (
            <div className="container">
                <h4>Simulation de deux caisses</h4>
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
                            <td className="text-center">0</td>
                            <td className="text-center">0</td>
                        </tr>);
                    })}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default DeuxCaisses;
