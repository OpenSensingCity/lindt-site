var winW = $(window).width() * .9;
var winH = $(window).height() * .9;
CodeMirror.modeURL = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.30.0/mode/%N/%N.js";


///////////////////////////////////////
//  getQueryStringValue

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//  validate

var valid = true;
var open = false;
var timers = [];

var validate = function() {

  // no two named thing with the same URI and mediatype
  // queries have mediatype application/vnd.sparql-generate
  // graphs have mediatype text/turtle

  // no query, graph or document has bad state 

  valid = true;
  resetErrors();

  if(!query_editor.queryValid) {
    valid = false;
    query_tag.addClass("invalid");
    query_tag.children(":first").append(" <span class='invalidmsg'>This query is not valid.</span>");
        $("#run").attr("disabled", "disabled");
  }

  // validating dataset
  if(!graph_editor.docValid) {
    valid = false;
    graph_tag.addClass("invalid");
    graph_tag.children(":first").append(" <span class='invalidmsg'>This graph is not valid.</span>");
        $("#run").attr("disabled", "disabled");
  }

  if(valid && open) {
    for(var timer of timers) {
      window.clearTimeout(timer);
    }
    timers = [];
    var msg = {
        query: query_string,
        graph: graph_string,
    };
    timers.push(window.setTimeout(function(msg) {
      send(msg);
    }, 500, msg));
  }
};

var run = function() {
    var msg = {
        query: query_string,
        graph: graph_string,
    };
    send(msg);
}

var send = function(msg) {
    console.log("sending request");
    $("#run").delay(50).animate({
        "box-shadow": "none"
    }, 50, function () {
        $("#run").animate({
            "box-shadow": "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)"
        }, 50);
    });
    socket.send(JSON.stringify(msg));
}


var resetErrors = function() {
  $(".invalid").removeClass("invalid");
  $("#run").removeAttr("disabled");
  $(".invalidmsg").remove();
};

var init = function() { 
  $("#form").empty();
  $("#form").append(`
    <div class="col-lg-6">
      <div id="queryset" class="fieldset">
        <legend>SPARQL Query</legend>
        <p>See the documentation for our predefined <a href="custom_datatypes">RDF Datatypes</a>.</p>
      </div>
      <div id="dataset" class="fieldset">
        <legend>RDF Graph</legend>
      </div>
    </div>
    <div class="col-lg-6">
      <div class="fieldset">
        <div id="result_list">
          <legend>Result</legend>
          <div id="result_mappings" style="display:none;" readonly><textarea> </textarea></div>
          <div id="result_graph"><textarea></textarea></div>
        </div>
        <div id="log">
          <legend>Log</legend>
          <input id="loglevel" type="range" value="5" min="0" max="5"></input>
          <pre></pre>
        </div>
      </div>
    </div>`);
    
    
  load_query();
  load_graph();
  load_result();
  validate();
}


///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
// queryset

var query_string,
 query_tag,
 query_editor;

var load_query = function() {

  // load default query
  query_string = localStorage.getItem('query');
  if(query_string == null) {
    query_string = ``;
    localStorage.setItem('query', query_string);
  }

  // show default query
  query_tag = $(`<div id='default_query'>
      <label>Query</label>
      <textarea></textarea>
    </div>`);
  $("#queryset").append(query_tag);

  query_editor = YASQE.fromTextArea($('#default_query textarea')[0], {
    createShareLink: false,
    lineNumbers: true
  });
  query_editor.setValue(query_string);
  query_editor.on("change", function(){
      query_string = query_editor.getValue();
      localStorage.setItem('query', query_string);
      validate();
    }
  );
}


///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
// dataset

var graph_string,
 graph_tag,
 graph_editor;

var load_graph = function() {
  graph_string = localStorage.getItem('graph');
  if(graph_string == null) {
    graph_string = ``;
    localStorage.setItem('graph', graph_string);
  }

  // show default graph
  graph_tag = $(`<div id='default_graph'>
      <label>RDF graph</label>
      <textarea></textarea>
    </div>`);
  $("#dataset").append(graph_tag);

  graph_editor = YATE.fromTextArea($('#default_graph textarea')[0], {
    createShareLink: false,
    lineNumbers: true
  });
  graph_editor.setValue(graph_string);
  graph_editor.on("change", function(){
      graph_string = graph_editor.getValue();
      localStorage.setItem('graph', graph_string);
      validate();
    }
  );
}

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//  result

var result_mappings;
var result_graph_tag;
var result_graph;
var levels = {"TRACE": 5,
                "DEBUG": 4,
                "INFO": 3,
                "WARN": 2,
                "ERROR":1};

var load_result = function() {
  result_mappings = $("#result_mappings > textarea");
  result_mappings.val("");
  result_mappings.parent().hide();
  result_graph_tag = $("#result_graph > textarea")
  result_graph = YATE.fromTextArea(result_graph_tag[0], {
  "readOnly": true, 
  "createShareLink": false});
  result_graph.setValue("");
  $(result_graph.getWrapperElement()).hide();
  $("#loglevel").on('input propertychange', manage_log_level);
  $("#log pre").empty();
}


var manage_log_level = function() {
    var val = $("#loglevel").val();
    for(var level in levels) {
        if(val >= levels[level]) {
            $(".log." + level).show();          
        } else {
            $(".log." + level).hide();                        
        }
    }
    $("#log pre").scrollTop($("#log pre")[0].scrollHeight);
}

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//  examples

var load_examples = function() {
  var http = new XMLHttpRequest();
  var url = "api/list";
  http.open("GET", url, true);
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          examples = http.responseText.split("\n");
          for(var i = 0 ; i<examples.length ;i++ ) {
              if(examples[i]!=="") {
                  $("#examples").append("<option value='"+examples[i]+"'>"+examples[i]+"</option>");
              }
          }            
      }

      var example = getQueryStringValue("example");
      if(example && example != "") {
        load_example(example);
        $("#examples").val(example);
      }

  }
  http.send();

  $("#examples").change(function() {
    var example = $("#examples")[0].value;
    if(example!=="---") {
        load_example(example);
    }
  });

}

var load_example = function(id) {
  $.getJSON("api/list/"+id, function( data ) {
        localStorage.setItem('title', id);
        localStorage.setItem('description', data.description);
        localStorage.setItem('query', data.query);
        localStorage.setItem('graph', data.graph);
        init();
      });
}

$(document).ready(function() {
    
  $(".main-body").parent().empty().removeClass("container").addClass("container-fluid").append(`
  <h1>Linked Datatypes Playground</h1>

  <p>Check out <a href="https://ci.mines-stetienne.fr/lindt/custom_datatypes.html">The Specification of cdt:ucum and other UCUM datatypes</a> - <a href="http://unitsofmeasure.org/ucum.html">The Unified Code for Units of Measure code system</a></p>
  <p>You can <label for="example">load and try one of the examples:</label> <select name="example" id="examples"><option value="---">---</option></select></p>

  <div id="form" class="row"></div>`);
  init();
  load_examples();

  var websocketurl = "wss://" + window.location.hostname + (window.location.port!="" ? ":" + window.location.port : "") + "/lindt/query";
  socket = new WebSocket(websocketurl);
 
  socket.onopen = function (event) {
    open = true;
    console.log("websocket open");
    validate();
  };
   
  socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      if(data.clear === true) {
        result_mappings.val("");
        result_mappings.parent().hide();
        result_graph.setValue("");
        $(result_graph.getWrapperElement()).hide();
        $("#log pre").empty();
      } 
      if(data.result && data.result != "" && data.resultType == "mappings") {
        $(result_graph.getWrapperElement()).hide();
        result_mappings.parent().show();
        result_mappings.val(data.result);
        result_mappings.prop("readonly", true)
      } else if(data.result && data.result != "" && data.resultType == "graph") {
        result_mappings.parent().hide();
        $(result_graph.getWrapperElement()).show();
        result_graph.setValue(data.result);       
      }
      if(data.log && data.log != "") {
        var span = $("<span>")
                .addClass("log")
                .append(data.log.replace(/</g, "&lt;"))
                .appendTo("#log pre");
        $("#log pre").scrollTop($("#log pre")[0].scrollHeight);
        for(var level in levels) {
            if(data.log.includes(level)) {
                span.addClass(level);
            }
        }
      }
      manage_log_level();
    }
   
  socket.onclose = function (event) {
      console.log("websocket closed");
  }

});