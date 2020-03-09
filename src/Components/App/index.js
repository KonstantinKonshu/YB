import React, {Component, PureComponent} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import SearchBar from "../Searchbar";
import YoutubeAPI from "../YoutubeAPI";
import VideoList from "../VideoList"
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
// import createBrowserHistory from "history/createBrowserHistory";
import { createBrowserHistory } from "history";
import Qwerty from "../qwerty"
import CurrentVideoList from "../CurrentVideoList";
import CurrentChannelList from "../CurrentChannelList";
import "./style.css";



const KEY = 'AIzaSyA01SERnn1EhrWJd_96D-EbXqW6fI6okMM';
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
            selectedCV: null
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
        console.log('componentDidMount');
        const  s = qs.parse(history.location.search);
        console.log(s);
        if(s['search']!==undefined)
            this.handleSubmit(s['search']);
        if(s['id']!==undefined)
            this.handleSubmit(s['id']);
        console.log('history', history);
        document.addEventListener('mouseup', this.handleOnClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleOnClick);
    }

    handleVideoSelect = (video) => {
        console.log('fun handleVideoSelect');
        if(video.id.kind==="youtube#video"){
            console.log('click video');
            this.setState({
                selectedVideo: video,
                isOpenModal: true,

            });
        }
        if(video.id.kind==="youtube#channel"){
            console.log('click channel');
            this.setState({
                channelId: video.snippet.channelId,
                selectedVideo: video,
                nameTitle: `Channel ${video.snippet.title}`,
                isOpenChannel: true
            });
            console.log(this.state)
            this.clickChannelSelect(video)
        }

    };


    clickChannelSelect = (channel) =>{

        console.log('clickChannelSelect');
        const params = {
            channelId: channel.id.channelId,
            part: 'snippet',
            key: KEY,
            maxResults: 10
        };
        YoutubeAPI.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then(response =>{
                this.setState({
                    videos: response.data.items
                });
                console.log("channelCL", response )
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
                            <CurrentChannelList
                                history={history}
                            />
                        </Route>
                    </div>

                </div>
            </Router>
        )
    };


    handleSubmit = (termFromSearchBar) => {
        console.log('handleSubmit');
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
            console.log('term++ ', termFromSearchBar);

            YoutubeAPI.get(`https://www.googleapis.com/youtube/v3/videos?id=${termFromSearchBar}&key=${KEY}&part=snippet,contentDetails,statistics,status`)
                .then(response =>{
                        this.setState({
                            selectedCV: response.data.items,
                            selectedVideo: null
                        })
                    console.log("handleSubmitCURRENT--requiest", response)
                }

                )
                .catch(error => console.log("ERROR", error));
            // const params = {
            //     id: termFromSearchBar,
            //     part: 'id,snippet,contentDetails',
            //     key: KEY
            // };
            // YoutubeAPI.get('https://www.googleapis.com/youtube/v3/videos', {params})
            //     .then(response =>{
            //             this.setState({
            //                 selectedVideo: response.data.items
            //             })
            //         console.log("red", response)
            //     }
            //
            //     )
            //     .catch(error => console.log("ERROR", error));
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
                            prevPageToken: response.data.prevPageToken
                        })
                    )
                    .catch(error => console.log("ERROR", error));
                this.setState({
                    checkBtn:false
                });
            }
        }

    };



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