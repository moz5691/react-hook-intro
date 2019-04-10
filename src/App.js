import React, {useState,useEffect, useRef} from 'react';
import {Form, Segment, List} from 'semantic-ui-react';
import axios from 'axios';

import './App.css';

const App = () => {

    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("React Hooks");
    const [title, setTitle] = useState("");
    const searchInputRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(()=>{
        document.title = `Search for ${title}`;

        fetchData();

    }, [title]);

    const fetchData = async () => {
        setLoading(true);

        try {
            const incoming = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`);
            console.log(incoming.data);
            setResults(incoming.data.hits);
            setTitle(query);
        } catch(err) {
            setError(err);
        }

        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
        // setQuery("");
    };

    const handleClearSearch = () => {
        setQuery("");
        searchInputRef.current.focus();
    };

    return (


      <div className="App">
          <Segment>
              <h2 className="App-text">React Hooks Demo</h2>
              <Form onSubmit={handleSearch}>
                      <input
                          type={"text"}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          ref = {searchInputRef}
                      />
                  <button className="ui button green" type = "submit" >Search</button>
                  <button className="ui button blue" onClick={handleClearSearch}>Clear</button>
              </Form>
          </Segment>


          {loading ? (<div><h2 className="App-text">Loading data...</h2></div>) :
              ( <List divided relaxed>
                  {results.map( (result,i) =>
                      <List.Item key={i}>
                          <List.Icon name="github" size="large" verticalAlign='middle'/>
                          <List.Content>
                              <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                          </List.Content>

                      </List.Item>
                  )}
                </List>)
          }

          {error ? (<div>
              <h3>Network Error</h3>
              {JSON.stringify(error, null, 2)}</div>):(<div>No Error</div>)}


      </div>
    );
};

export default App;
