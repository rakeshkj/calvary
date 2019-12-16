import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet,TouchableWithoutFeedback,Platform,FlatList,NativeModules,DeviceEventEmitter,NativeEventEmitter } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import {Width} from "../constants/dimensions";
import {getAlbums} from '../services/apiList'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';

export default class AlbumList extends Component{
    constructor(props){
        super(props)
        this.state = {
            menu : ['Books','Albums','Sermons','Bibles','More'],
            albums: []
        }
    }

    componentDidMount()  {
        NetInfo.fetch().then(status => {
            if(status.isConnected){
                this.getAlbumList()
            }else{
                Toast.show('Please check your internet connection.')
            }
        })
    }

    getAlbumList = async() => {
        let res = await getAlbums()
        if (res){
            console.log("res==",res)
            this.setState({albums:res})
        }
    }

    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigation.openDrawer();
    };

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
                                <Text style={{color:'white',fontSize:20}}>Albums</Text>
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
                    //this.postOrder(item)
                    //this.runTransaction(item)
                    this.props.navigation.navigate('SongsListScreen',{item:item})
                }}
                style={[
                    styles.menuItem,
                    { alignItems:'center'  },
                ]}
            >
                <View style={styles.menuCircle}>
                    <View style={styles.albumVw}>
                        <Image source={{uri:item.album_logo}}  style={{height:'100%',width:'100%',resizeMode: 'cover',borderTopLeftRadius:5,
                            borderTopRightRadius:5}}/>
                        <Image
                            source={require('./../../assets/play.png')}
                            style={{ width: 30, height: 30,position:'absolute',right:5,bottom:5 }}
                        />
                    </View>
                    <View>
                        <Text numberOfLines={1} style={{marginLeft:10,marginTop:10,fontWeight:'bold',width:'100%'}}>{item.album_title}</Text>
                        <Text numberOfLines={1} style={{marginLeft:10,marginTop:2,width:'100%'}}>{item.artist}</Text>
                        <Text style={{marginLeft:10,color:'#FF0000', textAlignVertical: "center",fontWeight:'bold'}}>
                            Rs. {item.price}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <FlatList
                    style={{flex: 1}}
                    data={this.state.albums}
                    contentContainerStyle={{marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}
                    renderItem={({ item,index }) => this.renderItem(item,index)}
                    style={{width:'100%',marginTop:10}}
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
        width:Width(50),
        height:Width(60),
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
