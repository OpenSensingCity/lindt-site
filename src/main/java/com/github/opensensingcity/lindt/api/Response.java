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

/**
 *
 * @author maxime.lefrancois
 */
public class Response {
    public String log;
    public String result;
    public String resultType;
    public boolean clear;

    public Response(String log, String result, String resultType, boolean clear) {
        this.log = log;
        this.result = result;
        this.resultType = resultType;
        this.clear = clear;
    }
}
