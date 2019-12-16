import React from 'react'
import {View, Text, TouchableOpacity, Image, Slider, AppRegistry, StatusBar,StyleSheet,TouchableWithoutFeedback} from 'react-native'
import TrackPlayer, {ProgressComponent} from 'react-native-track-player';

TrackPlayer.setupPlayer();

export default class Player extends React.Component{

    state = {
        AudioStatus: true,
        CurrentPlayTitle : '',
        CurrentPlayArtist : '',
        CurrentPlayImage : require('./../../assets/poster.jpg'),
        Volume : 60,
        data:this.props.navigation.state.params.data
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.intiateTrack()
    }

    togglePlayback = async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        debugger;
        if (currentTrack == null) {
            TrackPlayer.reset();
            if(this.props.navigation.state.params.isOffline){
                TrackPlayer.setupPlayer().then(async () => {
                    // Adds a track to the queue
                    await TrackPlayer.add({
                        id: 'trackId',
                        url: {uri: this.props.navigation.state.params.path},
                        title: 'Track Title',
                        artist: 'Track Artist',
                    });
                });
            }else{
                await TrackPlayer.add(this.state.data);
            }
            TrackPlayer.play();
        } else {
            if(await TrackPlayer.getState() === 2){
                TrackPlayer.play();
            }else{
                TrackPlayer.pause();
            }
        }
        this.UpdateTrackUI();
     }

    skipToNext = async () => {
        try {
            await TrackPlayer.skipToNext();
        } catch (error) {
            console.log(error);
            TrackPlayer.stop();
        }
        this.UpdateTrack();
        this.UpdateTrackUI();
    }

    skipToPrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
            this.UpdateTrack();
        } catch (error) {
            console.log(error);
        }
        this.UpdateTrack();
        this.UpdateTrackUI();
    }

    UpdateTrack = async () => {
        var current_id = await TrackPlayer.getCurrentTrack();
        if(current_id){
            var track = await TrackPlayer.getTrack(current_id);
            this.setState({
                CurrentPlayTitle : track.title,
                CurrentPlayArtist : track.artist,
                CurrentPlayImage : {uri: track.artwork},
            });
        }else{
            this.setState({
                CurrentPlayTitle : this.state.data[0].title,
                CurrentPlayArtist : this.state.data[0].artist,
                CurrentPlayImage : {uri: this.state.data[0].artwork},
            });
         }
    }

    intiateTrack = async () => {
        this.setState({
            CurrentPlayTitle : this.state.data[0].title,
            CurrentPlayArtist : this.state.data[0].artist,
            CurrentPlayImage : {uri: this.state.data[0].artwork},
        });
        TrackPlayer.reset();
        await TrackPlayer.add(this.state.data);
    }

    UpdateTrackUI = async () => {
        debugger;
        if(await TrackPlayer.getState() == 2){
            this.setState({
                AudioStatus: true
            });
        } else if(await TrackPlayer.getState() == 3){
            this.setState({
                AudioStatus: false
            });
        } else if(await TrackPlayer.getState() == 6){
            this.setState({
                AudioStatus: false
            });
        }
    }

    render(){
        return(
            <View style={{ flex: 1, justifyContent:'space-between', flexDirection:'column',  backgroundColor: '#FFF'}}>
                <StatusBar backgroundColor='#FFF' barStyle="dark-content"/>
                <View style={{flex: 8,}}>
                    <View style={{flex: 1, padding: 15}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color:'#000'}}>{this.state.CurrentPlayTitle}</Text>
                        <Text>{this.state.CurrentPlayArtist}</Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', flex: 9}}>
                        <Image source={{uri:this.state.data[0].artwork}}  style={{width: '90%', height: 335}}/>
                    </View>
                </View>
                <View style={{justifyContent:'center', flex: 2, alignItems:'center'}}>
                    <TrackStatus />
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.skipToPrevious()} style={{padding: 15}} activeOpacity={1}>
                            <Image source={require('./../../assets/Back-Music-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.togglePlayback()} style={{padding: 15}} activeOpacity={1}>
                            <Image source={this.state.AudioStatus ? require('./../../assets/Play-Music-icon.png') : require('./../../assets/pause-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.skipToNext()} style={{padding: 15}} activeOpacity={1}>
                            <Image source={require('./../../assets/Next-Music-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


export class TrackStatus extends ProgressComponent {

    formatTwoDigits(n) {
        return n < 10 ? '0' + n : n;
    }

    formatTime(seconds) {
        const ss = Math.floor(seconds) % 60;
        const mm = Math.floor(seconds / 60) % 60;
        const hh = Math.floor(seconds / 3600);

        if(hh > 0) {
            return hh + ':' + this.formatTwoDigits(mm) + ':' + this.formatTwoDigits(ss);
        } else {
            return mm + ':' + this.formatTwoDigits(ss);
        }
    }

    render() {
        const position = this.formatTime(Math.floor(this.state.position));
        const duration = this.formatTime(Math.floor(this.state.duration));
        const info = position + ' / ' + duration;

        let progress = this.getProgress() * 100;
        let buffered = this.getBufferedProgress() * 100;
        buffered -= progress;
        if(buffered < 0) buffered = 0;

        return (
            <View style={styles.view}>
                <Text style={styles.info}>{info}</Text>
                <TouchableWithoutFeedback>
                    <View style={styles.bar}>
                        <View style={[{width: progress + '%'}, styles.played]} />
                        <View style={[{width: buffered + '%'}, styles.buffered]} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#171F33',
        justifyContent: 'center',
        color: 'white',
        width:'90%',
        height:'30%'
    },
    position: {
        color: 'white',
        textAlign: 'left'
    },
    duration: {
        color: 'white',
        textAlign: 'right'
    },
    timeContainer: {
        alignItems: 'center',
        color: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5
    },
    slider: {
        marginLeft: 30,
        marginRight: 30
    }
});

AppRegistry.registerComponent('Player', () => Player);



