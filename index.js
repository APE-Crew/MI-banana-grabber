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

const filePathes = {
  master: "json_files/ape_MASTERFILE.json",
  items: "json_files/ape_items.json",
  characters: "json_files/ape_characters.json",
  ships: "json_files/ape_ships.json",
  animals: "json_files/ape_animals.json",
  unknown: "json_files/ape_unknown.json",
};

/* allWikipages.json contain all category infomations  */
const sourceFilePath = "./sources/allWikipages.json";
/* The Result json */
// const destinationFile = filePathes["master"];

const gameNames = {
  SoMI: "The Secret of Monkey Island",
  MI2: "Monkey Island 2: LeChuck's Revenge",
  CoMI: "The Curse of Monkey Island",
  EfMI: "Escape from Monkey Island",
  ToMI: "Tales of Monkey Island",
};

const changeData = (data) => {
  data = data.ObjectToArray();
  // data = setNewAttributeInAllData(data);
  data = deleteByKeyNames(data, ["childs", "inner", "kind"]);
  data = changeKeyNames(data, {fullurl: "url", tagsource: "source"});
  data = splitCats(data);
  // console.log(data);
  return data;
};

// ----------------------------------------------------------------------------------
fs.readFile(sourceFilePath, "utf-8", (err, jsonString) => {
  if (err) {
    console.error(err);
    return;
  }
  const data = changeData(JSON.parse(jsonString));
  writeFile(JSON.stringify(data, null, 2), filePathes["master"]);
  writeFile(JSON.stringify(filterDatas("characters", data), null, 2), filePathes["characters"]);
  writeFile(JSON.stringify(filterDatas("items", data), null, 2), filePathes["items"]);
  writeFile(JSON.stringify(filterDatas("ships", data), null, 2), filePathes["ships"]);
  writeFile(JSON.stringify(filterDatas("animals", data), null, 2), filePathes["animals"]);
  writeFile(JSON.stringify(filterDatas("unknown", data), null, 2), filePathes["unknown"]);
  // writeFile(JSON.stringify(result), data.stringify());
});

// if (!Object.prototype.functionfy) {
//   Object.prototype.functionfy = function () {
//     return () => JSON.stringify(this);
//   };
// }
// const a = {};
// console.log(typeof a); // object
// const b = a.functionfy();
// console.log(typeof b); // function

// delete thisIsObject["Cow"];
// ----------------------------------------------------------------------------------
// TEST:
const testdata = [
  {dataset: ["animals"]},
  {dataset: ["characters"]},
  {dataset: ["animals", "characters"]},
  {dataset: ["items"]},
];
const onlyitems = filterDatas("items", testdata);
console.log(onlyitems);
const onlyanimals = filterDatas("animals", testdata);
console.log(onlyanimals);
// -------------
function filterDatas(filterfor, fulldata) {
  return fulldata;
}
// ----------------------------------------------------------------------------------
const setNewAttributeInDataset = (dataset, attr, value) => (dataset[attr] = value);
// ----------------------------------------------------------------------------------
function splitCats(data) {
  const dn = data.map((dataObject) => {
    const categoryStrings = dataObject.categories;

    categoryStrings.map((cstr) => {
      // console.log(cstr);
      const e = cstr.split("|");

      dataObject.dataset = fileKind(dataObject.dataset, cstr).uniqueValues();
      dataObject.professions = getProfessions(dataObject.professions, cstr).uniqueValues();
      dataObject.nationalities = getNationalities(dataObject.nationalities, cstr).uniqueValues();
      // if (dataObject.nationalities.length > 1) console.log(dataObject.nationalities);
      dataObject.aperance = getAperance(dataObject.aperance, cstr).uniqueValues();
      dataObject.crew = getCrew(dataObject.crew, cstr);
      // if (dataObject.crew.length > 1) console.log(dataObject.crew);

      if (e[0] === "Characters" || e[0] === "Animals") {
        dataObject.livestatus = deadOrAlive(dataObject.livestatus, cstr);
        dataObject.gender = gender(dataObject.gender, cstr);
      }

      // dataObject.individual = getIndividual(dataObject.individual,cstr);

      // if (e[0] === "Animals") {
      //   dataObject.individual = "animal";
      // }
    });
    // Lifestatus: alive | dead | undead | ghost

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
function consoleCheck(funccase, gewuenscht) {
  console.log(
    `${funccase === gewuenscht ? "TRUE " : "FALSE"} - "${funccase}" ${
      funccase === gewuenscht ? "===" : "!=="
    } "${gewuenscht}" `
  );
}
// ----------------------------------------------------------------------------------
// zurückgegeben werden soll der höhere (alive < ghost) Lebensstatus: alive < dead < undead < ghost
// consoleCheck(deadOrAlive("", "Characters|Sonstwas|Ozzie Mandrill"), "alive");
// consoleCheck(deadOrAlive("alive", "Characters|Sonstwas|Ozzie Mandrill"), "alive");
// consoleCheck(deadOrAlive("alive", "Characters|Deceased|Ozzie Mandrill"), "dead");
// consoleCheck(deadOrAlive("alive", "Characters|Deceased|Undead|Murray"), "undead");
// consoleCheck(deadOrAlive("alive", "Characters|Deceased|Undead|Ghosts|LeChuck"), "ghost");
// consoleCheck(deadOrAlive("ghost", "Characters|Deceased|Undead|Bla"), "ghost");
// consoleCheck(deadOrAlive("dead", "Characters|Deceased|Bla"), "dead");
// consoleCheck(deadOrAlive("undead", "Characters|Deceased|Bla"), "undead");
// consoleCheck(deadOrAlive("undead", "Characters|Deceased|Undead|Ghosts|Bla"), "ghost");

// consoleCheck(deadOrAlive("", "Characters|Deceased|Undead"), "undead");
// consoleCheck(deadOrAlive("alive", "Characters|Deceased|Undead"), "undead");
// consoleCheck(deadOrAlive("Dead", "Characters|Deceased|Undead"), "undead");

// consoleCheck(deadOrAlive("Undead", "Characters|Deceased|Undead"), "undead");
// consoleCheck(deadOrAlive("Undead", "Characters|Deceased|Undead|Ghosts"), "ghost");
// ----------------------------------------------------------------------------------
function deadOrAlive(a, b) {
  const wert = {alive: 0, dead: 1, undead: 2, ghost: 3};
  a = a === "" || typeof a === "undefined" ? "alive" : a.toLowerCase();
  c = b.indexOf("Deceased") > 10 ? "dead" : "alive";
  c = b.indexOf("Undead") > 18 ? "undead" : c;
  c = b.indexOf("Ghosts") > 24 ? "ghost" : c;
  return wert[a] >= wert[c] ? a : c;

  // return b.search(/dead/g);
  // return b.search(/dead\|undead\|/);
  // return b.search(/dead\|undead\|ghost/);

  // return b;
  //   const splitted = b.split("|");
  //   const c = splitted[splitted.length - 1];
  // wertigkeit['alive'] > wertigkeit[c]

  // const complead = a + "|" + b;
  // const lowes = complead.toLowerCase();
  // const renamed = lowes.replace("undead", "nichtamleben");
  // const ghost = renamed.includes("Ghosts") || renamed.includes("ghost") ? "Ghost" : renamed;
  // const dead = ghost.includes("dead") ? "Dead" : ghost;
  // const undead = dead.includes("nichtamleben") ? "Undead" : dead;
  // const reallydead = undead.includes("deceased") ? "Dead" : undead;
  // const alive = reallydead.includes("alive") ? "Alive" : reallydead;
  // const reallyAlive = a === "" ? "Alive" : alive;

  // return reallyAlive;
}

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
