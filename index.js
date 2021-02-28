/*
------------------------------------------------------------------------------------
Normally monkey patching is bad coding practice. 
See: https://en.wikipedia.org/wiki/Monkey_patch
In this project we try to use monkey patching as often as possible.
So in this project ... if you  don't use Monkey Patching its _bad_ coding practice. 
it's an APE not an API, sry little pirate.
------------------------------------------------------------------------------------
*/

// ----------------------------------------------------------------------------------
// ------------------------------ Monkey Patches ------------------------------------
if (!Object.prototype.ObjectToArray) {
  Object.prototype.ObjectToArray = function () {
    let dataNew = [];
    Object.keys(this).map((key) => dataNew.push(this[key]));
    return dataNew;
  };
}
// ----------------------------------------------------------------------------------

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
// ----------------------------------------------------------------------------------
if (!Array.prototype.uniqueValues) {
  Array.prototype.uniqueValues = function () {
    return [...new Set(this)];
  };
}
// ----------------------------------------------------------------------------------
if (!Array.prototype.intersect) {
  Array.prototype.intersect = function (arr) {
    return this.filter((value) => arr.includes(value));
  };
}
// const filteredArray = array1.filter(value => array2.includes(value));
// ----------------------------------------------------------------------------------

const fs = require("fs");
// const {stringify} = require("querystring");

const filePathes = {
  source: "./sources/allWikipages.json",
  master: "json_files/ape_MASTERFILE.json",
  items: "json_files/ape_items.json",
  characters: "json_files/ape_characters.json",
  ships: "json_files/ape_ships.json",
  animals: "json_files/ape_animals.json",
  locations: "json_files/ape_locations.json",
  unknown: "json_files/ape_unknown.json",
};

const gameNames = {
  SoMI: "The Secret of Monkey Island",
  MI2: "Monkey Island 2: LeChuck's Revenge",
  CoMI: "The Curse of Monkey Island",
  EfMI: "Escape from Monkey Island",
  ToMI: "Tales of Monkey Island",
};

const changeData = (data) => {
  data = data.ObjectToArray();
  data = changeKeyNames(data, {fullurl: "url", tagsource: "source"});
  data = splitCats(data);
  data = deleteByKeyNames(data, ["childs", "inner", "kind", "source"]);
  return data;
};

// ----------------------------------------------------------------------------------
fs.readFile(filePathes["source"], "utf-8", (err, jsonString) => {
  if (err) {
    console.error(err);
    return;
  }
  const data = changeData(JSON.parse(jsonString));
  consoleLogStatistics(data);
  writeFile(JSON.stringify(data, null, 2), filePathes["master"]);
  writeFile(JSON.stringify(filterDatas("characters", data), null, 2), filePathes["characters"]);
  writeFile(JSON.stringify(filterDatas("items", data), null, 2), filePathes["items"]);
  writeFile(JSON.stringify(filterDatas("ships", data), null, 2), filePathes["ships"]);
  writeFile(JSON.stringify(filterDatas("animals", data), null, 2), filePathes["animals"]);
  writeFile(JSON.stringify(filterDatas("unknown", data), null, 2), filePathes["unknown"]);
  writeFile(JSON.stringify(filterDatas("locations", data), null, 2), filePathes["locations"]);
  // writeFile(JSON.stringify(result), data.stringify());
});

// ----------------------------------------------------------------------------------
function consoleLogStatistics(data) {
  console.log("-----------------------------------------------------------------");
  console.log(`Anzahl Datensätze: ${data.length}`);
  console.log(`Kategorien: ${Object.keys(data[0]).length} (${Object.keys(data[0]).join(",")})`);
  console.log("-----------------------------------------------------------------");
}
// ----------------------------------------------------------------------------------
// TEST:
const testdata = [
  {dataset: ["animals"]},
  {dataset: ["characters"]},
  {dataset: ["animals", "characters"]},
  {dataset: ["items"]},
];
const onlyitems = filterDatas("items", testdata);
/* [
  {dataset: ["items"]},
]
*/
console.log(onlyitems);
const onlyanimals = filterDatas("animals", testdata);
/* [
    {dataset: ["animals"]},
  {dataset: ["animals", "characters"]},
]
*/
console.log(onlyanimals);
// -------------------------------------------------------------
function filterDatas(filterfor, fulldata) {
  //filter nach filterfor
  return fulldata;
}
// ----------------------------------------------------------------------------------
// const setNewAttributeInDataset = (dataset, attr, value) => (dataset[attr] = value);
// ----------------------------------------------------------------------------------
function splitCats(data) {
  const dn = data.map((dataObject) => {
    const categoryStrings = dataObject.categories;

    categoryStrings.map((cstr) => {
      dataObject.dataset = fileKind(dataObject.dataset, cstr).uniqueValues();
      dataObject.professions = getProfessions(dataObject.professions, cstr).uniqueValues();
      dataObject.nationalities = getNationalities(dataObject.nationalities, cstr).uniqueValues();
      dataObject.aperance = getAperance(dataObject.aperance, cstr).uniqueValues();
      dataObject.crew = getCrew(dataObject.crew, cstr);
      dataObject.livestatus = deadOrAlive(dataObject.livestatus, cstr);
      dataObject.gender = gender(dataObject.gender, cstr);
    });
    return dataObject;
  });
  return dn;
}

// ----------------------------------------------------------------------------------
function getCrew(value, string) {
  if (typeof value === "undefined") value = "";
  const e = string.split("|");
  if (e[1] === "Crews") {
    if (typeof e[2] !== "undefined") value = e[2].replace("s Crew", "");
  }
  return value;
}
// ----------------------------------------------------------------------------------
function getAperance(arr, string) {
  if (typeof arr === "undefined") arr = [];
  const e = string.split("|");
  const intersection = Object.keys(gameNames).intersect(e.last().split(" "));

  if (e[1] === "Characters By Game") {
    arr = [...arr, ...intersection];
  }
  return arr;
}
// ----------------------------------------------------------------------------------
function getNationalities(arr, string) {
  if (typeof arr === "undefined") arr = [];
  const e = string.split("|");
  if (e[1] === "Nationalities") {
    arr.push(e[e.length - 1].replace(" Residents", ""));
  }
  //Nationalities
  return arr;
}
// ----------------------------------------------------------------------------------
function getProfessions(arr, string) {
  if (typeof arr === "undefined") arr = [];
  const e = string.split("|");
  if (e[0] === "Professions") {
    arr.push(e[1]);
  }
  if (e[1] === "Pirates") {
    arr.push(e[1]);
  }
  return arr;
}
// ----------------------------------------------------------------------------------
function fileKind(fileArray, string) {
  if (typeof fileArray === "undefined") fileArray = [];
  const e = string.split("|");

  switch (e[0]) {
    case "Characters":
      fileArray.push("characters");
      break;
    case "Animals":
      fileArray.push("animals");
      break;
    case "Items":
      fileArray.push("items");
      break;
    case "Locations":
      fileArray.push("locations");
      break;
    case "Transportation":
      fileArray.push(e[1]);
      break;
    default:
      fileArray.push("unknown");
  }

  return fileArray;
}

// ----------------------------------------------------------------------------------
function gender(a, b) {
  const e = b.split("|");
  const strResult = e.includes("Males") ? "male" : e.includes("Females") ? "female" : "unknown";

  switch (a) {
    case "male":
      return a;
    case "female":
      return a;
    case "unknown":
      return strResult;
    default:
      return "unknown";
  }
}
// ----------------------------------------------------------------------------------

function deadOrAlive(a, b) {
  const complead = a + "|" + b;
  const makeLow = complead.toLowerCase();

  if (makeLow.match("ghost")) {
    return "Ghost";
  } else if (makeLow.match("undead")) {
    return "Undead";
  } else if (makeLow.match("dead") || makeLow.match("deceased")) {
    return "Dead";
  } else if (makeLow.match("alive") || !makeLow.match("deceased")) {
    return "Alive";
  }
}

// ----------------------------------------------------------------------------------
const setNewAttributeInDataset = (dataset, attr, value) => (dataset[attr] = value);

// ----------------------------------------------------------------------------------
function deleteByKeyNames(data, array) {
  return data.map((item) => {
    array.forEach((delkey) => {
      delete item[delkey];
    });
    return item;
  });
}
// ----------------------------------------------------------------------------------
function changeKeyNames(data, replaceObj) {
  Object.keys(replaceObj).map((key) => {
    data = changeKeyName(data, key, replaceObj[key]);
  });
  return data;
}
// ----------------------------------------------------------------------------------
function changeKeyName(data, oldkey, newkey) {
  const newDataset = data.map((item) => {
    let newItem = {};
    Object.keys(item).map((key) => {
      if (oldkey != key) newItem[key] = item[key];
      if (oldkey === key) newItem[newkey] = item[key];
    });
    return newItem;
  });
  return newDataset;
}
// ----------------------------------------------------------------------------------
function setNewAttributeInAllData(data) {
  return data.map((value, index) => {
    return value;
    // dataNew.push(data[key]);
  });
}

// ----------------------------------------------------------------------------------
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
    `${objectCount} Datensätze insgesamt, ${dataCount - objectCount} doppelte Datensätze entfernt`
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
