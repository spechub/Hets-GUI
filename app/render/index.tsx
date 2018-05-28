import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";

import "semantic-ui-css/semantic.min.css";

import { hetsGui } from "./reducers/reducer";
import App from "./components/App";

const store = createStore(hetsGui);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("content")
);
