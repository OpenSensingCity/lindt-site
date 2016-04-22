/*
 * Copyright 2016 ITEA 12004 SEAS Project.
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
package com.github.thesmartenergy.lindt.v1;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URI;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 *
 * @author maxime.lefrancois
 */
@Path("")
public class OntologyPageResource {

    private static final Logger LOG = Logger.getLogger(OntologyPageResource.class.getSimpleName());

    @Inject
    HttpServletRequest request;

    @GET
    @Path("{path}")
    @Produces("*/*")
    public Response getAsHtml(@PathParam("path") String path) {
        if (path.equals("DBpediaLengthQueries.zip")) {
            return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/" + path), "application/zip").build();
        }
        if (path.equals("dbpedia.zip")) {
            return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/" + path), "application/zip").build();
        }
        if (path.equals("custom_datatypes.js")) {
            return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/" + path), "application/javascript").build();
        }
        if (path.equals("custom_datatypes.ttl")) {
            return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/" + path), "text/turtle").build();
        }
        if (path.equals("custom_datatypes.html")) {
            return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/" + path), "text/html").build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("custom_datatypes")
    @Produces("text/html")
    public Response getCustomDatatypesAsHtml() {
        Response.ResponseBuilder res = Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.html"), "text/turtle");
        res.header("Content-Disposition", "filename= custom_datatypes.html;");
        return res.build();
    }

    @GET
    @Path("custom_datatypes")
    @Produces("application/javascript")
    public Response getCustomDatatypesAsJavascript() {
        Response.ResponseBuilder res = Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.js"), "text/turtle");
        res.header("Content-Disposition", "filename= custom_datatypes.js;");
        return res.build();
    }

    @GET
    @Path("custom_datatypes")
    @Produces("text/turtle")
    public Response getCustomDatatypesAsTurtle() {
        Response.ResponseBuilder res = Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.ttl"), "text/turtle");
        res.header("Content-Disposition", "filename= custom_datatypes.ttl;");
        return res.build();
    }
    
    @GET
    @Path("voc")
    @Produces("text/turtle")
    public Response getVocabularyAsTurtle() {
        Response.ResponseBuilder res = Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("ontology/voc.ttl"), "text/turtle");
        res.header("Content-Disposition", "filename= lindt.ttl;");
        return res.build();
    }

    @GET
    @Path("voc.ttl")
    public Response getVocabularySpecificallyAsTurtle() {
        Response.ResponseBuilder res = Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("ontology/voc.ttl"), "text/turtle");
        res.header("Content-Disposition", "filename= lindt.ttl;");
        return res.build();
    }


    @GET
    @Path("voc")
    @Produces("application/rdf+xml")
    public Response getVocabularyAsXml() {
        InputStream in = OntologyPageResource.class.getClassLoader().getResourceAsStream("ontology/voc.ttl");
        Model m = ModelFactory.createDefaultModel().read(in, "https://w3id.org/lindt/voc#", "TTL");
        StringWriter sw = new StringWriter();
        m.write(sw);
        Response.ResponseBuilder res = Response.ok(sw.toString(), "application/rdf+xml");
        res.header("Content-Disposition", "filename= lindt.rdf;");
        return res.build();
    }

    @GET
    @Path("voc.rdf")
    public Response getVocabularySpecificallyAsXml() {
        InputStream in = OntologyPageResource.class.getClassLoader().getResourceAsStream("ontology/voc.ttl");
        Model m = ModelFactory.createDefaultModel().read(in, "https://w3id.org/lindt/voc#", "TTL");
        StringWriter sw = new StringWriter();
        m.write(sw);
        Response.ResponseBuilder res = Response.ok(sw.toString(), "application/rdf+xml");
        res.header("Content-Disposition", "filename= lindt.rdf;");
        return res.build();
    }


    @GET
    @Path("voc")
    @Produces("text/html")
    public Response getVocabularyAsHtml() {
        return Response.seeOther(URI.create("http://vowl.visualdataweb.org/webvowl/#iri=https://w3id.org/lindt/voc")).build();
    }

    @GET
    @Path("voc.html")
    public Response getVocabularySpecificallyAsHtml() {
        return Response.seeOther(URI.create("http://vowl.visualdataweb.org/webvowl/#iri=https://w3id.org/lindt/voc")).build();
    }

}
