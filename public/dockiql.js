/**
 * This GraphiQL example illustrates how to use some of GraphiQL's props
 * in order to enable reading and updating the URL parameters, making
 * link sharing of queries a little bit easier.
 *
 * This is only one example of this kind of feature, GraphiQL exposes
 * various React params to enable interesting integrations.
 */

    // Parse the search string to get url parameters.
var search = window.location.search;
var parameters = {};
search.substr(1).split('&').forEach(function (entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] =
            decodeURIComponent(entry.slice(eq + 1));
    }
});

// if variables was provided, try to format it.
if (parameters.variables) {
    try {
        parameters.variables =
            JSON.stringify(JSON.parse(parameters.variables), null, 2);
    } catch (e) {
        // Do nothing, we want to display the invalid JSON as a string, rather
        // than present an error.
    }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared
function onEditQuery(newQuery) {
    parameters.query = newQuery;
    updateURL();
}

function onEditVariables(newVariables) {
    parameters.variables = newVariables;
    updateURL();
}

function onEditOperationName(newOperationName) {
    parameters.operationName = newOperationName;
    updateURL();
}

function updateURL() {
    var newSearch = '?' + Object.keys(parameters).filter(function (key) {
        return Boolean(parameters[key]);
    }).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(parameters[key]);
    }).join('&');
    history.replaceState(null, null, newSearch);
}

// Defines a GraphQL fetcher using the fetch API. You're not required to
// use fetch, and could instead implement graphQLFetcher however you like,
// as long as it returns a Promise or Observable.
function graphQLFetcher(endpoint) {
    return function (graphQLParams) {
        // This example expects a GraphQL server at the path /graphql.
        // Change this to point wherever you host your GraphQL server.
        return fetch(endpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'include'
        }).then(function (response) {

            return response.text()

        }, function (reason) {
            return "Rejected for this reason: " + reason + "\nIs the endpoint (" + endpoint + ") reachable ?";
        }).then(function (responseBody) {
            try {
                return JSON.parse(responseBody);
            } catch (error) {
                return responseBody;
            }
        });
    };
}


class GraphiQLExtended extends React.Component {

    constructor(props) {

        super(props);

        this.dockiQLEnpointName = 'DockiQLEndpoint';

        let endpointValue = localStorage.getItem(this.dockiQLEnpointName);
        if (endpointValue == null) {
            endpointValue = "http://localhost";
        }
        this.state = {
            currEndpoint: endpointValue
        };

        this.setEndpoint = this.setEndpoint.bind(this);
        this.updateEndpoint = this.updateEndpoint.bind(this);

    }

    setEndpoint(event) {

        localStorage.setItem(this.dockiQLEnpointName, this.state.currEndpoint);
        event.preventDefault();

    }

    updateEndpoint(e) {
        this.setState({currEndpoint: e.target.value});
    }

    render() {
        return React.createElement('div'
            , {id: "application"}
            , React.createElement('div'
                , {id: "url-bar", className: "graphiql-container"}
                , React.createElement('input'
                    , {type: "text", id: "url-box", value: this.state.currEndpoint, onChange: this.updateEndpoint}
                )
                , React.createElement('a'
                    , {id: "url-save-button", className: "toolbar-button", onClick: this.setEndpoint}
                    , "Set Endpoint"
                )
            )
            , React.createElement(GraphiQL,
                {
                    fetcher: graphQLFetcher(this.state.currEndpoint),
                    query: parameters.query,
                    variables: parameters.variables,
                    operationName: parameters.operationName,
                    onEditQuery: onEditQuery,
                    onEditVariables: onEditVariables,
                    onEditOperationName: onEditOperationName
                }
            )
        )
    }

}

// Render <GraphiQL /> into the body.
// See the README in the top level of this module to learn more about
// how you can customize GraphiQL by providing different values or
// additional child elements.
ReactDOM.render(
    React.createElement(GraphiQLExtended),
    document.getElementById('graphiql')
);
