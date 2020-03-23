import React from "react";
import {render} from "react-dom";
import App from './Components/App';
import {Provider} from "react-redux";
import {createStore} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./Reducers";
//import { Route, Router , browserHistory} from "react-router";
//import {BrowserRouter as Router, Route, Link} from "react-router-dom";
// import { createBrowserHistory } from "history";
import {BrowserRouter as Router, Route} from "react-router-dom";
import { browserHistory} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";


// const browserHistory = createBrowserHistory();
const store = createStore(reducers, composeWithDevTools());
const history = syncHistoryWithStore(browserHistory, store);
console.log('historyINDEX', history);

render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <Route path="/" component={App} />
            </div>
        </Router>
    </Provider>
    ,document.getElementById('root')
);