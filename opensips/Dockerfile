FROM opensips/opensips:latest

# Set environment variables
ENV DBENGINE=MYSQL
ENV DBURL="mysql://opensips:opensips@mysql/opensips"
ENV LOG_LEVEL=3

# Install required packages before running OpenSIPS
RUN apt update && \
    apt install -y software-properties-common procps nano bash lsof && \
    apt install -y opensips-mysql-module && \
    apt install -y sngrep && \
    apt install -y net-tools
    
# Copy custom OpenSIPS configuration
COPY opensips.cfg /etc/opensips/opensips.cfg

# Command to run OpenSIPS when the container starts
CMD ["/usr/sbin/opensips", "-F", "-f", "/etc/opensips/opensips.cfg"]