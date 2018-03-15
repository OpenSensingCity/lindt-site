/*
 * Copyright 2018 École des Mines de Saint-Étienne.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var getDatatype = function (uri) {
    var metricprefixes = {
        y: -24, yocto: -24,
        z: -21, zepto: -21,
        a: -18, atto: -18,
        f: -15, femto: -15,
        p: -12, pico: -12,
        n: -9, nano: -9,
        μ: -6, micro: -6,
        m: -3, milli: -3,
        c: -2, centi: -2,
        d: -1, deci: -1,
        da: 1, deca: 1,
        h: 2, hecto: 2,
        k: 3, kilo: 3,
        M: 6, mega: 6,
        G: 9, giga: 9,
        T: 12, tera: 12,
        P: 15, peta: 15,
        E: 18, exa: 18,
        Z: 21, zeta: 21,
        Y: 24, yotta: 14
    };
    var lengthfactors = {
        m: 1, metre: 1, metres: 1,
        th: 0.0000254, thou: 0.0000254, thousand: 0.0000254, thousandth: 0.0000254, thousands: 0.0000254, thousandths: 0.0000254, mil: 0.0000254, mils: 0.0000254,
        in: 0.0254, inch: 0.0254, inches: 0.0254,
        ft: 0.3048, fts: 0.3048, foot: 0.3048, feet: 0.3048,
        yd: 0.9144, yard: 0.9144, yards: 0.9144,
        ch: 20.1168, chain: 20.1168, chains: 20.1168,
        fur: 201.168, furlong: 201.168, furlongs: 201.168,
        mi: 1609.344, mile: 1609.344, miles: 1609.344,
        lea: 4828.032, league: 4828.032, leagues: 4828.032,
        ftm: 1.8288, fathom: 1.8288, fathoms: 1.8288,
        cb: 185.3184, cable: 185.3184, cables: 185.3184,
        NM: 1853.184, nmi: 1853.184, "nautical mile": 1853.184, "nautical miles": 1853.184,
        link: 0.201168, links: 0.201168,
        rod: 5.0292, rods: 5.0292
    };
    var lengthRegex = /^([-+]?[0-9]*\.?[0-9]+)([eE]([-+]?[0-9]+))? ?(((y|z|a|f|p|n|μ|m|c|d|da|h|k|M|G|T|P|E|Z|Y)?m)|(yocto|zepto|atto|femto|pico|nano|micro|milli|centi|deci|deca|hecto|kilo|mega|giga|tera|peta|exa|zeta|yota)?metres?|th(ou(sand(th)?s?)?)?|mils?|in(ch(es)?)?|f(ts?|oot|eet)|y(d|ards?)|ch(ains?)?|fur(longs?)?|mi(les?)?|lea(gues?)?|ftm|fathoms?|cb|cables?|NM|nmi|nautical miles?|links?|rods?)$/;
    var Length = {
        getVoltage: function (lexicalForm) {
            var parse = lexicalForm.match(lengthRegex);
            if (parse === null) {
                throw new Error("illegal lexical form");
            }
            var value = parse[1];
            var sigNum = Math.max(value.length,7);
            var exponent = parse[3];
            if (exponent !== undefined) {
                value *= Math.pow(10, exponent);
            }
            var prefix = (parse[6] === undefined) ? parse[7] : parse[6];
            if (prefix !== undefined) {
                value *= Math.pow(10, metricprefixes[prefix]);
            }
            var factor = lengthfactors[parse[4]];
            if (factor === undefined) {
                factor = 1;
            }
            value *= factor;
            return Math.round(value*Math.pow(10, sigNum))/Math.pow(10, sigNum);
        },
        getUri: function () {
            return "https://w3id.org/lindt/custom_datatypes#length";
        },
        isLegal: function (lexicalForm) {
            return lengthRegex.test(lexicalForm);
        },
        recognisesDatatype: function (datatypeUri) {
            return this.getUri() === datatypeUri;
        },
        getRecognisedDatatypes: function () {
            return [this.getUri()];
        },
        isEqual: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                return this.getVoltage(lexicalForm1) === this.getVoltage(lexicalForm2);
            }
            return false;
        },
        compare: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                var metres1 = this.getVoltage(lexicalForm1);
                var metres2 = this.getVoltage(lexicalForm2);
                if (metres1 < metres2) {
                    return -1;
                } else if (metres1 === metres2) {
                    return 0;
                } else if (metres1 > metres2) {
                    return 1;
                }
            }
            return false;
        },
        getNormalForm: function (lexicalForm) {
            if (!Length.isLegal(lexicalForm)) {
                throw new Error("Non legal lexical form");
            }
            return this.getVoltage(lexicalForm) + " m";
        },
        importLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^datatypeUri to return^^this.getUri() 
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        },
        exportLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^this.getUri() to return^^datatypeUri  
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        }
    };


    var volumeRegex = /^([-+]?[0-9]*\.?[0-9]+)([eE]([-+]?[0-9]+))? ?((y|z|a|f|p|n|μ|m|c|d|da|h|k|M|G|T|P|E|Z|Y)?(l|m3))$/;
    var Volume = {
        getCubicMeter: function (lexicalForm) {
            var parse = lexicalForm.match(volumeRegex);
            if (parse === null) {
                throw new Error("illegal lexical form");
            }
            var value = parse[1];
            var sigNum = Math.max(value.length,7);
            var exponent = parse[3];
            if (exponent !== undefined) {
                value *= Math.pow(10, exponent);
            }
            if (parse[6] === "l") {
                value *= Math.pow(10, 3*metricprefixes[prefix]);
                var prefix = parse[5];
                if (prefix !== undefined) {
                    value *= Math.pow(10, metricprefixes[prefix]);
                }
            } else {
                var prefix = parse[5];
                if (prefix !== undefined) {
                    value *= Math.pow(10, 3*metricprefixes[prefix]);
                }
            }
            return Math.round(value*Math.pow(10, sigNum))/Math.pow(10, sigNum);
        },
        getUri: function () {
            return "https://w3id.org/lindt/custom_datatypes#volume";
        },
        isLegal: function (lexicalForm) {
            return volumeRegex.test(lexicalForm);
        },
        recognisesDatatype: function (datatypeUri) {
            return this.getUri() === datatypeUri;
        },
        getRecognisedDatatypes: function () {
            return [this.getUri()];
        },
        isEqual: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                return this.getCubicMeter(lexicalForm1) === this.getCubicMeter(lexicalForm2);
            }
            return false;
        },
        compare: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                var volume1 = this.getCubicMeter(lexicalForm1);
                var volume2 = this.getCubicMeter(lexicalForm2);
                if (volume1 < volume2) {
                    return -1;
                } else if (volume1 === volume2) {
                    return 0;
                } else if (volume1 > volume2) {
                    return 1;
                }
            }
            return false;
        },
        getNormalForm: function (lexicalForm) {
            if (!Volume.isLegal(lexicalForm)) {
                throw new Error("Non legal lexical form");
            }
            return this.getCubicMeter(lexicalForm) + " m3";
        },
        importLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^datatypeUri to return^^this.getUri() 
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        },
        exportLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^this.getUri() to return^^datatypeUri  
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        }
    };


    var tempRegex = /^([-+]?[0-9]*\.?[0-9]+)([eE]([-+]?[0-9]+))? ?°(F|C|K)$/;
    var Temperature = {
        getCelsius: function (lexicalForm) {
            var parse = lexicalForm.match(tempRegex);
            if (parse === null) {
                throw new Error("illegal lexical form");
            }
            var value = parse[1];
            var sigNum = Math.max(value.length,7);
            var exponent = parse[3];
            if (exponent !== undefined) {
                value *= Math.pow(10, exponent);
            }
            if (parse[4] === "F") {
                value = ( value - 32 ) * 5/9;
            } else if (parse[4] === "K") {
                value = value + 273.15;
            }
            return Math.round(value*Math.pow(10, sigNum))/Math.pow(10, sigNum);
        },
        getUri: function () {
            return "https://w3id.org/lindt/custom_datatypes#temperature";
        },
        isLegal: function (lexicalForm) {
            return tempRegex.test(lexicalForm);
        },
        recognisesDatatype: function (datatypeUri) {
            return this.getUri() === datatypeUri;
        },
        getRecognisedDatatypes: function () {
            return [this.getUri()];
        },
        isEqual: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                return this.getCelsius(lexicalForm1) === this.getCelsius(lexicalForm2);
            }
            return false;
        },
        compare: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                var temp1 = this.getCelsius(lexicalForm1);
                var temp2 = this.getCelsius(lexicalForm2);
                if (temp1 < temp2) {
                    return -1;
                } else if (temp1 === temp2) {
                    return 0;
                } else if (temp1 > temp2) {
                    return 1;
                }
            }
            return false;
        },
        getNormalForm: function (lexicalForm) {
            if (!Length.isLegal(lexicalForm)) {
                throw new Error("Non legal lexical form");
            }
            return this.getCelsius(lexicalForm) + " °C";
        },
        importLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^datatypeUri to return^^this.getUri() 
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        },
        exportLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^this.getUri() to return^^datatypeUri  
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        }
    };


    var voltageRegex = /^([-+]?[0-9]*\.?[0-9]+)([eE]([-+]?[0-9]+))? ?((y|z|a|f|p|n|μ|m|c|d|da|h|k|M|G|T|P|E|Z|Y)?V)$/;
    var Voltage = {
        getVoltage: function (lexicalForm) {
            var parse = lexicalForm.match(voltageRegex);
            if (parse === null) {
                throw new Error("illegal lexical form");
            }
            var value = parse[1];
            var sigNum = Math.max(value.length,7);
            var exponent = parse[3];
            if (exponent !== undefined) {
                value *= Math.pow(10, exponent);
            }
            var prefix = parse[5];
            if (prefix !== undefined) {
                value *= Math.pow(10, metricprefixes[prefix]);
            }
            return Math.round(value*Math.pow(10, sigNum))/Math.pow(10, sigNum);
        },
        getUri: function () {
            return "https://w3id.org/lindt/custom_datatypes#voltage";
        },
        isLegal: function (lexicalForm) {
            return voltageRegex.test(lexicalForm);
        },
        recognisesDatatype: function (datatypeUri) {
            return this.getUri() === datatypeUri;
        },
        getRecognisedDatatypes: function () {
            return [this.getUri()];
        },
        isEqual: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                return this.getVoltage(lexicalForm1) === this.getVoltage(lexicalForm2);
            }
            return false;
        },
        compare: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                var voltage1 = this.getVoltage(lexicalForm1);
                var voltage2 = this.getVoltage(lexicalForm2);
                if (voltage1 < voltage2) {
                    return -1;
                } else if (voltage1 === voltage2) {
                    return 0;
                } else if (voltage1 > voltage2) {
                    return 1;
                }
            }
            return false;
        },
        getNormalForm: function (lexicalForm) {
            if (!Length.isLegal(lexicalForm)) {
                throw new Error("Non legal lexical form");
            }
            return this.getVoltage(lexicalForm) + " V";
        },
        importLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^datatypeUri to return^^this.getUri() 
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        },
        exportLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^this.getUri() to return^^datatypeUri  
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        }
    };
    
    
    var electricIntensityRegex = /^([-+]?[0-9]*\.?[0-9]+)([eE]([-+]?[0-9]+))? ?((y|z|a|f|p|n|μ|m|c|d|da|h|k|M|G|T|P|E|Z|Y)?A)$/;
    var ElectricIntensity = {
        getAmpere: function (lexicalForm) {
            var parse = lexicalForm.match(electricIntensityRegex);
            if (parse === null) {
                throw new Error("illegal lexical form");
            }
            var value = parse[1];
            var sigNum = Math.max(value.length,7);
            var exponent = parse[3];
            if (exponent !== undefined) {
                value *= Math.pow(10, exponent);
            }
            var prefix = parse[5];
            if (prefix !== undefined) {
                value *= Math.pow(10, metricprefixes[prefix]);
            }
            return Math.round(value*Math.pow(10, sigNum))/Math.pow(10, sigNum);
        },
        getUri: function () {
            return "https://w3id.org/lindt/custom_datatypes#electricIntensity";
        },
        isLegal: function (lexicalForm) {
            return electricIntensityRegex.test(lexicalForm);
        },
        recognisesDatatype: function (datatypeUri) {
            return this.getUri() === datatypeUri;
        },
        getRecognisedDatatypes: function () {
            return [this.getUri()];
        },
        isEqual: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                return this.getAmpere(lexicalForm1) === this.getAmpere(lexicalForm2);
            }
            return false;
        },
        compare: function (lexicalForm1, lexicalForm2, datatypeUri2) {
            if(datatypeUri2 === undefined) {
                datatypeUri2 = this.getUri();
            }
            if (this.getUri() === datatypeUri2) {
                var ampere1 = this.getAmpere(lexicalForm1);
                var ampere2 = this.getAmpere(lexicalForm2);
                if (ampere1 < ampere2) {
                    return -1;
                } else if (ampere1 === ampere2) {
                    return 0;
                } else if (ampere1 > ampere2) {
                    return 1;
                }
            }
            return false;
        },
        getNormalForm: function (lexicalForm) {
            if (!Length.isLegal(lexicalForm)) {
                throw new Error("Non legal lexical form");
            }
            return this.getAmpere(lexicalForm) + " A";
        },
        importLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^datatypeUri to return^^this.getUri() 
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        },
        exportLiteral: function (lexicalForm, datatypeUri) {
            // transforms lexicalForm^^this.getUri() to return^^datatypeUri  
            if (this.getUri() === datatypeUri) {
                return lexicalForm;
            }
            throw new Error("datatype " + this.getUri() + " does not recognize datatype " + datatypeUri);
        }
    };

    if (uri === Length.getUri() || uri ==="http://w3id.org/lindt/v1/custom_datatypes#length") {
        return Length;
    } else if (uri === Volume.getUri() || uri === "http://w3id.org/lindt/v1/custom_datatypes#volume") {
        return Volume;
    } else if (uri === Temperature.getUri() || uri === "http://w3id.org/lindt/v1/custom_datatypes#temperature") {
        return Temperature;
    } else if (uri === Voltage.getUri() || uri === "http://w3id.org/lindt/v1/custom_datatypes#voltage") {
        return Voltage;
    } else if (uri === ElectricIntensity.getUri() || uri === "http://w3id.org/lindt/v1/custom_datatypes#electricIntensity") {
        return ElectricIntensity;
    } 
    
};
