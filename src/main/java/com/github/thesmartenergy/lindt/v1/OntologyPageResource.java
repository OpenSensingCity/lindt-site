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
        return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.html"), "text/html").build();
    }

    @GET
    @Path("custom_datatypes")
    @Produces("application/javascript")
    public Response getCustomDatatypesAsJavascript() {
        return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.js"), "application/javascript").build();
    }

    @GET
    @Path("custom_datatypes")
    @Produces("text/turtle")
    public Response getCustomDatatypesAsTurtle() {
        return Response.ok(OntologyPageResource.class.getClassLoader().getResourceAsStream("v1/custom_datatypes.ttl"), "text/turtle").build();
    }

}
