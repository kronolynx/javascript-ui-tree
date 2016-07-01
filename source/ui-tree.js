"use strict";

var generateHtmlTree = function(array) {
    var ol = createDomElement("ul", "", "ui-tree-nodes");
    array.forEach(function(item){
       var li  = createDomElement("li", "", "ui-tree-node");
       var div = createDomElement("div", item.id, "tree-node tree-node-content ui-tree-handle");
       div.innerText = item.title;

       var removeButton = createDomElement("a", "", "pull-right btn btn-danger btn-xs",{onclick:'remove(this)'});
       removeButton.appendChild(createDomElement("span", "", "glyphicon glyphicon-remove"));
       var newItem = createDomElement("a", "", "pull-right btn btn-primary btn-xs margin-right8",{onclick:'remove(this)'});
       newItem.appendChild(createDomElement("span", "", "glyphicon glyphicon-plus"));

       div.appendChild(removeButton);
       div.appendChild(newItem);
       li.appendChild(div);

       if(typeof item.items === "object" && item.items.length > 0){
           var arrow = createDomElement("a", "", "btn btn-success btn-xs", {onclick:"toggle(this)"});
           arrow.appendChild(createDomElement("span","","glyphicon glyphicon-chevron-down"));
           div.insertBefore(arrow, div.childNodes[0]);
           li.appendChild(generateHtmlTree(item.items));
       }
       ol.appendChild(li);
    });
    return ol;
};

/**
 * Generates a json tree from an html node
 * @param   html node
 * @return json array
 */
var generateJsonTree = function(node){
     if(!node){
         return [];
     }
     node = node.firstElementChild;

     var jsonArr = [];
     while(node){
        if(node.tagName.toLowerCase() === "div"){
            var json;
            json = {id: (+ node.getAttribute("id")), title: node.innerText};
            json.items = generateJsonTree(node.nextElementSibling);
            jsonArr.push(json);
            return jsonArr;
        } else {
            // add all the chilNodes to the array
            [].push.apply(jsonArr, generateJsonTree(node));
        }

         node = node.nextElementSibling;
     }
     return jsonArr;
};

/**
 * Generate the json from an html ID,
 * @param  html element ID
 * @return Json Array
 */
var generateJson = function(id){
    return {id:1, items: generateJsonTree(document.getElementById(id))} ;
};

/**
 * set the HTML tree from a json tree
 * @param  json tree
 */
var setUiTree = function(json){
    var root = document.getElementById("tree-root");
    root.innerHTML = "";
    var tree = generateHtmlTree(json.items);
    root.appendChild(tree);
};

/**
 * Generate DOM element
 * @param   _tag    tagname
 * @param   [_id]     element id
 * @param   [_class]  string with the classes
 * @param   [_events] json with the events or attributes to add e.g: {onclick : "alert("click")", data-somedata: "some data"}
 * @return html element
 */
var createDomElement = function(_tag, _id, _class, _events){
    var element = document.createElement(_tag);
    if(_id){
        element.setAttribute("id", _id);
    }
    if(_class){
        element.setAttribute("class", _class);
    }
    if(_events){
        for(var key in _events ){
            if(_events.hasOwnProperty(key)){
                element.setAttribute(key, _events[key]);
            }
        }
    }
    return element;
};

document.addEventListener("DOMContentLoaded", function(event){
    setUiTree(data);
    var test = JSON.stringify(generateJson("tree-root"), null, 2);
    var displayJson = document.getElementsByTagName("code")[0];
    displayJson.innerText = test;
});

var data = {
   "id":1,
   "title":"Árbol semántico",
   "items":[
      {
         "id":11,
         "title":"Coche",
         "items":[
            {
               "id":111,
               "title":"Averiado",
               "items":[

               ]
            },
            {
               "id":112,
               "title":"Roto",
               "items":[

               ]
            },
            {
               "id":113,
               "title":"Pinchazo",
               "items":[
                  {
                     "id":1131,
                     "title":"Humo",
                     "items":[

                     ]
                  }
               ]
            }
         ]
      },
      {
         "id":12,
         "title":"Vehículo",
         "items":[
            {
               "id":121,
               "title":"Averiado",
               "items":[

               ]
            },
            {
               "id":122,
               "title":"Roto",
               "items":[

               ]
            },
            {
               "id":123,
               "title":"Pinchazo",
               "items":[

               ]
            }
         ]
      },
      {
         "id":13,
         "title":"Automovil",
         "items":[
            {
               "id":131,
               "title":"Averiado",
               "items":[

               ]
            },
            {
               "id":132,
               "title":"Roto",
               "items":[

               ]
            },
            {
               "id":133,
               "title":"Incendio",
               "items":[

               ]
            }
         ]
      }
   ]
};
