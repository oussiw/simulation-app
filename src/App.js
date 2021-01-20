import React, {Component} from "react"
import './App.css';
import {useState} from "react"
import DeuxCaisses from "./components/DeuxCaisses";
import TroisCaisses from "./components/TroisCaisses";
import MyService from "./services/MyService";
import "./indicators"

class App extends Component {
    constructor() {
        super();
        this.state = {
            deuxCaissesHidden: true,
            troisCaissesHidden: true,
            IX: 0,
            IY: 0,
            IZ: 0,
            nb: 0
        }
    }
    onChangeHandler=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    render() {
        return (
            <div className="container">
                <h3>Simulation - App</h3>
                <hr/>
                <div className="form-row">
                    <div className="form-group">
                        <label for="nb">Nombre de simulations:</label>
                        <input className="form form-control col-md-11" id="nb" placeholder="Nbr" name="nb"
                               onChange={this.onChangeHandler} required/>
                    </div>
                    <div className="form-group">
                        <label for="ix">IX:</label>
                        <input className="form form-control col-md-11" id="ix" placeholder="IX" name="IX"
                               onChange={this.onChangeHandler} required/>
                    </div>
                    <div className="form-group">
                        <label for="iy">IY:</label>
                        <input className="form form-control col-md-11" id="iy" placeholder="IY" name="IY"
                               onChange={ this.onChangeHandler} required/>
                    </div>
                    <div className="form-group">
                        <label for="iz">IZ:</label>
                        <input className="form form-control col-md-11" id="iz" placeholder="IZ" name="IZ"
                               onChange={ this.onChangeHandler} required/>
                    </div>
                </div>
                <button className="btn btn-outline-dark col-md-3"
                        onClick={() => {
                            if(!this.state.troisCaissesHidden){
                                this.setState(
                                    {
                                        troisCaissesHidden:!this.state.troisCaissesHidden
                                    }
                                )
                            }
                            this.setState({
                                deuxCaissesHidden: !this.state.deuxCaissesHidden
                            })
                        }}>Simuler deux caisses
                </button>

                <span className="col-md-1"></span>
                <button className="btn btn-outline-dark col-md-3"
                        onClick={() => {
                            if(!this.state.deuxCaissesHidden){
                                this.setState({
                                    deuxCaissesHidden: !this.state.deuxCaissesHidden
                                })
                            }
                            this.setState({
                                troisCaissesHidden:!this.state.troisCaissesHidden
                            })
                        }}>Simuler trois caisses
                </button>
                <br/>
                <hr/>
                {!this.state.deuxCaissesHidden && <DeuxCaisses IX={this.state.IX} IY={this.state.IY} IZ={this.state.IZ} nb={this.state.nb}/>}
                {!this.state.troisCaissesHidden && <TroisCaisses IX={this.state.IX} IY={this.state.IY} IZ={this.state.IZ} nb={this.state.nb}/>}

            </div>
        );
    }


}

export default App;
