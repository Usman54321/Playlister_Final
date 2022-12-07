import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
//console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_PAGE: "SET_PAGE",
    SET_SORT_TYPE: "SET_SORT_TYPE",
    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    ADD_VIEW: "ADD_VIEW",
}


// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG"
}

const SortType = {
    CREATION_DATE: "CREATION_DATE",
    LAST_EDIT_DATE: "LAST_EDIT_DATE",
    NAME: "NAME",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES",
    PUBLISHED_DATE: "PUBLISHED_DATE",
    LISTENS: "LISTENS",
}

const CurrentPage = {
    HOME: "HOME",
    COMMUNITY: "COMMUNITY",
    USER: "USER",
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        currentPage: CurrentPage.HOME,
        currentSort: SortType.CREATION_DATE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentPlayingList: null,
    });
    const history = useHistory();

    //console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    //console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        // console.log("Store: " + JSON.stringify(store, null, 3));

        if (type === GlobalStoreActionType.LOAD_ID_NAME_PAIRS || type === GlobalStoreActionType.SET_CURRENT_LIST || type === GlobalStoreActionType.SET_SORT_TYPE || type === GlobalStoreActionType.ADD_VIEW) {
            console.log("storeReducer: " + type + " " + JSON.stringify(payload, null, 3));
        }
        else
            console.log("storeReducer: " + type + " " + payload);

        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    // currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: store.currentList,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // START EDITING A SONG
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // START REMOVING A SONG
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // HIDE MODALS
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }
            // SET THE CURRENT PAGE
            case GlobalStoreActionType.SET_PAGE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: payload.page,
                    currentSort: payload.sort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: null,
                });
            }

            case GlobalStoreActionType.SET_SORT_TYPE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: payload.sortType,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: store.currentPlayingList,
                });
            }

            case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: payload,
                });
            }

            case GlobalStoreActionType.ADD_VIEW: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentPage: store.currentPage,
                    currentSort: store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPlayingList: payload.id,
                });
            }

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                let sorted = store.sortHelper(pairsArray, store.currentSort);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: sorted,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        // history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let num = 0;
        let newListName = "Untitled" + num;
        let response = await api.getPlaylistPairs();
        if (response.data.success) {
            let ourPlaylists = response.data.idNamePairs;
            while (ourPlaylists.some((playlist) => playlist.name === newListName)) {
                num++;
                newListName = "Untitled" + num;
            }
        }
        response = await api.createPlaylist(newListName, [], auth.user.userName);
        // console.log("createNewList response: " + JSON.stringify(response, null, 3));
        if (response.status === 201) {
            tps.clearAllTransactions();
            // let newList = response.data.playlist;
            const response2 = await api.getPlaylistPairs();
            if (response2.data.success) {
                let pairsArray = response2.data.idNamePairs;
                let sorted = store.sortHelper(pairsArray, store.currentSort);
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: sorted
                });
            }
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/playlist/" + newList._id);
            // store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let sorted = store.sortHelper(pairsArray, store.currentSort);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: sorted
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs()
                history.push("/");
                store.hideModals();
            }
            else {
                console.log("API FAILED TO DELETE THE LIST");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        // if (store.listIdMarkedForDeletion === store.currentPlayingList) {
        //     store.setPlayingList(null);
        // }
        store.deleteList(store.listIdMarkedForDeletion);
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    // history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    let sorted = store.sortHelper(pairsArray, store.currentSort);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                        payload: {
                            idNamePairs: sorted,
                            playlist: store.currentList
                        }
                    });
                }
            }
        }
        asyncUpdateCurrentList();
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function () {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.isModalOpen = () => {
        return store.currentModal !== CurrentModal.NONE;
    }

    store.search = (query) => {
        if (query === "") {
            store.clearIDNamePairs();
            return;
        }
        if (store.currentPage === CurrentPage.HOME) {
            async function asyncLoadIdNamePairs() {
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    let sorted = store.sortHelper(pairsArray, store.currentSort);
                    let filteredPairsArray = sorted.filter(pair =>
                        pair.name.toLowerCase().includes(query.toLowerCase()));
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: filteredPairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadIdNamePairs();
        }
        else if (store.currentPage === CurrentPage.COMMUNITY) {
            async function asyncLoadCommunityIdNamePairs() {
                const response = await api.getPlaylistPairsForCommunity();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    let sorted = store.sortHelper(pairsArray, store.currentSort);
                    let filteredPairsArray = sorted.filter(pair =>
                        pair.name.toLowerCase().includes(query.toLowerCase()));
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: filteredPairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadCommunityIdNamePairs();
        }
        else if (store.currentPage === CurrentPage.USER) {
            async function asyncLoadCommunityIdNamePairs() {
                const response = await api.getPlaylistPairsForCommunity();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    let sorted = store.sortHelper(pairsArray, store.currentSort);
                    let filteredPairsArray = sorted.filter(pair =>
                        pair.ownerUserName.toLowerCase() === query.toLowerCase());
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: filteredPairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadCommunityIdNamePairs();
        }
    }

    store.setPage = (page) => {
        let url = ""
        let sort = SortType.CREATION_DATE;
        if (page === CurrentPage.HOME) {
            url = "/";
        }
        else if (page === CurrentPage.COMMUNITY) {
            url = "/community-lists";
            sort = SortType.NAME;

        }
        else if (page === CurrentPage.USER) {
            url = "/user-lists";
            sort = SortType.NAME;
        }
        storeReducer({
            type: GlobalStoreActionType.SET_PAGE,
            payload: {
                page: page,
                sort: sort
            }
        });
        history.push(url);
    }

    store.getPlaylistById = async (id) => {
        const response = await api.getPlaylistById(id);
        if (response.data.success) {
            return response.data.playlist;
        }
    }

    // store.editPlaylist = (id) => {
    //     async function asyncEditPlaylist(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;

    //             response = await api.updatePlaylistById(playlist._id, playlist);
    //             if (response.data.success) {
    //                 storeReducer({
    //                     type: GlobalStoreActionType.EDIT_PLAYLIST,
    //                     payload: playlist
    //                 });
    //                 history.push("/edit-playlist/" + id);
    //             }
    //         }
    //     }
    //     asyncEditPlaylist(id);
    // }

    store.getSongsByPlaylistId = async (id) => {
        const response = await api.getPlaylistById(id);
        if (response.data.success) {
            return response.data.playlist.songs;
        }
    }

    store.likePlaylist = async (id, userName) => {
        let response = await api.getPublicPlaylistByID(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            // console.log("Playlist likes: " + playlist.likes.toString());

            // If this user has disliked the playlist, remove them from the dislikes array
            if (playlist.dislikes.includes(userName)) {
                let index = playlist.dislikes.indexOf(userName);
                playlist.dislikes.splice(index, 1);
            }

            if (playlist.likes.includes(userName)) {
                // console.log("User with username " + userName + " already liked this playlist");
                playlist.likes = playlist.likes.filter(user => user !== userName);
            }
            else {
                // console.log("User with username " + userName + " has not liked this playlist");
                playlist.likes.push(userName);
            }

            response = await api.updatePublicFeatures(playlist._id, playlist);
            if (response.data.success) {
                // Now we need to map playlist pairs again
                if (store.currentPage === CurrentPage.HOME) {
                    async function asyncLoadIdNamePairs() {
                        const response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                payload: sortedPairsArray
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.COMMUNITY) {
                    async function asyncLoadCommunityIdNamePairs() {
                        const response = await api.getPlaylistPairsForCommunity();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                payload: sortedPairsArray
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadCommunityIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.USER) {
                    let modifiedIdNamePairs = [...store.idNamePairs];
                    for (let i = 0; i < modifiedIdNamePairs.length; i++) {
                        if (modifiedIdNamePairs[i]._id === id) {
                            modifiedIdNamePairs[i] = playlist;
                            break;
                        }
                    }
                    let sorted = store.sortHelper(modifiedIdNamePairs, store.currentSort);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: sorted
                    });
                }
            }
        }
    }

    store.dislikePlaylist = async (id, userName) => {
        let response = await api.getPublicPlaylistByID(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            // console.log("Playlist dislikes: " + playlist.dislikes.toString());

            // If this user has liked the playlist, remove them from the likes array
            if (playlist.likes.includes(userName)) {
                let index = playlist.likes.indexOf(userName);
                playlist.likes.splice(index, 1);
            }

            if (playlist.dislikes.includes(userName)) {
                // console.log("User with username " + userName + " already disliked this playlist");
                playlist.dislikes = playlist.dislikes.filter(user => user !== userName);
            }
            else {
                // console.log("User with username " + userName + " has not disliked this playlist");
                playlist.dislikes.push(userName);
            }

            response = await api.updatePublicFeatures(playlist._id, playlist);
            if (response.data.success) {
                // Now we need to map playlist pairs again
                if (store.currentPage === CurrentPage.HOME) {
                    async function asyncLoadIdNamePairs() {
                        const response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                payload: sortedPairsArray
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.COMMUNITY) {
                    async function asyncLoadCommunityIdNamePairs() {
                        const response = await api.getPlaylistPairsForCommunity();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                payload: sortedPairsArray
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadCommunityIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.USER) {
                    let modifiedIdNamePairs = [...store.idNamePairs];
                    for (let i = 0; i < modifiedIdNamePairs.length; i++) {
                        if (modifiedIdNamePairs[i]._id === id) {
                            modifiedIdNamePairs[i] = playlist;
                            break;
                        }
                    }
                    let sorted = store.sortHelper(modifiedIdNamePairs, store.currentSort);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: sorted
                    });
                }
            }
        }
    }

    store.viewPlaylist = async (id) => {
        let response = await api.getPublicPlaylistByID(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            playlist.views = playlist.views + 1;
            response = await api.updatePublicFeatures(playlist._id, playlist);
            if (response.data.success) {
                // Now we need to map playlist pairs again
                if (store.currentPage === CurrentPage.HOME) {
                    async function asyncLoadIdNamePairs() {
                        const response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sorted = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.ADD_VIEW,
                                payload: {
                                    idNamePairs: sorted,
                                    id: id,
                                }
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.COMMUNITY) {
                    async function asyncLoadCommunityIdNamePairs() {
                        const response = await api.getPlaylistPairsForCommunity();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            let sorted = store.sortHelper(pairsArray, store.currentSort);
                            storeReducer({
                                type: GlobalStoreActionType.ADD_VIEW,
                                payload: {
                                    idNamePairs: sorted,
                                    id: id,
                                }
                            });
                        }
                        else {
                            console.log("API FAILED TO GET THE LIST PAIRS");
                        }
                    }
                    asyncLoadCommunityIdNamePairs();
                }
                else if (store.currentPage === CurrentPage.USER) {
                    // If we're in the user view we just use the current idNamePairs
                    let modifiedIdNamePairs = store.idNamePairs;
                    for (let i = 0; i < modifiedIdNamePairs.length; i++) {
                        if (modifiedIdNamePairs[i]._id === id) {
                            modifiedIdNamePairs[i] = playlist;
                            break;
                        }
                    }
                    let sorted = store.sortHelper(modifiedIdNamePairs, store.currentSort);
                    storeReducer({
                        type: GlobalStoreActionType.GlobalStoreActionType.ADD_VIEW,
                        payload: {
                            idNamePairs: sorted,
                            id: id,
                        }
                    });
                }
            }
        }
    }

    store.addComment = (username, comment) => {
        async function asyncAddComment(username, comment) {
            let response = await api.getPublicPlaylistByID(store.currentPlayingList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.comments.push({ userName: username, comment: comment });
                response = await api.updatePublicFeatures(playlist._id, playlist);
                if (response.data.success) {
                    // Now we need to map playlist pairs again
                    if (store.currentPage === CurrentPage.HOME) {
                        async function asyncLoadIdNamePairs() {
                            const response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: sortedPairsArray
                                });
                            }
                            else {
                                console.log("API FAILED TO GET THE LIST PAIRS");
                            }
                        }
                        asyncLoadIdNamePairs();
                    }
                    else if (store.currentPage === CurrentPage.COMMUNITY) {
                        async function asyncLoadCommunityIdNamePairs() {
                            const response = await api.getPlaylistPairsForCommunity();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                let sortedPairsArray = store.sortHelper(pairsArray, store.currentSort);
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: sortedPairsArray
                                });
                            }
                            else {
                                console.log("API FAILED TO GET THE LIST PAIRS");
                            }
                        }
                        asyncLoadCommunityIdNamePairs();
                    }
                    else if (store.currentPage === CurrentPage.USER) {
                        let modifiedIdNamePairs = [...store.idNamePairs];
                        for (let i = 0; i < modifiedIdNamePairs.length; i++) {
                            if (modifiedIdNamePairs[i]._id === id) {
                                modifiedIdNamePairs[i] = playlist;
                                break;
                            }
                        }
                        let sorted = store.sortHelper(modifiedIdNamePairs, store.currentSort);
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: sorted
                        });
                    }
                }
            }
        }
        asyncAddComment(username, comment);
    }

    store.duplicatePlaylist = (playlist, userName) => {
        async function asyncDuplicatePlaylist(playlist, username) {
            let playlistName = playlist.name;
            // Make sure the playlistName is uniquely named
            // We do this by appending a number to the end of the playlist name
            let num = 0;
            // While it's present in that our playlists, keep incrementing the number
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let ourPlaylists = response.data.idNamePairs;
                while (ourPlaylists.some(p => p.name === playlistName)) {
                    playlistName = playlist.name + num;
                    num++;
                }
                let playlistSongs = playlist.songs;
                response = await api.createPlaylist(playlistName, playlistSongs, username);
                if (response.status === 201) {
                    tps.clearAllTransactions();
                    // if (store.page === CurrentPage.HOME) {
                    response = await api.getPlaylistPairs();
                    // }
                    // else if (store.page === CurrentPage.COMMUNITY) {
                    //     response = await api.getPublicPlaylistPairs();
                    // }
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        let sorted = store.sortHelper(pairsArray, store.currentSort);
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: sorted
                        });
                        if (store.currentPage !== CurrentPage.HOME) {
                            store.setPage(CurrentPage.HOME);
                        }
                    }
                }
            }
        }
        asyncDuplicatePlaylist(playlist, userName);
    }

    store.publishPlaylist = (id) => {
        async function asyncPublishPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let date = new Date();
                console.log("Setting playlist at " + id + " to date " + date);
                playlist.published = date;
                console.log(JSON.stringify(playlist, null, 3));
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        let sorted = store.sortHelper(pairsArray, store.currentSort);
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: sorted
                        });
                    }
                }
            }
        }
        asyncPublishPlaylist(id);
    }

    store.loadIdNamePairsForCommunity = () => {
        async function asyncLoadIdNamePairsForCommunity() {
            let response = await api.getPlaylistPairsForCommunity();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let sorted = store.sortHelper(pairsArray, store.currentSort);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: sorted
                });
            }
        }
        asyncLoadIdNamePairsForCommunity();
    }

    store.setCurrentListForCommunity = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPublicPlaylistByID(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPublicPlaylistByID = async (id) => {
        let response = await api.getPublicPlaylistByID(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            return playlist;
        }
    }

    store.setSortType = (sortType) => {
        switch (sortType) {
            case "creationDate":
                sortType = SortType.CREATION_DATE;
                break;
            case "lastEditDate":
                sortType = SortType.LAST_EDIT_DATE;
                break;
            case "name":
                sortType = SortType.NAME;
                break;
            case "likes":
                sortType = SortType.LIKES;
                break;
            case "dislikes":
                sortType = SortType.DISLIKES;
                break;
            case "publishedDate":
                sortType = SortType.PUBLISHED_DATE;
                break;
            case "listens":
                sortType = SortType.LISTENS;
                break;
            default:
                console.log("Invalid sort type " + sortType);
                break;
        }
        let playlists = store.idNamePairs;
        let sorted = store.sortHelper(playlists, sortType);
        let payload = {
            idNamePairs: sorted,
            sortType: sortType
        }
        console.log("Payload being passed into SET_SORT_TYPE:")
        console.log(JSON.stringify(payload, null, 3));
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_TYPE,
            payload: payload
        });
    }

    store.sortHelper = (lists, sortType) => {
        let sortedPairsArray = null;
        if (sortType === SortType.CREATION_DATE) {
            // Sort by creation date oldest to newest
            sortedPairsArray = lists.sort((a, b) => {
                let aDate = new Date(a.createdAt);
                let bDate = new Date(b.createdAt);
                return aDate - bDate;
            });
        }
        else if (sortType === SortType.LAST_EDIT_DATE) {
            // Sort by last edit date newest to oldest
            sortedPairsArray = lists.sort((a, b) => {
                let aDate = new Date(a.updatedAt);
                let bDate = new Date(b.updatedAt);
                return bDate - aDate;
            });
        }
        else if (sortType === SortType.NAME) {
            // Sort by name alphabetically
            sortedPairsArray = lists.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
        else if (sortType === SortType.LIKES) {
            // Sort by likes most to least
            sortedPairsArray = lists.sort((a, b) => {
                return b.likes.length - a.likes.length;
            });
        }
        else if (sortType === SortType.DISLIKES) {
            // Sort by dislikes most to least
            sortedPairsArray = lists.sort((a, b) => {
                return b.dislikes.length - a.dislikes.length;
            });
        }
        else if (sortType === SortType.PUBLISHED_DATE) {
            // Sort by published date newest to oldest
            sortedPairsArray = lists.sort((a, b) => {
                // a and b are both Dates
                let aDate = new Date(a.published);
                let bDate = new Date(b.published);
                return bDate - aDate;
            });
        }
        else if (sortType === SortType.LISTENS) {
            // Sort by listens most to least
            sortedPairsArray = lists.sort((a, b) => {
                return b.views - a.views;
            });
        }
        else {
            console.log("Invalid sort type");
        }
        return sortedPairsArray;
    }

    store.clearIDNamePairs = () => {
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: []
        });
    }

    store.setPlayingList = (id) => {
        // let list = store.idNamePairs.find((list) => {
        //     return list._id === id;
        // });
        console.log("Setting list with ID: " + id + " as playing list");
        storeReducer({
            type: GlobalStoreActionType.SET_PLAYING_LIST,
            payload: id
        });
    }


    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };