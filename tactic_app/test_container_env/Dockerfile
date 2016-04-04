FROM python:2.7.11
WORKDIR /code
ADD requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt
MAINTAINER "Bruce L Sherin"
ADD  . /code
CMD ["python", "-u", "test.py"]