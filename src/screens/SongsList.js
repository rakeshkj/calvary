import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    FlatList,
    Platform,Alert
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import {Width} from "../constants/dimensions";
import {songUrl, getSongs, postOrder, updateOrder} from '../services/apiList'
import Paytm from '@philly25/react-native-paytm';
const RNFS = require('react-native-fs');
import Toast from "react-native-simple-toast";

export default class SongsList extends Component{
    constructor(props){
        super(props)
        this.state = {
            songs:[],
            id:this.props.navigation.state.params.item.id,
            status: '',
            orderID: '',
            songArr:[],
            res:{}
        }
    }

    componentDidMount(): void {
        this.getSongList()
    }

    componentWillMount(): void {
        Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
    }

    componentWillUnmount(): void {
        Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
    }

    toggleDrawer = () => {
        this.props.navigation.goBack();
    };

    runTransaction(res) {
        const details = {
            mode: 'Production', // 'Staging' or 'Production'
            MID: res.MID,
            INDUSTRY_TYPE_ID: res.INDUSTRY_TYPE_ID,
            WEBSITE: res.WEBSITE,
            CHANNEL_ID: res.CHANNEL_ID,
            TXN_AMOUNT: res.TXN_AMOUNT, // String
            ORDER_ID: res.ORDER_ID, // String
            EMAIL: res.EMAIL, // String
            MOBILE_NO: res.MOBILE_NO, // String
            CUST_ID: res.CUST_ID, // String
            CALLBACK_URL: res.CALLBACK_URL,
            CHECKSUMHASH: res.CHECKSUMHASH
        };
        Paytm.startPayment(details);
    }

    onPayTmResponse = (resp) => {
        const {STATUS, status, response} = resp;
        if (Platform.OS === 'ios') {
            if (status === 'Success') {
                const jsonResponse = JSON.parse(response);
                const {STATUS} = jsonResponse;

                if (STATUS && STATUS === 'TXN_SUCCESS') {
                    this.updateOrder(this.state.orderID,this.state.id,resp.TXNID,'P')
                }
            }
        } else {
            if (STATUS && STATUS === 'TXN_SUCCESS') {
                this.updateOrder(this.state.orderID,this.state.id,resp.TXNID,'P')
            }
        }
    };

    postOrder = async(id,status) => {
        let body ={
            'item' : 'album',
            'item_id' : id,
            'status' : status
        }
        let res = await postOrder(body,true)
        if (res){
            this.setState({orderID:res.ORDER_ID})
            this.runTransaction(res)
        }
    }

    updateOrder = async(id,album,transactionID,status) => {
        let body = {
            'status' : status,
            'item' : 'album',
            'item_id' : album,
            'transaction_id' : transactionID
        }
        let res = await updateOrder(body,id,false)
        if (res){
            this.getSongList()
        }
    }

    getSongList = async() => {
        let body ={
            'id' : this.props.navigation.state.params.item.id
        }
        let res = await getSongs(body)
        if (res){
            console.log("res song==",res)
            this.setState({songs:res.songs,status:res.payment_status,res:res})
            if(res.songs){
                if(res.songs.length > 0){
                    var arrSongs = []
                    res.songs.map((item => {
                        let objSong = {
                            "id": item.id,
                            "url": songUrl + item.song,
                            "title": item.song_title,
                            "artist": res.artist,
                            "artwork": songUrl + res.album_logo
                        }
                        arrSongs.push(objSong)
                    }))
                    this.setState({songArr:arrSongs})
                }
            }
        }
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
                                <Text style={{color:'white',fontSize:20}}>Songs</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </LinearGradient>
        )
    }

    extention(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    onPlay = (url,index) => {
        var headers = { Authorization: "Bearer abcsdsjkdjskjdkskjd" };
        // download(url)

        debugger;
        var arr1 = [...this.state.songArr]
        var temp = arr1[0];
        arr1[0] = arr1[index];
        arr1[index] = temp;

        this.props.navigation.navigate('PlayerScreen', {data:arr1,isOffline:false})


        this.setState({songArr:this.state.songArr})
        // var filename = url.substring(url.lastIndexOf("/") + 1);
        // var newFileName = filename.replace(/[_]/g,'').replace(".","");
        // debugger;
        // const rootPath = RNFS.DocumentDirectoryPath; //= (os == "android") ? RNFS.DocumentDirectoryPath :RNFS.MainBundlePath
        // var path = rootPath + "/" + newFileName;
        // RNFS.readDir(RNFS.DocumentDirectoryPath,'utf8').then((obj) => {
        //     if(obj.length > 0){
        //         let isPath = false
        //         obj.map((item) => {
        //             debugger;
        //             if(item.name != newFileName){
        //                 isPath = false
        //             }else{
        //                 isPath = true
        //             }
        //         })
        //         if(!isPath){
        //             Alert.alert(
        //                 'Calvary',
        //                 'Do you want to download song?',
        //                 [
        //                     {text: 'Yes', onPress: () => {
        //                             RNFS.writeFile(path, url, 'utf8').then((pbj) => {
        //                                 console.log('FILE WRITTEN!',pbj);
        //                                 Toast.show("Song is downloaded, you can check from Downloaded Song.")
        //                                 this.props.navigation.navigate('PlayerScreen', {data:this.state.songArr,isOffline:false})
        //                                 return
        //                             }).catch((err) => {
        //                                 console.log(err.message);
        //                                 Toast.show(err.message)
        //                                 return
        //                             });
        //                         }},
        //                     {text: 'No', onPress: () => {
        //                             this.props.navigation.navigate('PlayerScreen', {data:this.state.songArr,isOffline:false})
        //                         }},
        //                 ],
        //                 {cancelable: false},
        //             );
        //         }else{
        //             this.props.navigation.navigate('PlayerScreen', {data:this.state.songArr,isOffline:false})
        //         }
        //
        //     }
        // }).catch(err=>{
        //     Toast.show(err.toString())
        // })



    }

    renderItem = (item,index) => {
        return(
            <TouchableOpacity
                onPress={() => {
                    if(this.state.status == "P"){
                        //this.props.navigation.navigate('PlayerScreen', {title:item.song_title, filepath: songUrl + item.song,image:songUrl + this.state.res.album_logo})
                        this.onPlay(songUrl + item.song,index)
                    }else{
                        this.postOrder(this.state.id,'N')
                    }
                }}
                style={[
                    styles.menuItem,
                    { alignItems:'center'},
                ]}
            >
                <View style={styles.menuCircle}>
                    <Text style={{fontSize:20,marginLeft:5}}>{index + 1 }.</Text>
                    <Text style={{fontSize:20,marginLeft:10}}>{item.song_title}</Text>
                    <Image
                        source={require('./../../assets/play.png')}
                        style={{ width: 20, height: 20,position:'absolute',right:20}}
                    />
                </View>
                <View style={{height:0.5,backgroundColor:'gray',paddingBottom:2,width:'90%'}}/>
            </TouchableOpacity>
        )
    }

    render(){
        const item = this.props.navigation.state.params.item
        return(
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <View style={styles.albumLogo}>
                    <Image style={styles.albumLogoImg} source={{uri:item.album_logo}}/>
                    <View style={styles.albumTextVw}>
                        <Text style={{fontSize:20,fontWeight:'bold'}}>{item.album_title}</Text>
                        <Text style={{fontSize:15}}>{item.artist}</Text>
                        { this.state.status == "N" &&
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#591A83', '#FF0000']} style={{height:30,width:50,borderRadius: 5,
                        alignItems:'center',justifyContent:'center',marginTop:5}}  >
                            <TouchableOpacity onPress={() => this.postOrder(this.state.id,'N') }>
                                <Text style={{fontSize:15,color:'white'}}>Buy</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                            }
                    </View>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.songs}
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
        flex:1,
        height:50,
    },
    menuCircle:{
        height:'90%',
        width: '95%',
        flexDirection:'row',
        alignItems:'center'
    },
    albumLogo:{
        marginTop:15,
        marginLeft:15,
        flexDirection:'row'
    },
    albumLogoImg:{
        resizeMode: 'cover',
        height:150,
        width:150,
        borderRadius: 5
    },
    albumTextVw:{
        marginTop:10,
        marginLeft:10
    }
})
