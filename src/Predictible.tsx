import React from 'react';

interface IProps {
}

interface IState {
    valueName: string;
    countries: any[];
    codCountries: any[];
}

export class Predictible extends React.Component<IProps, IState> {
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
        //Get the information of the country based on the country code
        let codCountry = "";
        if (this.state.codCountries.length !== 0) {
            for (let country of this.state.codCountries) {
                if (codCountry !== "") {
                    codCountry = codCountry + "," + country.country_id;
                }
                else
                    {codCountry = country.country_id;}
            }
        }
        if (codCountry !== "") {
            fetch("https://restcountries.com/v3.1/alpha?codes=" + codCountry,
                {"method": "GET"}
                )
                .then(response => response.json())
                .then(response => {
                    let arrCountries = [];
                    for (let country of response) {
                        arrCountries.push(country.name.common);
                        this.setState({countries: arrCountries});
                    }
                    let index=0;
                    while (index < this.state.codCountries.length && index < this.state.countries.length) {
                        //Display result with their probability
                        console.log(this.state.countries[index] + "|" + this.state.codCountries[index].probability + "\n\r");
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    getProbabilities(e: any) {
        e.preventDefault();
        //Fetch results hitting the API
        fetch("https://api.nationalize.io?name=" + this.state.valueName,
            {"method": "GET"}
        )
            .then(response => response.json())
            .then(response => {
                this.setState({codCountries: response.country});
                if (this.state.codCountries.length !== 0) {
                    this.getInfoCountries();
                }
            })
            .catch(error => {
                console.log(error)
            });

    }


    renderButton() {
        let button;

        if (this.state.valueName === '') {
            button = (<button type='button' disabled={true}>
                Show
            </button>);
        }
        else {
            button = (<button type='button' onClick={(e) => this.getProbabilities(e)}>
                Show
            </button>);
        }
        return button;
    }

    render() {
        return(
          <form onSubmit={this.handleSubmit}>
              <label>
                  Name:
                  <input type="text" value={this.state.valueName} onChange={this.handleChange} />
              </label>
              {this.renderButton()}

          </form>

        );
    }
}
