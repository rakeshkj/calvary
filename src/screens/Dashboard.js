import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet,TouchableWithoutFeedback,TextInput,FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Layout from './../constants/Layout'
import {Width} from "../constants/dimensions";
import {getAlbums} from "../services/apiList";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-simple-toast";
import {ScrollView} from "react-navigation";

export default class Dashboard extends Component{
    constructor(props){
        super(props)
        this.state = {
            menu : [{
                Name: 'Books',
                uri : require('./../../assets/books.png')
            },{
                Name: 'Albums',
                uri : require('./../../assets/album.png')
            },{
                Name: 'Sermons',
                uri : require('./../../assets/church.png')
            },{
                Name: 'Bibles',
                uri : require('./../../assets/bible.png')
            },{
                Name: 'More',
                uri : require('./../../assets/more.png')
            }],
            books : [{
                uri : require('./../../assets/book2.jpg')
            },{
                uri : require('./../../assets/book3.jpg')
            },{
                uri : require('./../../assets/book4.jpg')
            },{
                uri : require('./../../assets/book5.jpg')
            }],
            books1 : [{
                uri : require('./../../assets/book6.jpg')
            },{
                uri : require('./../../assets/book7.jpg')
            },{
                uri : require('./../../assets/book8.jpg')
            },{
                uri : require('./../../assets/book9.jpg')
            }],
            books2 : [{
                uri : require('./../../assets/book10.jpg')
            },{
                uri : require('./../../assets/book11.jpg')
            },{
                uri : require('./../../assets/book12.jpg')
            },{
                uri : require('./../../assets/book13.jpg')
            }],
            books3 : [{
                uri : require('./../../assets/book14.jpg')
            },{
                uri : require('./../../assets/book15.jpg')
            },{
                uri : require('./../../assets/book16.jpg')
            },{
                uri : require('./../../assets/book17.jpg')
            }],
        }
    }

    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigation.openDrawer();
    };

    componentDidMount(): void {
        NetInfo.fetch().then(status => {
            if(status.isConnected){
                this.getAlbumList()
            }else{
                Toast.show('Please check your internet connection.')
            }
        })
    }

    renderNavigationBar(){
        return(
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#591A83', '#FF0000']} style={{borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20}}  >
                <View style={styles.navigationBarContainer}>
                    <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.navigationBarLeftButton}>
                        <Image
                            source={require('./../../assets/drawer.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.navigationBarTitleContainer}>
                        <TouchableWithoutFeedback>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color:'white'}}>CALVARY BOOK CENTER</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 : 0,justifyContent:'center',alignItems: 'center',flexDirection:'row',marginRight:15}}>
                        <Image
                            source={require('./../../assets/notification.png')}
                            style={{ width: 20, height: 20,marginRight:5 }}
                        />
                        <Image
                            source={require('./../../assets/search.png')}
                            style={{ width: 20, height: 20,marginRight:5 }}
                        />
                        <Image
                            source={require('./../../assets/cart.png')}
                            style={{ width: 20, height: 20 }}
                        />
                    </View>
                </View>
                <View style={{height:30, marginLeft:15,marginRight:15,backgroundColor:'white',flexDirection:'row',alignItems:'center',paddingHorizontal: 10}}>
                    <Image
                        source={require('./../../assets/search_gary.png')}
                        style={{ width: 20, height: 20 }}
                    />
                    <TextInput style={{marginHorizontal:10,width:'82%',height:'100%',paddingVertical: 2,fontSize:13}} placeholder="What are you looking for?" multiline={false}/>
                    <Image
                        source={require('./../../assets/camera.png')}
                        style={{ width: 20, height: 20 }}
                    />
                </View>
                <View style={{height:30,marginLeft:15,marginRight:15,marginBottom:10,flexDirection: 'row',marginTop: 10}}>
                    <Image
                        source={require('./../../assets/location.png')}
                        style={{ width: 25, height: 25 }}
                    />
                    <Text style={{color:'white',marginTop:4,fontSize:12,marginLeft:5}}> Delivery to Calvary Temple - Hydrabad 500032</Text>
                </View>
            </LinearGradient>
        )
    }

    manageNavigation = (index) => {
        if (index == 1){
            this.props.navigation.navigate('AlbumListScreen')
        }
    }

    getAlbumList = async() => {
        let res = await getAlbums()
        if (res){
            console.log("res==",res)
            this.setState({albums:res})
        }
    }

    renderAlbumItem = (item,index) => {
        return(
            <TouchableOpacity
                onPress={() => {
                    //this.postOrder(item)
                    //this.runTransaction(item)
                    this.props.navigation.navigate('SongsListScreen',{item:item})
                }}
                style={[
                    styles.menuAlbumItem,
                    { alignItems:'center'  },
                ]}
            >
                <View style={styles.menuAlbumCircle}>
                    <View style={styles.albumVw}>
                        <Image source={{uri:item.album_logo}}  style={{height:'100%',width:'50%',resizeMode: 'cover',borderTopLeftRadius:5,
                            borderTopRightRadius:5}}/>
                        <View>
                            <Text numberOfLines={1} style={{marginLeft:10,marginTop:10,fontWeight:'bold',width:'100%'}}>{item.album_title}</Text>
                            <Text numberOfLines={1} style={{marginLeft:10,marginTop:2,width:'100%'}}>{item.artist}</Text>
                            <Text style={{marginLeft:10,color:'#FF0000', textAlignVertical: "center",fontWeight:'bold'}}>
                                Rs. {item.price}
                            </Text>
                        </View>
                        <Image
                            source={require('./../../assets/play.png')}
                            style={{ width: 30, height: 30,position:'absolute',right:5,bottom:5 }}
                        />
                    </View>

                </View>

            </TouchableOpacity>
        )
    }

    renderItem = (item,index) => {
        return(
            <TouchableOpacity
                onPress={() => this.manageNavigation(index)}
                style={[
                    styles.menuItem,
                    { alignItems:'center'  },
                ]}
            >
                <View style={[styles.menuCircle,{backgroundColor: index % 2 == 0 ? '#A4BFFF' : '#76FFBA'}]}>
                    <Image
                        source={item.uri}
                        style={{ width: '50%', height: '50%' }}
                    />
                </View>
                <Text>{item.Name}</Text>
            </TouchableOpacity>
        )
    }

    renderBookItem = (item) => {
        return(
            <TouchableOpacity
                style={[
                    styles.menuBookItem,
                    { alignItems:'center'  },
                ]}
            >
                <View style={styles.menuBookCircle}>
                    <View style={[styles.bookVw,{height:'100%'}]}>
                        <Image source={item.uri}  style={{height:'100%',width:'100%',resizeMode: 'cover',borderTopLeftRadius:5,
                            borderTopRightRadius:5}}/>
                    </View>
                    <View style={{height:'100%',width:2,backgroundColor:'gray',marginLeft: 20}}/>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text>Diary - 2019</Text>
                    <Text>For rs.99 Shop Now</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderBookItemNew = (item,index) => {
        return(
            <TouchableOpacity
                style={[
                    styles.menuBook1Item,
                    { alignItems:'center'  },
                ]}
            >
                <View style={styles.menuBook1Circle}>
                    <View style={[styles.bookVw,{height:'100%'}]}>
                        <Image source={item.uri}  style={{height:'100%',width:'100%',resizeMode: 'cover',borderTopLeftRadius:5,
                            borderTopRightRadius:5}}/>
                    </View>
                    <View style={{height:'100%',width:2,backgroundColor:'gray',marginLeft: 20}}/>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text>Diary - 2019</Text>
                    <Text>For rs.99 Shop Now</Text>
                </View>
                <View style={{backgroundColor:'gray',height:1,width:'100%'}}/>
                <View style={[styles.menuBook1Circle,{marginTop:15}]}>
                    <View style={[styles.bookVw,{height:'100%'}]}>
                        <Image source={this.state.books2[index].uri}  style={{height:'100%',width:'100%',resizeMode: 'cover',borderTopLeftRadius:5,
                            borderTopRightRadius:5}}/>
                    </View>
                    <View style={{height:'100%',width:2,backgroundColor:'gray',marginLeft: 20}}/>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text>Diary - 2019</Text>
                    <Text>For rs.99 Shop Now</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <ScrollView>
                    <View style={{width:'100%',marginTop:10,height:Width(30)}}>
                        <FlatList
                            horizontal={true}
                            data={this.state.menu}
                            renderItem={({ item,index }) => this.renderItem(item,index)}
                            style={{width:'100%',marginTop:10,height:30}}
                        />
                    </View>
                    <View style={{width:'100%',height:200}}>
                        <FlatList
                            horizontal={true}
                            data={this.state.albums}
                            renderItem={({ item,index }) => this.renderAlbumItem(item,index)}
                            style={{width:'100%',height:200}}
                        />
                    </View>

                    <View style={{marginTop:10}}>
                        <Text style={{marginLeft:20,fontSize:15,fontWeight:'bold'}}>Special Offers</Text>
                        <FlatList
                            horizontal={true}
                            data={this.state.books}
                            renderItem={({ item,index }) => this.renderBookItem(item,index)}
                            style={{width:'100%',marginTop:15}}
                        />
                    </View>
                    <View style={{backgroundColor:'gray',height:5,width:'100%'}}/>
                    <View style={{marginTop:10}}>
                        <Text style={{marginLeft:20,fontSize:15,fontWeight:'bold'}}>Deals of the Day</Text>
                        <FlatList
                            horizontal={true}
                            data={this.state.books1}
                            renderItem={({ item,index }) => this.renderBookItemNew(item,index)}
                            style={{width:'100%',marginTop:15}}
                        />
                    </View>
                    <View style={{backgroundColor:'gray',height:5,width:'100%',marginTop:10}}/>
                    <View style={{marginTop:10}}>
                        <Text style={{marginLeft:20,fontSize:15,fontWeight:'bold'}}>Best Seller</Text>
                        <FlatList
                            horizontal={true}
                            data={this.state.books1}
                            renderItem={({ item,index }) => this.renderBookItem(item,index)}
                            style={{width:'100%',marginTop:15}}
                        />
                    </View>
                </ScrollView>
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
        height: Layout.HEADER_HEIGHT,
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    navigationBarLeftButton: {
        marginTop: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        marginLeft: Width(4),
        marginBottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
    },
    navigationBarTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop:Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 : 0,
        alignItems: 'center',
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
    },
    menuItem:{
        width:Width(20),
        height:Width(20),
    },
    menuCircle:{
        height:'70%',
        width:'70%',
        marginTop:0,
        borderRadius:Width(15) /2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuAlbumItem:{
        width:Width(100),
        height:200,
    },
    menuAlbumCircle:{
        height:'90%',
        width:'85%',
        borderRadius:5,
        elevation:5,
        backgroundColor:'white'
    },
    albumVw:{
        height:'100%',
        width:'100%',
        marginTop:0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e9e2e9',
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        flexDirection:'row'
    },
    menuBookItem:{
        width:Width(40),
        height:220,
    },
    menuBookCircle:{
        height:'70%',
        width:'75%',
        borderRadius:5,
        elevation:5,
        backgroundColor:'white',
        flexDirection:'row',
    },
    bookVw:{
        height:'65%',
        width:'100%',
        marginTop:0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e9e2e9',
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },
    menuBook1Item:{
        width:Width(40),
        height:440,
    },
    menuBook1Circle:{
        height:'40%',
        width:'75%',
        borderRadius:5,
        elevation:5,
        backgroundColor:'white',
        flexDirection:'row',
    },
})
