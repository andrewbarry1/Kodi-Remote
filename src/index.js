import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import dotenv from 'dotenv';
import './index.css';


class Stream extends React.Component {

  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }
  
  click() {
    let stream_url = 'plugin://plugin.video.twitch/?channel_id=' + this.props.stream_id + '&mode=play'
    let data = {
      jsonrpc: '2.0',
      method: 'Player.Open',
      params: {
	'item': {
	  'file': stream_url
	},
	options: {}
      },
      id: 9001
    };
    
    axios.post('/jsonrpc?Player.Open', data) // request proxied to kodi (CORS)
      .then((r) => {
	console.log('Opened stream');
      })
      .catch((e) => {
	console.log(e);
      });
    
  }

  
  render() {
    return (
	<button className="stream" onClick={this.click}>
	<h1>{this.props.name}</h1>
	<img src={this.props.thumb} />
	<h2>{this.props.title}</h2>
	<h4>{this.props.viewers} Viewers</h4>
	</button>
    );
  }

}

class Streams extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      streams: []
    };
  }

  componentDidMount() {
    
    axios.post('https://id.twitch.tv/oauth2/token?client_id='+ process.env.REACT_APP_TWITCH_CLIENT +'&client_secret='+ process.env.REACT_APP_TWITCH_SECRET +'&grant_type=client_credentials&scope=')
      .then((response) => {
	let accessToken = response.data.access_token;
	let headers = {'Client-ID': process.env.REACT_APP_TWITCH_CLIENT, 'Authorization': 'Bearer ' + accessToken};
	const instance = axios.create({
	  baseURL: 'https://api.twitch.tv/helix/',
	  timeout: 2000,
	  headers: headers
	});
	instance.get('users/follows?from_id=' + process.env.REACT_APP_TWITCH_ID + '&first=100')
	  .then((r2) => {
	    var following = [];
	    r2.data.data.forEach((follow) => {
	      following.push(follow.to_id);
	    });
	    if (following.length > 0) {
	      instance.get('streams?user_id=' + following.join('&user_id='))
		.then((r3) => { // Live streams fetched!
		  this.setState({
		    streams: r3.data.data,
		    isLoaded: true
		  });
		})
		.catch((e3) => {
		  console.log(e3);
		  this.setState({
		    error: e3
		  });
		});
	    }
	    else {
	      this.setState({
		streams: [],
		isLoaded: true
	      });
	    }
	  })
	  .catch((e2) => {
	    console.log(e2);
	    this.setState({
	      error: e2
	    });
	  });
      })
      .catch((error) => {
	console.log(error);
	this.setState({
	  error: error
	});
      });


    
  }

  
  render() {
    if (this.state.error) {
      return (
	  <center><p>Error loading twitch streams</p></center>
      );
    }
    else if (!this.state.isLoaded) {
      return (
	  <center><img src='loading.png'/></center>
      );
    }
    return (
	<center>
	{this.state.streams.map(stream => (
	    <Stream name={stream.user_name} thumb={stream.thumbnail_url.replace('{width}','320').replace('{height}','180')} title={stream.title} viewers={stream.viewer_count} stream_id={stream.user_id}/>
	  ))}
      </center>
    );
  }
}

class Nav extends React.Component {

  stop() {
    let data = {
      'jsonrpc': '2.0',
      'method': 'Player.Stop',
      'params': [1],
      'id': 69
    };
    
    axios.post('/jsonrpc?Player.Close', data) // request proxied to kodi (CORS)
      .then((r) => {
	console.log('Closed stream');
      })
      .catch((e) => {
	console.log(e);
      });
  }

  pause() {
    // TODO
  }

  resume() {
    // TODO
  }
  
  render() {
    return (
	<ul>
	<li><a onClick={this.stop}>Stop</a></li>
	<li><a onClick={this.pause}>Pause</a></li>
	<li><a onClick={this.resume}>Resume</a></li>
	</ul>
    );
  }
}

class Youtube extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.change = this.change.bind(this);
    this.play = this.play.bind(this);
  }

  change(event) {
    this.setState({value: event.target.value});
  }
  
  play(event) {
    event.preventDefault();
    console.log("Playing " + this.state.value);
    var vid_id = this.state.value + '';
    if (vid_id.indexOf('youtu.be') != -1) vid_id = vid_id.split('youtu.be/')[1].split('?')[0];
    else vid_id = vid_id.split('watch?v=')[1].split('&')[0];
    
    let vid_url = 'plugin://plugin.video.youtube/play/?video_id=' + vid_id;
    let data = {
      jsonrpc: '2.0',
      method: 'Player.Open',
      params: {
	'item': {
	  'file': vid_url
	},
	options: {}
      },
      id: 9001
    };
    axios.post('/jsonrpc?Player.Open', data) // request proxied to kodi (CORS)
      .then((r) => {
	console.log('Opened video');
      })
      .catch((e) => {
	console.log(e);
      });
  }
  
  render() {
    return (
	<center>
	<form onSubmit={this.play}>
	<input type="text" value={this.state.value} onChange={this.change} placeholder="Video URL" className="youtube-input" />
	<button>►</button>
	</form>
	</center>
    );
  }
}

// ========================================

ReactDOM.render(
    <Nav />,
  document.getElementById('nav')
);

ReactDOM.render(
    < Youtube />,
  document.getElementById('youtube')
);


ReactDOM.render(
    <Streams />,
  document.getElementById('root')
);
