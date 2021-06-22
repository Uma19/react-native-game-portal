import RNFS from "react-native-fs";
import RNBackgroundDownloader from "react-native-background-downloader";
import FileSystem from "react-native-fs";
import { unzip } from "react-native-zip-archive";

const gameDownloader = (url) => {
  return new Promise((resolve, reject) => {
    let chunks = url.split("/");
    let fileName = chunks[chunks.length - 1];
    let folderName = fileName.split(".")[0];

    console.log("fileName: ", fileName);
    //console.log("folderName: ", folderName);
    console.log("url: ", url)

    RNBackgroundDownloader.download({
      id: fileName,
      url: url,
      destination: `${RNFS.DocumentDirectoryPath}/games/${fileName}`,
    })
      .begin((expectedBytes) => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress((percent) => {
        console.log(`Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        console.log("Download is done!");
        let sourcePath = `${RNFS.DocumentDirectoryPath}/games/${fileName}`;
        let targetPath = `${RNFS.DocumentDirectoryPath}/games/${folderName}`;

        console.log("unzipping... ");
        //console.log("sourcePath: ", sourcePath);
        //console.log("targetPath: ", targetPath);

        unzip(sourcePath, targetPath)
          .then((path) => {
            console.log(`unzipping completed at ${path}`);
            resolve(path);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      })
      .error((error) => {
        console.log("Download canceled due to error: ", error);
        reject(error);
      });
  });
};

export default gameDownloader;
