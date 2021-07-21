import React, { useEffect, useState, createRef, useContext } from "react";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import StaticServer from "react-native-static-server";

const LoadGame = (props) => {
  const [url, setUrl] = useState();
  const {gameFilePath, initialContent} = props.navigation.state.params.params;

  useEffect(() => {
    const server = new StaticServer(
      9091,
      gameFilePath
    );
    server.start().then((url) => setUrl(url));
  }, []);
  
  const webViewRef = createRef();
  const onLoad = () => {
    if (webViewRef && webViewRef.current) {
        webViewRef.current.injectJavaScript(
          getInjectableJSMessage(JSON.stringify(initialContent))
        );
    }
  }

  function getInjectableJSMessage(message) {
    return `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${message}
        }));
      })();
    `;
  }

  const onMessageReceived = (gameData) => {
    // call method to save this data along with childId sessionId and gameDetails in database
    alert(gameData);
    const gameDetails = JSON.parse(gameData)
    if (gameDetails.home == 1) {
      props.navigation.navigate("GetStartedScreen");
    }
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: url }}
      pagingEnabled
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState={true}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowingReadAccessToURL={true}
      onLoad={() => onLoad()}
      onMessage={(event) => {
        onMessageReceived(event.nativeEvent.data);
      }}
      renderLoading={() => (
        <ActivityIndicator
          color="blue"
          size="large"
          style={{
            flex: 1,
          }}
        />
      )}
    />
  );
};

export default LoadGame;
