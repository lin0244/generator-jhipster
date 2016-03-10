(function() {
    'use strict';
<%_ var hasDate = false;
    if (fieldsContainZonedDateTime || fieldsContainLocalDate || fieldsContainDate) {
        hasDate = true;
    }
_%>
    angular
        .module('<%=angularAppName%>')
        .factory('<%= entityClass %>', <%= entityClass %>);

    <%= entityClass %>.$inject = ['$resource'<% if (hasDate) { %>, 'DateUtils'<% } %>];

    function <%= entityClass %> ($resource, DateUtils) {
        var resourceUrl = <% if (applicationType == 'gateway' && locals.microserviceName) {%> '<%= microserviceName.toLowerCase() %>/' +<% } %> 'api/<%= entityApiUrl %>/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);<% for (idx in fields) { if (fields[idx].fieldType == 'LocalDate') { %>
                    data.<%=fields[idx].fieldName%> = DateUtils.convertLocaleDateFromServer(data.<%=fields[idx].fieldName%>);<% }if (fields[idx].fieldType == 'ZonedDateTime' || fields[idx].fieldType == 'Date') { %>
                    data.<%=fields[idx].fieldName%> = DateUtils.convertDateTimeFromServer(data.<%=fields[idx].fieldName%>);<% } }%>
                    return data;
                }
            },<% if (fieldsContainLocalDate) { %>
            'update': {
                method: 'PUT',
                transformRequest: function (data) {<% for (idx in fields) { if (fields[idx].fieldType == 'LocalDate') { %>
                    data.<%=fields[idx].fieldName%> = DateUtils.convertLocaleDateToServer(data.<%=fields[idx].fieldName%>);<% } }%>
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {<% for (idx in fields) { if (fields[idx].fieldType == 'LocalDate') { %>
                    data.<%=fields[idx].fieldName%> = DateUtils.convertLocaleDateToServer(data.<%=fields[idx].fieldName%>);<% } }%>
                    return angular.toJson(data);
                }
            }<% } else { %>
            'update': { method:'PUT' }<% } %>
        });
    }
})();
