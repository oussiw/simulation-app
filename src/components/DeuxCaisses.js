import React, {useState, Component} from "react"
import MyService from "../services/MyService";

class DeuxCaisses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            NCE: 0,
            NCP: 0,
            TSmy: 0,
            TATmoy: 0

        }
    }

    componentDidMount() {
        let temp = MyService.effetuerSimulation(240, 240, 240)
        this.setState({
            NCE: temp.NCE,
            NCP: temp.NCP,
            TSmy: temp.TSmy,
            TATmoy: temp.TATmoy
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
                    <tr>
                        <td className="text-center">1</td>
                        <td className="text-center">{this.state.NCE}</td>
                        <td className="text-center">{this.state.NCP}</td>
                        <td className="text-center">{this.state.TATmoy} min</td>
                        <td className="text-center">{this.state.TSmy} min</td>
                        <td className="text-center">0</td>
                        <td className="text-center">0</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default DeuxCaisses;
