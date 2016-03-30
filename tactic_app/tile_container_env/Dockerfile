FROM ruimashita/scikit-learn:latest
WORKDIR /code
ADD requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt
MAINTAINER "Bruce L Sherin"
ADD  . /code
CMD ["python", "tile_main.py"]