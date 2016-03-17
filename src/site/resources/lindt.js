var lindt = new function() {
    this.datatypes = {};
    this.getDatatype = function(uri) {
        return this.datatypes[uri];
    };
    this.checkDatatype = function(datatype) {
        return typeof datatype==="function"
            && typeof datatype.uri === "string"
            && typeof datatype.isLegal === "function" && datatype.isLegal.length===1
            && typeof datatype.import === "function" && datatype.import.length===1;
    };
    this.checkLiteral = function(literal) {
        return typeof literal.datatype === "function" && this.checkDatatype(literal.datatype)
            && typeof literal.lexicalForm === "string"
            && typeof literal.equals === "function" && literal.equals.length===1
            && typeof literal.exportTo === "function" && literal.exportTo.length===1
            && typeof literal.cannonicalise === "function" && literal.cannonicalise.length===0;
    };
//    this.registerDatatype = function(o) {
//        if(typeof o === "undefined") {
//            throw new Error("The construction of a Datatype requires a parameter.");
//        }
//        if(!o.hasOwnProperty("uri") || typeof o.uri !== "string") {
//            throw new Error("The Datatype construction parameter must contain a string property 'uri'.");
//        }
//        if(datatypes.hasOwnProperty(o.uri)) {
//            throw new Error("A Datatype with uri "+o.uri+" already exists");
//        }
//        if(!o.hasOwnProperty("isLegal") || typeof o.isLegal!== "function" || o.isLegal.length!==1) {
//            throw new Error("The Datatype construction parameter must contain a function property 'isLegal' with one parameter.");
//        }
//        if(!o.hasOwnProperty("equals") || typeof o.equals!== "function"  || o.equals.length!==1) {
//            throw new Error("The Datatype construction parameter must contain a function property 'equals' with one parameter.");
//        }
//        if(o.hasOwnProperty("import") && ( typeof o.equals!== "function"  || o.equals.length!==2)) {
//            throw new Error("Property 'import' of the datatype construction must be a function with two parameters.");
//        }
//        if(o.hasOwnProperty("export") && ( typeof o.equals!== "function"  || o.equals.length!==1)) {
//            throw new Error("Property 'export' of the datatype construction must be a function with one parameter.");
//        }
//        dt = function(lexicalForm) {
//            this.lexicalForm = lexicalForm;
//            if(!this.datatype.isLegal(lexicalForm)) {
//                throw new Error("Literal \"" + lexicalForm + "\"^^<"+this.datatypeURI+"> is ill-typed: lexical form is not valid.");
//            }
//        };
//        dt.uri = o.uri;
//        dt.isLegal = function(lexicalForm) {
//            if(o.isLegal(lexicalForm)) {
//                return true;
//            }
//            return false;
//        }
//        dt.import = function(literal) {
//            this.checkLiteral(literal);
//            if(typeof lexicalform !== "string" || typeof uri !== "string") {
//                throw new Error("Arguments lexicalForm and uri must be strings");
//            }
//            var myLexicalForm = o.import(lexicalForm, uri);
//            if(typeof myLexicalForm !== "string") {
//                throw new Error("Literal \"" + lexicalForm + "\"^^<"+uri+"> cannot be imported to datatype <"+dt.uri+">.");
//            }
//            return new dt(myLexicalForm);
//        };
//        dt.prototype.equals = function(lexicalForm, datatypeURI) {
//            o.equals;
//        }
//        dt.prototype.datatype = dt;
//        dt.prototype.datatypeURI = dt.uri;
//        dt.prototype.exportTo = function(newUri) {
//            if(newUri===dt.uri) {
//                return this.lexicalForm;
//            }
//            if(!o.hasOwnProperty("export")) {
//                throw new Error("Exporting is not supported.");
//            }
//            if(typeof newUri !== "string") {
//                throw new Error("Argument uri must be a string");
//            }
//            var newDt = lindt.getDatatype(newUri);
//            if(newDt === undefined) {
//                throw new Error("Datatype <"+newUri+"> is not declared.")
//            }
//            var newLexicalForm = o.export(this.lexicalForm, newUri);
//            if(typeof myLexicalForm !== "string") {
//                throw new Error("Literal \"" + this.lexicalForm + "\"^^<"+dt.uri+"> cannot be exoprted to datatype <"+newUri+">.");
//            }
//            return new (myLexicalForm);
//        };
//        datatypes[o.uri] = dt;
//        return dt;
//    };
};

