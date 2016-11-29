var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
    getInitialState() {
        return {};
    },
    onSonosNameChange(e) {
        this.setState({sonosName: e.target.value});
    },
    onClick() {
        var matches = location.search.match(/signed_request=([\w\.\-]+)/);
        if (!matches) return;
        var url = 'https://9ptaixi3s1.execute-api.us-east-1.amazonaws.com/dev/associate';
        var opts = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                jwt: matches[1],
                SonosName: this.state.sonosName,
            })
        };
        fetch(url, opts)
            .then(response => response.json())
            .then(data => {
                this.setState({success: true});
            });
    },
    render() {
        return (
            <div>
                <div>
                    <input value={this.state.sonosName} onChange={this.onSonosNameChange} placeholder='Sonos Name' />
                    {' '}
                    <button onClick={this.onClick}>Associate</button>
                </div>
                <div>
                    {this.state.success && 'Success!'}
                </div>
            </div>
        );
    }
});

window.onload = function() {
    var root = document.createElement('div');
    root.id = 'app';
    ReactDOM.render(<App />, document.body.appendChild(root));
}
