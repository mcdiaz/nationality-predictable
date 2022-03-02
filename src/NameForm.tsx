import React from 'react';
import {Input} from "@mui/material";
import {Col, Container, Row} from "react-bootstrap";

interface IProps {
}

interface IState {
    valueName: string;
    countries: any[];
    codCountries: any[];
}

export class NameForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            valueName: '',
            countries: [],
            codCountries: [],

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any) {
        this.setState({valueName: event.target.value});
    }

    handleSubmit(event: any) {
        alert('Se ha guardado el nombre: ' + this.state.valueName);
        event.preventDefault();
    }

    getInfoCountries() {
        //get the information of the country based on the country code
        let infoCountries;
        let codCountry = "";
        if (this.state.codCountries.length !== 0) {
            console.log(this.state.codCountries);
            for (let country of this.state.codCountries) {
                if (codCountry !== "") {
                    codCountry = codCountry + "," + country.country_id;
                }
                else
                    {codCountry = country.country_id;}
                console.log("codCountry " + codCountry);
            }
        }
        if (codCountry !== "") {
            fetch("https://restcountries.com/v3.1/alpha?codes=" + codCountry,
                {"method": "GET"}
                )
                .then(response => response.json())
                .then(response => {
                    console.log("resp" + response);
                    let arrCountries = [];
                    for (let country of response) {
                        console.log(this.state.countries);
                        arrCountries.push(country.name.common);
                        this.setState({countries: arrCountries});
                    }
                    let index=0;
                    while (index < this.state.codCountries.length && index < this.state.countries.length) {
                        infoCountries = (<Container>
                            <Row>
                                <Col>
                                    {this.state.countries[index]}
                                </Col>
                                <Col>
                                    {this.state.codCountries[index]}
                                </Col>
                            </Row>
                        </Container>)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
        return infoCountries;
    }

    getProbabilities(e: any) {
        let showProbabilities;
        e.preventDefault();
        //Fetch results hitting the API
        fetch("https://api.nationalize.io?name=" + this.state.valueName,
            {"method": "GET"}
        )
            .then(response => response.json())
            .then(response => {
                this.setState({codCountries: response.country});
                console.log(response);
                console.log(this.state.codCountries);
                if (this.state.codCountries.length !== 0) {
                    showProbabilities = this.getInfoCountries();
                    console.log("aca");
                }
            })
            .catch(error => {
                console.log(error)
            });

            return showProbabilities;
    }


    renderButton() {
        let button;

        if (this.state.valueName === '') {
            button = (<button type='button' disabled={true}>
                Traer
            </button>);
        }
        else {
            button = (<button type='button' onClick={(e) => this.getProbabilities(e)}>
                Traer
            </button>);
        }
        return button;
    }

    render() {
        return(
          <form onSubmit={this.handleSubmit}>
              <label>
                  Nombre:
                  <input type="text" value={this.state.valueName} onChange={this.handleChange} />
              </label>
              {this.renderButton()}

          </form>

        );
    }
}
