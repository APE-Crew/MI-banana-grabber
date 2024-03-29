const fs = require("fs");

const sourceFilePath = "wikisource/FULLuniverse.json";
const destinationFile = "ape_MASTERFILE.json";

// MEMO
// fs.readFile("./allWikipages.json", "utf-8", (err, jsonString) => {
//   const data = JSON.parse(jsonString);
//   console.log(data);
// });
// fs.readFile(sourceFilePath, "utf8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   // console.log(data);
//   // const result = getCategoryTree(JSON.parse(data));
//   // console.log(result);
//   // const x = getTrackInfo(data);
//   // console.log(JSON.stringify(x));
//   writeFile(JSON.stringify(result), destinationFile);
// });

// ----------------------------------------------------
// split & analyse cats
// fs.readFile("./allCategories.txt", "utf-8", (err, data) => {
//   fs.readFile("./allWikipages.json", "utf-8", (err, json) => {
//     let entity = JSON.parse(json);
//     // let entityKeys = Object.keys(entity);

//     const lines = data.split("\n");

//     lines.forEach((line) => {
//       const segement = line.split("|");
//       const last = segement.pop();
//       const cats = segement.join("|");
//       // const last = segement[segement.length - 1];

//       if (entity.hasOwnProperty(last)) {
//         if (typeof entity[last]["categories"] == "undefined") {
//           entity[last]["categories"] = [];
//         }
//         entity[last]["categories"].push(cats);
//       } else {
//         // console.log("KEINE ZUORDNUNG:", last);
//       }
//     });

//     // console.log(entity);
//     // writeFile(JSON.stringify(entity), "allWikipagesNEW.json");
//     // console.log(lines);
//   });
// });

// ---------------------------------------------
function getCategoryTree(dataItem, path = "") {
  // console.log(path);

  fs.appendFile("categories.txt", path + "\n", function (err) {
    if (err) throw err;
    // console.log("Saved!");
  });

  // console.log(dataItem);
  let newObject = {};
  let newArray = [];

  let arrayOfChilds = dataItem.childs;
  // console.log("-_>", arrayOfChilds);

  if (arrayOfChilds.length == 0) {
    // console.log("-->", arrayOfChilds.title);
    // console.log(arrayOfChilds);
    // console.log(`${path ? `${path}|` : ""}${arrayOfChilds.title}`);
    // newArray.push(`${path ? `${path}|` : ""}${arrayOfChilds.title}`);
    // getCategoryTree(
    //   [],
    //   `${path ? `${path}|` : ""}${arrayOfChilds.title}`
    // );
    return;
  }

  // let universeData = arrayOfChilds.childs;

  if (arrayOfChilds.length > 0) {
    arrayOfChilds.forEach((e) => {
      // console.log(e);
      // console.log(e.title);
      let newPath = `${path ? `${path}|` : ""}${e.title}`;
      // console.log(newPath);
      const cpath = getCategoryTree(e, newPath);
      newObject[e.title] = cpath;
      // newObject[`${path ? `${path}|` : ""}${e.title}`] = cpath;
    });
  }

  //   if (e.kind === "Category") {
  //     // console.log(e.childs);
  //     newArray.push(...getAllWikisitesItems(e.childs));
  //     // getAllWikisitesItems(e.childs);
  //   }

  //   if (e.kind != "Category") {
  //     // console.log(e);
  //     newArray.push(e);
  //   }

  return newObject;
  // return newArray;
}
// ---------------------------------------------
function dataRequested(data) {
  // console.log(JSON.parse(data));
  let universeData = data.childs;
  // console.log(universeData);

  universeData = getAllWikisitesItems(universeData);

  const dataCount = universeData.length;

  let newObject = {};

  universeData.forEach((e) => {
    newObject[e.title] = e;
  });

  const objectCount = Object.keys(newObject).length;

  console.log(
    `${objectCount} Datensätze insgesamt, ${
      dataCount - objectCount
    } doppelte Datensätze entfernt`
  );

  writeFile(JSON.stringify(newObject), destinationFile);
}
// ---------------------------------------------
function getAllWikisitesItems(arrayOfChilds) {
  let newArray = [];

  arrayOfChilds.forEach((e) => {
    if (e.kind === "Category") {
      // console.log(e.childs);
      newArray.push(...getAllWikisitesItems(e.childs));
      // getAllWikisitesItems(e.childs);
    }

    if (e.kind != "Category") {
      // console.log(e);
      newArray.push(e);
    }
  });

  return newArray;
}
// ---------------------------------------------
function writeFile(data, path) {
  fs.writeFile(path, data, function (err, d) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
  });
}
