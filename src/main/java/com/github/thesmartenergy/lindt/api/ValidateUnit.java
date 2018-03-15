/*
 * Copyright 2015 École des Mines de Saint-Étienne.
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
package com.github.thesmartenergy.lindt.api;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.measure.Unit;
import javax.measure.format.ParserException;
import javax.measure.format.UnitFormat;
import javax.measure.spi.ServiceProvider;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import systems.uom.ucum.internal.format.TokenException;
import systems.uom.ucum.internal.format.TokenMgrError;

/**
 *
 * @author maxime.lefrancois
 */
@Path("validateUnit")
public class ValidateUnit {

    private static final Logger LOG = LoggerFactory.getLogger(ValidateUnit.class);
    public UnitFormat unitFormat = ServiceProvider.current().getUnitFormatService().getUnitFormat("CI");

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@QueryParam("unit") @DefaultValue("") String unitString) {
        try {
            Unit unit = unitFormat.parse(unitString);
            System.out.println("ok " + unitString);
            return Response.ok().build();
        } catch (ParserException | TokenException | TokenMgrError ex) {
            System.out.println("not ok " + unitString);
            JsonObjectBuilder jsonb = Json.createObjectBuilder()
                    .add("error", "A " + ex.getClass().getSimpleName() + " occurred"
                            + (ex.getMessage() != null ? ": " + ex.getMessage() : "."));
            try {
                String unitURL = URLEncoder.encode(unitString, "UTF-8");
                String classNameURL = URLEncoder.encode(ex.getClass().getName(), "UTF-8");
                String ghissue = "https://github.com/unitsofmeasurement/uom-sys"
                        + "tems/issues/new?title=systems-ucum-java8%3A%20Error%"
                        + "20with%20unit%20" + unitURL + "&body=Dear%20all%2C%"
                        + "0D%0A%0D%0APlaying%20around%20with%20systems-ucum-ja"
                        + "va8%20on%20https%3A%2F%2Fw3id.org%2Flindt%2Fplaygrou"
                        + "nd.html%20%2C%20I%20got%20a%20" + classNameURL + "%2"
                        + "0error%20message%20parsing%20the%20following%20unit%"
                        + "3A%0D%0A%0D%0A" + unitURL + "%0D%0A%0D%0AI%20believe"
                        + "%20this%20may%20be%20an%20error.%0D%0A%0D%0ABest%2C";
                jsonb.add("issue", ghissue);
            } catch (UnsupportedEncodingException e) {
            }
            return Response.status(Response.Status.BAD_REQUEST).entity(jsonb.build()).build();
        }
    }

}
