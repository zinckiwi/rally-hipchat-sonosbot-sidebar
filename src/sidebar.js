var React = require('react');
var ReactDOM = require('react-dom');
var strftime = require('strftime');

var Song = React.createClass({
    render() {
        if (location.search.indexOf('theme=dark') >= 0) var titleStyle = {color: '#ccc'};

        return (
            <li className='aui-connect-list-item'>
                <span className='aui-connect-list-item-title' style={titleStyle}>{this.props.Title}</span>
                <ul className='aui-connect-list-item-attributes'>
                    <li>{strftime('%l:%M %P', new Date(this.props.Timestamp))} ♫ {this.props.Artist}</li>
                </ul>
            </li>
        );
    }
});

var List = React.createClass({
    render() {
        return (
            <section className='aui-connect-content with-list'>
                <section className='aui-connect-content' style={{paddingBottom: 0}}>
                    <h4>Recently Played</h4>
                </section>
                <ol className='aui-connect-list'>
                    {this.props.songs && this.props.songs.Items.map(song => <Song {...song} />)}
                </ol>
            </section>
        );
    }
});

var ControlPanel = React.createClass({
    getInitialState() {
        return {};
    },
    onPlaypause() {
        document.getElementById('oubliette').src = 'http://10.40.40.108:5005/' + this.props.sonosName + '/playpause';
    },
    onSkip() {
        document.getElementById('oubliette').src = 'http://10.40.40.108:5005/' + this.props.sonosName + '/next';
        this.setState({isSkipDisabled: true}, () => {
            setTimeout(() => this.setState({isSkipDisabled: false}), 5000);
        });
    },
    onVolDown() {
        document.getElementById('oubliette').src = 'http://10.40.40.108:5005/' + this.props.sonosName + '/volume/-3';
    },
    onVolUp() {
        document.getElementById('oubliette').src = 'http://10.40.40.108:5005/' + this.props.sonosName + '/volume/+3';
    },
    render() {
        return (
            <section className='aui-connect-content'>
                <div style={{overflow: 'hidden', paddingTop: 10}}>
                    <div className='aui-buttons' style={{float: 'left'}}>
                        <button className='aui-button' onClick={this.onPlaypause}>
                            <i className="fa fa-play"></i> <i className="fa fa-pause"></i>
                        </button>
                        <button className='aui-button' onClick={this.onSkip} disabled={this.state.isSkipDisabled}>
                            <i className="fa fa-forward"></i>
                        </button>
                    </div>
                    <div className='aui-buttons' style={{float: 'right'}}>
                        <button className='aui-button' onClick={this.onVolDown}>
                            <i className="fa fa-volume-down"></i>
                        </button>
                        <button className='aui-button' onClick={this.onVolUp}>
                            <i className="fa fa-volume-up"></i>
                        </button>
                    </div>
                </div>
            </section>
        );
    }
});

var App = React.createClass({
    getInitialState() {
        return {};
    },
    componentWillMount() {
        this.getSonosName();
    },
    getSonosName() {
        HipChat.room.getRoomDetails((err, success) => {
            if (err) return;
            var url = 'https://9ptaixi3s1.execute-api.us-east-1.amazonaws.com/dev/machineNameForRoom';
            var opts = {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    roomId: success.id,
                })
            };
            fetch(url, opts)
                .then(response => response.json())
                .then(data => {
                    this.setState({sonosName: data.Item.SonosName});
                    this.refreshSongs();
                });
        });
    },
    refreshSongs() {
        clearTimeout(this._refresher);
        var url = 'https://9ptaixi3s1.execute-api.us-east-1.amazonaws.com/dev/songs/get';
        var opts = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                SonosName: this.state.sonosName,
                Limit: 10
            })
        };
        fetch(url, opts)
            .then(response => response.json())
            .then(data => {
                this.setState({songs: data});
                this._refresher = setTimeout(this.refreshSongs, 10000);
            });
    },
    render() {
        if (!this.state.sonosName) return null;
        return (
            <section className='aui-connect-page' role='main'>
                <ControlPanel sonosName={this.state.sonosName} />
                <List songs={this.state.songs} />
            </section>
        );
    }
});

window.onload = function() {
    var oubliette = document.createElement('img');
    oubliette.id = 'oubliette';
    oubliette.style.display = 'none';
    document.body.appendChild(oubliette);

    var root = document.createElement('div');
    root.id = 'app';
    ReactDOM.render(<App />, document.body.appendChild(root));
}
