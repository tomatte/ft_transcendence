FROM python:3.12

RUN apt-get update \
	&& apt-get install -y --no-install-recommends

COPY ./requirements.txt /requirements/requirements.txt
	
RUN python -m pip install -r /requirements/requirements.txt

WORKDIR /game_loop

COPY . .

COPY start_app.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start_app.sh

# CMD ["sleep", "infinity"]
CMD ["/usr/local/bin/start_app.sh"]

