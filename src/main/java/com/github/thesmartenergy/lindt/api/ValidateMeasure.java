///*
// * Copyright 2015 École des Mines de Saint-Étienne.
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *      http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//package com.github.thesmartenergy.lindt.api;
//
//import javax.measure.format.ParserException;
//import javax.measure.format.UnitFormat;
//import javax.measure.spi.ServiceProvider;
//import javax.ws.rs.DefaultValue;
//import javax.ws.rs.GET;
//import javax.ws.rs.Path;
//import javax.ws.rs.Produces;
//import javax.ws.rs.QueryParam;
//import javax.ws.rs.core.MediaType;
//import javax.ws.rs.core.Response;
//import org.apache.jena.datatypes.TypeMapper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
///**
// *
// * @author maxime.lefrancois
// */
//@Path("validateUnit")
//public class ValidateMeasure {
//
//    private static final Logger LOG = LoggerFactory.getLogger(ValidateMeasure.class);
//    public UnitFormat unitFormat = ServiceProvider.current().getUnitFormatService().getUnitFormat("CI");
//
//    @GET
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response get(@QueryParam("unit") @DefaultValue("") String unit, @QueryParam("measure") @DefaultValue("") String measure) {
//        if (unit.equals("") && measure.equals("")) {
//            return Response.noContent().build();
//        }
//        if (!unit.equals("") && !measure.equals("")) {
//            return Response.status(Response.Status.BAD_REQUEST).entity("Only one of unit or measure must be set.").build();
//        }
//        if (!unit.equals("")) {
//            try {
//                unitFormat.parse(unit);
//                return Response.noContent().build();
//            } catch (ParserException ex) {
//                return Response.ok("{'error': '" + ex.getMessage() +"'}").build();
//            }
//        }
//        if (!unit.equals("")) {
//            
//        }
//    }
//
//}
