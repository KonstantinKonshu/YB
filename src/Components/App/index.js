import React, {Component, PureComponent} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import SearchBar from "../Searchbar";
import YoutubeAPI from "../YoutubeAPI";
import VideoList from "../VideoList"
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import { createBrowserHistory } from "history";
import Qwerty from "../qwerty"
import CurrentVideoList from "../CurrentVideoList";
import CurrentChannelList from "../CurrentChannelList";
import "./style.css";



const KEY = 'AIzaSyAD4ZUwYz0WNLqyY13sJPmYprBEPJrvlk4';
const history = createBrowserHistory();
const qs = require('query-string');

class App extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            nextPageToken: null,
            prevPageToken: null,
            selectedVideo: null,
            pageToken: null,
            search: "",
            isOpenChannel: false,
            nameTitle: "My app",
            channelId: null,
            checkBtn: false,
            selectedCV: null,
            bannerChannel: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVideoSelect = this.handleVideoSelect.bind(this);
        this.handleLeafing = this.handleLeafing.bind(this);
    }

    handleOnClick = e => {
        console.log('handleOnClick');
        // let pol = document.getElementById('pol');
        //
        // if (e.target != pol && e.target.parentNode != pol) {
        //     this.setState({
        //         selectedVideo: null,
        //         isOpenModal: null
        //     })
        // }

        let btn_s = document.getElementById('btn_s');
        if (e.target == btn_s || e.target.parentNode == btn_s) {
                this.setState({
                    checkBtn: true
                })
            }

    };

    componentDidMount() {
        console.log('componentDidMount-his', history);
        const  s = qs.parse(history.location.search);
        console.log("elem S=== ",s);
        if(s['search']!==undefined){
            console.log("s_search");
            this.handleSubmit(s['search']);
        }
        else{
            if(s['ChannelId']!==undefined){
                console.log("s_channelID");
                this.handleSubmit(s['ChannelId']);
            }else{
                if(['id']!==undefined){
                    console.log("s_id");
                    this.handleSubmit(s['id']);
                }
            }
        }

        document.addEventListener('mouseup', this.handleOnClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleOnClick);
    }

    handleVideoSelect = (video) => {
        if(video.id.kind==="youtube#video"){
            this.setState({
                selectedVideo: video,
                isOpenModal: true
            });
        }
        if(video.id.kind==="youtube#channel"){
            this.setState({
                channelId: video.snippet.channelId,
                selectedVideo: video,
                nameTitle: `Channel ${video.snippet.title}`,
                isOpenChannel: true
            });
            this.clickChannelSelect(video.id.channelId)
        }

    };


    clickChannelSelect = (channelID) =>{

        console.log('clickChannelSelect', channelID);
        const params = {
            channelId: channelID,
            part: 'snippet',
            key: KEY,
            maxResults: 10
        };
        YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then(response =>
                this.setState({
                    videos: response.data.items
                })
            )
            .catch(error => console.log("ERROR", error));


        YoutubeAPI.get('https://www.googleapis.com/youtube/v3/channels',{
            params:{
                id: channelID,
                part: 'snippet,brandingSettings',
                key: KEY
            }
            })
            .then(response =>{
                this.setState({
                    bannerChannel: response.data.items[0].brandingSettings.image.bannerImageUrl,
                    isOpenChannel: true,
                    checkBtn: false
                });
                console.log('banner', this.state.bannerChannel);
            })
            .catch(error => console.log("ERROR", error));

        document.getElementById('btn-back').style.display = 'initial';
    };





    render() {
       return (
            <Router history={history}>
                <div>
                    <div className="header_jumbotron"/*className="jumbotron"*/>
                        <SearchBar handleFormSubmit={this.handleSubmit} //searchStr = {this.state.search}
                                   history={history}
                        />
                    </div>

                    <div className="bannerChannel">
                        <img className="img_banner" src={this.state.isOpenChannel && this.state.bannerChannel}/>
                    </div>

                    <div className="container">
                        {this.state.nameTitle}
                        <div>
                            <Route path={`/videolist`}>
                                <VideoList handleVideoSelect={this.handleVideoSelect} videos={this.state.videos}
                                   selectedVideo = {this.state.selectedVideo} search = {this.state.search} history={history}
                                        isOpenChannel={this.state.isOpenChannel}
                                />
                            </Route>
                        </div>

                        <div id="div_btn_control">
                            <button id='prev'  style={{display: 'none'}} onClick={() => this.handleLeafing(this.state.prevPageToken, false)}>Previous</button>
                            <button id='next' onClick={()=>this.handleLeafing(this.state.nextPageToken, true)}>Next</button>
                        </div>
                    </div>

                    <div>
                        <Route path='/current-video'>
                            <CurrentVideoList history={history} videos={this.state.videos}
                                              selectedVideo = {this.state.selectedVideo}
                                              handleVideoSelect={this.handleVideoSelect}
                                              isOpenChannel={this.state.isOpenChannel}
                                              selectedCV={this.state.selectedCV}
                            />
                        </Route>
                    </div>

                    <div>
                        <Route path='/current-channel'>
                            <CurrentChannelList history={history} videos={this.state.videos}
                                                selectedVideo = {this.state.selectedVideo}
                                                handleVideoSelect={this.handleVideoSelect}
                                                isOpenChannel={this.state.isOpenChannel}
                            />
                        </Route>
                    </div>

                </div>
            </Router>
        )
    };


    handleSubmit = (termFromSearchBar) => {
        console.log('handleSubmit', termFromSearchBar);
        document.getElementById('btn-back').style.display = 'none';
        document.getElementById('prev').style.display = 'none';
        document.getElementById('next').style.display = 'initial';


        this.setState({
            search: termFromSearchBar,
            nameTitle: termFromSearchBar,
            channelId: null,
            isOpenChannel:false
        });

        // if(history.location.pathname==="/videolist" || this.state.checkBtn){
        //     console.log('handleSubmitSEARCH');
        //     const params = {
        //         q: termFromSearchBar,
        //         part: 'snippet',
        //         key: KEY,
        //         maxResults: 10
        //     };
        //     YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
        //         .then(response =>
        //             this.setState({
        //                 videos: response.data.items,
        //                 nextPageToken: response.data.nextPageToken,
        //                 prevPageToken: response.data.prevPageToken
        //             })
        //         )
        //         .catch(error => console.log("ERROR", error));
        //     this.setState({
        //         checkBtn:false
        //     });
        // }
        // else{
        //     if(history.location.pathname==="/current-video"){
        //         console.log('handleSubmitCURRENT');
        //         const params = {
        //             id: termFromSearchBar,
        //             part: 'snippet'
        //         };
        //         YoutubeAPI.get('https://www.googleapis.com/youtube/v3/videos', {params})
        //             .then(response =>
        //                 this.setState({
        //                     selectedVideo: response.data.items
        //                 })
        //             )
        //             .catch(error => console.log("ERROR", error));
        //
        //
        //     }
        // }

        if(history.location.pathname==="/current-video" && !this.state.checkBtn){
            console.log('handleSubmitCURRENT-Video');
            YoutubeAPI.get(`https://www.googleapis.com/youtube/v3/videos?id=${termFromSearchBar}&key=${KEY}&part=snippet,contentDetails,statistics,status`)
                .then(response =>{
                    this.setState({
                        selectedCV: response.data.items,
                        selectedVideo: null
                    });
                    console.log("handleSubmitCURRENT--requiest", response)
                    this.gettingSimilarVideos(response.data.items[0].snippet.title)
                })
                .catch(error => console.log("ERROR", error));
            // this.submitToCurrentVideo(termFromSearchBar);
        }
        else{
            if(history.location.pathname==="/videolist" || this.state.checkBtn){
                console.log('handleSubmitSEARCH');
                const params = {
                    q: termFromSearchBar,
                    part: 'snippet',
                    key: KEY,
                    maxResults: 10
                };
                YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
                    .then(response =>
                        this.setState({
                            videos: response.data.items,
                            nextPageToken: response.data.nextPageToken,
                            prevPageToken: response.data.prevPageToken,
                            checkBtn:false
                        })
                    )
                    .catch(error => console.log("ERROR", error));
                // this.submitToVideolist(termFromSearchBar);
                // this.setState({
                //     checkBtn:false
                // });
            }
            else{
                if(history.location.pathname==="/current-channel"){
                    console.log('handleSubmitCURRENT-CHANNEL');
                    this.clickChannelSelect(termFromSearchBar);
                    // this.setState({
                    //     checkBtn:false
                    // });
                    document.getElementById('btn-back').style.display = 'initial';
                }
            }
            // this.setState({
            //     checkBtn:false
            // });
        }

    };

    // submitToCurrentVideo = (term) =>{
    //     // YoutubeAPI.get(`https://www.googleapis.com/youtube/v3/videos?id=${term}&key=${KEY}&part=snippet,contentDetails,statistics,status`)
    //     //     .then(response =>{
    //     //         this.setState({
    //     //             selectedCV: response.data.items,
    //     //             selectedVideo: null
    //     //         });
    //     //         console.log("handleSubmitCURRENT--requiest", response)
    //     //         this.gettingSimilarVideos(response.data.items[0].snippet.title)
    //     //     })
    //     //     .catch(error => console.log("ERROR", error));
    // };


    // submitToVideolist = (term) =>{
    //     const params = {
    //         q: term,
    //         part: 'snippet',
    //         key: KEY,
    //         maxResults: 10
    //     };
    //     YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
    //         .then(response =>
    //             this.setState({
    //                 videos: response.data.items,
    //                 nextPageToken: response.data.nextPageToken,
    //                 prevPageToken: response.data.prevPageToken
    //             })
    //         )
    //         .catch(error => console.log("ERROR", error));
    // };


    // submitToCurrentChannel = (term) =>{
    //     const params = {
    //         id: term,
    //         part: 'snippet',
    //         key: KEY
    //     };
    //     YoutubeAPI.get('https://www.googleapis.com/youtube/v3/channels', {params})
    //         .then(response =>
    //             this.setState({
    //                 channelId: response.data.items
    //             })
    //         )
    //         .catch(error => console.log("ERROR", error));
    //
    // };

    gettingSimilarVideos = (termName) => {
        const params = {
            q: termName,
            part: 'snippet',
            key: KEY,
            maxResults: 10
        };
        console.log("termName", termName);
        YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then(response =>
                this.setState({
                    videos: response.data.items,
                    nextPageToken: response.data.nextPageToken,
                    prevPageToken: response.data.prevPageToken
                })
            )
            .catch(error => console.log("ERROR", error));
    };

    // handleSubChannel = (videoId, channelId) =>{
    //     console.log('handleSubmitCURRENT-CHANNEL');
    //     const params = {
    //         channelId: channelId,
    //         part: 'snippet',
    //         key: KEY,
    //         maxResults: 10
    //     };
    //     YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
    //         .then(response =>{
    //             this.setState({
    //                 videos: response.data.items
    //             });
    //             console.log("channelCLICKSELECT", response )
    //         })
    //         .catch(error => console.log("ERROR", error));
    //
    //
    //
    //
    //
    // };

    handleLeafing = (pgToken, indicator) => {
        console.log('handleLeafing');
        let params = {
            q: this.state.search,
            part: 'snippet',
            key: KEY,
            maxResults: 10,
            pageToken: pgToken,
        };
        if (indicator) document.getElementById('prev').style.display = 'initial';

        if (this.state.channelId !== null) {
            params["channelId"] = this.state.channelId;
            params['type'] = "video";
        }
        YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then(response => {
                this.setState({
                    videos: response.data.items,
                    nextPageToken: response.data.nextPageToken,
                    prevPageToken: response.data.prevPageToken
                });
                console.log(response.data.prevPageToken);
                if (response.data.prevPageToken === undefined)
                    document.getElementById('prev').style.display = 'none';
                })
            .catch(error => console.log("ERROR", error));
    };
}

export default App