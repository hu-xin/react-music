import React, { Component } from 'react';
import $ from 'jquery';
import { jPlayer } from 'jplayer';
import Pubsub from 'pubsub-js';
import Progress from '../components/progress';
import './player.less';

let duration = 0;
class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: '-',
            currentTime: 0,
            volume: 0,
            isPlay: true
        }
    }
    componentDidMount() {
        $('#player').bind($.jPlayer.event.timeupdate, (e) => {
            duration = Math.round(e.jPlayer.status.duration);
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute,
                currentTime: Math.round(e.jPlayer.status.currentTime),
                volume: e.jPlayer.options.volume * 100
            })
        })
    }
    componentWillUnmount() {
        $('#player').unbind($.jPlayer.event.timeupdate);
    }
    progressChangeHandle(progress) {
        $('#player').jPlayer('play', duration * progress);
    }
    volumeChangeHandle(progress) {
        $('#player').jPlayer('volume',progress)
    }
    play() {
        this.state.isPlay ? $('#player').jPlayer('pause') : $('#player').jPlayer('play');
        this.setState({
            isPlay: !this.state.isPlay
        })
    }
    playNext() {
        Pubsub.publish('PLAY_NEXT');
    }
    playPrev() {
        Pubsub.publish('PLAY_PREV');
    }
    render() {
        return (
            <div className="player-page">
                <div className="player">
                    <div className="info row">
                        <div className="cover -col-auto">
                            <img src={ this.props.currentMusicItem.cover } alt={ this.props.currentMusicItem.title } />
                        </div>
                        <div>
                            <h3 className="title">{this.props.currentMusicItem.title}</h3>
                            <div className="artist">{this.props.currentMusicItem.artist}</div>
                        </div>
                    </div>
                    <div className="play-progress row">
                        <div className="time -col-auto ft12">
                            <span>{parseInt(this.state.currentTime / 60)}</span>
                            <span>:</span>
                            <span>{parseInt(this.state.currentTime % 60 / 10)}</span>
                            <span>{this.state.currentTime % 10}</span>
                        </div>
                        <Progress
                            progress={this.state.progress}
                            onProgress={this.progressChangeHandle}
                            currentTime={this.state.currentTime}
                            duration={duration}
                        ></Progress>
                        <div className="time -col-auto ft12">
                            <span>{parseInt(duration / 60)}</span>
                            <span>:</span>
                            <span>{parseInt(duration % 60 / 10)}</span>
                            <span>{duration % 10}</span>
                        </div>
                    </div>
                    <div className="controller">
                        <i className="icon prev" onClick={this.playPrev}></i>
                        <i className={`icon ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                        <i className="icon next" onClick={this.playNext}></i>
                        <div className="volume-wrapper">
                            <i className="icon volume"></i>
                            <Progress
                                progress={this.state.volume}
                                onProgress={this.volumeChangeHandle}
                            ></Progress>
                        </div>
                        <i className="icon repeat-random repeat"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player;