
import React, { useEffect, Component } from "react";
import axios from 'axios';
import Parser from 'html-react-parser';


class Table extends Component {
    state = {
      countyData: 0,
      countyTable: '',
      chosenState: 'California',
    }
    clear() {
        this.setState({actionCount: 0})
        this.setState({display: '0'})
    }
    componentDidMount() {
        this.getTableData();
    }
    onTodoChange(value){
        this.setState({
             chosenState: value
        });
        this.getTableData();
    }
    getTableData = async () => {

        let countiesResponse;
    
        try { 
          
          countiesResponse = await axios.get('https://disease.sh/v3/covid-19/jhucsse/counties');
    
        } catch(e) { 
          console.log('Failed to fetch countries: ${e.message}', e);
          return;
        }
    
        
        let countiesData = countiesResponse.data;
        
    
        var data_filter = countiesData.filter( element => (element.province.toLowerCase() === this.state.chosenState.toLowerCase() && element.stats.confirmed != 0));

        data_filter.sort((a, b) => {
          return b.stats.confirmed - a.stats.confirmed;
        });
    
        var table = '<table><tr><th>State</th><th>County</th><th>Infections</th></tr>'
        var tr;
        for (var i = 0; i < data_filter.length; i++) {
            tr = '<tr>';
            tr += ('<td>' + data_filter[i].province + '</td>');
            tr += ('<td>' + data_filter[i].county + '</td>');
            tr += ('<td>' + data_filter[i].stats.confirmed + '</td>');
            tr += '<tr/>'
            table += tr;
        }
        table += '</table>'

        this.setState({countyTable: table});
        return <div>Table Chart</div>
    }
    render() {
      return (
        <div>
            <p>State County Data</p>
            <input
                type="text"
                id="state-search"
                placeholder="Search state"
                name="s"
                onChange={e => this.onTodoChange(e.target.value)}
            />
            {Parser(this.state.countyTable)}
        </div>
      );
    }
  }


export default Table