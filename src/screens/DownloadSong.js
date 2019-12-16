import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet,TouchableWithoutFeedback,Platform,FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import {Width} from "../constants/dimensions";
import Toast from 'react-native-simple-toast';
const RNFS = require('react-native-fs');
import TrackPlayer from 'react-native-track-player';

export default class AlbumList extends Component{
    constructor(props){
        super(props)
        this.state = {
            songs : []
        }
    }

    componentDidMount()  {
        RNFS.readDir(RNFS.DocumentDirectoryPath,'utf8').then((obj) => {
            if(obj.length > 0){
                this.setState({songs:obj})
            }
        })
    }

    renderNavigationBar(){
        return(
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#591A83', '#FF0000']} style={{borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20}}  >
                <View style={styles.navigationBarContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.navigationBarLeftButton}>
                        <Image
                            source={require('./../../assets/back.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.navigationBarTitleContainer}>
                        <TouchableWithoutFeedback>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color:'white',fontSize:20}}>My Songs</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </LinearGradient>
        )
    }

    renderItem = (item,index) => {
        return(
            <TouchableOpacity
                onPress={() => {
                    var file_uri = "file://" + item.path;
                    TrackPlayer.setupPlayer().then(() => {
                        let track = { id:'try', url:file_uri,title:"try artist",artist:"artist"}
                        TrackPlayer.add([track]).then(function() {
                            console.log("Track Added Created")
                            TrackPlayer.play()
                        });
                    })
                }} style={[
                    styles.menuItem,
                ]}
            >
                <View style={{flexDirection: 'row'}}>
                    <Text style={{marginLeft: 10,fontWeight:'bold'}}>{index + 1}.</Text>
                    <Text style={{marginLeft: 10,fontWeight:'bold'}}>{item.name}</Text>
                </View>
                <View style={{width:'100%',height:1,backgroundColor:'black'}}/>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <FlatList
                    data={this.state.songs}
                    renderItem={({ item,index }) => this.renderItem(item,index)}
                    style={{width:'100%',marginTop:10,height:'70%'}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navigationBarContainer: {
        height: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT + 20 :  Layout.HEADER_HEIGHT,
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    navigationBarLeftButton: {
        marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 + 10 : 0,
        marginLeft: Width(4),
        marginBottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
    },
    navigationBarTitleContainer: {
        position: 'absolute',
        top: 0,
        left: 50,
        right: 50,
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 + 10 : 0,
    },
    menuItem:{
        width:Width(100),
        height:Width(10),
    },
    menuCircle:{
        height:'90%',
        width:'85%',
        borderRadius:5,
        elevation:5,
        backgroundColor:'white'
    },
    albumVw:{
        height:'65%',
        width:'100%',
        marginTop:0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e9e2e9',
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    }
})
