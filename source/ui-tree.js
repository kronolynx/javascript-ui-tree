//"use strict";

Element.prototype.hasClassName = function(name) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
    if (!this.hasClassName(name)) {
        this.className = this.className ? [this.className, name].join(' ') : name;
    }
    return this;
};

Element.prototype.removeClassName = function(name) {
    if (this.hasClassName(name)) {
        var c = this.className;
        this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
    }
    return this;
};

var generateTreeNode = function(item) {
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
};

var insertHtmlArrow = function(li) {
    var arrow = createDomElement("a", "", "btn btn-success btn-xs", {
        onclick: "toggleNode(this)"
    });
    arrow.appendChild(createDomElement("span", "", "glyphicon glyphicon-chevron-down"));
    li.firstElementChild.insertBefore(arrow, li.firstElementChild.childNodes[0]);
};

var generateHtmlTree = function(array) {
    var ol = createDomElement("ul", "", "ui-tree-nodes");
    array.forEach(function(item) {
        var li = generateTreeNode(item);
        if (typeof item.items === "object") {
            if (item.items.length > 0) {
                insertHtmlArrow(li);
                li.appendChild(generateHtmlTree(item.items));
            } else {
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


var removeNode = function(element) {
    console.log(element.parentElement);
    if (element.parentElement.parentElement.childElementCount === 1) {
        if (element.parentElement.parentElement.previousElementSibling) {
            element.parentElement.parentElement.previousElementSibling.firstElementChild.remove();
        }
    }
    element.parentElement.remove();
    displayJson(generateJson("tree-root"));
};

var newNode = function(element) {
    var Id = (+element.getAttribute("id"));
    var nodesLength = element.nextElementSibling.childElementCount;
    var newItem = generateTreeNode({
        id: Id * 10 + nodesLength + 1,
        title: element.innerText + '.' + (nodesLength + 1)
    });
    newItem.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
    element.nextElementSibling.appendChild(newItem);
    if (nodesLength === 0) {
        insertHtmlArrow(element.parentElement);
    }
    displayJson(generateJson("tree-root"));
};

var toggleNode = function(element) {
    if (element.firstElementChild.hasClassName("glyphicon-chevron-down")) {
        element.firstElementChild.removeClassName("glyphicon-chevron-down").addClassName("glyphicon-chevron-right");
        element.parentElement.nextElementSibling.style.display = "none";
    } else {
        element.firstElementChild.removeClassName("glyphicon-chevron-right").addClassName("glyphicon-chevron-down");
        element.parentElement.nextElementSibling.style.display = "block";
    }
};

var displayJson = function(json) {
    var test = JSON.stringify(json, null, 2);
    var displayJson = document.getElementsByTagName("code")[0];
    displayJson.innerText = test;
};


// Starting point
document.addEventListener("DOMContentLoaded", function(event) {
    setUiTree(data);
    displayJson(generateJson("tree-root"));
    dragDrop();
});





/***********************  drag and drop **************************/
    var originalObject = null;
    var mouseOffset = null;
    var iMouseDown = false;
    var lMouseState = false;
    var dragObject = null;
    var elemOffset = null;
    var mousePos = {x:0, y:0};
    // Demo 0 variables
    var DragDrops = [];
    var curTarget = null;
    var lastTarget = null;
    var dragHelper = null;
    var tempDiv = null;
    var rootParent = null;
    var rootSibling = null;
    Number.prototype.NaN0 = function() {
        return isNaN(this) ? 0 : this;
    };

    var treeRoot = null;
    var draggables = [];
    //     treeRoot.onmousemove = mouseMove;
    //     console.dir(treeRoot);

    function mouseCoords(e) {
//         if (ev.pageX || ev.pageY) {
//             return {
//                 x: ev.pageX,
//                 y: ev.pageY
//             };
//         }
//         return {
//             x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
//             y: ev.clientY + document.body.scrollTop - document.body.clientTop
//         };
        return {
            x: document.all ? window.event.clientX : e.pageX ,
            y: document.all ? window.event.clientY : e.pageY
        }
    }

    

    var dragObject = null;
    var mouseOffset = null;

    function getMouseOffset(target, ev) {
        ev = ev || window.event;
        var docPos = getPosition(target);
        var mousePos = mouseCoords(ev);
        //console.log("offset", docPos, mousePos);
        return {
            x: mousePos.x - docPos.x,
            y: mousePos.y - docPos.y
        };
    }

    function getPosition(e) {
        var left = 0;
        var top = 0;
        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }
        left += e.offsetLeft;
        top += e.offsetTop;
        return {
            x: left,
            y: top
        };
    }



    function mouseMove(ev) {
        ev = ev || window.event;
        mousePos = mouseCoords(ev);
        //x_pos = document.all ? window.event.clientX : ev.pageX;
        //y_pos = document.all ? window.event.clientY : ev.pageY;
        if (dragObject) {
            // console.log("top", mousePos.y - mouseOffset.y, "left" , (mousePos.x - mouseOffset.x), mousePos.x, mousePos.y);
             //console.log("top", mousePos.y , "left" , (mousePos.x ), mousePos.x, mousePos.y);
//             console.log("x",mousePos.x - mouseOffset.x);
//             dragObject.style.top = (mousePos.y - mouseOffset.y) + 'px';
//             dragObject.style.left = (mousePos.x - mouseOffset.x) + 'px';
            dragObject.style.top = (mousePos.y - curOffset.top) + 'px';
            dragObject.style.left = (mousePos.x - curOffset.left) + 'px';
            return false;
        }
    }

    function mouseUp(ev) {
        ev = ev || window.event;
        var mousePos = mouseCoords(ev);
        var found = false;
        for(var i=0; i < draggables.length; i++){
            if(draggables[i].parentElement !== dragObject){
                var curTarget  = draggables[i];
                var targPos    = getPosition(curTarget);
                var targWidth  = parseInt(curTarget.offsetWidth);
                var targHeight = parseInt(curTarget.offsetHeight);
                if(
                    (mousePos.x > targPos.x)                &&
                    (mousePos.x < (targPos.x + targWidth))  &&
                    (mousePos.y > targPos.y)                &&
                    (mousePos.y < (targPos.y + targHeight))){
                        // dragObject was dropped onto curTarget!
                        console.log("dropped", curTarget);
                        if(dragObject.parentElement.childNodes.length === 1){
                            dragObject.parentElement.previousElementSibling.firstElementChild.remove();
                        }
                        dragObject.remove()
                        curTarget.nextSibling.appendChild(originalObject);
                        if(curTarget.nextSibling.childElementCount === 1){
                            insertHtmlArrow(curTarget.parentElement);
                        }
                        
                        setDraggables(originalObject);
                        found = true;
                        displayJson(generateJson("tree-root"));
                }
            }
        }
        dragObject = null;
    }

    function makeDraggable(item) {
        if (!item) return;
        item.onmousedown = function(ev) {
             dragObject = this.parentElement;
             originalObject = dragObject.cloneNode(true);
             curOffset = {top: mousePos.y - dragObject.offsetTop, left: mousePos.x - dragObject.offsetTop };
             dragObject.style.width = window.getComputedStyle(dragObject, null).width;
             dragObject.style.zIndex = 9999;
             dragObject.style.position = 'absolute'
            
            mouseOffset = getMouseOffset(this, ev);
            return false;
        };
    }
    
//     document.onmousemove = mouseMove;
//     //document.onmousedown = mouseDown;
//     document.onmouseup = mouseUp;
    var setDraggables = function(element){
        var temp = element.getElementsByClassName("ui-tree-handle");
        for (var i = 0; i < temp.length; i++) {
            makeDraggable(temp[i]);
        }
        return temp;
    }

var dragDrop = function() {
    treeRoot = document.getElementById("tree-root");
    window.onmousemove = mouseMove;
    window.onmouseup = mouseUp;
    draggables  = setDraggables(treeRoot);
};




/******************* test data *****************************/
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
