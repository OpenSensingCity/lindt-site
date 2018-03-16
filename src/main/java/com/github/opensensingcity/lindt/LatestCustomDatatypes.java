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
package com.github.opensensingcity.lindt;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author maxime.lefrancois
 */
@WebServlet({"/custom_datatypes","/custom_datatypes.html","/custom_datatypes.ttl","/custom_datatypes.js"})
public class LatestCustomDatatypes extends HttpServlet {
    
    final String path = "/v2";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        final String context = req.getSession().getServletContext().getContextPath();
        final String pathInfo = req.getServletPath();
        if(pathInfo.contains(".")) {
            resp.sendRedirect(context + path + pathInfo);
            return; 
        }
        final String accept = req.getHeader("Accept");
        if(accept == null) {
            resp.sendRedirect(context + path + pathInfo + ".html");
        } else if (accept.contains("text/turtle")) {
            resp.sendRedirect(context + path + pathInfo + ".ttl");
        } else if (accept.contains("application/javascript")) {
            resp.sendRedirect(context + path + pathInfo + ".js");
        } else {
            resp.sendRedirect(context + path + pathInfo + ".html");
        }
    }

}
