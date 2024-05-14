const txtApiReqUrl = document.getElementById("txtApiReqUrl");
const textareaApiExpResp = document.getElementById("textareaApiExpResp");
textareaApiExpResp.addEventListener("click",function(){
  //textareaAPIBody.setSelectionRange(0,textareaAPIBody.value.length);
});
const textareaAPISchema = document.getElementById("textareaAPISchema");
const textareaManual = document.getElementById("textareaManual");
const txtEntity = document.getElementById("txtEntity"); 
const preOutput = document.getElementById("preOutput");
const divResultsFetch = document.getElementById("divResultsFetch");
const btnGenerate = document.getElementById("btnGenerate"); 
const imgErr = document.getElementById("imgErr");
const spanErrMsg = document.getElementById("spanErrMsg");
let asyncFunctionName = "";
let entityFirstCharUpper;
var newLine = "\n";
let ctr=0;
let selectApiType = document.getElementById("selectApiType");
let errors = 0;
let errMsg = "";

btnGenerate.addEventListener("click",function(){
  clearForm();
  if (validateGenerateCode())
  {
    entity = txtEntity.value.trim();
    entityFirstCharUpper = firstLetterToUpper(entity);
    let methodType = selectApiType.options[selectApiType.selectedIndex].text;
    switch (methodType) {
      case "GET":
        asyncFunctionName = "Get" + entityFirstCharUpper;
        generateGet();
        break;
      case "POST": //create
        asyncFunctionName = "Create" + entityFirstCharUpper;
        generatePost();
        break;
      case "PUT": //put/update
        asyncFunctionName = "Update" + entityFirstCharUpper;
        generatePut();
        break;
      default:
        lblMsg.innerText = "No function defined for " + selectApiType.options[selectApiType.selectedIndex].text;;
        break;
    }
  } 
});

function validateGenerateCode() {
  selectApiType.style.border = "none";
  spanErrMsg.innerText = "";
  spanErrMsg.style.visibility="hidden";
  imgErr.style.visibility="hidden";
  errMsg="";
  lblApiType.style.color = "black";
  errors=0;

  let methodType = selectApiType.options[selectApiType.selectedIndex].text;
  if (methodType == "") {
    errors+=1;
    errMsg+="Please select a method type \n";
    selectApiType.style.border = "1px solid red";
    lblApiType.style.color = "red";
  };

  console.log('errors' +  errors);
  if (errors > 0){
    spanErrMsg.innerText = errMsg;
    spanErrMsg.style.visibility="visible";
    imgErr.style.visibility="visible";
    return false;
  }
  else
  {
    return true;
  }
}

function validateInput(){
  spanErrMsg.style.visibility="hidden";
  imgErr.style.visibility="hidden";
  lblEntity.style.color = "";
  txtEntity.style.border = "1px solid #767676";
  lblApiReqUrl.style.color = "black";
  spanErrMsg.innerText = "";
  errMsg="";
  txtApiReqUrl.style.border = "1px solid #767676";
 
  var apiURL = txtApiReqUrl.value.trim();
  if (apiURL == "") {
    errors+=1;
    errMsg+="Please enter an valid API URL \n";
    lblApiReqUrl.style.color = "red";
    txtApiReqUrl.style.border = "1px solid red";
  };

  if (txtEntity.value == "") {
    errors+=1;
    errMsg+="Please enter an entity value \n";
    lblEntity.style.color = "red";
    txtEntity.style.border = "1px solid red";
  };

  if (errors > 0){
    spanErrMsg.innerText = errMsg;
    spanErrMsg.style.visibility="visible";
    imgErr.style.visibility="visible";
  
    return false;
  }
  else
  {
    return true;
  }
}

function firstLetterToUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function copyGeneratedCode() {
  navigator.clipboard.writeText(preOutput.innerText);
  lblMsg.innerHTML = "Text Copied";

  setTimeout(() => {
    $("#lblMsg").animate({ opacity: 0.0 }, { duration: 1000 });
  }, 2000);

  setTimeout(() => {
    $("#lblMsg").text("");
  }, 3000);

  setTimeout(() => {
    $("#lblMsg").css('opacity', '1');
  }, 3100);

}

const btnClearGeneratedCode = document.getElementById("btnClearGeneratedCode");
btnClearGeneratedCode.addEventListener("click", btnClearGeneratedCodeClick, false);
function btnClearGeneratedCodeClick() {
  clearForm();
}

function clearForm(){
  lblMsg.innerHTML = "";
  preOutput.innerText = "";
  divResultsFetch.style.border = "solid 1px #ccc";
}

window.addEventListener("load", (event) => {
  txtApiReqUrl.focus();
  var myArray = {
    1:"GET",
    2:"POST",
    3:"PUT",
    4:"PATCH",
    5:"DELETE",
    6:"HEAD",
    7:"OPTIONS",
    8:"CONNECT",
    9:"TRACE"
  };
  for (var key in myArray) {
    selectApiType.add(new Option(myArray[key], key));
  }
  setDefaults();
  currentTab = getCookie("tab");
  if (currentTab) {
    setActiveTab(currentTab);
  }
  else
  {
    setActiveTab("tab1");
  }
  //testing();
});

function testing() {
  //testing ////////////////////////
  txtApiReqUrl.value = "http://localhost:5000/AppUserFlashCard/CreateAppUserFlashCard";
  selectApiType.value = 2;
  textareaApiExpResp.value =`{
  "appUserId": 0,
  "flashCardId": 0,
  "score": 0,
  "comment": "string"
}`
//   textareaAPISchema.value = `CreateAppUserFlashCardRequest{
//   appUserId	integer($int32)
//   nullable: true
//   flashCardId	integer($int32)
//   nullable: true
//   score	integer($int32)
//   nullable: true
//   comment	string
//   nullable: true
// }`;

//   textareaManual.value = `appUserId=0
// flashCardId=0
// score=0
// comment=""
// `;
  txtEntity.value = "FlashCard"; //validate this matches something?
/////////////////////////////////
}
function setDefaults(){
  textareaAPISchema.style.backgroundColor="#F0F0F0"; 
  textareaManual.style.backgroundColor="#F0F0F0"; 
}
function isValidJSON(obj) {
  let jsonString = obj;
  if (typeof obj !== "string") {
    try {
      jsonString = null;
      jsonString = JSON.stringify(obj);
    } catch (error) {
        return false;
    }
  }
  try {
      JSON.parse(jsonString);
      return true;
  } catch (error) {
      return false;
  }
}
let currentTab;
function setCookie(name, value) {
  document.cookie = name + "=" + value + ";secure";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function removeCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
var tabBtn =  $(".btnTab");
tabBtn.click(function(evt) {
  setActiveTab(evt.target.parentElement.id)
});
function setActiveTab(tabId) {
  var newActiveTab = document.getElementById(tabId);
  var newActiveContentDivId = "divContent" + tabId.replace("tab","");
  var newActiveContentDiv = document.getElementById(newActiveContentDivId);

  let tabs = document.querySelectorAll('.tab, .activeTab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].className = "tab";    
  }

  let contentDivs = document.querySelectorAll('.divContent');
  for (var i = 0; i < contentDivs.length; i++) {
    contentDivs[i].style.display = "none";    
    //console.log(contentDivs[i]);//
  }

  const divContent1 = document.getElementById("divContent1");
  const divContent2 = document.getElementById("divContent2");
  const divContent3 = document.getElementById("divContent3");
  divContent1.style.display = "none";
  divContent2.style.display = "none";
  divContent3.style.display = "none";

  newActiveContentDiv.style.display = "block";

  newActiveTab.className = "activeTab";
  newActiveContentDiv.className = "divContentActive";
  setCookie("tab",newActiveTab.id);
  $(newActiveTab.id).fadeIn(1000);
}
const indent = function(numOfSpaces) {
  let indent = "";
  for (let i = 1; i <= numOfSpaces; i++) {
    indent+=" ";
  }
  return indent;
}
function urlHasQueryString(url){
  if (url.includes("?")) {
    return true;
  }
  else
  {
    return false;
  }
}
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
function parseQueryStringParams(url) {
  //split by '?'
  let urlArray = url.split("?");
  let queryString = "";
  if (urlArray.length > 0) {
    queryString = urlArray[1];
  }
  return queryString.split("&");
};
function generateGet() {
  if (validateInput()) {
    divResultsFetch.style.border = "solid 1px blue";
    let apiReqUrl = txtApiReqUrl.value.trim();
    let uri = new URL(apiReqUrl);
    let baseUrl = uri.origin;
    let apiPath = uri.pathname;
    let asyncFunctionParams = "";
    let apiParamsString = "";
    let apiParamsStringStart = `${indent(2)}+ "?" + new URLSearchParams({`;
    let apiParamsStringEnd = "";

    let paramsArray;
    let param="";
    let paramName="";
    let paramArray="";
    ctr=0;
    if (urlHasQueryString(apiReqUrl)) {

      paramsArray = parseQueryStringParams(apiReqUrl);
      if (paramsArray.length > 0) {
        apiParamsString+=apiParamsStringStart;
      }

      for (let i = 0; i < paramsArray.length; i++) {
        param = paramsArray[i];
        paramArray = null;
        paramArray = param.split("=");
        if (paramArray.length > 0) {
          paramName = paramArray[0];
          asyncFunctionParams+=paramName.replace("_","");
          apiParamsStringEnd+=newLine + indent(8) + paramName + ":" + paramName.replace("_","");
          if (i != paramArray.length-1) {
            asyncFunctionParams+=", ";
            apiParamsStringEnd+=", ";
          }
        }
      }
      if (paramsArray.length > 0) {
        apiParamsString+=apiParamsStringEnd;
      }
    }

    let jsonVarDeclaration = "";
    let jsonVarAssignment = "";
    //get json vars from api resp example, schema or manually entered tabs
    let activeApiVarsTab = document.querySelectorAll(".activeTab")[0].id;
    switch (activeApiVarsTab) {
      case "tab1":
        //generate vars from json request example
        let jsonExResp;
        if (isValidJSON(textareaApiExpResp.value.trim())) 
        {
          jsonExResp = JSON.parse(textareaApiExpResp.value.trim());
          let jsonExRespKeys = Object.keys(jsonExResp);
          ctr=0;
          for (var key in jsonExResp) {
            ctr+=1;
            if (jsonExResp.hasOwnProperty(key)) {
              jsonVarDeclaration+="let " + key + " = null;";
              jsonVarAssignment+=indent(4) + key + " = " + entity + "." + key + ";";
              if (ctr < jsonExRespKeys.length)
              {
                jsonVarDeclaration+="\n";
                jsonVarAssignment+="\n";
              }
            }
          }
        }
        else
        {

        }
        break;
      case "tab2":
        //generate vars from schema
        break;
      case "tab3":
        //generate vars line by line from manual input
        break;
      default:
        break;
    }

    var asyncAPIFunctionString = 
`var apiBaseUrl = "${baseUrl}";
let ${entity} = null;
${jsonVarDeclaration}

${asyncFunctionName}(${entity}).then(
  function(${entity}) 
  { 
${jsonVarAssignment}
  },
  function(error) { 
    console.log("Get ${entity} error : " + error);
  }
);

async function ${asyncFunctionName}(${asyncFunctionParams}) {
  try
  {
    const response = await fetch(apiBaseUrl + "${apiPath}"
    ${apiParamsString}
      })
    );
    const ${entity}Obj = await response.json();
    return ${entity}Obj;
  }
  catch (error) {
    console.error(error);
  }
}
  `;

    preOutput.innerText = asyncAPIFunctionString;
  }
}
function generatePost() {
  if (validateInput()) {
    divResultsFetch.style.border = "solid 1px blue";
    let apiReqUrl = txtApiReqUrl.value.trim();
    let uri = new URL(apiReqUrl);
    let baseUrl = uri.origin;
    let apiPath = uri.pathname;
    ctr=0;
    let jsonVarDeclaration = "";
    let jsonVarAssignment = "";
    let jsonPost = "";
    let varsPassed = "";
    let newEntityId = "";
    //get json vars from api resp example, schema or manually entered tabs
    let activeApiVarsTab = document.querySelectorAll(".activeTab")[0].id;
    switch (activeApiVarsTab) {
      case "tab1":
        //generate vars from json request example
        let jsonExResp;
        if (isValidJSON(textareaApiExpResp.value.trim())) 
        {
          jsonExResp = JSON.parse(textareaApiExpResp.value.trim());
          let jsonExRespKeys = Object.keys(jsonExResp);
          console.log(jsonExResp);
          ctr=0;
          for (var key in jsonExResp) {
            ctr+=1;
            if (jsonExResp.hasOwnProperty(key)) {
              jsonVarDeclaration+="let " + key + " = null;";
              jsonVarAssignment+=indent(4) + key + " = " + entity + "." + key + ";";
              varsPassed+=key;
              console.log(key);
              jsonPost+=indent(4) + "\"" + key + "\"" + ":" + key;
              if (ctr < jsonExRespKeys.length)
              {
                jsonVarDeclaration+="\n";
                jsonVarAssignment+="\n";
                varsPassed+=", ";
                jsonPost+=",\n";
              }
              if (key.toUpperCase() == entity.toUpperCase()+"ID") {
                newEntityId = key;
              }
            }
          }
        }
        break;
      case "tab2":
        //generate vars from schema
        break;
      case "tab3":
        //generate vars line by line from manual input
        break;
      default:
        break;
    }

  var asyncAPIFunctionString = 
`var apiBaseUrl = "${baseUrl}";
let ${entity} = null;
${jsonVarDeclaration}

${asyncFunctionName}(${varsPassed}).then(
  function(${entity}) 
  { 
    //stringifiedResp = JSON.stringify(resp);
    //jsonResp = JSON.parse(stringifiedResp);
${jsonVarAssignment}
    //lblMsg.innerText = "${entity} added (Id : " + ${newEntityId} + ")";
  },
  function(error) { 
    console.log("Get ${entity} error : " + error);
  }
);

async function ${asyncFunctionName}(${varsPassed}} ) {
  var jsonString;
  jsonString =
  {
${jsonPost}
  }

  var JSONStringifiedText = JSON.stringify(jsonString);
  var JSONParsedJSONStringifiedText = JSON.parse(JSONStringifiedText);
  var bodyPostJSON = JSONParsedJSONStringifiedText;

  return await fetch(apiBaseUrl + "/QuizSection/CreateQuizSection", {
    method: "POST",
    body: bodyPostJSON,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    }})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    })
    .catch(error => {
      return error;
    });
}

  `;
    preOutput.innerText = asyncAPIFunctionString;
  }
}
function generatePut() {
  if (validateInput()) {
    divResultsFetch.style.border = "solid 1px blue";
    let apiReqUrl = txtApiReqUrl.value.trim();
    let uri = new URL(apiReqUrl);
    let baseUrl = uri.origin;
    let apiPath = uri.pathname;
    ctr=0;
    let jsonVarDeclaration = "";
    let jsonVarAssignment = "";
    let jsonPost = "";
    let varsPassed = "";
    let newEntityId = "";
    //get json vars from api resp example, schema or manually entered tabs
    let activeApiVarsTab = document.querySelectorAll(".activeTab")[0].id;

    switch (activeApiVarsTab) {
      case "tab1":
        //generate vars from json request example
        let jsonExResp;
        if (isValidJSON(textareaApiExpResp.value.trim())) 
        {
          jsonExResp = JSON.parse(textareaApiExpResp.value.trim());
          let jsonExRespKeys = Object.keys(jsonExResp);
          console.log(jsonExResp);
          ctr=0;
          for (var key in jsonExResp) {
            ctr+=1;
            if (jsonExResp.hasOwnProperty(key)) {
              jsonVarDeclaration+="let " + key + " = null;";
              jsonVarAssignment+=indent(4) + key + " = " + entity + "." + key + ";";
              varsPassed+=key;
              console.log(key);
              jsonPost+=indent(4) + "\"" + key + "\"" + ":" + key;
              if (ctr < jsonExRespKeys.length)
              {
                jsonVarDeclaration+="\n";
                jsonVarAssignment+="\n";
                varsPassed+=", ";
                jsonPost+=",\n";
              }
              if (key.toUpperCase() == entity.toUpperCase()+"ID") {
                newEntityId = key;
              }
            }
          }
        }
        break;
      case "tab2":
        //generate vars from schema
        break;
      case "tab3":
        //generate vars line by line from manual input
        break;
      default:
        break;
    }



  var asyncAPIFunctionString = 
  `var apiBaseUrl = "${baseUrl}";
  let ${entity} = null;
  ${jsonVarDeclaration}
  
  ${asyncFunctionName}(${varsPassed}).then(
    function(${entity}) 
    { 
      //stringifiedResp = JSON.stringify(resp);
      //jsonResp = JSON.parse(stringifiedResp);
  ${jsonVarAssignment}
      //lblMsg.innerText = "${entity} added (Id : " + ${newEntityId} + ")";
    },
    function(error) { 
      console.log("Get ${entity} error : " + error);
    }
  );
  
  async function ${asyncFunctionName}(${varsPassed}} ) {
    var jsonString;
    jsonString =
    {
  ${jsonPost}
    }
  
    var JSONStringifiedText = JSON.stringify(jsonString);
    var JSONParsedJSONStringifiedText = JSON.parse(JSONStringifiedText);
    var bodyPostJSON = JSONParsedJSONStringifiedText;
  
    return await fetch(apiBaseUrl + "/QuizSection/CreateQuizSection", {
      method: "POST",
      body: bodyPostJSON,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }})
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      })
      .catch(error => {
        return error;
      });
  }
  
    `;
    //output
    preOutput.innerText = asyncAPIFunctionString;
  }
}



