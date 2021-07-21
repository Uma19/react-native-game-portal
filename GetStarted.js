import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import gameDownloader from "./gameDownloader";
import RNFS from "react-native-fs";
import { gameDetails } from "./assets/GameDetails";
// import NetInfo from "@react-native-community/netinfo";
import Orientation from 'react-native-orientation';

export default function GetStarted(props) {
  const [navigation] = useState(props.navigation);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [jsonError, setJsonError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState("");

  const [isOffline, setOfflineStatus] = useState(false);
  
  // useEffect(() => {
  //   const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
  //     alert(
  //       'Connection type: ' + 
  //        state.type + 
  //       ', Is connected?: ' + 
  //        state.isConnected);
  //     const offline = !(state.isConnected && state.isInternetReachable);
  //     setOfflineStatus(offline);
  //   });
  
  //  console.log("offline mode started ", isOffline)
  
  //   return () => removeNetInfoSubscription();
  // }, []);


  useEffect(() => {
    Orientation.lockToLandscape();
  }, [])
  
  useEffect(() => {
    const initialGameInfo = gameDetails[0];
    setGameData(JSON.stringify(initialGameInfo));
  }, []);

  const clearTextInput = () => {
    setUrl("");
    setGameData("");
  };
  const getStartedButtonClickedHandler = () => {
    const gamesFolder = "games";
    const DirectoryPath = RNFS.DocumentDirectoryPath + "/" + gamesFolder;
    RNFS.mkdir(DirectoryPath);
    if (url !== "") {
      setError(false);
      setLoading(true);
      gameDownloader(url)
        .then((downloadedPath) => {
          setLoading(false);
          console.log("download path ", downloadedPath);
          navigation.navigate("LoadGameScreen", {
            screen: "Settings",
            params: { gameFilePath: downloadedPath, initialContent: gameData },
          });
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setError(true);
    }
  };

  const validateJson = (data) => {
    try {
      JSON.parse(data);
      setJsonError(false);
    } catch (e) {
      console.log("error ", e);
      setJsonError(true);
    }
    setGameData(data);
  };

  return (
    <View style={styles.container}>
       <StatusBar
        hidden={true} />
      <Text style={styles.textStyle}>Game Portal</Text>

      <View style={styles.jsonContainer}>
        <Text style={styles.jsonTitleStyle}>
          Initial Input Json data to game
        </Text>
        <TextInput
          disableFullscreenUI={true}
          placeholder="Enter Valid Initial Input Json data"
          selectTextOnFocus={true}
          style={styles.jsonTextInput}
          value={gameData}
          editable
          multiline
          onChangeText={(text) => {
            validateJson(text);
          }}
        />
        {jsonError ? (
          <Text style={styles.errorStyle}>Please enter valid json</Text>
        ) : (
          <></>
        )}
      </View>

      <TextInput
        disableFullscreenUI={true}
        placeholder="Enter Game Url"
        selectTextOnFocus={true}
        style={styles.textInput}
        value={url}
        onChangeText={(text) => {
          setUrl(text);
        }}
      />
      {error ? (
        <Text style={styles.errorStyle}>Please enter the url</Text>
      ) : (
        <></>
      )}

      <View style={styles.buttonMainView}>
        <TouchableOpacity
          disabled={loading}
          style={styles.GetStartedButtonStyle}
          onPress={getStartedButtonClickedHandler}
        >
          <Text style={styles.GetStartedButtonTextStyle}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          style={styles.clearButtonStyle}
          onPress={clearTextInput}
        >
          <Text style={styles.GetStartedButtonTextStyle}>Clear</Text>
        </TouchableOpacity>
      </View>
      {loading && (
      <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9E7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  jsonContainer: {
    display: "flex",
    padding: 10,
    paddingLeft: 20
  },
  errorStyle: {
    color: "red",
  },
  textStyle: {
    paddingTop: 15,
    borderRadius: 5,
    color: "black",
    fontSize: 15,
    fontWeight: "800",
  },
  jsonTitleStyle: {
    paddingBottom: 5,
    borderRadius: 5,
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  textInput: {
    width: 670,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "grey",
    paddingLeft: 20,
    marginLeft: 10
  },
  jsonTextInput: {
    width: 650,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "grey",
    paddingLeft: 10,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 50,
    width: 50,
    resizeMode: "stretch",
  },
  buttonView: {},
  buttonMainView: {
    flexBasis: 100,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
  },
  imgBackground: {
    width: "20%",
    height: "20%",
    flex: 1,
  },
  GetStartedButtonStyle: {
    width: 150,
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#DF0064",
  },

  clearButtonStyle: {
    width: 120,
    height: 50,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "grey",
  },
  GetStartedButtonTextStyle: {
    color: "white",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 20,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
