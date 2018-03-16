/*
 * Copyright 2017 École des Mines de Saint-Étienne.
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
import java.io.IOException;
import java.io.StringWriter;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QueryParseException;
import org.apache.jena.query.ResultSetFormatter;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RiotException;
import org.apache.jena.sparql.core.Prologue;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 *
 * @author maxime.lefrancois
 */
@ServerEndpoint("/query")
public class QueryEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(QueryEndpoint.class);
    private static final Gson gson = new Gson();
    private static final String base = "http://example.org/";
    private static final StringWriterAppender appender = (StringWriterAppender) org.apache.log4j.Logger.getRootLogger().getAppender("WEBSOCKET");
    
    @OnOpen
    public void open(Session session) {
        LOG.info("Establishing connection");
    }

    @OnClose
    public void close(Session session) {
        LOG.info("Closing connection");
    }

    @OnMessage
    public void handleMessage(String message, Session session) throws IOException, InterruptedException {
        appender.putSession(Thread.currentThread(), session); 
        try {
            session.getBasicRemote().sendText(gson.toJson(new Response("", "", "", true)));
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(QueryEndpoint.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }

        if (message.getBytes().length > 10 * Math.pow(2, 10)) {
            LOG.error("In this web interface request size cannot exceed 10 kB.");
            appender.removeSession(Thread.currentThread());
            return;
        }

        Model model = ModelFactory.createDefaultModel();
        try {
            Request request = gson.fromJson(message, Request.class);

            Query query = QueryFactory.create(request.query);
            RDFDataMgr.read(model, IOUtils.toInputStream(request.graph, "UTF-8"), base, Lang.TTL);
            QueryExecution ex = QueryExecutionFactory.create(query, model);

            Prologue pm = query.getPrologue();
            pm.getPrefixMapping().setNsPrefixes(model.getNsPrefixMap());

            if(query.isSelectType()) {
                String result = ResultSetFormatter.asText(ex.execSelect(), pm);
                session.getBasicRemote().sendText(gson.toJson(new Response("",result,"mappings",false)));
            } else if (query.isConstructType()) {
                StringWriter sb = new StringWriter();
                Model result = ex.execConstruct();
                result.setNsPrefixes(pm.getPrefixMapping());
                result.write(sb, "TTL", "http://example.org/");
                session.getBasicRemote().sendText(gson.toJson(new Response("",sb.toString(),"graph",false)));
            }
        } catch (IllegalArgumentException | IOException | RiotException | QueryParseException ex) {
            LOG.error(ex.getClass().getName() + ": " + ex.getMessage());
            return;
        }
        appender.removeSession(Thread.currentThread());
    }

}
