import React,{Component} from 'react';
import { AsyncStorage } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import DashboardScreen from './src/screens/Dashboard'
import AlbumListScreen from './src/screens/AlbumList'
import DrawerScreen from "./src/screens/DrawerScreen";
import SongsListScreen from "./src/screens/SongsList";
import PlayerScreen from "./src/screens/PlayerScreen"
import SingupScreen from "./src/screens/User/Singup"
import SinginScreen from "./src/screens/User/Signin"
import SingupOtpScreen from "./src/screens/User/Signupotp"
import SingupFullScreen from "./src/screens/User/Signupfull"
import NavigatorService from './src/services/navigator';
import DownloadScreen from './src/screens/DownloadSong';
import TrackPlayer from 'react-native-track-player';



export const Dashboard_StackNavigator = createStackNavigator({
    //All the screen from the Screen1 will be indexed here
    DashboardScreen:{screen: DashboardScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    AlbumListScreen:{screen: AlbumListScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SongsListScreen:{screen: SongsListScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    PlayerScreen:{screen: PlayerScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    DownloadScreen:{screen: DownloadScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
},{
    initialRouteName: 'DashboardScreen'
});

export const DashboardNavigator = createDrawerNavigator({
        Home: {
            screen: Dashboard_StackNavigator, navigationOptions: {
                header: null, gesturesEnabled: false,
            }
        }

},{
    initialRouteName:  "Home",
        contentComponent: props => <DrawerScreen {...props} />,
});

export const Login_StackNavigator = createStackNavigator({
    //All the screen from the Screen1 will be indexed here

    SinginScreen:{screen: SinginScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupScreen:{screen: SingupScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupOtpScreen:{screen: SingupOtpScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupFullScreen:{screen: SingupFullScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    DrawerScreen:{screen: DashboardNavigator,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
},{
    initialRouteName: 'SinginScreen'
});

export const Home_StackNavigator = createStackNavigator({
    //All the screen from the Screen1 will be indexed here

    SinginScreen:{screen: SinginScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupScreen:{screen: SingupScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupOtpScreen:{screen: SingupOtpScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    SingupFullScreen:{screen: SingupFullScreen,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
    DrawerScreen:{screen: DashboardNavigator,navigationOptions: {
            header: null,gesturesEnabled: false,
        }},
},{
    initialRouteName: 'DrawerScreen'
});



const AppContainer = createAppContainer(Login_StackNavigator);
const AppContainer1 = createAppContainer(Home_StackNavigator);

export default  class App extends Component {
    constructor(props){
        super(props);
        this.state={token:"fetching",};

    }

    componentDidMount() {
        AsyncStorage.getItem('userkey').then((value) => {
            console.log("toke===",value);
            this.setState({'token': value})
        })
    }

    render() {
        if (this.state.token === 'fetching')
            return null;
        else {
            return (
                this.state.token ?
                    <AppContainer1
                        ref={navigatorRef => {
                            NavigatorService.setContainer(navigatorRef);
                        }}
                    /> :
                    <AppContainer
                        ref={navigatorRef => {
                            NavigatorService.setContainer(navigatorRef);
                        }}
                    />
            );
        }
    }
}

TrackPlayer.registerEventHandler(require('./player-handler'));


