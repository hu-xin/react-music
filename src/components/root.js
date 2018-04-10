import React, { Component } from 'react';
import $ from 'jquery';
import { jPlayer } from 'jplayer';
import Pubsub from 'pubsub-js';
import { MUSIC_LIST } from '../config/musiclist'
import '../static/css/reset.css';
import '../static/css/common.css';
import './root.less';
import Player from '../pages/player'

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: '-',
            musiclist: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0]
        }
    }
    playMusic(musicItem) {
        $('#player').jPlayer('setMedia', {
            mp3: musicItem.file
        }).jPlayer('play')
        this.setState({
            currentMusicItem: musicItem
        })
    }
    playNext(type = 'next') {
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex = null;
        let musicListLength = this.state.musiclist.length;
        if(type === 'next'){
            newIndex = (index + 1) % musicListLength;
        }else{
            newIndex = (index - 1 + musicListLength) % musicListLength;
        }
        this.playMusic(this.state.musiclist[newIndex])
    }
    findMusicIndex(musicItem) {
        return this.state.musiclist.indexOf(musicItem)
    }
    componentDidMount() {
        $('#player').jPlayer({
            supplied: 'mp3',
            wmode: 'window'
        });
        this.playMusic(this.state.currentMusicItem);
        Pubsub.subscribe('PLAY_NEXT', () => {
            this.playNext();
        });
        Pubsub.subscribe('PLAY_PREV', () => {
            this.playNext('prev');
        });
        $('#player').bind($.jPlayer.event.ended, () => {
            this.playNext();
        })
    }
    componentWillUnmount() {
        Pubsub.unsubscribe('PLAY_NEXT');
        Pubsub.unsubscribe('PLAY_PREV');
        $('#player').unbind($.jPlayer.event.ended);
    }
    render() {
        return (
            <div className="component-root">
                <div className="bg-cover"></div>
                <Player
                    musiclist={this.state.musiclist}
                    currentMusicItem={this.state.currentMusicItem}
                >
                </Player>
            </div>
        )
    }
}

export default Root;