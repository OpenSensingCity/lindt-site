/*
 * Copyright 2016 Ecole des Mines de Saint-Etienne.
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
package com.github.opensensingcity.lindt.api;

import com.google.gson.Gson;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import javax.servlet.http.HttpServlet;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 *
 * @author Maxime Lefrançois <maxime.lefrancois at emse.fr>
 */
@Path("/list")
public class ListExamples extends HttpServlet {

    private static final Logger LOG = LoggerFactory.getLogger(ListExamples.class);
    private static final Gson gson = new Gson();

    @GET
    public Response doGet() throws IOException, URISyntaxException {
        LOG.info("Loading list of examples");
        File examples = new File(ListExamples.class.getClassLoader().getResource("examples").toURI());

        StringBuilder sb = new StringBuilder();
        File[] files = examples.listFiles();
        Arrays.sort(files);
        for (File example : files) {
            if (example.isDirectory()) {
                sb.append(example.getName() + "\n");
            }
        }

        Response.ResponseBuilder res = Response.ok(sb.toString(), "text/plain");
        return res.build();

    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response doGet(@PathParam("id") String id) throws IOException, URISyntaxException, Exception {
        LOG.info("Loading example {}", id);
        File example = new File(ListExamples.class.getClassLoader().getResource("examples/" + id).toURI());
        Request request = new Request();
        try {
            request.query = IOUtils.toString(new BOMInputStream(new FileInputStream(new File(example, "query.rq"))), "UTF-8");
        } catch (Exception ex) {
            request.query = "";
            LOG.trace(ex.getMessage());
        }
        try {
            request.graph = IOUtils.toString(new BOMInputStream(new FileInputStream(new File(example, "graph.ttl"))), "UTF-8");
        } catch (Exception ex) {
            request.graph = "";
            LOG.trace(ex.getMessage());
        }
        Response.ResponseBuilder res = Response.ok(gson.toJson(request), "application/json");
        return res.build();
    }

}
