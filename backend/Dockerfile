FROM python:3.12

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/* \
	&& apt autoremove -y \
	&& apt autoclean

WORKDIR /backend
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
COPY startDB.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/startDB.sh

EXPOSE 8000
CMD ["/usr/local/bin/startDB.sh"]
