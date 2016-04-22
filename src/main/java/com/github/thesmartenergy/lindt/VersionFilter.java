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

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author maxime.lefrancois
 */
@WebFilter(urlPatterns = {"/*"}, filterName = "filterOne")
public class VersionFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        System.out.println("inside filter");

        HttpServletRequest req = ((HttpServletRequest) request);
        String path = req.getServletPath();
        String queryString = req.getQueryString();

        if(path.startsWith("/v1/")) {
            chain.doFilter(request, response);
            System.out.println("just continue");
            return;
        }
        System.out.println("more check");
        if(path.startsWith("/custom_datatypes") || path.startsWith("/voc")) {
            String q = req.getQueryString(); 
            if(q != null && !q.isEmpty()) {
                q = "?" + q;
            } else {
                q = "";
            }
            ((HttpServletResponse) response).sendRedirect(req.getContextPath() + "/v1" + path + q);
        } else {
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
    }
}
