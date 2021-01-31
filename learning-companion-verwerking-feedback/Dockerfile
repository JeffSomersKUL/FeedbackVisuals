FROM python:3.8-slim
WORKDIR /usr/src

COPY requirements.txt /usr/src
RUN pip install -r requirements.txt

COPY src /usr/src
WORKDIR /usr/src
ENTRYPOINT ["python"] 
