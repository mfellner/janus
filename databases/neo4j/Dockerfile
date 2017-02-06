FROM neo4j:3.1.1

RUN apk update && apk add ca-certificates wget

ENV NEO4J_HOME /var/lib/neo4j
ENV GA_UUID_URL http://products.graphaware.com/download/uuid/latest
ENV GA_FRAMEWORK_URL http://products.graphaware.com/download/framework-server-community/latest
ENV APOC_URL https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.1.0.3/apoc-3.1.0.3-all.jar

RUN wget -q -O ${NEO4J_HOME}/plugins/graphaware-uuid.jar ${GA_UUID_URL}
RUN wget -q -O ${NEO4J_HOME}/plugins/graphaware-server-community-all.jar ${GA_FRAMEWORK_URL}
RUN wget -q -O ${NEO4J_HOME}/plugins/apoc-all.jar ${APOC_URL}

ADD neo4j.conf ${NEO4J_HOME}/conf
