import React, { useState } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import GetStarted from "./GetStarted";
import LoadGame from "./LoadGame";

const routeList = {
  GetStartedScreen: { screen: GetStarted },
  LoadGameScreen: {screen: LoadGame}
}

const initialRouteListLoggedIn = {
  initialRouteName: "GetStartedScreen",
  headerMode: "none",
}

export const AppNavigatorLoggedIn = createStackNavigator(
  routeList,
  initialRouteListLoggedIn
);

const AppContainerLoggedIn = createAppContainer(AppNavigatorLoggedIn);

export default function App(props) {
  const handleNavigationChange = (prevState, newState, action) => {
  };

  return (
    <AppContainerLoggedIn
    onNavigationStateChange={handleNavigationChange}
    uriPrefix="/app"
  />
  );
}
