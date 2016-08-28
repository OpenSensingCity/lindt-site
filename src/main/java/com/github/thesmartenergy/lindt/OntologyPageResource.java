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
package com.github.thesmartenergy.lindt;

import java.net.URI;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
