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
const { stringify } = require("querystring");

/* allWikipages.json contain all category infomations  */
const sourceFilePath = "./sources/allWikipages.json";
/* The Result json */
const destinationFile = "json_files/ape_MASTERFILE.json";

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
  data = changeKeyNames(data, { fullurl: "url", tagsource: "source" });
  data = splitCats(data);
  // console.log(data);
  return data;
};

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
function splitCats(data) {
  const dn = data.map((dataObject) => {
    const categoryStrings = dataObject.categories;

    categoryStrings.map((cstr) => {
      // console.log(cstr);
      const e = cstr.split("|");

      dataObject.filekind = fileKind(dataObject.filekind, cstr).uniqueValues();
      dataObject.professions = getProfessions(
        dataObject.professions,
        cstr
      ).uniqueValues();
      dataObject.nationalities = getNationalities(
        dataObject.nationalities,
        cstr
      ).uniqueValues();
      // if (dataObject.nationalities.length > 1) console.log(dataObject.nationalities);
      dataObject.aperance = getAperance(
        dataObject.aperance,
        cstr
      ).uniqueValues();
      dataObject.crew = getCrew(dataObject.crew, cstr).uniqueValues();
      // if (dataObject.crew.length > 1) console.log(dataObject.crew);

      if (e[0] === "Characters" || e[0] === "Animals") {
        dataObject.livestatus = deadOrAlive(dataObject.livestatus, cstr);
        dataObject.gender = gender(dataObject.gender, cstr);
      }

      // dataObject.individual = getIndividual(dataObject.individual,cstr);

      if (e[0] === "Animals") {
        dataObject.individual = "animal";
      }
    });
    // Lifestatus: alive | dead | undead | ghost

    return dataObject;
  });
  return dn;
}

// ----------------------------------------------------------------------------------
function getCrew(arr, string) {
  if (typeof arr === "undefined") arr = [];
  const e = string.split("|");
  if (e[1] === "Crews") {
    if (typeof e[2] !== "undefined") arr.push(e[2]);
  }
  return arr;
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
    case "Transportations":
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
  const strResult = e.includes("Males")
    ? "male"
    : e.includes("Females")
    ? "female"
    : "unknown";

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
// zurückgegeben werden soll der höhere (alive < ghost) Lebensstatus: alive < dead < undead < ghost
// console.log(deadOrAlive("", "Characters|Sonstwas|Ozzie Mandrill")); // return ‘alive’
// console.log(deadOrAlive("alive", "Characters|Sonstwas|Ozzie Mandrill")); // return ‘alive’
// console.log(deadOrAlive("alive", "Characters|Deceased|Ozzie Mandrill")); // return ‘dead’
// console.log(deadOrAlive("alive", "Characters|Deceased|Undead|Murray")); // return ‘undead’
// console.log(deadOrAlive("alive", "Characters|Deceased|Undead|Ghosts|LeChuck")); // return ‘ghost’
// console.log(deadOrAlive("ghost", "Characters|Deceased|Undead|Bla")); // return ‘ghost’
// console.log(deadOrAlive("dead", "Characters|Deceased|Bla")); // return ‘dead’
// console.log(deadOrAlive("undead", "Characters|Deceased|Bla")); // return ‘undead’
// console.log(deadOrAlive("undead", "Characters|Deceased|Undead|Ghosts|Bla")); // return ‘ghost’
// console.log(deadOrAlive("", "Characters|Deceased|Undead")); // return ‘undead’
// console.log(deadOrAlive("alive", "Characters|Deceased|Undead")); // return ‘undead’
// console.log(deadOrAlive("Dead", "Characters|Deceased|Undead")); // return ‘undead’
// console.log(deadOrAlive("Undead", "Characters|Deceased|Undead")); // return ‘undead’
// console.log(deadOrAlive("Undead", "Characters|Deceased|Undead|Ghosts")); // return ‘ghost’

function deadOrAlive(a, b) {
  const complead = a + "|" + b;
  const makeLow = complead.toLowerCase();

  if (makeLow.match("ghost")) {
    return "Ghost";
  } else if (makeLow.match("undead")) {
    return "Undead";
  } else if (makeLow.match("dead")) {
    return "Dead";
  } else if (makeLow.match("deceased")) {
    return "Dead";
  } else if (makeLow.match("alive") || !makeLow.match("deceased")) {
    return "Alive";
  }
}

// ----------------------------------------------------------------------------------
const setNewAttributeInDataset = (dataset, attr, value) =>
  (dataset[attr] = value);
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
fs.readFile(sourceFilePath, "utf-8", (err, jsonString) => {
  if (err) {
    console.error(err);
    return;
  }
  const data = changeData(JSON.parse(jsonString));
  writeFile(JSON.stringify(data, null, 2), destinationFile);
  // writeFile(JSON.stringify(result), data.stringify());
});
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
