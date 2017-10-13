import React from 'react';
import './TrackToast.css';
import PreviewPlayer from './PreviewPlayer';
import Loading from './Loading';


class TrackToast extends React.Component {
  constructor (props) {
  super(props);
  this.state = {
      status:'loading',
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  _parsetime(ms) {
    let ss = Math.floor((ms/1000) % 60);
    let mm = Math.floor((ms/1000) / 60);
    let mmss = mm + ':' + (ss >= 10 ? ss : '0' + ss);
    return mmss;
  }

  componentWillMount() {
console.log('componentWillMount');
  }

 componentDidMount() {
   console.log('componentDidMount');
    document.body.addEventListener('click', this.handleClickOutside,true);
   /*setTimeout(() => {
      if(this.props.trackInfo && !this.state.ready) {
        this.setState({ready:true});
      }
      console.log('readt');
      console.log(this.ref);
      document.addEventListener('click', this.handleClickOutside, true);
   },500);*/

 }

 componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
   setTimeout(() => {
    if(nextProps.trackInfo && (this.state.status === 'loading')) {
      this.setState({status:'ready'});
    }
    },500);
 }

  componentWillUnmount() {
     console.log('componentWillUnmount');
  //TODO: add fade out method
    if(this.state.status === 'ready') {
      document.body.removeEventListener('click', this.handleClickOutside);
    }
  }

  //FIXME:avoid immediate invoke in the flow that would affect loading
  handleClickOutside(event) {
     //TODO: this method somehow block other event for good???
     //event.stopImmediatePropagation();
     console.log('DEBUG handleClickOutside:');
     console.log(this.ref);

    if (this.ref && !this.ref.contains(event.target)) {
        this.props.outClickHandler();
    }
  }

  renderLoading(style) {
    return <Loading style={style}/>
  }

 classSet(classNames) {
    let className = '';
    for (let key in classNames) {
      className += (classNames[key] && (key + ' ')) ;
    }
    return className.replace(/(\s*$)/g, "");
 }

  renderToast(style) {
    let classNames = {
      'ToastInfo':true,
      'reverse':this.isReverse()
    };
    return (
      <div ref={(ref) => this.ref = ref} style ={style} className={this.classSet(classNames)} >
          <PreviewPlayer srcUrl={this.props.trackInfo.preview} img={this.props.trackInfo.image}/>
          <div className='TrackInfo'>

            <div className='trackName'>
              <h3 >{this.props.trackInfo.name}</h3>
              <h3 className='Duration'>{this._parsetime(this.props.trackInfo.duration)}</h3>
            </div>
            <div className='Album'>
              <h3 className="AlbumName"><span>- </span>{this.props.trackInfo.album}<span> -</span></h3>
            </div>
            <div  className='ArtistName'>
              <h3 ><span>By</span> {this.props.trackInfo.artist}</h3>
            </div>
            <div className='Spotify'>
              <a className='SpotifyIcon' target={'_blank'} href={this.props.trackInfo.externalUrl}></a>
              <div className='SpotifyToast'>
                <p>Listen on Spotify</p>
              </div>
            </div>
          </div>
      </div>
    );
  }

  isReverse() {
    return window.innerHeight + document.body.scrollTop - this.props.pos.y < 300;
  }

  calPos() {
    if(this.isReverse()) {
      return {
                loadtyle:{
                left:this.props.pos.x + 'px',
                top:(this.props.pos.y  - 100) + 'px'},
                toasttyle:{
                left:this.props.pos.x + 'px',
                top:(this.props.pos.y  - 200)  + 'px'}
              };

      } else {
      return {
                loadtyle:{
                left:this.props.pos.x + 'px',
                top:this.props.pos.y  + 'px'},
                toasttyle:{
                left:this.props.pos.x + 'px',
                top:this.props.pos.y  + 'px'}
              };
    }
  }

  render() {
    //return this.state.status === 'ready' ? this.renderToast(style) : this.renderBubbling(style);
    return this.state.status === 'ready' ? this.renderToast(this.calPos().toasttyle) : this.renderLoading(this.calPos().loadtyle);
  }
}


export default TrackToast;
