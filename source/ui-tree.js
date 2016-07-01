"use strict";

var generateTreeNode = function(item){
    var li = createDomElement("li", "", "ui-tree-node");
    var div = createDomElement("div", item.id, "tree-node tree-node-content ui-tree-handle");
    div.innerText = item.title;

    var removeButton = createDomElement("a", "", "pull-right btn btn-danger btn-xs", {
        onclick: 'removeNode(this.parentElement)'
    });
    removeButton.appendChild(createDomElement("span", "", "glyphicon glyphicon-remove"));
    var newItem = createDomElement("a", "", "pull-right btn btn-primary btn-xs margin-right8", {
        onclick: 'newNode(this.parentElement)'
    });
    newItem.appendChild(createDomElement("span", "", "glyphicon glyphicon-plus"));

    div.appendChild(removeButton);
    div.appendChild(newItem);
    li.appendChild(div);
    return li;
}

var insertHtmlArrow = function(li){
    var arrow = createDomElement("a", "", "btn btn-success btn-xs", {
                onclick: "toggleNode(this)"
            });
            arrow.appendChild(createDomElement("span", "", "glyphicon glyphicon-chevron-down"));
            li.firstElementChild.insertBefore(arrow, li.firstElementChild.childNodes[0]);
}

var generateHtmlTree = function(array) {
    var ol = createDomElement("ul", "", "ui-tree-nodes");
    array.forEach(function(item) {      
        var li = generateTreeNode(item);
        if (typeof item.items === "object") {
            if(item.items.length > 0){
                insertHtmlArrow(li);
                li.appendChild(generateHtmlTree(item.items));
            }else {
                li.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
            }
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
var generateJsonTree = function(node) {
    if (!node) {
        return [];
    }
    node = node.firstElementChild;

    var jsonArr = [];
    while (node) {
        if (node.tagName.toLowerCase() === "div") {
            var json;
            json = {
                id: (+node.getAttribute("id")),
                title: node.innerText
            };
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
var generateJson = function(id) {
    return {
        id: 1,
        items: generateJsonTree(document.getElementById(id))
    };
};

/**
 * set the HTML tree from a json tree
 * @param  json tree
 */
var setUiTree = function(json) {
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
var createDomElement = function(_tag, _id, _class, _events) {
    var element = document.createElement(_tag);
    if (_id) {
        element.setAttribute("id", _id);
    }
    if (_class) {
        element.setAttribute("class", _class);
    }
    if (_events) {
        for (var key in _events) {
            if (_events.hasOwnProperty(key)) {
                element.setAttribute(key, _events[key]);
            }
        }
    }
    return element;
};


var removeNode = function(element){
    console.log(element.parentElement);
    if(element.parentElement.parentElement.childElementCount === 1){
        element.parentElement.parentElement.previousElementSibling.firstElementChild.remove();
    }
    element.parentElement.remove()
    displayJson(generateJson("tree-root"));
}

var newNode = function(element){
    var Id = (+ element.getAttribute("id")); 
    var nodesLength = element.nextElementSibling.childElementCount; 
    var newItem =  generateTreeNode({id: Id * 10 + nodesLength, 
                                     title: element.innerText + '.' + (nodesLength + 1 )});
    newItem.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
    element.nextElementSibling.appendChild(newItem);
    if(nodesLength === 0){
        insertHtmlArrow(element.parentElement);
    }
    displayJson(generateJson("tree-root"));
}

var displayJson = function(json){
    var test = JSON.stringify(json, null, 2);
    var displayJson = document.getElementsByTagName("code")[0];
    displayJson.innerText = test;
}

document.addEventListener("DOMContentLoaded", function(event) {
    setUiTree(data);
    displayJson(generateJson("tree-root"));
});

var data = {
    "id": 1,
    "items": [{
        "id": 11,
        "title": "Node1.1",
        "items": [{
            "id": 111,
            "title": "Node1.1.1",
            "items": [

            ]
        }, {
            "id": 112,
            "title": "Node1.1.2",
            "items": [

            ]
        }, {
            "id": 113,
            "title": "Node1.1.3",
            "items": [{
                "id": 1131,
                "title": "Node.1.1.3.1",
                "items": [

                ]
            }]
        }]
    }, {
        "id": 12,
        "title": "Node1.2",
        "items": [{
            "id": 121,
            "title": "Node1.2.1",
            "items": [

            ]
        }, {
            "id": 122,
            "title": "Node1.2.2",
            "items": [

            ]
        }, {
            "id": 123,
            "title": "Node1.2.3",
            "items": [

            ]
        }]
    }, {
        "id": 13,
        "title": "Node1.3",
        "items": [{
            "id": 131,
            "title": "Node1.3.1",
            "items": [

            ]
        }, {
            "id": 132,
            "title": "Node1.3.2",
            "items": [

            ]
        }, {
            "id": 133,
            "title": "Node1.3.3",
            "items": [

            ]
        }]
    }]
};
